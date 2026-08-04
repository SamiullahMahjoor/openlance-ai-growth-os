# Evolution Namespace, Freeze Declaration

**Status:** FROZEN (all ten evolution concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-evolution` (`packages/namespaces/evolution`).
**Scope:** the Evolution namespace domain model, the **thirteenth and final** namespace of Phase 2B, built on
top of the immutable Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety,
Reasoning, Prompts, Tools, Agents, Runtime, Evaluation, and Operations namespaces, and the frozen `ai/` and
`knowledge/` constitution. Evolution is a Category 1 (Pure Domain Model) namespace, declared per ADR-0024 §42.
**With this freeze, the AI layer is complete: all thirteen Phase 2B namespaces conform to the frozen
constitution.**

The Evolution namespace is **immutable**. It states the model of controlled architectural change of the AI
layer: how architectural change is proposed, reviewed, approved, introduced, stabilized, and retired, how
compatibility is preserved, how migration and deprecation proceed, and how the repository grows, so that the
layer advances over years while its constitution stays stable. Evolution defines how the architecture changes;
it never performs behavior: it never executes, reasons, retrieves, stores truth, evaluates, operates, or
governs, and it never defines a deployment, migration tool, version-control system, provider, framework,
language, or code.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/evolution/<file>.md` document. Each
models the two normative sections of the Evolution Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `EVOLUTION_INVARIANTS` (8), `EVOLUTION_CONCERNS` (10) | none |
| `evolution-architecture.ts` | Evolution Architecture | `EvolutionPart` (7) | none |
| `evolution-lifecycle.ts` | Evolution Lifecycle | `EvolutionLifecyclePhase` (6, ordered) | `evolutionPhaseAtOrAfter` |
| `evolution-planning.ts` | Evolution Planning | none (planning facets) | none |
| `change-management.ts` | Change Management | `ChangeCategory` (3) | none |
| `compatibility-management.ts` | Compatibility Management | none (compatibility facets) | none |
| `migration-model.ts` | Migration Model | none (migration facets) | none |
| `deprecation-model.ts` | Deprecation Model | `DeprecationState` (3, ordered) | `deprecationStateAtOrAfter` |
| `repository-growth.ts` | Repository Growth | none (growth facets) | none |
| `evolution-boundaries.ts` | Evolution Boundaries | `EvolutionBoundary` (6) | none |
| `evolution-versioning.ts` | Evolution Versioning | none (versioning facets) | none |

The ten concerns match the ten concerns in the inventory `ai/evolution/evolution.md` exactly.

## Category 1 and the §42 declaration (recorded for the freeze)

ADR-0024 does **not** enumerate Evolution among its five worked examples. Per **ADR-0024 §42**, when a
namespace is not enumerated its purity category is declared in the design document, with no new ADR. Evolution
is declared **category 1 (Pure Domain Model)**, the same shape as Governance and Safety: it owns a model of
truth about how the architecture changes, not an integration (category 4), an orchestration or runtime service
(category 3), or a composition root (category 5). The frozen `ai/evolution/` documents are technology-neutral
specifications that "define the evolution model, never how a change is implemented, deployed, or executed"
(`ai/evolution/README.md`). So the package conforms to that spec per **ADR-0020** as an immutable, stateless
domain model ("types, frozen data, and pure predicates... no IO"); the carrying out of a concrete change is the
amendment workflow's (`ai/CONTRIBUTING.md`) and the runtime's, built later, outside this package. No new ADR
was added; the ADR corpus is unchanged (25 ADRs, contiguous). See `docs/implementation/22-evolution.md` section
2. Both independent audits confirmed the declaration sound and the package genuinely IO-free.

## The two algorithms (recorded for the freeze)

Each predicate expresses a constitutional ordering over evolution-owned classifications, via a private
(non-exported) rank map and `>=`:

- `evolutionPhaseAtOrAfter` - the evolution-lifecycle phase order (`evolution-lifecycle.md`): proposal, review,
  approval, introduction, stabilization, retirement. The document declares "each phase precedes the next". A
  change ends at Stabilization or, for a superseded part, at Retirement; that is recorded in the descriptions
  and does not change the canonical phase order.
- `deprecationStateAtOrAfter` - the deprecation-state order (`deprecation-model.md`): active, deprecated,
  retired. The document states "A part passes from active to deprecated to retired" and "This document owns the
  deprecation states and their order".

The unordered classifications (`EvolutionPart`, `ChangeCategory`, `EvolutionBoundary`) carry no predicate.

## Classification vs. definitions-only (recorded for the freeze)

Per the modeling rule in `docs/implementation/13-retrieval.md` section 4, a Specification becomes a
classification only where it enumerates a genuine closed homogeneous domain set the model refers to by
identity. Modeled: the evolution parts, lifecycle phases, change categories, deprecation states, and evolution
boundaries. Definitions only: planning, compatibility management, migration model, repository growth, and
evolution versioning. Planning, compatibility management, and repository growth narrate heterogeneous facets.
The migration model owns "migration phases", but they are narrated in a single sentence, two of the four defer
to `ai/evolution/deprecation-model.md` and the lifecycle's retirement, and the invariants restate them only
generically ("defined phases"), not as a closed set by identity, so no phase classification is invented (the
same treatment the Operations incident and maintenance lifecycles received). Evolution versioning narrates a
core model (version evolution) plus two deferrals (compatibility across generations, constitutional evolution
governance) and a property (behavior-preserving), and the inventory names "constitutional evolution governance
consumption", a deferral rather than an owned aspect; unlike the clean version-rules / evolution / migration /
deprecation aspect sets of `ai/evaluation/` and `ai/operations/` versioning, this is not a closed homogeneous
set the model refers to by identity, so no aspect classification is modeled. Both audits verified these
decisions correct in both directions.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **27 exported types** and **56 exported
  runtime values** (54 frozen catalogs and description records + 2 predicate functions).
- The only executable logic is the two pure deterministic predicates; there is no IO. Every exported catalog is
  `Object.freeze`d. All descriptions are plain string literals (no em-dash, no smart quotes, no runtime string
  operations).
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports nothing:
  its dependency edge is `[]` (`NAMESPACE_DEPS.evolution = []`; it references the amendment workflow, the
  change rules, the maturity map, operations, the runtime, and the knowledge repository in prose and uses no
  foreign type; ADR-0021, "import only what you use").
- 100% coverage (statements, branches, functions, lines) on all modules; full validation green end to end; two
  independent source audits CLEAN, no substantive findings, no correction cycle (one Low documentation miscount
  was corrected before this freeze).

## A note on the arch-regression test harness (the final rewrite)

Evolution is the last namespace, so implementing it removed the last of the temporary scratch-fixture strategy
from `scripts/arch-regression.mjs`. With no namespace reserved, the suite can no longer write a scratch barrel
into a reserved namespace, so the `barrel()` helper was removed and every fixture is now a marker probe file
(`__arch_probe__*.ts`) added alongside a package's real source, importing a real package by its bare workspace
specifier. Because a marker probe is never a package entry, it can never close a package-level cycle with a bare
import; the `no-circular` test (`cycle-probe-import`) therefore uses two sibling probes in an implemented
namespace that import each other by relative path, forming a file-level cycle, and `no-circular` (which is
import-syntax-agnostic) still fires. No scenario writes to any `packages/namespaces/*/src/index.ts`, so no real
barrel is clobbered. Every rule the suite tested before is still tested: `substrate-layer-kernel`, `no-circular`,
`substrate-not-to-namespace`, `namespace-operations`, `namespace-evolution`, `testing-not-a-runtime-dep`,
`not-to-deep-import`, and the two legal passes (`operations -> runtime` and `config -> kernel`); all 10
scenarios pass and the tree is swept clean afterward. This changes no constitution, no frozen namespace, no ADR,
and no dependency rule, and does not weaken enforcement. Both audits verified the rewrite legitimate and
non-weakening.

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the two orderings, public API,
ownership, and constitutional traceability are settled. Every evolution the concerns imply (proposing,
reviewing, approving, introducing, migrating, deprecating, or carrying out a concrete change) is deferred to the
amendment workflow and the runtime, which consume this model and do not modify it. The change rules, the
amendment workflow, the maturity map, business truth, and the behavior of every namespace are referenced, never
recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen evolution file without an architecture change process, each still
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

## The AI layer is complete

Evolution is the final namespace. With it frozen, all thirteen Phase 2B namespaces (Governance, Providers,
Memory, Retrieval, Safety, Reasoning, Prompts, Tools, Agents, Runtime, Evaluation, Operations, Evolution) are
implemented as immutable, technology-neutral domain models conforming to the frozen constitution, and the AI
layer owns a complete model of its own governed change. Any further work is additive under the allowed-changes
policy above with full validation, or a new architecture-reviewed ADR.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
