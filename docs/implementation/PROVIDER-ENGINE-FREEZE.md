# Provider Engine, Freeze Declaration (Phase 4, Stage 1)

**Status:** FROZEN (implemented, validated, and independently audited twice).
**Package:** `@openlance/aios-provider-engine` (`apps/provider-engine`).
**Scope:** Phase 4, Stage 1: the Runtime's vendor-neutral operational Provider Engine, the **first operational stage
with real executable behavior**, built on the frozen Phase 2A substrate, the frozen Phase 2B namespaces
(`@openlance/aios-providers`, `@openlance/aios-runtime`), and the frozen Phase 3 composition-root seam. Decision:
[ADR-0035](adr/0035-phase4-operational-layer-and-provider-engine.md) (Accepted). Design:
[docs/implementation/32-provider-engine.md](32-provider-engine.md).

This is the first stage that executes. Phase 2B (pure models) and Phase 3 (descriptive, non-executing plans) executed
nothing; Phase 4 introduces the operational layer, and this engine performs real work (registration, health probing,
governed invocation over the `Provider` abstraction, event emission, failover) behind a governance-cleared seam.

## What this stage owns

The operational realization of the frozen `@openlance/aios-providers` model, sequenced by the frozen
`@openlance/aios-runtime` model: provider **registration**, **discovery**, **capability evaluation**, deterministic
**selection** and **routing**, **lifecycle** gating, **health**, **governed invocation** (with a required
`GovernanceClearance`, bounded per-provider retry, a clock deadline, cancellation, and bounded failover), **response
normalization**, and operational **metrics / statistics / diagnostics / events**. It is framed and placed as the
Runtime's operational provider subsystem; the run-time invocation of a provider is the Runtime's (ai/providers,
ai/runtime), and this engine is that subsystem. It re-owns nothing the Providers or Runtime namespaces own.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`Provider`, `ProviderRequest`/`Response`, `ProviderDescriptor`, `ProviderNeed`, `ExecutionOptions`, `HealthStatus`, `ProviderStatistics`, `ProviderDiagnostics`); type-only, excluded from coverage |
| `src/governance-clearance.ts` | `GovernanceClearance` (module-private brand), `mintClearance` (test/future-minter seam, not in the barrel), `isClearance` |
| `src/errors.ts` | `ProviderError` (a `BaseError` subtype, `infrastructure`, `PROVIDER.*` codes) |
| `src/registry.ts` | `ProviderRegistry` (register / has / get / list / unregister; deterministic order) |
| `src/capabilities.ts` | `providerSatisfies`, `ProviderCapabilities` |
| `src/lifecycle.ts` | `ProviderLifecycle` (consumes frozen `PROVIDER_LIFECYCLE_PHASES` / `usableInPhase` / `phaseAtOrAfter`) |
| `src/health.ts` | `ProviderHealthMonitor` (probe / status / isUnhealthy / forget) |
| `src/routing.ts` | `isEligible`, `ProviderRouter` (deterministic, bounded, acyclic fallback order) |
| `src/selection.ts` | `ProviderSelector` (first of the routed order) |
| `src/normalizer.ts` | `ProviderResponseNormalizer` (neutral frozen envelope) |
| `src/executor.ts` | `ProviderExecutor` (the sole, governed invocation path) |
| `src/metrics.ts` | `ProviderMetrics` |
| `src/events.ts` | `ProviderEvents`, `PROVIDER_EVENT_TYPES` (consumes frozen `createEvent` / `EVENT_BUS`) |
| `src/configuration.ts` | `ProviderConfiguration`, `ProviderEngineSettings`, `DEFAULT_SETTINGS` |
| `src/factory.ts` | `ProviderFactory` (validates + freezes a `Provider` from a descriptor) |
| `src/plugin-bridge.ts` | `ProviderPluginBridge`, `ProviderPlugin` (consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `ProviderManager` (the facade + DI entry), `ProviderManagerOptions` |
| `src/module.ts` | `providerEngineModule`, `PROVIDER_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard; the minter is deliberately not exported) |

## The governance-cleared execution seam (the crux)

The engine's only invocation path is `ProviderExecutor.execute`, which requires a `GovernanceClearance`: a
non-forgeable handle whose brand is a module-private `unique symbol`. `mintClearance` (the only producer) is **not**
re-exported from the public barrel, so production has no way to mint a clearance and therefore **no
ungoverned-execution path** by construction, honoring the runtime invariant "Governance precedes execution" and the
providers invariant "used only within the rules governance sets" (ADR-0020). The executor fails closed on a missing
clearance (`PROVIDER.NO_CLEARANCE`), a clearance whose capability does not match the request
(`PROVIDER.CLEARANCE_MISMATCH`), a need whose capability does not match the request (`PROVIDER.CAPABILITY_MISMATCH`), a
non-positive or non-integer attempt bound (`PROVIDER.INVALID_ATTEMPTS`), and no eligible provider
(`PROVIDER.NO_PROVIDER`), and refuses on cancellation (`PROVIDER.CANCELLED`) or a passed deadline (`PROVIDER.TIMEOUT`).
In Stage 1 the minter is a test-and-benchmark seam; when the runtime validation pipeline / governance enforcement
engine (a later Phase 4 stage, ADR-0031) is built, it becomes the sole minter, with no change to the executor's public
contract.

## No vendor knowledge (ADR-0035 invariant)

The engine holds **no vendor knowledge**: no vendor SDK, no vendor-specific request or response model, no API URL, and
no authentication. It depends only on the `Provider` abstraction. The invariant is enforced structurally: the package
declares no vendor dependency, imports no SDK, and the guard test `tests/no-vendor-knowledge.test.ts` scans every
`src/` file and fails the build on any vendor name, SDK, URL, or auth token. Concrete adapters are separate later
sub-stages against the frozen engine.

## Consume, never recreate

Consumes the frozen `@openlance/aios-providers` model (lifecycle phases + predicates), the frozen
`@openlance/aios-runtime` model (`VALIDATION_STAGES`), and the frozen substrate (`di` token/`Module`, `events`
`createEvent`/`EVENT_BUS`, `errors` `BaseError`/`Result`, `plugins` `PluginManifest` type, `kernel`). It recreates no
container, event bus, dispatcher, error taxonomy, config service, or plugin host, and registers through the frozen
composition-root extension seam (ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Immutability

`ProviderResponse` (normalizer), `GovernanceClearance` (mint), `ProviderStatistics` (metrics), `ProviderDiagnostics`
(manager), the built `Provider` and its `capabilities` array (factory), the adopted-ids array (plugin bridge), and the
module consts (`PROVIDER_EVENT_TYPES`, `DEFAULT_SETTINGS`, config settings) are all `Object.freeze`d. Both audits
verified the freezes empirically.

## Dependency graph

`@openlance/aios-provider-engine -> { @openlance/aios-providers, @openlance/aios-runtime, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges,
recorded in `dependency-graph.snapshot.json`). All are `app -> namespace` (providers, runtime) or `app -> substrate`
edges, legal under the frozen dependency rules; no dependency-cruiser rule and no namespace edge changed. The
composition root, config, and logging are test-only devDependencies.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 33 packages / 35 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 17 executable modules (barrel and the type-only
  `types.ts` excluded per ADR-0015); 48 tests; benchmarks recorded; no `.only` / `.skip`.
- Two independent source audits. Audit 1 (constitutional ownership, ADR-0035 compliance, no-vendor invariant,
  duplication, traceability, API fidelity) was CLEAN. Audit 2 (dependency correctness, immutability, determinism,
  governed-executor correctness, coverage honesty, regression) raised one Medium and four Low findings, all fixed:
  a `need`/`request` capability-agreement guard (`PROVIDER.CAPABILITY_MISMATCH`); a positive-integer attempt-bound
  guard (`PROVIDER.INVALID_ATTEMPTS`) that closed a subsequently-caught `NaN`/`Infinity` unassigned-read hole and made
  the executor's definite-assignment sound; plugin-bridge adoption now validates and freezes through `ProviderFactory`;
  and `ProviderHealthMonitor.forget` + `ProviderManager.unregister` clear stale health on retirement. A second,
  independent re-audit of the fixes (correctness + constitutional) confirmed CLEAN.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, and the eight frozen
Phase 3 packages unchanged; `.dependency-cruiser.cjs`, `tsconfig.base.json`, and `tools/` unchanged
(`git diff HEAD -- ai/ knowledge/ packages/ .dependency-cruiser.cjs tools/` empty). The change set is the new
`apps/provider-engine/` package, ADR-0035, the design doc, this freeze doc, the ADR index row, the graph snapshot, and
`pnpm-lock.yaml`.

## What "frozen" means

The Provider Engine's public API, the governance-cleared invocation contract (no production path invokes without a
valid, capability-matched clearance), the no-vendor-knowledge invariant, the consume-not-recreate boundary, the
deterministic selection/routing, the fail-closed `Result` contract, the immutable return shapes, and the dependency
edges are settled for Stage 1. Concrete vendor adapters, the real clearance minter (the governance enforcement engine),
and all other namespace operational services are later Phase 4 stages, not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
provider-engine file without an architecture change process, each still running the full validation pipeline. Any
change to the public API, the no-vendor-knowledge invariant, the governance-cleared invocation contract, the
consume-not-recreate boundary, the fail-closed contract, or the dependency edges is an architectural modification
requiring a new or superseding ADR, an architecture review, an independent audit, and full validation.

## Do not begin Stage 2

Phase 4 Stage 2 (Prompt Engine) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
