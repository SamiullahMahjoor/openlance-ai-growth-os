# 11. Providers namespace implementation design

The implementation design for `@openlance/aios-providers`, the package that conforms to the frozen
`ai/providers/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Unlike Governance (built one
concern per stage), Providers was implemented as one cohesive cycle at explicit request; the design and
discipline are identical.

## 1. Ownership

Providers owns the **provider- and model-neutral abstraction of the AI layer**: what a provider is as an
architectural abstraction over a source of intelligence, and how it is identified, described by
capability, presented, selected, routed to, fallen back from, kept compatible, bounded, and versioned
(`ai/providers/README.md`, `ai/providers/providers.md`; ownership-map.md assigns it both "Models" and
"Providers"). It owns none of the behavior that flows through a provider: reasoning, prompts, memory,
retrieval, execution, truth, and the intelligence a source produces are owned elsewhere.

## 2. Category and the purity reconciliation (the pivotal decision)

ADR-0024 classifies Providers as **category 4, Infrastructure Adapter** ("boundary to external systems;
owns integrations only"). The frozen constitution says this namespace "never executes a provider, never
networks, never defines a protocol or an interface... never contains code" (`ai/providers/README.md`
lines 53, 106-107; `provider-boundaries.md` Execution and Implementation boundaries). These are
reconciled by the frozen documents themselves, so no architecture was invented and the ambiguity gate
was not triggered:

- **ADR-0020** (foundational to, and cited by, ADR-0024) fixes how *every* technology-neutral
  constitutional namespace is realized in code: an "immutable, stateless domain model... a set of types,
  frozen data, and pure predicates... no IO," and it explicitly adds "the category a namespace belongs
  to is fixed by ADR-0024." ADR-0020 and ADR-0024 are therefore designed to coexist.
- So Providers is category 4 in that it **owns the external-integration boundary abstraction** - the
  architectural seam at which external sources of intelligence are integrated - while at this layer that
  ownership is realized per ADR-0020 as a **Pure Domain Model** (no IO). The IO-bearing invocation is the
  runtime's ("the runtime that invokes a provider", `provider-lifecycle.md`, `provider-abstraction.md`).
- The constitution independently forecloses IO/execution/network/protocol/interface/code here, and the
  constitution is supreme over any ADR, so the package is pure regardless.

The package is thus **types, frozen data, and pure deterministic predicates**, with every runtime
evaluation deferred to the runtime.

## 3. Responsibilities

Present a source of intelligence neutrally, uniformly, and deterministically, and own none of the
behavior served. Provide the immutable truth the agents and the runtime consume when they use a provider
to act. It states the rules of the provider abstraction; it never carries them out.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). Each concern models the two normative sections of the Provider Document
Standard - **Principles** and **Invariants** - and, where the **Specification** enumerates a genuine
closed domain set, that classification. Pure predicates are added only where every input and output is
provider-owned and the predicate expresses the specification verbatim (the boundary rule inherited from
Governance, `docs/implementation/10-governance.md` section 7a).

- `namespace.ts` - `ProviderInvariant` (7), `ProviderConcern` (10).
- `provider-architecture.ts` - principles (4), `ProviderPart` (3), invariants (5).
- `provider-lifecycle.ts` - principles (4), `ProviderLifecyclePhase` (5, ordered), invariants (5), and
  the predicates `phaseAtOrAfter` and `usableInPhase`.
- `provider-capabilities.ts` - principles (4), invariants (5).
- `provider-abstraction.ts` - principles (4), invariants (5).
- `provider-selection.ts` - principles (4), invariants (5).
- `provider-routing.ts` - principles (4), invariants (5).
- `provider-fallback.ts` - principles (4), invariants (5).
- `provider-compatibility.ts` - principles (4), `CompatibilityKind` (2), invariants (5).
- `provider-boundaries.ts` - principles (4), `ProviderBoundary` (6), invariants (5).
- `provider-versioning.ts` - principles (4), `ProviderVersioningAspect` (4), invariants (5).

**Predicates.** Only the provider lifecycle carries executable logic, because it is the only concern
whose Specification defines an ordered, provider-owned classification with a verbatim rule. `phaseAtOrAfter`
expresses "each phase precedes the next"; `usableInPhase` expresses "a provider is used only in Activation
and Operation." The other Specifications describe relations over runtime-owned models (a need, a provider
registry, a consumer's requirements, a concrete chain), whose evaluation is deferred to the runtime; those
concerns are definitions only. `CompatibilityKind`, `ProviderPart`, `ProviderBoundary`, and
`ProviderVersioningAspect` are unordered enumerations with no verbatim relation, so they carry no predicate.

## 5. Dependency usage

`NAMESPACE_DEPS.providers = ['governance']` permits an edge to Governance. No provider concern's model
uses a governance-owned type - governance rules are referenced in prose, never restated or imported
(referenced-model non-restatement; ADR-0021 "import only what you use") - so the package imports nothing
and its dependency-graph edge is `[]`. It uses no substrate package.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for Providers: **lifecycle** none (a provider's five lifecycle phases are
modeled *data*, not a package lifecycle; the package does not boot, run, or shut down); **state** none
(the model is immutable/frozen); **errors** none (it performs no execution); **events** none. These empty
sections are the correct shape of a Pure Domain Model, not gaps.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted
against the constitution (`toEqual` on the full array); every description is asserted non-empty;
immutability is asserted (`Object.isFrozen`); and the lifecycle predicates are proven total and
deterministic across the whole phase matrix (`phaseAtOrAfter` against the declared order for all
5x5 pairs; `usableInPhase` for all five phases). Executable code is at 100% coverage; there is no
pure-data-only module to exclude. Benchmarks measure the two lifecycle predicates only (Rule 5). No
integration tests yet (no downstream consumer exists).

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/providers/` document, and no
  executor/network/protocol/runtime-context evaluator is exported.
- Full validation green: build, typecheck, lint, format, depcruise, arch:check, graph:check, docs-check,
  test (100% on executable code), bench, docs.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the frozen Governance namespace
  unchanged; the dependency graph unchanged (`providers: []`).
