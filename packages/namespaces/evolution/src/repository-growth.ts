/**
 * Repository growth: how the repository grows over time, expressed as the model of namespace expansion,
 * document growth, additive scaling, and the future-proof structure that lets it grow without redesign
 * (ai/evolution/repository-growth.md, OL-AI-EVOLUTION-REPOSITORY-GROWTH).
 *
 * The Specification narrates the growth model as heterogeneous facets (document growth, namespace expansion,
 * additive scaling, future-proof structure): two mechanisms of growth and two properties of it, not a closed
 * homogeneous set the model refers to by identity, so this concern is definitions only (principles and
 * invariants), consistent with the modeling rule recorded in docs/implementation/13-retrieval.md section 4. The
 * growth rules, Folder Structure, and Future Expansion are owned by ai/README.md, the maturity map by
 * ai/architecture/repository-evolution.md, and the change model for a structural growth by
 * ai/evolution/change-management.md, referenced not restated (ADR-0020, ADR-0025).
 */

/**
 * A repository-growth principle: a permanent rule the growth model upholds, each instantiating an evolution
 * invariant (ai/evolution/repository-growth.md, "Principles").
 */
export type RepositoryGrowthPrinciple =
  | 'growth-is-additive'
  | 'growth-applies-the-rules-it-does-not-own-them'
  | 'growth-preserves-structure'
  | 'growth-is-future-proof';

/** The repository-growth principles, in constitutional order; frozen. */
export const REPOSITORY_GROWTH_PRINCIPLES: readonly RepositoryGrowthPrinciple[] = Object.freeze([
  'growth-is-additive',
  'growth-applies-the-rules-it-does-not-own-them',
  'growth-preserves-structure',
  'growth-is-future-proof',
]);

/** What each repository-growth principle requires (ai/evolution/repository-growth.md, "Principles"). */
export const REPOSITORY_GROWTH_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<RepositoryGrowthPrinciple, string>
> = Object.freeze({
  'growth-is-additive':
    'The repository grows by adding documents and namespaces, never by enlarging or redesigning existing ones.',
  'growth-applies-the-rules-it-does-not-own-them':
    'The growth rules and Future Expansion are owned by ai/README.md; this model applies them and never redefines them.',
  'growth-preserves-structure':
    'Every addition follows the same Process, Reference, and Specification pattern, so the structure stays uniform as it grows.',
  'growth-is-future-proof':
    'Because growth is additive and uniform, the repository scales from a handful of documents to thousands without its structure changing.',
});

/**
 * A repository-growth invariant: a guarantee the growth model always upholds
 * (ai/evolution/repository-growth.md, "Invariants").
 */
export type RepositoryGrowthInvariant =
  | 'grows-by-adding-documents-and-namespaces-never-enlarging-or-redesigning'
  | 'applies-the-growth-rules-and-future-expansion-never-redefines-them'
  | 'every-addition-follows-the-same-process-reference-and-specification-pattern'
  | 'additive-uniform-growth-scales-without-redesign-structure-change-is-constitutional'
  | 'modelling-growth-is-inert';

/** The repository-growth invariants, in constitutional order; frozen. */
export const REPOSITORY_GROWTH_INVARIANTS: readonly RepositoryGrowthInvariant[] = Object.freeze([
  'grows-by-adding-documents-and-namespaces-never-enlarging-or-redesigning',
  'applies-the-growth-rules-and-future-expansion-never-redefines-them',
  'every-addition-follows-the-same-process-reference-and-specification-pattern',
  'additive-uniform-growth-scales-without-redesign-structure-change-is-constitutional',
  'modelling-growth-is-inert',
]);

/** What each repository-growth invariant guarantees (ai/evolution/repository-growth.md, "Invariants"). */
export const REPOSITORY_GROWTH_INVARIANT_DESCRIPTIONS: Readonly<
  Record<RepositoryGrowthInvariant, string>
> = Object.freeze({
  'grows-by-adding-documents-and-namespaces-never-enlarging-or-redesigning':
    'The repository grows by adding documents and namespaces, never by enlarging or redesigning existing ones.',
  'applies-the-growth-rules-and-future-expansion-never-redefines-them':
    'Growth applies the growth rules and Future Expansion owned by ai/README.md and never redefines them.',
  'every-addition-follows-the-same-process-reference-and-specification-pattern':
    'Every addition follows the same Process, Reference, and Specification pattern, so the structure stays uniform.',
  'additive-uniform-growth-scales-without-redesign-structure-change-is-constitutional':
    'Additive, uniform growth lets the repository scale without redesign, and a growth that would change the structure is a constitutional change.',
  'modelling-growth-is-inert':
    'Modelling growth never executes, reasons, operates, governs, changes behavior, or changes ownership, authority, or business truth.',
});
