import type { ReasoningStage, ReasoningStrategy, UncertaintyKind } from '@openlance/aios-reasoning';

/** A premise's stable identity within the engine. */
export type ReasoningId = string;

/**
 * A premise: a piece of retrieved knowledge a reasoning consumes, drawn from its source (never invented or owned). It
 * carries the `statement` it asserts (a normalized knowledge reference) and the `source` that provides it. Reasoning
 * rests on premises and stated assumptions, never on an invented fact.
 */
export interface Premise {
  readonly id: ReasoningId;
  readonly statement: string;
  readonly source: string;
}

/** A premise's registration input; the factory validates it and normalizes its statement. */
export interface PremiseInput {
  readonly id: ReasoningId;
  readonly statement: string;
  readonly source: string;
}

/**
 * A reasoning request: the `task` to reason about, the `strategy` (frozen category) it applies, the registered
 * `premises` (ids) it grounds on, the `parts` to decompose the task into, the stated `assumptions` it takes as given,
 * and the governance `permitted` verdict the engine applies (a `false` verdict escalates; permission is applied, never
 * defined). The retrieved knowledge and governing rules are provided, never determined here.
 */
export interface ReasoningRequest {
  readonly task: string;
  readonly strategy: ReasoningStrategy;
  readonly premises?: readonly ReasoningId[];
  readonly parts?: readonly string[];
  readonly assumptions?: readonly string[];
  readonly permitted?: boolean;
}

/**
 * A governed reasoning plan: the outcome of reasoning over a request. It names the `task`, the applied `strategy`, the
 * decomposed `parts`, the `premises` and `assumptions` it rests on, and the terminal `stage` (`concluded`,
 * `inconclusive`, or `escalated`), with a classified `uncertainty` when the reasoning is inconclusive. `validated: true`
 * marks that it passed the frozen validation dimensions. It is a plan the reasoning produced; the inference it frames is
 * never carried out here.
 */
export interface ReasoningPlan {
  readonly task: string;
  readonly strategy: ReasoningStrategy;
  readonly parts: readonly string[];
  readonly premises: readonly ReasoningId[];
  readonly assumptions: readonly string[];
  readonly stage: ReasoningStage;
  readonly uncertainty?: UncertaintyKind;
  readonly validated: true;
}

/** A read-only snapshot of the engine's operational counters. */
export interface ReasoningStatistics {
  readonly registrations: number;
  readonly reasonings: number;
  readonly concluded: number;
  readonly inconclusive: number;
  readonly escalated: number;
  readonly failures: number;
}

/** A read-only operational view of the engine. */
export interface ReasoningDiagnostics {
  readonly premiseCount: number;
  readonly statistics: ReasoningStatistics;
}
