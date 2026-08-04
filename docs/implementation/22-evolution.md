# 22. Evolution namespace implementation design

The implementation design for `@openlance/aios-evolution`, the package that conforms to the frozen
`ai/evolution/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Evolution is the **final namespace**
of Phase 2B and of the AI layer; like the prior Phase 2B namespaces, it was implemented as one cohesive cycle
at explicit request.

## 1. Ownership

Evolution owns the **model of controlled architectural change of the AI layer**: how architectural change is
proposed, reviewed, approved, introduced, stabilized, and retired, how compatibility is preserved, how
migration and deprecation proceed, and how the repository grows, so that the layer advances over years while
its constitution stays stable (`ai/evolution/README.md`, `ai/evolution/evolution.md`). It applies the growth
rules owned by `ai/README.md`, serves the amendment workflow owned by `ai/CONTRIBUTING.md`, defers the change
rules to `ai/governance/`, and defers the maturity map to `ai/architecture/repository-evolution.md`. It owns no
behavior, no rule, no workflow, no map, and no business truth.

## 2. Category (ADR-0024 §42) and the purity basis

ADR-0024 does **not** enumerate Evolution among its five worked examples. Per **ADR-0024 §42**, when a
namespace is not enumerated its purity category is declared in this design document, with no new ADR. Evolution
is declared **category 1 (Pure Domain Model)**, the same shape as Governance and Safety: it owns a model of
*truth about how the architecture changes*, not an integration (category 4), an orchestration or runtime
service (category 3), or a composition root (category 5). Nothing in `ai/evolution/` names a provider, a
framework, a runtime, a deployment, a migration tool, a version-control system, or code; every document is a
technology-neutral Specification that "defines the evolution model, never how a change is implemented, deployed,
or executed" (`ai/evolution/README.md`). ADR-0020 fixes how every technology-neutral constitutional namespace
maps to code: "a set of types, frozen data, and pure predicates... no IO." So the conformance package owns the
evolution model **as an immutable specification model**; the carrying out of a concrete change is the amendment
workflow's and the runtime's, built later, outside this package. Category 1 and ADR-0020 coincide here.

## 3. The two algorithms

Every executable predicate expresses a constitutional ordering over evolution-owned classifications (the
boundary rule inherited from Governance, `docs/implementation/10-governance.md` section 7a):

- `evolutionPhaseAtOrAfter(a, b)` - the **evolution-lifecycle phase order** (`evolution-lifecycle.md`):
  proposal, review, approval, introduction, stabilization, retirement. A total order the document declares
  ("each phase precedes the next"), realized via a private rank map and `>=`. (A change ends at Stabilization
  or, for a superseded part, at Retirement; that is recorded in the descriptions and does not change the
  canonical phase order.)
- `deprecationStateAtOrAfter(a, b)` - the **deprecation-state order** (`deprecation-model.md`): active,
  deprecated, retired. The document states "A part passes from active to deprecated to retired" and "This
  document owns the deprecation states and their order", realized via a private rank map and `>=`.

The unordered classifications (`EvolutionPart`, `ChangeCategory`, `EvolutionBoundary`) carry no predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). The concern order follows the inventory in `ai/evolution/evolution.md`.

- `namespace.ts` - `EvolutionInvariant` (8), `EvolutionConcern` (10).
- `evolution-architecture.ts` - principles (4), `EvolutionPart` (7: planning, lifecycle, change, compatibility,
  migration, deprecation, growth), invariants (5).
- `evolution-lifecycle.ts` - principles (4), `EvolutionLifecyclePhase` (6, ordered), invariants (5),
  `evolutionPhaseAtOrAfter`.
- `evolution-planning.ts` - principles (4), invariants (5). Definitions only.
- `change-management.ts` - principles (4), `ChangeCategory` (3: additive, amending, superseding), invariants (5).
- `compatibility-management.ts` - principles (4), invariants (5). Definitions only.
- `migration-model.ts` - principles (4), invariants (5). Definitions only.
- `deprecation-model.ts` - principles (4), `DeprecationState` (3, ordered), invariants (5),
  `deprecationStateAtOrAfter`.
- `repository-growth.ts` - principles (4), invariants (5). Definitions only.
- `evolution-boundaries.ts` - principles (4), `EvolutionBoundary` (6: behavior, runtime-and-operations,
  governance, workflow-and-map, knowledge, implementation), invariants (5).
- `evolution-versioning.ts` - principles (4), invariants (5). Definitions only.

**Classification vs. definitions-only.** Per the modeling rule recorded in `docs/implementation/13-retrieval.md`
section 4, a Specification becomes a classification only where it enumerates a genuine closed homogeneous domain
set the model refers to by identity (ideally restated in invariants). Modeled: the evolution parts (the seven
parts the model "is composed of", restated in the architecture invariant), the lifecycle phases (ordered,
restated in the invariants), the change categories (three named scopes, restated in the change invariant), the
deprecation states (ordered, the document explicitly "owns the deprecation states and their order"), and the
evolution boundaries (six named architectural boundaries). Definitions only: planning, compatibility
management, migration model, repository growth, and evolution versioning. Planning, compatibility management,
and repository growth narrate heterogeneous facets. The migration model owns "migration phases", but they are
narrated in a single sentence, two of the four defer to `ai/evolution/deprecation-model.md` and the lifecycle's
retirement, and the invariants restate them only generically ("defined phases"), not as a closed set by
identity, so no phase classification is invented (the same treatment the Operations incident and maintenance
lifecycles received). Evolution versioning narrates a core model (version evolution) plus two deferrals
(compatibility across generations, constitutional evolution governance) and a property (behavior-preserving),
and the inventory even names "constitutional evolution governance consumption", a deferral rather than an owned
aspect; unlike the clean version-rules / evolution / migration / deprecation aspect sets of `ai/evaluation/` and
`ai/operations/` versioning, this is not a closed homogeneous set the model refers to by identity, so no aspect
classification is modeled.

**Referenced models.** The amendment workflow (`ai/CONTRIBUTING.md`); the change rules and human governance
(`ai/governance/change-governance.md`, `ai/governance/human-oversight.md`, `ai/governance/escalation.md`); the
maturity map (`ai/architecture/repository-evolution.md`); the dependency direction
(`ai/architecture/dependency-map.md`); the Future Architecture Roadmap and growth rules (`ai/README.md`);
operations and the runtime; a namespace's own internal compatibility (for example
`ai/evaluation/evaluation-compatibility.md`); and business truth (the knowledge repository) are all referenced
in prose and never recreated as an evolution classification (referenced-model non-restatement rule).

## 5. Dependency usage

`ai/architecture/dependency-map.md` places Evolution depending on nothing (dependency-cruiser
`NAMESPACE_DEPS.evolution = []`). No evolution concern's model uses a foreign type - the rules, workflow, map,
operations, runtime, and knowledge it relates to are referenced in prose, never restated or imported (ADR-0021)
- so the package imports nothing and its dependency-graph edge is `[]`. It uses no substrate package. Evolution
advances the architecture and never cycles, which is the `acyclic` invariant made concrete: it depends on
nothing, so no cycle is possible.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for the Evolution *package*: **lifecycle** none (the evolution phases and
deprecation states are modeled *data*, not a package lifecycle); **state** none (the model is immutable/frozen;
the deprecation states are a description of the conditions a part may hold, carrying no mutable current-state);
**errors** none (it performs no change); **events** none. These empty sections are the correct shape of a Pure
Domain Model realized per ADR-0020, not gaps - the amendment workflow and the runtime own the live carrying out
of a concrete change.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual`); every principle, member, and invariant description is asserted non-empty;
immutability is asserted (`Object.isFrozen`). The two orderings are proven total and deterministic across their
whole matrices (6x6 for the lifecycle phases, 3x3 for the deprecation states) against the declared order.
Executable code is at 100% coverage (statements, branches, functions, lines). Benchmarks measure the two
predicates only.

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/evolution/` document, and no deployment, migration
  tool, version-control system, or change engine is exported.
- Full validation green: typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test (100% on
  executable code), bench, docs, build.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the twelve prior frozen namespaces unchanged;
  the dependency graph unchanged (`evolution: []`).

## 9. Completion of the AI layer

Evolution is the final namespace. With it frozen, all thirteen Phase 2B namespaces conform to the frozen
constitution, and the AI layer owns a complete, immutable, technology-neutral model of its own governed change.
The arch-regression harness (`scripts/arch-regression.mjs`) was updated to remove the last of its temporary
scratch-fixture strategy: with no namespace reserved, it now writes only marker probe files alongside real
source and creates no scratch barrels, while preserving every rule test (see the freeze note).
