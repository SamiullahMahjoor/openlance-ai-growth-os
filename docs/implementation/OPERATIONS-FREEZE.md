# Operations Namespace, Freeze Declaration

**Status:** FROZEN (all ten operational concerns implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-operations` (`packages/namespaces/operations`).
**Scope:** the Operations namespace domain model, the twelfth namespace of Phase 2B, built on top of the
immutable Phase 2A substrate, the frozen Governance, Providers, Memory, Retrieval, Safety, Reasoning, Prompts,
Tools, Agents, Runtime, and Evaluation namespaces, and the frozen `ai/` and `knowledge/` constitution.
Operations is the Category 5 (Composition Root) namespace, the only one of that category.

The Operations namespace is **immutable**. It states the running-the-layer model of the AI layer: how the
running of the layer is observed, monitored, kept healthy, diagnosed, maintained, and evolved, so that the
layer runs reliably without its behavior ever being changed by the act of operating it. It operates the layer;
it never changes its behavior: it never reasons, executes runtime behavior, decides a matter reserved to
governance, or changes the behavior of any namespace, and it never defines a monitoring tool, dashboard, log,
alerting platform, deployment system, infrastructure product, provider, framework, language, runtime, protocol,
interface, or code.

## What was built (the ten concerns + namespace)

Each concern is one source module, tracing verbatim to its frozen `ai/operations/<file>.md` document. Each
models the two normative sections of the Operations Document Standard (Principles, Invariants) and, where the
Specification enumerates a genuine closed domain set, that classification.

| Module | Concern | Specification classification | Predicate |
|---|---|---|---|
| `namespace.ts` | namespace-wide | `OPERATIONS_INVARIANTS` (7), `OPERATIONS_CONCERNS` (10) | none |
| `operations-architecture.ts` | Operations Architecture | `OperationsPart` (6) | none |
| `operations-lifecycle.ts` | Operations Lifecycle | `OperationsLifecyclePhase` (4, ordered) | `operationsPhaseAtOrAfter` |
| `observability.ts` | Observability | none (visibility facets) | none |
| `monitoring.ts` | Monitoring | none (watching facets) | none |
| `incident-management.ts` | Incident Management | none (incident facets) | none |
| `health-management.ts` | Health Management | `HealthState` (3, ordered) | `healthStateAtOrAfter` |
| `diagnostics.ts` | Diagnostics | none (investigation facets) | none |
| `maintenance.ts` | Maintenance | `MaintenanceCategory` (3) | none |
| `operations-boundaries.ts` | Operations Boundaries | `OperationsBoundary` (6) | none |
| `operations-versioning.ts` | Operations Versioning | `OperationsVersioningAspect` (4) | none |

The ten concerns match the ten concerns in the inventory `ai/operations/operations.md` exactly.

## Category 5 and the Composition-Root reconciliation (recorded for the freeze)

ADR-0024 enumerates Operations as **category 5 (Composition Root)**: it "builds the complete application,
creates the dependency graph, and performs dependency-injection composition." That names Operations'
constitutional **role**. The package that conforms to the frozen, technology-neutral `ai/operations/`
specification is realized per **ADR-0020** as an immutable, stateless domain model with **no IO and no
dependency injection**, because ADR-0020's Decision applies to "Every technology-neutral constitutional
namespace" and states a namespace package "must never own: runtime, orchestration, execution, ... dependency
injection, events, services, or mutable state," ADR-0024's Consequences say the category constrains the package
"in addition to ADR-0020," and `ai/operations/README.md` states operations "defines the operational model,
never how operations is implemented, tooled, or deployed, and never contains code." So Operations owns the
operational model **as an immutable specification model**; the actual composition-root wiring (building the
application, creating the dependency graph, performing DI composition) is the operational implementation, built
later, outside this constitutional-conformance package. This is the same reconciliation the Category 3 Runtime
and the Category 4 adapters (Providers, Memory, Tools) used. ADR-0020's Related constitutional references name
`ai/governance/README.md` and `ai/runtime/README.md` (not `ai/operations/README.md`), and this freeze makes no
claim otherwise. No new ADR was added; the ADR corpus is unchanged (25 ADRs, contiguous). See
`docs/implementation/21-operations.md` section 2. Both independent audits confirmed the reconciliation sound and
the package genuinely IO-free and DI-free.

## The two algorithms (recorded for the freeze)

Each predicate expresses a constitutional ordering over operations-owned classifications, via a private
(non-exported) rank map and `>=`:

- `operationsPhaseAtOrAfter` - the operations-lifecycle phase order (`operations-lifecycle.md`): startup,
  steady-state, maintenance, retirement. The document declares "each phase precedes the next." The operation
  returns from the maintenance phase to steady-state; that is a described operational transition, recorded in
  the phase and invariant descriptions, and it does not change the canonical phase order, so it is not modeled
  as a separate transition map.
- `healthStateAtOrAfter` - the health-state order (`health-management.md`): healthy, degraded, failed, "ordered
  from healthy to degraded to failed."

The unordered classifications (`OperationsPart`, `MaintenanceCategory`, `OperationsBoundary`,
`OperationsVersioningAspect`) carry no predicate.

## Classification vs. definitions-only (recorded for the freeze)

Per the modeling rule in `docs/implementation/13-retrieval.md` section 4, a Specification becomes a
classification only where it enumerates a genuine closed homogeneous domain set the model refers to by identity.
Modeled: the operational parts, lifecycle phases, health states, maintenance categories, operations boundaries,
and versioning aspects. Definitions only: observability, monitoring, and diagnostics (heterogeneous facets), and
incident-management. Incident-management is definitions-only despite owning "the incident lifecycle" and
"incident classification": the lifecycle is narrated in a single sentence and restated in the invariants only by
its endpoints ("from recognition to closure"), not as a closed set by identity, and the classification's
severity levels and kinds are not enumerated (as with the ordered-but-unnamed risk levels of `ai/safety/`), so
neither is invented. The maintenance concern models only its categories, not its activity lifecycle (narrated
and restated only by bounds, "from plan to completion"). The versioning fourth aspect,
`compatibility-and-deprecation`, is the single Specification bullet "Compatibility and deprecation", modeled
verbatim as enumerated rather than split. Both audits verified these decisions correct in both directions.

## Final surface and purity confirmation

- A single explicit barrel (`src/index.ts`), no wildcard `export *`: **28 exported types** and **58 exported
  runtime values** (56 frozen catalogs and description records + 2 predicate functions).
- The only executable logic is the two pure deterministic predicates; there is no IO and no dependency
  injection. Every exported catalog is `Object.freeze`d. All descriptions are plain string literals (no em-dash,
  no smart quotes, no runtime string operations).
- No runtime, mutable state, lifecycle, events, IO, DI, or services (ADR-0020). The namespace imports nothing:
  its dependency edge is `[]` (it references the constitution, Governance, the Runtime it operates, and the
  Evaluation, Safety, and Evolution namespaces it observes or defers to, but uses no foreign type and imports no
  package; ADR-0021, "import only what you use" - it imports none, including the Governance and Runtime edges it
  is allowed). `NAMESPACE_DEPS.operations = ['governance', 'runtime']` (permitted edges, unchanged).
- 100% coverage (statements, branches, functions, lines) on all modules; full validation green end to end; two
  independent source audits CLEAN, no findings, no correction cycle.

## A note on the arch-regression test harness

Implementing Operations required updating `scripts/arch-regression.mjs`, the architectural-regression test
harness. That script uses still-reserved namespaces as scratch fixtures; four scenarios previously wrote to
`packages/namespaces/operations/src/index.ts`, which would clobber Operations' now-real barrel. Those scenarios
were rotated: `legal-namespace-bare-import` and `illegal-namespace-edge-bare-import` now add a marker probe file
(`operations/src/__arch_probe__.ts`, which never clobbers the real barrel) rather than a scratch barrel;
`reserved-namespace-forbidden-edge-bare-import` now has the reserved `evolution` barrel import the real
`operations` package and writes nothing into operations. Because `evolution` is now the only reserved namespace,
a two-namespace package cycle can no longer be built with bare imports without writing an implemented
namespace's real barrel (a marker probe is never the package entry, so it cannot close a package-level cycle);
`cycle-bare-import` was therefore changed to form the cycle inside the reserved `evolution` namespace, with the
closing edge a production bare workspace import (`@openlance/aios-evolution`), so `no-circular` still fires
against a bare specifier. This changes no constitution, no frozen namespace, no ADR, and no dependency rule; it
adapts a test fixture to a namespace becoming real, and it does not weaken enforcement (every rule category is
still exercised, all 10 scenarios still pass, and `namespace-operations` is now continuously enforced against
operations' real source by the standard depcruise run). Both audits verified the change legitimate and
non-weakening, and the tree swept clean afterward. The remaining namespace (Evolution) will require rotating
every fixture off `evolution` as well, since no reserved namespace will remain.

## What "frozen" means

The namespace's concerns, identities, classifications, principles, invariants, the two orderings, public API,
ownership, and constitutional traceability are settled. Every operational evaluation the concerns imply
(observing, monitoring, assessing health, diagnosing, maintaining, or composing a concrete running layer) is
deferred to the operational implementation, which consumes this model and does not modify it. Governance rules,
the runtime it operates, the evaluation and safety signals it observes, the subject namespaces' behavior, the
evolution of the layer, and business truth are referenced, never recreated.

## Allowed changes (no architecture review required)

Only these categories may change a frozen operations file without an architecture change process, each still
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

The Evolution namespace, and the operational layers, consume this model and do not modify it. The operational
implementation composes, wires, and runs the layer; it may not modify any frozen operations file except under
the allowed-changes policy above with full validation.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
