/**
 * @packageDocumentation
 * `@openlance/aios-provider-adapter-openai`
 *
 * The AIOS OpenAI provider adapter (Platform Completion, PC-2): the first concrete provider adapter, a separate leaf
 * package implemented against the frozen Provider Engine seam (ADR-0047). `createOpenAIProvider(options)` returns a
 * frozen-seam `ProviderDescriptor` that maps a neutral text-generation request to and from the OpenAI chat-completions
 * API behind an injected transport. All vendor knowledge is isolated here; the adapter imports no HTTP client and no SDK,
 * embeds no credential (the API key and base URL are injected), is fail-closed and never throws, and accepts a
 * `GovernanceClearance` without inspecting or minting one. It never modifies the frozen Provider Engine.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules are prohibited
 * and fail CI.
 */

export { createOpenAIProvider } from './provider.js';
export { toChatBody, fromChatResponse } from './mapping.js';
export type {
  OpenAIProviderOptions,
  OpenAITextOutput,
  Transport,
  TransportRequest,
  TransportResult,
} from './types.js';
