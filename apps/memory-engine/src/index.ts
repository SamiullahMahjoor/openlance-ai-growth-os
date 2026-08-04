/**
 * @packageDocumentation
 * `@openlance/aios-memory-engine`
 *
 * The Runtime's foundational operational Memory Engine (Phase 4, Stage 3; ADR-0037), the operational
 * realization of the frozen Memory namespace. It carries out operational memory management (form: receive,
 * classify, validate, retain; recall: make retained context available; remove) over retained records, by
 * consuming the frozen `@openlance/aios-memory` model. It is foundational: it depends on no operational
 * service (not the Prompt Engine, not the Provider Engine).
 *
 * It executes nothing (it never reasons, retrieves external knowledge, invokes a provider, or expresses a
 * prompt), it performs no retrieval (its indexing, lookup, and recall are deterministic and structural,
 * over the engine's own retained records, with no retrieval technique), and it contains no vendor
 * knowledge (no vendor client library, model, API URL, or authentication).
 * Memory holds runtime state only; knowledge always prevails over it.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal modules
 * are prohibited and fail CI. Constitution: OL-AI-MEMORY-README.
 */

export type {
  MemoryDiagnostics,
  MemoryId,
  MemoryRecord,
  MemoryRecordInput,
  MemoryRequest,
  MemoryScope,
  MemoryStatistics,
} from './types.js';

export { MemoryError } from './errors.js';
export { MemoryRegistry } from './registry.js';
export { MemoryFactory } from './factory.js';
export { MemoryLifecycle } from './lifecycle.js';
export { MemoryValidator } from './validator.js';
export { MemoryNormalizer } from './normalizer.js';
export { MemoryIndexer } from './indexer.js';
export { MemoryLookup } from './lookup.js';
export { MemoryResolver } from './resolver.js';
export { MemoryMetrics } from './metrics.js';
export { MemoryEvents, MEMORY_EVENT_TYPES } from './events.js';
export { MemoryConfiguration, DEFAULT_SETTINGS } from './configuration.js';
export type { MemoryEngineSettings } from './configuration.js';
export { MemoryPluginBridge } from './plugin-bridge.js';
export type { MemoryPlugin } from './plugin-bridge.js';
export { MemoryManager } from './manager.js';
export type { MemoryManagerOptions } from './manager.js';
export { memoryEngineModule, MEMORY_MANAGER } from './module.js';
