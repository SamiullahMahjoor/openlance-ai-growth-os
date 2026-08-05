/**
 * @packageDocumentation
 * `@openlance/aios-reasoning-engine`
 *
 * The AIOS Reasoning Engine (Phase 4, Stage 6): the Runtime's operational reasoning subsystem, the operational
 * realization of the frozen Reasoning namespace. It performs deterministic structural reasoning over provided knowledge
 * (register premises, frame, decompose, validate through the frozen conjunctive dimensions, produce a governed plan),
 * driving the frozen `@openlance/aios-reasoning` model, and produces a validated `ReasoningPlan` whose terminal stage is
 * `concluded`, `inconclusive`, or `escalated`. It **reasons and stops**: it invokes no provider, performs no inference,
 * and executes nothing.
 *
 * It is **foundational**: it consumes only the frozen reasoning model and the substrate, and depends on no operational
 * service. Per the frozen `reasoning-boundaries`, a reasoning is expressed as prompts and executed by providers (owned
 * by their namespaces), and a reasoning produces a conclusion and stops, so the engine reaches into no provider, prompt,
 * or retrieval engine; the inference the plan frames is a later execution stage. It contains no vendor knowledge and
 * names no model (ADR-0040). This file is the single supported public API (Engineering Rule 1).
 */

export type {
  ReasoningId,
  Premise,
  PremiseInput,
  ReasoningRequest,
  ReasoningPlan,
  ReasoningStatistics,
  ReasoningDiagnostics,
} from './types.js';

export { ReasoningError } from './errors.js';
export { ReasoningNormalizer } from './normalizer.js';
export { ReasoningRegistry } from './registry.js';
export { ReasoningFactory } from './factory.js';
export { ReasoningLifecycle } from './lifecycle.js';
export { ReasoningDecomposer } from './decomposer.js';
export { ReasoningValidator } from './validator.js';
export { ReasoningPlanner } from './planner.js';
export { ReasoningMetrics } from './metrics.js';
export { ReasoningEvents, REASONING_EVENT_TYPES } from './events.js';
export { ReasoningConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { ReasoningEngineSettings } from './configuration.js';
export { ReasoningPluginBridge } from './plugin-bridge.js';
export type { ReasoningPlugin } from './plugin-bridge.js';
export { ReasoningManager } from './manager.js';
export type { ReasoningManagerOptions } from './manager.js';
export { reasoningEngineModule, REASONING_MANAGER } from './module.js';
