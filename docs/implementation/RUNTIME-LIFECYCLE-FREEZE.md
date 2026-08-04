# Runtime Lifecycle, Freeze Declaration (Phase 3, Stage 4)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-runtime-lifecycle` (`apps/runtime-lifecycle`).
**Scope:** Phase 3, Stage 4: the runtime lifecycle plan, the fourth `apps/`-layer package, built on the frozen
Phase 2A substrate, the 13 frozen Phase 2B namespaces (in particular the frozen `@openlance/aios-runtime`
lifecycle model), and the frozen Stage 1 to Stage 3 packages. Decision: ADR-0029 (Accepted). Design:
`docs/implementation/26-runtime-lifecycle.md`.

## The gate this stage resolved

The Stage 4 mandate (an immutable runtime lifecycle model, lifecycle transitions, fail-closed validation) conflicts
with the frozen surface: the runtime lifecycle model is already frozen (`@openlance/aios-runtime` owns the 13
execution states, the transition adjacency map and `transitionAllowed`, the lifecycle/session/workflow/validation
phase orderings and predicates, boundaries, and events), so re-declaring it duplicates frozen code; and driving a
live execution through the lifecycle is execution and orchestration, which the mandate forbids and which the
constitution assigns to "the runtime, outside every knowledge document" (the Execution Pipeline, Stage 5). Per
ADR-0007 and the mandate's own instruction, implementation stopped at the design artifacts and awaited a
direction. **Option A** (a descriptive runtime lifecycle plan) was approved and is what this package implements.

## What this stage owns

An immutable **`RuntimeLifecyclePlan`** that binds the DI-integrated application to the frozen runtime lifecycle
model. It **describes, never owns**: it references the frozen model and re-declares nothing, and it **carries
nothing out**: it holds no runtime state, has no current state, drives no transition, executes nothing, activates
nothing, schedules nothing, instantiates no runtime engine, and performs no orchestration. It simply proves that
an `IntegratedApplication` is constitutionally ready to enter the execution pipeline (Stage 5), which consumes the
plan.

## What was built

| Module | Owns |
|---|---|
| `src/lifecycle.ts` | the public types, `buildRuntimeLifecyclePlan`, `validateLifecyclePath`, and the internal referenced model constants |
| `src/errors.ts` | `RuntimeLifecycleError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `buildRuntimeLifecyclePlan(integrated: IntegratedApplication): Result<RuntimeLifecyclePlan, RuntimeLifecycleError[]>`
  - bind the integrated application to the frozen lifecycle model, failing closed.
- `validateLifecyclePath(states: readonly ExecutionState[]): Result<readonly ExecutionState[], RuntimeLifecycleError[]>`
  - validate a proposed sequence of execution states against the frozen transition relation, failing closed.
- `RuntimeLifecyclePlan`, `RuntimeLifecycleError`.

`RuntimeLifecyclePlan = { integrated, initialState, phases, admissionPath, validated: true }` (deep-frozen).
`initialState` is `created` (referenced from the frozen model), `phases` is the frozen
`EXECUTION_LIFECYCLE_PHASES` (referenced), and `admissionPath` is the model's deterministic entry sequence,
validated against the frozen `transitionAllowed`. The descriptive planning metadata is the plan itself; there is
no separate diagnostics report.

## Consume, never recreate; never duplicate the constitution

It consumes the frozen `@openlance/aios-runtime` lifecycle model and the frozen `IntegratedApplication`
(ADR-0028), and re-declares no execution state, transition, lifecycle phase, session phase, workflow step,
validation stage, boundary, or event. It recreates no container, registry, resolver, namespace manifest, or
composition root (Stages 1 to 3). "Lifecycle transitions" is a pure validator over the frozen relation
(`validateLifecyclePath`, delegating to `transitionAllowed`), never a live state machine. The only non-imported
data are the referenced initial state `created` and the deterministic admission path (Created through
Initializing, Loading, Validating), which is the constitution's single-successor prefix and is proven, not
trusted: every edge is validated against the frozen `transitionAllowed`, so model drift fails closed.

## Validation (delegated, fail closed)

`validateLifecyclePath` performs no validation of its own; it delegates each consecutive transition to the frozen
`transitionAllowed` and aggregates one `RUNTIME_LIFECYCLE.FORBIDDEN_TRANSITION` error per forbidden pair, building
no partial path. `buildRuntimeLifecyclePlan` uses it (through kernel `map`) to prove the admission sequence,
failing closed. Failures ride the `Result` channel (ADR-0006), never thrown.

## Immutability

The `RuntimeLifecyclePlan`, its `phases` (the frozen `EXECUTION_LIFECYCLE_PHASES`), and its `admissionPath` (a
frozen array) are all `Object.freeze`d; `integrated` is the already-deep-frozen Stage 3 object. `validateLifecyclePath`
returns a frozen array. Both functions are pure; the package holds no mutable state. Both audits verified the deep
freeze empirically.

## Dependency graph

`@openlance/aios-runtime-lifecycle -> { @openlance/aios-di-integration, @openlance/aios-runtime, kernel, errors }`
(its `src/` edges, recorded in `dependency-graph.snapshot.json`; composition-root, namespace-wiring, config, and
logging are test-only devDependencies). This introduces the first app dependency on a namespace for its model
(the legal `app -> namespace` edge, ADR-0027/0028/0029); the `@openlance/aios-runtime` namespace itself remains
edge `[]` and byte-unchanged. No dependency-cruiser rule changed.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 28 packages / 29 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 6 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN. Audit 1 (traceability, ownership, API fidelity, no invention, no
  duplication) and Audit 2 (purity, immutability, regression, dependency correctness, ADR/architecture
  compliance). Audit 1 raised one Low doc-fidelity finding (the design doc's option/table prose mentioned a
  diagnostics report the shipped plan does not produce); the doc was aligned to the code and the audit re-run
  CLEAN. Deep immutability, the fail-closed delegation, no invention, and the no-duplication constraint were
  verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen Phase 2B namespaces (including
`packages/namespaces/runtime`), and the frozen Stage 1 to Stage 3 packages unchanged; `.dependency-cruiser.cjs`
and `scripts/` unchanged; no other ADR's decision changed except the new ADR-0029 (Accepted). The complete change
set is the runtime-lifecycle package, its design doc, ADR-0029, the ADR index row, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The lifecycle plan's public API, behavior (delegated fail-closed transition validation, immutable
`RuntimeLifecyclePlan`, referenced-not-recreated model, carries-nothing-out boundary), and dependency edges are
settled for Stage 4. Driving the lifecycle (execution, orchestration, scheduling), the execution pipeline, and
all later stages are **not** part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen runtime-lifecycle file without an architecture change process, each still running the full validation
pipeline. Any change to the public API, the describe-never-own boundary, the carries-nothing-out boundary, the
fail-closed delegated-validation contract, the immutable `RuntimeLifecyclePlan` shape, or the consume-not-recreate
boundary is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Constitutional and prior-phase layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate, namespaces (including the
runtime model), composition root, namespace wiring, and DI integration are unchanged; this stage consumes them and
modifies none.

## Do not begin Stage 5 or later

Phase 3 Stage 5 (Execution Pipeline), Stage 6 (Governance Enforcement), Stage 7+, and any runtime execution are
not started. Each is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
