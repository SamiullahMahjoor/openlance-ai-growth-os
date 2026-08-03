# Evaluation Namespace, Freeze Declaration

**Status:** FROZEN (all ten evaluation concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-evaluation` (`packages/namespaces/evaluation`).
**Scope:** the Evaluation namespace domain model, the eleventh namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, Reasoning, Prompts,
Tools, Agents, and Runtime namespaces, and the frozen `ai/` and `knowledge/` constitution. Evaluation is a
Category 1 (Pure Domain Model) namespace, declared per ADR-0024 §42.

The Evaluation namespace is **immutable**. It states the assessment model of the AI layer: how the output of
the AI layer is measured, scored, validated, benchmarked, and compared, so that behavior can be judged,
deterministically and neutrally, without ever being performed or changed. It measures behavior; it never
performs it: it never reasons, executes, decides, or changes the behavior it assesses, and it never defines a
metric mechanism, test harness, provider, model, framework, language, runtime, protocol, interface, or code.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/evaluation/<file>.md` document. Each
models the two normative sections of the Evaluation Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `EVALUATION_INVARIANTS` (7), `EVALUATION_CONCERNS` (10) | none |
| `evaluation-architecture.ts` | Evaluation Architecture | `EvaluationPart` (4) | none |
| `evaluation-lifecycle.ts` | Evaluation Lifecycle | `EvaluationLifecyclePhase` (5, ordered) | `evaluationPhaseAtOrAfter` |
| `evaluation-metrics.ts` | Evaluation Metrics | none (measurement facets) | none |
| `evaluation-scoring.ts` | Evaluation Scoring | none (scoring facets) | none |
| `evaluation-validation.ts` | Evaluation Validation | `EvaluationValidationCheck` (4, ordered) | `evaluationValidationCheckAtOrAfter` |
| `evaluation-benchmarking.ts` | Evaluation Benchmarking | none (benchmark facets) | none |
| `evaluation-comparison.ts` | Evaluation Comparison | none (comparison facets) | none |
| `evaluation-compatibility.ts` | Evaluation Compatibility | `EvaluationCompatibilityKind` (2) | none |
| `evaluation-boundaries.ts` | Evaluation Boundaries | `EvaluationBoundary` (6) | none |
| `evaluation-versioning.ts` | Evaluation Versioning | `EvaluationVersioningAspect` (4) | none |

The ten concerns match the ten concerns in the inventory `ai/evaluation/evaluation.md` exactly.

## Category 1 and the §42 declaration (recorded for the freeze)

ADR-0024 does **not** enumerate Evaluation among its five worked examples. Per **ADR-0024 §42**, when a
namespace is not enumerated its purity category is declared in the design document, with no new ADR. Evaluation
is declared **category 1 (Pure Domain Model)**, the same shape as Governance and Safety: it owns a model of
truth about how output is judged, not an integration (category 4), an orchestration or runtime service
(category 3), or a composition root (category 5). The frozen `ai/evaluation/` documents are technology-neutral
specifications that "define the evaluation model, never how an evaluation is implemented or executed"
(`ai/evaluation/README.md`). So the package conforms to that spec per **ADR-0020** as an immutable, stateless
domain model ("types, frozen data, and pure predicates... no IO"); the assessment of a concrete output is the
operational runtime's, built later, outside this constitutional-conformance package. Category 1 and ADR-0020
coincide here. No new ADR was added; the ADR corpus is unchanged (25 ADRs, contiguous). See
`docs/implementation/20-evaluation.md` section 2. Both independent audits confirmed the declaration sound and
the package genuinely IO-free.

## The two algorithms (recorded for the freeze)

Each predicate expresses a constitutional ordering over evaluation-owned classifications, via a private
(non-exported) rank map and `>=`:

- `evaluationPhaseAtOrAfter` - the evaluation-lifecycle phase order (`evaluation-lifecycle.md`): framing,
  measurement, scoring, validation, result. The document declares "the following ordered phases" and the
  invariant "Framing precedes Measurement, which precedes Scoring, which precedes Validation."
- `evaluationValidationCheckAtOrAfter` - the evaluation-validation check order (`evaluation-validation.md`):
  well-formedness, grounding, scoring, constitutional. The document declares "from well-formedness to
  constitutional conformance" and the invariant "well-formedness first."

The unordered classifications (`EvaluationPart`, `EvaluationCompatibilityKind`, `EvaluationBoundary`,
`EvaluationVersioningAspect`) carry no predicate.

## Classification vs. definitions-only (recorded for the freeze)

Per the modeling rule in `docs/implementation/13-retrieval.md` section 4, a Specification becomes a
classification only where it enumerates a genuine closed homogeneous domain set the model refers to by
identity. Modeled: architecture parts, lifecycle phases, validation checks, compatibility kinds, boundaries,
and versioning aspects. Definitions only: metrics, scoring, benchmarking, and comparison, whose Specifications
narrate heterogeneous facets of one model and refer to no closed set by identity (metrics' "quality dimensions"
and "grounding dimension" are introduced with "including" and "such as", non-exhaustive, and are not restated
as a closed set in the invariants). Both audits verified the decision correct.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **28 exported types** and **58 exported
  runtime values** (56 frozen catalogs and description records + 2 predicate functions).
- The only executable logic is the two pure deterministic predicates; there is no IO. Every exported catalog is
  `Object.freeze`d. All descriptions are plain string literals (no em-dash, no smart quotes, no runtime string
  operations).
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports nothing:
  its dependency edge is `[]` (it references the constitution, Governance, the subject namespaces it observes,
  and the knowledge repository but uses no foreign type and imports no package; ADR-0021, "import only what you
  use" - it imports none, including the Governance edge it is allowed). `NAMESPACE_DEPS.evaluation =
  ['governance']` (permitted edge, unchanged).
- 100% coverage (statements, branches, functions, lines) on all modules; full validation green end to end; two
  independent source audits CLEAN, no findings (one description error found and fixed during construction:
  `evaluation-scoring.ts` invariants had been merged/rephrased and were rewritten to trace 1:1 to
  `ai/evaluation/evaluation-scoring.md` before validation and audit).

## A note on the arch-regression test harness

Implementing Evaluation required updating `scripts/arch-regression.mjs`, the architectural-regression test
harness. That script uses still-reserved namespaces as scratch fixtures; three scenarios previously wrote a
temporary `packages/namespaces/evaluation/src/index.ts` and deleted it, which would clobber Evaluation's
now-real barrel. Those three scenarios were rotated to write scratch barrels only into the still-reserved
`operations` and `evolution` namespaces: `cycle-bare-import` now exercises the `operations` and `evolution`
cycle (`no-circular`); `illegal-namespace-edge-bare-import` now exercises `operations -> evolution`
(`namespace-operations`); and `reserved-namespace-forbidden-edge-bare-import` now exercises
`evolution -> operations` (`namespace-evolution`). This changes no constitution, no frozen namespace, no ADR,
and no dependency rule; it adapts a test fixture to a namespace becoming real, and it does not weaken
enforcement (every rule category is still exercised, all 10 scenarios still pass, and `namespace-evaluation` is
now continuously enforced against evaluation's real source by the standard depcruise run). Both audits verified
the change legitimate and non-weakening. The remaining namespace implementations (Operations, Evolution) will
require the same kind of fixture rotation.

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the two orderings, public API,
ownership, and constitutional traceability are settled. Every evaluation the concerns imply (measuring,
scoring, validating, benchmarking, comparing, or assessing a concrete output) is deferred to the operational
runtime, which consumes this model and does not modify it. Governance rules, the subject namespaces' quality
definitions, business truth, and the behavior evaluated are referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen evaluation file without an architecture change process, each still
running the full validation pipeline: **compiler compatibility**, **security vulnerabilities**, **dependency
updates**, and **critical bug fixes** (a genuine defect in existing behavior, for example a description,
ordering, or classification member that does not trace verbatim to its frozen document).

## Any architectural modification requires all of

- a **new ADR** (an Accepted ADR is superseded, never edited in place),
- an **architecture review**,
- an **independent audit**, and
- **full validation** (green end to end).

"Architectural modification" includes any change to a concern's public API or export, an identity,
classification, principle, invariant, or ordering; the introduction of a new predicate; the reproduction of a
referenced model owned by another owner; a change of purity category (ADR-0024); the dependency graph; or the
constitutional traceability.

## Constitutional layers remain immutable

`ai/` and `knowledge/` remain immutable; no implementation change may modify them (CI constitutional guard).
This freeze adds nothing to the constitution; it conforms to it.

## Downstream work is additive

The Operations and Evolution namespaces, and the operational layers, consume this model and do not modify it.
The operational runtime measures, scores, and assesses concrete outputs; Operations builds the application.
They may not modify any frozen evaluation file except under the allowed-changes policy above with full
validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
