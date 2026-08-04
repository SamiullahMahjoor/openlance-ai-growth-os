/**
 * The Evolution namespace, namespace-wide truth (ai/evolution/README.md, OL-AI-EVOLUTION-README;
 * ai/evolution/evolution.md, OL-AI-EVOLUTION-EVOLUTION).
 *
 * The evolution invariants every evolution concern upholds, and the canonical inventory of the evolution
 * concerns, as immutable definitions (ADR-0020). The namespace is the model of controlled architectural change
 * of the AI layer: it defines how architectural change is proposed, reviewed, approved, introduced, stabilized,
 * and retired, how compatibility is preserved, how migration and deprecation proceed, and how the repository
 * grows, so that the layer advances over years while its constitution stays stable. Evolution defines how the
 * architecture changes; it never performs behavior: it never executes, reasons, retrieves, stores truth,
 * evaluates, operates, governs, or performs any runtime behavior, and it never defines a deployment, migration
 * tool, version-control system, provider, framework, or code (ai/evolution/README.md). It is deterministic and
 * scalable: the same architectural change, under the same rules and the same current architecture, follows the
 * same evolution path, and the model holds across decades of growth (ai/evolution/evolution.md). It defers the
 * amendment workflow to ai/CONTRIBUTING.md, the change rules to ai/governance/, the maturity map to
 * ai/architecture/repository-evolution.md, and business truth to the knowledge repository.
 *
 * Evolution is the final namespace of the AI layer. ADR-0024 does not enumerate Evolution among its examples;
 * per ADR-0024 §42 its category is declared in the design (docs/implementation/22-evolution.md) as category 1
 * (Pure Domain Model), the same shape as Governance: it owns the model of controlled architectural change
 * (truth about how the architecture changes), not an integration, orchestration, or composition. Its executable
 * surface is two pure ordering predicates over evolution-owned classifications - the lifecycle-phase and
 * deprecation-state orderings - realized per ADR-0020 as an immutable stateless domain model with no IO; the
 * carrying out of a concrete change is the amendment workflow's and the runtime's.
 */

/**
 * An evolution invariant: a permanent guarantee every evolution document upholds and no evolution may violate
 * (ai/evolution/README.md, "Evolution Invariants"). Every evolution concern's principles instantiate these.
 */
export type EvolutionInvariant =
  | 'defines-change-never-performs-behavior'
  | 'controlled-and-additive'
  | 'preserves-constitutional-stability'
  | 'preserves-compatibility-or-migrates'
  | 'acyclic'
  | 'deterministic'
  | 'defers-workflow-rules-map-and-truth'
  | 'single-owned-technology-neutral-and-scalable';

/** The eight evolution invariants, in constitutional order; frozen. */
export const EVOLUTION_INVARIANTS: readonly EvolutionInvariant[] = Object.freeze([
  'defines-change-never-performs-behavior',
  'controlled-and-additive',
  'preserves-constitutional-stability',
  'preserves-compatibility-or-migrates',
  'acyclic',
  'deterministic',
  'defers-workflow-rules-map-and-truth',
  'single-owned-technology-neutral-and-scalable',
]);

/** The guarantee each evolution invariant states (ai/evolution/README.md, "Evolution Invariants"). */
export const EVOLUTION_INVARIANT_DESCRIPTIONS: Readonly<Record<EvolutionInvariant, string>> =
  Object.freeze({
    'defines-change-never-performs-behavior':
      'Evolution never executes, reasons, retrieves, stores truth, evaluates, operates, governs, or performs any runtime behavior.',
    'controlled-and-additive':
      'Architectural change is proposed, reviewed, approved, introduced, stabilized, and retired, and growth is additive rather than a redesign.',
    'preserves-constitutional-stability':
      'A change advances the architecture without eroding the constitution; the foundations stay stable while the architecture extends.',
    'preserves-compatibility-or-migrates':
      'A change preserves compatibility, or is migrated and the superseded part deprecated, so nothing breaks silently.',
    acyclic:
      'Architectural evolution advances the architecture and never cycles; no change loops the architecture back on itself.',
    deterministic:
      'The same architectural change, under the same rules and the same current architecture, follows the same evolution path, with no randomness.',
    'defers-workflow-rules-map-and-truth':
      'It defers the amendment workflow to ai/CONTRIBUTING.md, the change rules to ai/governance/, the maturity map to ai/architecture/repository-evolution.md, and business truth to the knowledge repository.',
    'single-owned-technology-neutral-and-scalable':
      'Each evolution concern has exactly one owning document, and the model holds across decades of growth.',
  });

/**
 * An evolution concern: one aspect of the evolution model, each owned by exactly one document
 * (ai/evolution/evolution.md, "The Evolution Concerns"). This is the namespace inventory identity; the model of
 * each concern is owned by its named document and this package's corresponding module.
 */
export type EvolutionConcern =
  | 'evolution-architecture'
  | 'evolution-lifecycle'
  | 'evolution-planning'
  | 'change-management'
  | 'compatibility-management'
  | 'migration-model'
  | 'deprecation-model'
  | 'repository-growth'
  | 'evolution-boundaries'
  | 'evolution-versioning';

/** The ten evolution concerns, in inventory order; frozen. */
export const EVOLUTION_CONCERNS: readonly EvolutionConcern[] = Object.freeze([
  'evolution-architecture',
  'evolution-lifecycle',
  'evolution-planning',
  'change-management',
  'compatibility-management',
  'migration-model',
  'deprecation-model',
  'repository-growth',
  'evolution-boundaries',
  'evolution-versioning',
]);

/** What each evolution concern owns (ai/evolution/evolution.md, "The Evolution Concerns"). */
export const EVOLUTION_CONCERN_DESCRIPTIONS: Readonly<Record<EvolutionConcern, string>> =
  Object.freeze({
    'evolution-architecture':
      'The structural architecture of evolution: evolution identity and architectural composition.',
    'evolution-lifecycle':
      'The phases of an architectural change: proposal, review, approval, introduction, stabilization, and retirement.',
    'evolution-planning':
      'The planning model: the roadmap, architectural sequencing, and dependency planning of evolution.',
    'change-management':
      'The constitutional change model, change categories, and controlled change.',
    'compatibility-management':
      'The compatibility relationships, compatibility guarantees, and compatibility preservation across architectural evolution.',
    'migration-model': 'The migration architecture, migration phases, and migration safety.',
    'deprecation-model': 'The deprecation lifecycle, the replacement model, and retirement rules.',
    'repository-growth':
      'The growth model: namespace expansion, document growth, additive scaling, and future-proof repository structure.',
    'evolution-boundaries': 'What evolution never owns, and where evolution stops.',
    'evolution-versioning':
      'Version evolution, compatibility across generations, and constitutional evolution governance consumption.',
  });
