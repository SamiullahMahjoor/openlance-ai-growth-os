# 21. Operations namespace implementation design

The implementation design for `@openlance/aios-operations`, the package that conforms to the frozen
`ai/operations/` constitutional namespace. It follows the namespace development lifecycle (ADR-0023):
constitution read in full, design recorded here, no architecture invented. Like the ten prior Phase 2B
namespaces, Operations was implemented as one cohesive cycle at explicit request.

## 1. Ownership

Operations owns the **running-the-layer model of the AI layer**: how the running of the layer is observed,
monitored, kept healthy, diagnosed, maintained, and evolved, so that the layer runs reliably without its
behavior ever being changed by the act of operating it (`ai/operations/README.md`, `ai/operations/operations.md`).
It operates the Runtime namespace it runs, observes the Evaluation and Safety namespaces for operational
awareness and defers to them, and owns none of the behavior it operates (`ai/reasoning/`, `ai/retrieval/`,
`ai/memory/`, `ai/prompts/`, `ai/agents/`, `ai/providers/`, `ai/tools/`), none of the rules it runs within
(`ai/governance/`), none of the protection or judgment its signals inform (`ai/safety/`, `ai/evaluation/`),
none of the evolution of the layer (the Evolution namespace), and no business truth (the knowledge repository).

## 2. Category (ADR-0024) and the Composition-Root reconciliation

ADR-0024 enumerates Operations as **category 5 (Composition Root)**: it "builds the complete application,
creates the dependency graph, and performs dependency-injection composition. Owns nothing else." This names the
operational **role**. The package that conforms to the frozen `ai/operations/` specification is nonetheless
realized per **ADR-0020** as an immutable, stateless domain model with **no IO and no dependency injection**,
because:

- **ADR-0020**'s Decision applies to "Every technology-neutral constitutional namespace" and states a namespace
  package "must never own: runtime, orchestration, execution, ... dependency injection, events, services, or
  mutable state." **ADR-0024**'s Consequences say the category constrains the package "in addition to ADR-0020
  and ADR-0021," not instead of it. (ADR-0020's Related constitutional references name `ai/governance/README.md`
  and `ai/runtime/README.md`; they do not name `ai/operations/README.md`, and this design makes no such claim.)
- The frozen `ai/operations/` documents are technology-neutral specifications: `ai/operations/README.md` states
  operations "defines the operational model, never how operations is implemented, tooled, or deployed, and never
  contains code," and Operations sits at the Specification authority level.
- So the conformance package owns the operational model **as an immutable specification model**; the actual
  composition-root wiring (building the application, creating the dependency graph, performing DI composition)
  is the operational implementation, built later, outside this package. This is the same reconciliation the
  Runtime (category 3) and the category-4 adapters used: the ADR-0024 category names the constitutional role,
  the conformance package is always a pure ADR-0020 model.

The package is thus **types, frozen data, and two pure deterministic algorithms**, with every operational
evaluation deferred to the operational implementation. Because the category constrains what a package
*contains*, not whether it must contain IO or DI, category 5 and ADR-0020 coexist without conflict.

## 3. The two algorithms

Each predicate expresses a constitutional ordering over operations-owned classifications (the boundary rule
inherited from Governance, `docs/implementation/10-governance.md` section 7a):

- `operationsPhaseAtOrAfter(a, b)` - the **operations-lifecycle phase order** (`operations-lifecycle.md`):
  startup, steady-state, maintenance, retirement. A total order the document declares ("each phase precedes the
  next"), realized via a private rank map and `>=`. The document also states the operation returns from the
  maintenance phase to steady-state; that is a described operational transition, recorded in the phase and
  invariant descriptions, and it does not change the canonical order in which the phases are declared, so it is
  not modeled as a separate transition map.
- `healthStateAtOrAfter(a, b)` - the **health-state order** (`health-management.md`): healthy, degraded, failed.
  A total order the document declares ("ordered from healthy to degraded to failed"; the invariant "from healthy
  to failed"), realized via a private rank map and `>=`.

The unordered classifications (`OperationsPart`, `MaintenanceCategory`, `OperationsBoundary`,
`OperationsVersioningAspect`) carry no predicate.

## 4. Public API and module layout

One module per concern, plus a namespace-root module, all re-exported through a single explicit barrel
(`src/index.ts`, no wildcard). The concern order follows the inventory in `ai/operations/operations.md`.

- `namespace.ts` - `OperationsInvariant` (7), `OperationsConcern` (10).
- `operations-architecture.ts` - principles (4), `OperationsPart` (6: observability, monitoring, health,
  incident, diagnostic, maintenance), invariants (5).
- `operations-lifecycle.ts` - principles (4), `OperationsLifecyclePhase` (4, ordered), invariants (5),
  `operationsPhaseAtOrAfter`.
- `observability.ts` - principles (4), invariants (5). Definitions only.
- `monitoring.ts` - principles (4), invariants (5). Definitions only.
- `incident-management.ts` - principles (4), invariants (5). Definitions only.
- `health-management.ts` - principles (4), `HealthState` (3, ordered), invariants (5), `healthStateAtOrAfter`.
- `diagnostics.ts` - principles (4), invariants (5). Definitions only.
- `maintenance.ts` - principles (4), `MaintenanceCategory` (3: corrective, preventive, adaptive), invariants (5).
- `operations-boundaries.ts` - principles (4), `OperationsBoundary` (6: behavior, runtime, governance,
  safety-and-evaluation, evolution, implementation), invariants (5).
- `operations-versioning.ts` - principles (4), `OperationsVersioningAspect` (4: version-rules, evolution,
  migration, compatibility-and-deprecation), invariants (5).

**Classification vs. definitions-only.** Per the modeling rule recorded in `docs/implementation/13-retrieval.md`
section 4, a Specification becomes a classification only where it enumerates a genuine closed homogeneous domain
set the model refers to by identity (ideally restated in invariants). Modeled: the operational parts (the six
parts the model "is composed of", restated in the architecture invariant), the lifecycle phases and the health
states (both ordered and restated in their invariants), the maintenance categories (three named categories by
intent, restated in the maintenance invariant), the operations boundaries (six named architectural boundaries),
and the versioning aspects (the four the Specification lists; the fourth, "Compatibility and deprecation", is
one aspect in the document and is modeled verbatim as enumerated, not split). Definitions only: observability,
monitoring, diagnostics, and incident-management. The first three narrate heterogeneous facets of one model.
Incident-management is definitions-only despite owning "the incident lifecycle" and "incident classification":
its lifecycle is narrated in a single sentence and restated in the invariants only by its endpoints ("from
recognition to closure"), not as a closed set referred to by identity; and its classification is "a defined
classification of severity and kind" whose severity levels and kinds the document does not enumerate (as with
the ordered-but-unnamed risk levels of `ai/safety/`), so no classification set is invented. The maintenance
concern models only its categories, not its activity lifecycle, for the same reason (that lifecycle is narrated
and restated only by its bounds, "from plan to completion").

**Referenced models.** The runtime execution and its lifecycles (`ai/runtime/`); the governance rules and
change governance (`ai/governance/`, `ai/governance/change-governance.md`); the protection and output judgment
operations defers to (`ai/safety/`, `ai/evaluation/`); the subject namespaces' behavior; the evolution of the
layer (the Evolution namespace); and business truth (the knowledge repository) are all referenced in prose and
never recreated as an operations classification (referenced-model non-restatement rule).

## 5. Dependency usage

`ai/architecture/dependency-map.md` places Operations depending on the constitution, Governance, and Runtime
(dependency-cruiser `NAMESPACE_DEPS.operations = ['governance', 'runtime']`). No operations concern's model uses
a type owned by Governance or Runtime - the runtime it operates and the rules it runs within are referenced in
prose, never restated or imported (referenced-model non-restatement; ADR-0021, "import only what you use") - so
the package imports nothing and its dependency-graph edge is `[]`. It uses no substrate package. "Build on top
of the frozen Runtime" is realized by referencing the runtime model, not by importing its types; the actual
composition over runtime is the operational implementation's.

## 6. Lifecycle, state, error, and event ownership

By ADR-0020 all four are empty for the Operations *package*: **lifecycle** none (the operations phases and
health states are modeled *data*, not a package lifecycle); **state** none (the model is immutable/frozen; the
health states are a description of the conditions the layer may hold, carrying no mutable current-state);
**errors** none (it performs no operation); **events** none. These empty sections are the correct shape of a
domain model realized per ADR-0020, not gaps - the actual composition root and operational service own the live
wiring, lifecycle, state, and events.

## 7. Testing strategy (ADR-0022)

One test file per module. Every classification's members, count, and constitutional order are asserted against
the constitution (`toEqual`); every principle, member, and invariant description is asserted non-empty;
immutability is asserted (`Object.isFrozen`). The two orderings are proven total and deterministic across their
whole matrices (4x4 for the lifecycle phases, 3x3 for the health states) against the declared order. Executable
code is at 100% coverage (statements, branches, functions, lines). Benchmarks measure the two predicates only.

## 8. Acceptance criteria

- Every exported symbol traces directly to a frozen `ai/operations/` document, and no monitoring tool,
  dashboard, alerting platform, deployment system, DI container, or composition engine is exported.
- Full validation green: typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test (100% on
  executable code), bench, docs, build.
- Zero regression; `ai/`, `knowledge/`, the frozen substrate, and the ten prior frozen namespaces unchanged;
  the dependency graph unchanged (`operations: []`).
