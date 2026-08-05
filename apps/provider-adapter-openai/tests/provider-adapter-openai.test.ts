import { isErr, isOk } from '@openlance/aios-kernel';
import { ProviderFactory } from '@openlance/aios-provider-engine';
import type {
  GovernanceClearance,
  ProviderError,
  ProviderRequest,
} from '@openlance/aios-provider-engine';
import type { Result } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { createOpenAIProvider, fromChatResponse, toChatBody } from '../src/index';
import type { Transport, TransportRequest, TransportResult } from '../src/index';

const clearance = {} as unknown as GovernanceClearance;

const returning = (result: TransportResult): Transport => ({ send: () => Promise.resolve(result) });
const throwing = (): Transport => ({
  send: () => Promise.reject(new Error('boom')),
});
const recording = (
  result: TransportResult,
): { transport: Transport; calls: TransportRequest[] } => {
  const calls: TransportRequest[] = [];
  return {
    calls,
    transport: {
      send: (request) => {
        calls.push(request);
        return Promise.resolve(result);
      },
    },
  };
};

const validBody = JSON.stringify({
  id: 'resp-1',
  model: 'gpt-x',
  choices: [{ message: { role: 'assistant', content: 'hello' } }],
});

const ok200 = (body: string): TransportResult => ({ status: 200, body });
const textRequest = (over: Partial<ProviderRequest> = {}): ProviderRequest => ({
  capability: 'text-generation',
  payload: { prompt: 'say hi' },
  ...over,
});

const unwrap = async (result: Promise<Result<unknown, ProviderError>>): Promise<unknown> => {
  const settled = await result;
  return isOk(settled) ? settled.value : settled.error;
};

describe('createOpenAIProvider descriptor', () => {
  it('builds a valid frozen-seam descriptor the ProviderFactory accepts', () => {
    const descriptor = createOpenAIProvider({
      transport: returning(ok200(validBody)),
      apiKey: 'injected',
      model: 'gpt-x',
    });
    expect(descriptor.id).toBe('openai:gpt-x');
    expect(descriptor.capabilities).toEqual(['text-generation']);
    const created = new ProviderFactory().create(descriptor);
    expect(isOk(created)).toBe(true);
    if (isOk(created)) {
      expect(created.value.phase).toBe('operation');
    }
  });

  it('targets the default base URL and injects the bearer credential', async () => {
    const rec = recording(ok200(validBody));
    const provider = createOpenAIProvider({
      transport: rec.transport,
      apiKey: 'secret-token',
      model: 'gpt-x',
    });
    await provider.invoke(clearance, textRequest());
    expect(rec.calls[0]?.url).toBe('https://api.openai.com/v1/chat/completions');
    expect(rec.calls[0]?.headers.Authorization).toBe('Bearer secret-token');
    expect(rec.calls[0]?.method).toBe('POST');
  });

  it('honors an injected base URL (trailing slash stripped) and a custom capability', async () => {
    const rec = recording(ok200(validBody));
    const provider = createOpenAIProvider({
      transport: rec.transport,
      apiKey: 'k',
      model: 'm',
      baseUrl: 'https://proxy.internal/openai/',
      capability: 'chat',
    });
    const result = await provider.invoke(clearance, textRequest({ capability: 'chat' }));
    expect(isOk(result)).toBe(true);
    expect(rec.calls[0]?.url).toBe('https://proxy.internal/openai/chat/completions');
  });
});

describe('invoke', () => {
  const provider = (transport: Transport) =>
    createOpenAIProvider({ transport, apiKey: 'k', model: 'gpt-x' });

  it('maps a successful response to a neutral text output', async () => {
    const output = await unwrap(
      provider(returning(ok200(validBody))).invoke(clearance, textRequest()),
    );
    expect(output).toEqual({ text: 'hello', model: 'gpt-x', id: 'resp-1' });
  });

  it('refuses an unsupported capability', async () => {
    const error = (await unwrap(
      provider(returning(ok200(validBody))).invoke(clearance, textRequest({ capability: 'image' })),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_UNSUPPORTED_CAPABILITY');
  });

  it('refuses a malformed payload', async () => {
    const error = (await unwrap(
      provider(returning(ok200(validBody))).invoke(clearance, textRequest({ payload: {} })),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_BAD_PAYLOAD');
  });

  it('reports a transport rejection as an error, never throwing', async () => {
    const error = (await unwrap(
      provider(throwing()).invoke(clearance, textRequest()),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_TRANSPORT_FAILED');
  });

  it('reports a below-range status as an error', async () => {
    const error = (await unwrap(
      provider(returning({ status: 150, body: '' })).invoke(clearance, textRequest()),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_HTTP_STATUS');
  });

  it('reports an above-range status as an error', async () => {
    const error = (await unwrap(
      provider(returning({ status: 500, body: 'err' })).invoke(clearance, textRequest()),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_HTTP_STATUS');
  });

  it('reports an unparseable response body as an error', async () => {
    const error = (await unwrap(
      provider(returning(ok200('not json{'))).invoke(clearance, textRequest()),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_BAD_RESPONSE');
  });

  it('never throws when the transport violates its contract by resolving a non-result', async () => {
    const badTransport: Transport = {
      send: () => Promise.resolve(undefined as unknown as TransportResult),
    };
    const error = (await unwrap(
      provider(badTransport).invoke(clearance, textRequest()),
    )) as ProviderError;
    expect(error.code).toBe('PROVIDER.ADAPTER_TRANSPORT_FAILED');
  });
});

describe('probe', () => {
  const provider = (transport: Transport) =>
    createOpenAIProvider({ transport, apiKey: 'k', model: 'm' });

  it('reports healthy on a 2xx', async () => {
    expect(await provider(returning({ status: 200, body: '' })).probe?.()).toBe('healthy');
  });
  it('reports unhealthy on an above-range status', async () => {
    expect(await provider(returning({ status: 503, body: '' })).probe?.()).toBe('unhealthy');
  });
  it('reports unhealthy on a below-range status', async () => {
    expect(await provider(returning({ status: 100, body: '' })).probe?.()).toBe('unhealthy');
  });
  it('reports unhealthy on a transport rejection', async () => {
    expect(await provider(throwing()).probe?.()).toBe('unhealthy');
  });
});

describe('mapping', () => {
  it('toChatBody wraps a prompt and rejects a missing or blank one', () => {
    const body = toChatBody('m', { prompt: 'hi' });
    expect(isOk(body)).toBe(true);
    if (isOk(body))
      expect(JSON.parse(body.value)).toEqual({
        model: 'm',
        messages: [{ role: 'user', content: 'hi' }],
      });
    expect(isErr(toChatBody('m', null))).toBe(true);
    expect(isErr(toChatBody('m', { prompt: 42 }))).toBe(true);
    expect(isErr(toChatBody('m', { prompt: '' }))).toBe(true);
  });

  it('fromChatResponse extracts content and defaults a missing id/model to blank', () => {
    const full = fromChatResponse(validBody);
    expect(isOk(full) && full.value).toEqual({ text: 'hello', model: 'gpt-x', id: 'resp-1' });
    const minimal = fromChatResponse(JSON.stringify({ choices: [{ message: { content: 'hi' } }] }));
    expect(isOk(minimal) && minimal.value).toEqual({ text: 'hi', model: '', id: '' });
  });

  it('fromChatResponse accepts empty content and blanks a non-string id/model', () => {
    const empty = fromChatResponse(JSON.stringify({ choices: [{ message: { content: '' } }] }));
    expect(isOk(empty) && empty.value).toEqual({ text: '', model: '', id: '' });
    const typed = fromChatResponse(
      JSON.stringify({ id: 123, model: 456, choices: [{ message: { content: 'x' } }] }),
    );
    expect(isOk(typed) && typed.value).toEqual({ text: 'x', model: '', id: '' });
  });

  it('fromChatResponse fails closed on a non-object, a null choice, an empty choices array, and a missing content', () => {
    expect(isErr(fromChatResponse('5'))).toBe(true);
    expect(isErr(fromChatResponse(JSON.stringify({ choices: [null] })))).toBe(true);
    expect(isErr(fromChatResponse(JSON.stringify({ choices: [] })))).toBe(true);
    expect(isErr(fromChatResponse(JSON.stringify({ choices: [{ message: {} }] })))).toBe(true);
  });
});
