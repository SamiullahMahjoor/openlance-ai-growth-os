/**
 * @packageDocumentation
 * `@openlance/aios-retrieval-engine`
 *
 * The Runtime's operational Retrieval Engine (Phase 4, Stage 4; ADR-0038), the operational realization of
 * the frozen Retrieval namespace. It determines the minimum sufficient, dependency-complete,
 * authority-correct knowledge set a task requires, over provided candidates (discover, select, resolve
 * dependencies, prioritize, assemble, validate, produce result), by consuming the frozen
 * `@openlance/aios-retrieval` model, and produces a validated `RetrievalResult`. It determines and stops.
 *
 * It is foundational: it depends on no operational service, and per the frozen retrieval boundary it
 * never reaches into memory (or reasoning, prompts, providers, tools, agents, or the runtime). It loads
 * nothing and executes nothing; its discovery, selection, prioritization, and validation are deterministic
 * and structural, applying no search technology; and it contains no vendor knowledge (no vendor client
 * library, model, API URL, or authentication). Composing
 * retrieved knowledge with retained memory belongs to a later orchestration layer.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-RETRIEVAL-README.
 */

export type {
  RetrievalCandidate,
  RetrievalCandidateInput,
  RetrievalDiagnostics,
  RetrievalId,
  RetrievalRequest,
  RetrievalResult,
  RetrievalStatistics,
} from './types.js';

export { RetrievalError } from './errors.js';
export { RetrievalRegistry } from './registry.js';
export { RetrievalFactory } from './factory.js';
export { RetrievalLifecycle } from './lifecycle.js';
export { RetrievalNormalizer } from './normalizer.js';
export { RetrievalPlanner } from './planner.js';
export { RetrievalFilter } from './filter.js';
export { RetrievalResolver } from './resolver.js';
export { RetrievalRanker } from './ranker.js';
export { RetrievalValidator, VALIDATION_ERROR_CODES } from './validator.js';
export { RetrievalExecutor } from './executor.js';
export { RetrievalMetrics } from './metrics.js';
export { RetrievalEvents, RETRIEVAL_EVENT_TYPES } from './events.js';
export { RetrievalConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { RetrievalEngineSettings } from './configuration.js';
export { RetrievalPluginBridge } from './plugin-bridge.js';
export type { RetrievalPlugin } from './plugin-bridge.js';
export { RetrievalManager } from './manager.js';
export type { RetrievalManagerOptions } from './manager.js';
export { retrievalEngineModule, RETRIEVAL_MANAGER } from './module.js';
