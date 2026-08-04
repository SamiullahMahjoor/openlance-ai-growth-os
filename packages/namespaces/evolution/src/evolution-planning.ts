/**
 * Evolution planning: how architectural evolution is planned, expressed as a roadmap, the sequencing of
 * architectural change, and the planning of dependencies between changes (ai/evolution/evolution-planning.md,
 * OL-AI-EVOLUTION-EVOLUTION-PLANNING).
 *
 * The Specification narrates the planning model as heterogeneous facets (the planning model, the roadmap,
 * architectural sequencing, dependency planning). It enumerates no closed homogeneous set the model refers to
 * by identity, so this concern is definitions only (principles and invariants), consistent with the modeling
 * rule recorded in docs/implementation/13-retrieval.md section 4. The Future Architecture Roadmap is owned by
 * ai/README.md, the lifecycle a planned change enters by ai/evolution/evolution-lifecycle.md, and the
 * dependency direction by ai/architecture/dependency-map.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * An evolution-planning principle: a permanent rule the planning model upholds, each instantiating an evolution
 * invariant (ai/evolution/evolution-planning.md, "Principles").
 */
export type EvolutionPlanningPrinciple =
  | 'planning-is-forward-looking-not-a-change'
  | 'planning-applies-the-roadmap-it-does-not-own-it'
  | 'sequencing-respects-dependencies'
  | 'planning-is-acyclic';

/** The evolution-planning principles, in constitutional order; frozen. */
export const EVOLUTION_PLANNING_PRINCIPLES: readonly EvolutionPlanningPrinciple[] = Object.freeze([
  'planning-is-forward-looking-not-a-change',
  'planning-applies-the-roadmap-it-does-not-own-it',
  'sequencing-respects-dependencies',
  'planning-is-acyclic',
]);

/** What each evolution-planning principle requires (ai/evolution/evolution-planning.md, "Principles"). */
export const EVOLUTION_PLANNING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<EvolutionPlanningPrinciple, string>
> = Object.freeze({
  'planning-is-forward-looking-not-a-change':
    'Planning arranges what may change and in what order; it changes nothing itself.',
  'planning-applies-the-roadmap-it-does-not-own-it':
    'The Future Architecture Roadmap is owned by ai/README.md; planning applies it to sequence change and never redefines it.',
  'sequencing-respects-dependencies':
    'A change is sequenced after the changes it depends on, so evolution proceeds in a dependency-respecting order.',
  'planning-is-acyclic':
    'A plan sequences changes without a cycle, so no change is planned to depend, directly or indirectly, on itself.',
});

/**
 * An evolution-planning invariant: a guarantee the planning model always upholds
 * (ai/evolution/evolution-planning.md, "Invariants").
 */
export type EvolutionPlanningInvariant =
  | 'arranges-and-sequences-change-never-makes-a-change'
  | 'applies-the-future-architecture-roadmap-never-redefines-it'
  | 'a-change-is-sequenced-after-the-changes-and-namespaces-it-depends-on'
  | 'a-plan-is-acyclic-no-change-depends-on-itself'
  | 'planning-evolution-is-inert';

/** The evolution-planning invariants, in constitutional order; frozen. */
export const EVOLUTION_PLANNING_INVARIANTS: readonly EvolutionPlanningInvariant[] = Object.freeze([
  'arranges-and-sequences-change-never-makes-a-change',
  'applies-the-future-architecture-roadmap-never-redefines-it',
  'a-change-is-sequenced-after-the-changes-and-namespaces-it-depends-on',
  'a-plan-is-acyclic-no-change-depends-on-itself',
  'planning-evolution-is-inert',
]);

/** What each evolution-planning invariant guarantees (ai/evolution/evolution-planning.md, "Invariants"). */
export const EVOLUTION_PLANNING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<EvolutionPlanningInvariant, string>
> = Object.freeze({
  'arranges-and-sequences-change-never-makes-a-change':
    'Planning arranges and sequences architectural change and never makes a change.',
  'applies-the-future-architecture-roadmap-never-redefines-it':
    'Planning applies the Future Architecture Roadmap owned by ai/README.md and never redefines it.',
  'a-change-is-sequenced-after-the-changes-and-namespaces-it-depends-on':
    'A change is sequenced after the changes and namespaces it depends on.',
  'a-plan-is-acyclic-no-change-depends-on-itself':
    'A plan is acyclic; no change is planned to depend, directly or indirectly, on itself.',
  'planning-evolution-is-inert':
    'Planning evolution never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
