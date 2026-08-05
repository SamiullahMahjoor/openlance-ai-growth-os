import { bench, describe } from 'vitest';

import { createOpenAIProvider, fromChatResponse, toChatBody } from '../src/index';
import type { GovernanceClearance, ProviderRequest } from '@openlance/aios-provider-engine';
import type { Transport, TransportResult } from '../src/index';

/**
 * Observational micro-baselines for the OpenAI adapter (Engineering Rule 5, ADR-0022): a full invoke cycle over a fake
 * transport, and the request and response mappings. Measurement only; deterministic over fixed inputs. Recorded results
 * live in benchmarks/baseline.md.
 */
const clearance = {} as unknown as GovernanceClearance;
const body = JSON.stringify({
  id: 'r',
  model: 'm',
  choices: [{ message: { content: 'hi' } }],
});
const result: TransportResult = { status: 200, body };
const transport: Transport = { send: () => Promise.resolve(result) };
const provider = createOpenAIProvider({ transport, apiKey: 'k', model: 'm' });
const request: ProviderRequest = { capability: 'text-generation', payload: { prompt: 'hi' } };

describe('provider-adapter-openai benchmarks', () => {
  bench('invoke (full cycle)', async () => {
    await provider.invoke(clearance, request);
  });
  bench('toChatBody', () => {
    toChatBody('m', { prompt: 'hi' });
  });
  bench('fromChatResponse', () => {
    fromChatResponse(body);
  });
});
