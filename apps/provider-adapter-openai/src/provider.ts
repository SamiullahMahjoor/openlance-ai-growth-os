import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { ProviderError } from '@openlance/aios-provider-engine';
import type {
  GovernanceClearance,
  HealthStatus,
  ProviderDescriptor,
  ProviderRequest,
} from '@openlance/aios-provider-engine';

import { fromChatResponse, toChatBody } from './mapping.js';
import type { OpenAIProviderOptions } from './types.js';

/** The OpenAI API base used when the options omit one. All vendor knowledge is confined to this adapter package. */
const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

/** The neutral capability this adapter serves when the options omit one. */
const DEFAULT_CAPABILITY = 'text-generation';

/** Build a provider-engine `ProviderError` with an adapter-specific code. */
const adapterError = (code: string, message: string): ProviderError =>
  new ProviderError(code, message, {});

/**
 * Create an OpenAI provider: a frozen-seam `ProviderDescriptor` the Provider Engine validates into a `Provider`. It maps
 * a neutral text-generation request to and from the OpenAI chat-completions API behind the injected transport, with the
 * model, base URL, and API key injected (no embedded credential, no HTTP client, no SDK). It is fail-closed and never
 * throws; it accepts a `GovernanceClearance` as a typed precondition and never inspects or mints one; the Provider
 * Engine's executor enforces the governed path.
 */
export const createOpenAIProvider = (options: OpenAIProviderOptions): ProviderDescriptor => {
  const baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const capability = options.capability ?? DEFAULT_CAPABILITY;
  const model = options.model;
  const headers: Readonly<Record<string, string>> = Object.freeze({
    Authorization: `Bearer ${options.apiKey}`,
    'Content-Type': 'application/json',
  });

  const invoke = async (
    _clearance: GovernanceClearance,
    request: ProviderRequest,
  ): Promise<Result<unknown, ProviderError>> => {
    if (request.capability !== capability) {
      return err(
        adapterError(
          'PROVIDER.ADAPTER_UNSUPPORTED_CAPABILITY',
          `The OpenAI adapter does not serve capability '${request.capability}'.`,
        ),
      );
    }
    const body = toChatBody(model, request.payload);
    if (isErr(body)) {
      return err(adapterError('PROVIDER.ADAPTER_BAD_PAYLOAD', body.error));
    }
    // Everything after the send is guarded (symmetric with probe): a transport that rejects or violates its typed
    // contract yields a fail-closed error, never a throw out of the public surface.
    try {
      const response = await options.transport.send({
        method: 'POST',
        url: `${baseUrl}/chat/completions`,
        headers,
        body: body.value,
      });
      if (response.status < 200 || response.status >= 300) {
        return err(
          adapterError(
            'PROVIDER.ADAPTER_HTTP_STATUS',
            `The provider returned status ${response.status}.`,
          ),
        );
      }
      const output = fromChatResponse(response.body);
      if (isErr(output)) {
        return err(adapterError('PROVIDER.ADAPTER_BAD_RESPONSE', output.error));
      }
      return ok(output.value);
    } catch {
      return err(
        adapterError(
          'PROVIDER.ADAPTER_TRANSPORT_FAILED',
          'The transport failed to reach the provider.',
        ),
      );
    }
  };

  const probe = async (): Promise<HealthStatus> => {
    try {
      const response = await options.transport.send({
        method: 'GET',
        url: `${baseUrl}/models`,
        headers,
        body: null,
      });
      return response.status >= 200 && response.status < 300 ? 'healthy' : 'unhealthy';
    } catch {
      return 'unhealthy';
    }
  };

  return { id: `openai:${model}`, capabilities: [capability], invoke, probe };
};
