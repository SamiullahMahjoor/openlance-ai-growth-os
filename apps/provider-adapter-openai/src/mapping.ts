import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { OpenAITextOutput } from './types.js';

/** Read a value as a string-keyed record, or an empty record when it is not a non-null object. Zero-trust; never throws. */
const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};

/**
 * Map a neutral text-generation request payload to the OpenAI chat-completions request body. The neutral payload carries
 * a non-empty `prompt` string; the mapping wraps it as a single user message under the given model. It fails (never
 * throws) when the payload carries no usable prompt, so a malformed request is refused rather than sent.
 */
export const toChatBody = (model: string, payload: unknown): Result<string, string> => {
  const prompt = asRecord(payload)['prompt'];
  if (typeof prompt !== 'string' || prompt === '') {
    return err('payload must carry a non-empty prompt string');
  }
  return ok(JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }));
};

/**
 * Map an OpenAI chat-completions response body to a neutral text output: the assistant message content, the model, and
 * the response id. It reads only defined fields and fails (never throws) on an unparseable body or a response that
 * carries no assistant content, so a malformed response never surfaces as a valid output.
 */
export const fromChatResponse = (body: string): Result<OpenAITextOutput, string> => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return err('response body is not valid JSON');
  }
  const root = asRecord(parsed);
  const choices = root['choices'];
  const first = Array.isArray(choices) ? asRecord(choices[0]) : {};
  const content = asRecord(first['message'])['content'];
  if (typeof content !== 'string') {
    return err('response carries no assistant message content');
  }
  const id = typeof root['id'] === 'string' ? root['id'] : '';
  const model = typeof root['model'] === 'string' ? root['model'] : '';
  return ok(Object.freeze({ text: content, model, id }));
};
