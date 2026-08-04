# Error Propagation, Freeze Declaration (Phase 3, Stage 7)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-error-propagation` (`apps/error-propagation`).
**Scope:** Phase 3, Stage 7: the application-level error propagation integration, the seventh `apps/`-layer package,
built on the frozen Phase 2A substrate (in particular the frozen `@openlance/aios-errors` framework and the
`@openlance/aios-kernel` `Result` channel) and the frozen Stage 1 to Stage 6 packages. Decision: ADR-0033
(Accepted; no supersession, as ADR-0032 already anticipates Stage 7). Design:
`docs/implementation/30-error-propagation.md`.

Note on the freeze boundary: per ADR-0032 the Phase 3 integration layer is frozen together at the consolidated
Stage 9 Runtime Freeze. This document records that Stage 7 is settled and audited; it does not pre-empt the Stage 9
layer-wide freeze.

## What this stage owns

An immutable **`ErrorPropagationPlan`** describing the runtime integration chain's coded error topology (which
coded errors propagate, in which frozen `ErrorCategory`, on the frozen `Result` channel), attached to the Stage 6
chain handle. It **describes, never owns**: it references the frozen error framework and re-declares nothing, and it
**executes nothing**: it does not catch, retry, recover, roll back, orchestrate, schedule, or handle any runtime
error, and runs no provider, tool, agent, plugin, namespace, or workflow. Those are Phase 4 or the frozen
substrate.

## What was built

| Module | Owns |
|---|---|
| `src/error-propagation.ts` | the public types, `buildErrorPropagationPlan`, `validateErrorPropagation` |
| `src/errors.ts` | `ErrorPropagationError` (a `BaseError` subtype, `infrastructure`) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Public API

- `buildErrorPropagationPlan(chain: PluginLoadingPlan, nodes: readonly ErrorPropagationNode[]): Result<ErrorPropagationPlan, ErrorPropagationError[]>`
  - build the plan, attaching it to the chain and delegating validation, failing closed.
- `validateErrorPropagation(nodes: readonly ErrorPropagationNode[]): Result<readonly ErrorPropagationNode[], ErrorPropagationError[]>`
  - validate the declared topology's code uniqueness via the frozen registry, failing closed.
- `ErrorPropagationNode`, `ErrorPropagationPlan`, `ErrorPropagationDiagnostics`, `ErrorPropagationError`.

`ErrorPropagationNode = { code, category }`, where `category` is the frozen `ErrorCategory` type (an invalid
category cannot be declared). `ErrorPropagationPlan = { chain, nodes, diagnostics, validated: true }` (deep-frozen).

## Consume, never recreate

The error framework is owned, in full, by the frozen substrate: the error hierarchy (`BaseError`, the
`domain`/`infrastructure`/`validation` `ErrorCategory`), `DomainError`/`InfrastructureError`/`ValidationError`, the
error-code registry (`InMemoryErrorCodeRegistry`), and the throw-to-`Result` bridges (`@openlance/aios-errors`,
ADR-0006), and the `Result` channel (`@openlance/aios-kernel`). This package recreates none of them; it consumes
the frozen `ErrorCategory` type, the frozen `InMemoryErrorCodeRegistry` (for code uniqueness), and the frozen
`Result` channel, and consumes the Stage 6 `PluginLoadingPlan`. It re-declares no error type, category set,
registry, or bridge, and it never re-encodes the `ErrorCategory` union as a runtime array (category validity is
compile-time enforced by the frozen type).

## Validation (delegated, fail closed)

`validateErrorPropagation` registers each node's code into a fresh frozen `InMemoryErrorCodeRegistry` and asserts
uniqueness; the registry's `assertUnique` throw is bridged to the `Result` channel with a local guard (the same
pattern the frozen `fromThrowable` uses), returning one `ERROR_PROPAGATION.DUPLICATE_CODE` error (wrapping the
frozen registry error as its cause) on a duplicate, and no partial topology. No runtime error is caught, mapped, or
handled. Failures ride the `Result` channel (ADR-0006), never thrown out of the API.

## Immutability

The `ErrorPropagationPlan`, its `nodes` (the frozen validated topology), its `diagnostics`, and `diagnostics.codes`
are all `Object.freeze`d; `chain` is the already-deep-frozen Stage 6 object. `validateErrorPropagation` returns a
frozen array. Both functions are pure; the `InMemoryErrorCodeRegistry` is a fresh local instance per call, holding
no ambient or shared state. Both audits verified the deep freeze and purity empirically.

## Dependency graph

`@openlance/aios-error-propagation -> { @openlance/aios-plugin-loading, @openlance/aios-errors, kernel }` (its
`src/` edges, recorded in `dependency-graph.snapshot.json`; the chain-building packages, plugins, config, logging,
and events are test-only devDependencies). The `app -> app` (plugin-loading) and `app -> substrate` (errors) edges
are legal; no dependency-cruiser rule or namespace edge changed.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10,
  graph:check, docs-check 31 packages / 33 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements/branches/functions/lines coverage; 6 tests; benchmark recorded; no `.only`/`.skip`.
- Two independent source audits, both CLEAN on the first pass, no findings at any severity. Audit 1 (ownership, ADR
  compliance, traceability, constitutional correctness, API fidelity, documentation fidelity, duplication) and
  Audit 2 (architecture, dependency correctness, immutability, purity, regression, implementation correctness,
  graph correctness). Deep immutability, the no-execution constraint, the delegated code-uniqueness, and the
  no-duplication constraint were verified empirically.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate (including `packages/errors` and
`packages/kernel`), all 13 frozen namespaces, and the six frozen Stage 1 to Stage 6 packages unchanged;
`.dependency-cruiser.cjs` and `scripts/` unchanged. The complete change set is the error-propagation package, its
design doc, ADR-0033, the ADR index row, the `PHASE-3-COMPLETE.md` roadmap note, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The error propagation plan's public API, behavior (delegated fail-closed uniqueness validation, immutable
`ErrorPropagationPlan`, consume-not-recreate boundary, executes-nothing boundary), and dependency edges are settled
for Stage 7. Catching, retrying, recovering, or handling runtime errors, and all runtime execution, are Phase 4 and
not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a
frozen error-propagation file without an architecture change process, each still running the full validation
pipeline. Any change to the public API, the describe-never-own boundary, the executes-nothing boundary, the
fail-closed delegated-validation contract, the immutable `ErrorPropagationPlan` shape, or the consume-not-recreate
boundary is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Constitutional and prior layers remain immutable

`ai/` and `knowledge/` remain immutable (CI constitutional guard). The frozen substrate (including the error
framework), namespaces, and the six prior Phase 3 packages are unchanged; this stage consumes them and modifies
none.

## Do not begin Stage 8

Phase 3 Stage 8 (Event Flow) and Stage 9 (Runtime Freeze) are not started. Each is a separate, design-first stage;
Stage 9 will be the consolidated Phase 3 Runtime Freeze.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
