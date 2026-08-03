# 12. Memory namespace implementation design

The implementation design for `@openlance/aios-memory`, the package that conforms to the frozen
`ai/memory/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like Providers, Memory was
implemented as one cohesive cycle at explicit request; the design and discipline are identical.

## 1. Ownership

Memory owns the **retained-context model of the AI layer**: how retained context is formed, held, made
available, kept consistent, validated, kept fresh, bounded, and evolved (`ai/memory/README.md`,
`ai/memory/memory.md`; ownership-map.md assigns Memory "Runtime memory behavior across its scopes, and
its lifecycle"). It owns none of the truth, rules, retrieval, reasoning, execution, or expression around
it: knowledge is owned by the knowledge repository (which always prevails over memory), the governing
rules by `ai/governance/`, knowledge retrieval by `ai/retrieval/`, execution and the session/execution
lifecycles by `ai/runtime/`, and reasoning by `ai/reasoning/`.

## 2. Category and the purity reconciliation

ADR-0024 classifies Memory as **category 4, Infrastructure Adapter** (it names "Memory storage
adapters"). The frozen constitution says this namespace is "never a store, a database, an index, a cache,
an embedding, a vector search, a persistence technology... or code" (`ai/memory/README.md` line 72;
`memory-boundaries.md` Implementation boundary). These are reconciled by the frozen documents, so no
architecture was invented and the ambiguity gate was not triggered - identically to Providers:

- **ADR-0020** (foundational to, and cited by, ADR-0024) fixes how *every* technology-neutral
  constitutional namespace is realized in code: an "immutable, stateless domain model... a set of types,
  frozen data, and pure predicates... no IO," and adds "the category a namespace belongs to is fixed by
  ADR-0024." The two coexist by design.
- So Memory is category 4 in that it **owns the retained-context boundary abstraction** - the seam at
  which retained state is held and made available - while at this layer that ownership is realized per
  ADR-0020 as a **Pure Domain Model** (no IO). The store and IO-bearing adapter are the runtime's; the
  runtime hands state to memory and draws context from it.
- The constitution independently forecloses store/IO/persistence/code here and is supreme over any ADR.

The package is thus **types, frozen data, and pure deterministic predicates**, with every runtime
evaluation deferred to the runtime.

## 3. Responsibilities

Classify, hold, make available, keep consistent and fresh, validate, bound, and evolve retained context
deterministically, and own none of the behavior around it. Provide the immutable truth the runtime,
reasoning, and agents consume when they draw prior context. It states the rules of the memory model; it
never carries them out, and it never stores.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Memory Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine
closed domain set, that classification. Pure predicates are added only where every input and output is
memory-owned and the predicate expresses the specification verbatim (the boundary rule inherited from
Governance, `docs/implementation/10-governance.md` section 7a).

- `namespace.ts` - `MemoryInvariant` (9), `MemoryConcern` (10).
- `memory-lifecycle.ts` - principles (4), `MemoryLifecyclePhase` (3, ordered), invariants (5), predicate
  `lifecyclePhaseAtOrAfter`.
- `memory-workflow.ts` - principles (5), `MemoryWorkflowStep` (7, ordered), invariants (6), predicate
  `workflowStepAtOrAfter`.
- `memory-types.ts` - principles (4), `MemoryType` (6), invariants (4).
- `memory-retention.ts` - principles (4), `MemoryRetentionClass` (4, ordered by persistence),
  invariants (5), predicate `retentionAtLeast`.
- `memory-retrieval.ts` - principles (4), invariants (4).
- `memory-consistency.ts` - principles (4), invariants (5).
- `memory-validation.ts` - principles (4), invariants (5).
- `memory-quality.ts` - principles (4), `MemoryQualityProperty` (3), invariants (4).
- `memory-boundaries.ts` - principles (4), `MemoryBoundary` (6), invariants (5).
- `memory-evolution.ts` - principles (4), invariants (5).

**Predicates.** Three ordering predicates over memory-owned classifications, each expressing a
constitutional ordering verbatim: `lifecyclePhaseAtOrAfter` ("Formation precedes Retention, which
precedes Removal"), `workflowStepAtOrAfter` ("an operation never runs before an operation that must
precede it"), and `retentionAtLeast` (the classes ordered from the shortest-lived Temporary, which
"never outlives the execution", through the nested scopes to the indefinitely held Permanent). The
unordered classifications (`MemoryType`, `MemoryQualityProperty`, `MemoryBoundary`) carry no predicate.
The retrieval/consistency/validation/evolution concerns describe process facets over runtime-owned
models (a request, a retained memory, a conflict, a change), whose evaluation is deferred to the runtime;
those concerns are definitions only.

## 5. Dependency usage

`NAMESPACE_DEPS.memory = ['governance']` permits an edge to Governance. No memory concern's model uses a
governance-owned type - governance rules are referenced in prose, never restated or imported
(referenced-model non-restatement; ADR-0021) - so the package imports nothing and its dependency-graph
edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Memory: **lifecycle** none (the three memory lifecycle phases and the
seven workflow steps are modeled *data*, not a package lifecycle; the package does not boot, run, or shut
down); **state** none (the model is immutable/frozen; memory retains no state here); **errors** none (it
performs no execution); **events** none. These empty sections are the correct shape of a Pure Domain
Model, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty;
immutability is asserted (`Object.isFrozen`); and the three ordering predicates are proven total and
deterministic across their whole matrices (`lifecyclePhaseAtOrAfter` 3x3, `workflowStepAtOrAfter` 7x7,
`retentionAtLeast` 4x4, each against the declared order) plus explicit true/false cases. Executable code
is at 100% coverage; there is no pure-data-only module to exclude. Benchmarks measure the three
predicates only (Rule 5). No integration tests yet (no downstream consumer exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/memory/` document, and no store, index, search,
  or runtime-context evaluator is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance and Providers
  namespaces unchanged; the dependency graph unchanged (`memory: []`).
