/** A retrieval candidate's stable identity within the engine. */
export type RetrievalId = string;

/**
 * A candidate knowledge piece, drawn from its single canonical owner (never a copy or a restatement). It
 * carries the `owner` that canonically owns its concern, an `authority` level (higher governs lower), the
 * `topics` it covers (for discovery), the ids it `dependsOn`, and its `content` (a normalized knowledge
 * reference). It names knowledge; it is never business truth restated, a governance rule, or runtime state.
 */
export interface RetrievalCandidate {
  readonly id: RetrievalId;
  readonly owner: string;
  readonly authority: number;
  readonly topics: readonly string[];
  readonly dependsOn: readonly RetrievalId[];
  readonly content: string;
}

/** A candidate's registration input; the factory validates it and normalizes its content. */
export interface RetrievalCandidateInput {
  readonly id: RetrievalId;
  readonly owner: string;
  readonly authority: number;
  readonly topics: readonly string[];
  readonly dependsOn?: readonly RetrievalId[];
  readonly content: string;
}

/**
 * A retrieval request: the `scope` (topic) whose knowledge is to be determined, and optionally the
 * governance-permitted candidate ids the execution may consume. Permission is applied, never restated.
 */
export interface RetrievalRequest {
  readonly scope: string;
  readonly permitted?: readonly RetrievalId[];
}

/**
 * A validated retrieval result: the ordered, dependency-complete candidate set the runtime is to load. It
 * names the knowledge to load; it never contains or alters the truth itself, and it is never loaded here.
 */
export interface RetrievalResult {
  readonly scope: string;
  readonly candidates: readonly RetrievalCandidate[];
  readonly validated: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface RetrievalStatistics {
  readonly registrations: number;
  readonly retrievals: number;
  readonly successes: number;
  readonly failures: number;
  readonly validationFailures: number;
}

/** A read-only operational view of the engine. */
export interface RetrievalDiagnostics {
  readonly candidateCount: number;
  readonly statistics: RetrievalStatistics;
}
