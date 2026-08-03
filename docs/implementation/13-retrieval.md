# 13. Retrieval namespace implementation design

The implementation design for `@openlance/aios-retrieval`, the package that conforms to the frozen
`ai/retrieval/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like Providers and Memory,
Retrieval was implemented as one cohesive cycle at explicit request; the design and discipline are
identical.

## 1. Ownership

Retrieval owns the **knowledge-determination model of the AI layer**: how, before an execution, the
minimum sufficient, dependency-complete, authority-correct set of knowledge a task requires is
discovered, selected, expanded through its dependencies, prioritized, assembled into a retrieval result,
and validated before loading (`ai/retrieval/README.md`, `ai/retrieval/retrieval.md`; ownership-map.md
assigns Retrieval "Context. Getting the right knowledge into context, and assembling it"). It owns
determination only. It never owns business truth (the knowledge repository), the rules that bound
retrieval (`ai/governance/`), the loading of the result or the execution-context assembly (`ai/runtime/`),
or any search technology.

## 2. Category and the purity reconciliation

ADR-0024 does **not** enumerate Retrieval among its examples, but ADR-0024 §42 requires each namespace's
category to be **declared in its implementation design when it is designed** - so this declaration needs
no new ADR. Retrieval is a foundational service that consumes the knowledge repository one-directionally
(the frozen dependency-map groups it with Providers, Memory, and Safety as "the foundational services
other namespaces build on"). It is therefore declared **category 4, Infrastructure Adapter**: the AI
layer's determination boundary to the knowledge repository, in the same group as Providers (boundary to
intelligence sources) and Memory (boundary to retained state). The reconciliation is identical to those:

- **ADR-0020** (foundational to, and cited by, ADR-0024) fixes how *every* technology-neutral
  constitutional namespace is realized in code: an "immutable, stateless domain model... a set of types,
  frozen data, and pure predicates... no IO," and adds "the category a namespace belongs to is fixed by
  ADR-0024." The two coexist by design.
- The constitution independently forbids Retrieval from searching, indexing, loading, or containing code
  (`ai/retrieval/README.md` line 70; `retrieval-boundaries.md` Technology boundary), and is supreme over
  any ADR.
- So Retrieval owns the determination boundary **as an immutable specification model**; the actual
  determination-execution over a real task and repository is the runtime's.

The package is thus **types, frozen data, and pure deterministic predicates**, with every runtime
evaluation deferred to the runtime.

## 3. Responsibilities

Discover, select, expand, prioritize, assemble, and validate the knowledge-determination model
deterministically, and own none of the truth, rules, loading, or execution around it. Provide the
immutable truth the runtime consumes when it loads what retrieval determines. It states the rules of the
retrieval model; it never carries them out, and it never loads.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Retrieval Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine
closed domain set, that classification. Pure predicates are added only where every input and output is
retrieval-owned and the predicate expresses the specification verbatim (the boundary rule inherited from
Governance, `docs/implementation/10-governance.md` section 7a).

- `namespace.ts` - `RetrievalInvariant` (9), `RetrievalConcern` (10).
- `retrieval-lifecycle.ts` - principles (4), `RetrievalLifecyclePhase` (5, ordered), invariants (4),
  predicate `retrievalPhaseAtOrAfter`.
- `retrieval-workflow.ts` - principles (5), `RetrievalWorkflowStep` (8, ordered), invariants (4),
  predicate `retrievalStepAtOrAfter`.
- `knowledge-discovery.ts` - principles (4), invariants (4).
- `knowledge-selection.ts` - principles (4), invariants (4).
- `dependency-resolution.ts` - principles (4), invariants (5).
- `context-prioritization.ts` - principles (4), invariants (4).
- `context-assembly.ts` - principles (4), invariants (4).
- `loading-strategy.ts` - principles (7), invariants (5).
- `retrieval-boundaries.ts` - principles (4), `RetrievalBoundary` (5), invariants (5).
- `retrieval-validation.ts` - principles (4), `RetrievalValidationDimension` (5), invariants (5).

**Predicates.** Two ordering predicates over retrieval-owned classifications, each expressing a
constitutional ordering verbatim: `retrievalPhaseAtOrAfter` ("each phase completes before the next
begins") and `retrievalStepAtOrAfter` ("a step never runs before a step that must precede it"). The
unordered classifications (`RetrievalBoundary`, `RetrievalValidationDimension`) carry no predicate; the
validation dimensions are conjunctive (a result is validated against all five), directly analogous to
governance's `ValidationDimension`. The discovery/selection/dependency-resolution/prioritization/assembly/
loading-strategy concerns describe process facets over runtime- and knowledge-owned models, whose
determination is deferred to the runtime; those concerns are definitions only.

**Referenced models.** The loading tiers (Critical, Required, Optional, Contextual), the Knowledge
Hierarchy, and the knowledge ownership/authority/dependency maps are owned by `knowledge/`; the permission
and validation rules by `ai/governance/`. All are referenced in prose and never recreated as a retrieval
classification (referenced-model non-restatement rule). The `RetrievalValidationDimension` catalog names
*what is checked*; it does not reproduce the knowledge maps.

## 5. Dependency usage

`NAMESPACE_DEPS.retrieval = ['governance']` permits an edge to Governance, and Retrieval consumes the
knowledge repository one-directionally (`knowledge/` is a document layer, not a package). No retrieval
concern's model uses a governance-owned type - governance and the knowledge repository are referenced in
prose, never restated or imported (referenced-model non-restatement; ADR-0021) - so the package imports
nothing and its dependency-graph edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Retrieval: **lifecycle** none (the five retrieval lifecycle phases and
the eight workflow steps are modeled *data*, not a package lifecycle; the package does not boot, run, or
shut down); **state** none (the model is immutable/frozen); **errors** none (it performs no execution);
**events** none. These empty sections are the correct shape of a Pure Domain Model, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty;
immutability is asserted (`Object.isFrozen`); and the two ordering predicates are proven total and
deterministic across their whole matrices (`retrievalPhaseAtOrAfter` 5x5, `retrievalStepAtOrAfter` 8x8,
each against the declared order) plus explicit true/false cases. Executable code is at 100% coverage;
there is no pure-data-only module to exclude. Benchmarks measure the two predicates only (Rule 5). No
integration tests yet (no downstream consumer exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/retrieval/` document, and no search, index,
  loader, or runtime-context evaluator is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance, Providers, and
  Memory namespaces unchanged; the dependency graph unchanged (`retrieval: []`).
