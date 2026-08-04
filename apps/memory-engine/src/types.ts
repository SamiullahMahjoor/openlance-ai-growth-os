import type {
  MemoryLifecyclePhase,
  MemoryRetentionClass,
  MemoryType,
} from '@openlance/aios-memory';

/** A retained memory record's stable identity within the engine. */
export type MemoryId = string;

/** The scope a memory is delimited by (for example an execution, session, or conversation identifier). */
export type MemoryScope = string;

/**
 * A retained-context record. It carries a frozen architectural `type` and `retention` class, the `scope`
 * it is delimited by, its retained `content` (runtime state, never business truth), and its lifecycle
 * `phase`. It is retained runtime state; knowledge always prevails over it.
 */
export interface MemoryRecord {
  readonly id: MemoryId;
  readonly type: MemoryType;
  readonly retention: MemoryRetentionClass;
  readonly scope: MemoryScope;
  readonly content: string;
  readonly phase: MemoryLifecyclePhase;
}

/** A memory record's formation input; the factory validates it and fills the default phase. */
export interface MemoryRecordInput {
  readonly id: MemoryId;
  readonly type: MemoryType;
  readonly retention: MemoryRetentionClass;
  readonly scope: MemoryScope;
  readonly content: string;
  readonly phase?: MemoryLifecyclePhase;
}

/**
 * A recall request: the scope whose retained context is to be made available, optionally narrowed to a
 * `type` and to a `minimumRetention` class. Recall makes retained context available; it retrieves no
 * external knowledge.
 */
export interface MemoryRequest {
  readonly scope: MemoryScope;
  readonly type?: MemoryType;
  readonly minimumRetention?: MemoryRetentionClass;
}

/** A read-only snapshot of the engine's operational counters. */
export interface MemoryStatistics {
  readonly formations: number;
  readonly recalls: number;
  readonly removals: number;
  readonly failures: number;
  readonly validationFailures: number;
}

/** A read-only operational view of the engine. */
export interface MemoryDiagnostics {
  readonly recordCount: number;
  readonly statistics: MemoryStatistics;
}
