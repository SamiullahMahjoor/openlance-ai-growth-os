# 20. Evaluation namespace implementation design

The implementation design for `@openlance/aios-evaluation`, the package that conforms to the frozen
`ai/evaluation/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like the nine prior Phase 2B
namespaces, Evaluation was implemented as one cohesive cycle at explicit request.

## 1. Ownership

Evaluation owns the **assessment model of the AI layer**: how the output of the AI layer is measured, scored,
validated, benchmarked, and compared, so that behavior can be judged, deterministically and neutrally, without
ever being performed or changed (`ai/evaluation/README.md`, `ai/evaluation/evaluation.md`). It observes the
outputs of the namespaces it evaluates, one-directionally, without those namespaces depending on it. It owns
none of the behavior it measures (`ai/reasoning/`, `ai/retrieval/`, `ai/prompts/`, `ai/memory/`, `ai/agents/`,
`ai/providers/`, `ai/tools/`), none of its quality definition (owned by each subject's namespace), none of the
decisions or protections its results inform (`ai/governance/`, `ai/safety/`), and no business truth (the
knowledge repository).

## 2. Category (ADR-0024) and the purity basis

ADR-0024 does **not** enumerate Evaluation among its five worked examples. Per **ADR-0024 §42**, when a
namespace is not enumerated its purity category is declared in this design document, with no new ADR. Evaluation
is declared **category 1 (Pure Domain Model)**, the same shape as Governance and Safety: it owns a model of
*truth about how output is judged*, not an integration (category 4), an orchestration or runtime service
(category 3), or a composition root (category 5). Nothing in `ai/evaluation/` names a provider, a model, a
framework, a runtime, a metric mechanism, a test harness, or code; every document is a technology-neutral
Specification that "defines the evaluation model, never how an evaluation is implemented or executed"
(`ai/evaluation/README.md`). ADR-0020 fixes how every technology-neutral constitutional namespace maps to code:
"a set of types, frozen data, and pure predicates... no IO." So the conformance package owns the evaluation
model **as an immutable specification model**; the assessment of a concrete output is the operational runtime's,
built later, outside this package. Category 1 and ADR-0020 coincide here: a Pure Domain Model realized exactly
as ADR-0020 prescribes.

## 3. The two algorithms

Every executable predicate expresses a constitutional ordering over evaluation-owned classifications (the
boundary rule inherited from Governance, `docs/implementation/10-governance.md` section 7a):

- `evaluationPhaseAtOrAfter(a, b)` - the **evaluation-lifecycle phase order** (`evaluation-lifecycle.md`,
  "Specification"): framing, measurement, scoring, validation, result. A total order the document declares
  ("the following ordered phases"; the invariant "Framing precedes Measurement, which precedes Scoring, which
  precedes Validation"), realized via a private rank map and `>=`.
- `evaluationValidationCheckAtOrAfter(a, b)` - the **evaluation-validation check order**
  (`evaluation-validation.md`, "Specification"): well-formedness, grounding, scoring, constitutional. A total
  order the document declares ("The checks are applied in this order, from well-formedness to constitutional
  conformance"; the invariant "well-formedness first"), realized via a private rank map and `>=`.

The unordered classifications (`EvaluationPart`, `EvaluationCompatibilityKind`, `EvaluationBoundary`,
`EvaluationVersioningAspect`) carry no predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). The concern order follows the inventory in `ai/evaluation/evaluation.md`.

- `namespace.ts` - `EvaluationInvariant` (7), `EvaluationConcern` (10).
- `evaluation-architecture.ts` - principles (4), `EvaluationPart` (4: identity, subject-output, metrics,
  benchmark), invariants (5).
- `evaluation-lifecycle.ts` - principles (4), `EvaluationLifecyclePhase` (5, ordered), invariants (5),
  `evaluationPhaseAtOrAfter`.
- `evaluation-metrics.ts` - principles (4), invariants (5). Definitions only.
- `evaluation-scoring.ts` - principles (4), invariants (5). Definitions only.
- `evaluation-validation.ts` - principles (4), `EvaluationValidationCheck` (4, ordered), invariants (5),
  `evaluationValidationCheckAtOrAfter`.
- `evaluation-benchmarking.ts` - principles (4), invariants (5). Definitions only.
- `evaluation-comparison.ts` - principles (4), invariants (5). Definitions only.
- `evaluation-compatibility.ts` - principles (4), `EvaluationCompatibilityKind` (2: subject, version),
  invariants (5).
- `evaluation-boundaries.ts` - principles (4), `EvaluationBoundary` (6: behavior, decision, subject,
  one-directional, truth, implementation), invariants (5).
- `evaluation-versioning.ts` - principles (4), `EvaluationVersioningAspect` (4: version-rules, evolution,
  migration, deprecation), invariants (5).

**Classification vs. definitions-only.** Per the rule recorded in `docs/implementation/13-retrieval.md`
section 4, a Specification becomes a classification only where it enumerates a genuine closed homogeneous
domain set the model refers to by identity. Modeled: `EvaluationPart` (the parts an evaluation "is composed
of", restated in the architecture invariant), the lifecycle phases and validation checks (both ordered and
restated in their invariants), `EvaluationCompatibilityKind` (the two kinds of compatibility the model owns),
`EvaluationBoundary` (the six named architectural boundaries), and `EvaluationVersioningAspect` (the four
aspects of versioning). Definitions only: metrics, scoring, benchmarking, and comparison. Each of those four
Specifications narrates heterogeneous facets of one model (for metrics, the "quality dimensions" and "grounding
dimension" are introduced with "including" and "such as", non-exhaustive, and are not restated as a closed set
in the invariants), so none yields a closed taxonomy the model refers to by identity.

**Referenced models.** The quality a metric measures against (owned by the subject namespaces, e.g.
`ai/reasoning/reasoning-quality.md`, `ai/memory/memory-quality.md`); the business truth grounding is measured
against (the knowledge repository); the decision or protection a result informs (`ai/governance/`,
`ai/safety/`); the governance validation rule (`ai/governance/constitutional-validation.md`); and the change
governance a version evolves under (`ai/governance/change-governance.md`) are all referenced in prose and never
recreated as an evaluation classification (referenced-model non-restatement rule).

## 5. Dependency usage

`ai/architecture/dependency-map.md` places Evaluation depending on the constitution and Governance only
(dependency-cruiser `NAMESPACE_DEPS.evaluation = ['governance']`). No evaluation concern's model uses a type
owned by Governance - the governance rules it applies are referenced in prose, never restated or imported
(referenced-model non-restatement; ADR-0021, "import only what you use") - so the package imports nothing and
its dependency-graph edge is `[]`. It uses no substrate package. This one-directional independence is the
`one-directional` boundary made concrete: evaluation depends only on the constitution and the governance
mandates, and no subject namespace depends on it, so no cycle is possible.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for the Evaluation *package*: **lifecycle** none (the evaluation phases and
validation checks are modeled *data*, not a package lifecycle); **state** none (the model is immutable/frozen;
an evaluation carries no mutable current-state); **errors** none (it performs no assessment); **events** none.
These empty sections are the correct shape of a Pure Domain Model realized per ADR-0020, not gaps - the actual
evaluation service owns the live assessment of a concrete output.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual`); every principle, member, and invariant description is asserted non-empty;
immutability is asserted (`Object.isFrozen`). The two orderings are proven total and deterministic across their
whole matrices (5x5 for the lifecycle phases, 4x4 for the validation checks) against the declared order.
Executable code is at 100% coverage (statements, branches, functions, lines). Benchmarks measure the two
predicates only.

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/evaluation/` document, and no metric mechanism, test
  harness, scorer, comparator, or assessment engine is exported.
- Full validation green: typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test (100% on
  executable code), bench, docs, build.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the nine prior frozen namespaces unchanged;
  the dependency graph unchanged (`evaluation: []`).
