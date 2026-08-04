# @openlance/aios-provider-engine

The AIOS **Provider Engine** (Phase 4, Stage 1): the Runtime's vendor-neutral operational provider subsystem. It is
the first operational stage with real executable behavior. It carries out provider registration, capability
evaluation, deterministic selection and routing, lifecycle, health, governed invocation, bounded failover, and
response normalization, over a technology-neutral `Provider` abstraction.

- **Layer:** `app` (`apps/*`), the first executable Phase 4 occupant.
- **Design:** [docs/implementation/32-provider-engine.md](../../docs/implementation/32-provider-engine.md).
  **Decision:** [ADR-0035](../../docs/implementation/adr/0035-phase4-operational-layer-and-provider-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-providers` model, sequenced by the frozen
`@openlance/aios-runtime` model. It **consumes, never recreates**: the provider model (identity, capability,
selection, routing, fallback, lifecycle phases), the runtime execution model, and the frozen substrate (DI, events,
errors, kernel). It re-owns nothing those namespaces own; the run-time invocation of a provider is the Runtime's, and
this engine is that runtime subsystem.

It owns only provider operation. It does not own prompts, memory, retrieval, tools, reasoning, agents, workflows,
whole-task orchestration, governance rules, safety rules, or any business truth.

## No vendor knowledge (ADR-0035 invariant)

The engine contains **no vendor knowledge**: no vendor SDK, no vendor-specific request or response model, no API URL,
and no authentication. It depends only on the `Provider` abstraction. Each concrete provider adapter is a separate
later sub-stage implemented against the frozen `Provider` interface, never the reverse. The invariant is enforced
structurally: the package declares no vendor dependency, imports no SDK, and a guard test
(`tests/no-vendor-knowledge.test.ts`) fails the build if any vendor name, SDK, URL, or auth token appears in `src/`.

## Governance-cleared execution

A provider is invoked only through `ProviderExecutor.execute`, which requires a `GovernanceClearance`: a non-forgeable
handle representing a completed governance validation for a specific request. Its brand is module-private and the
minter is **not** exported from the public barrel, so production has no way to mint a clearance and therefore no
ungoverned-execution path. "Governance precedes execution" (ai/runtime) holds by construction. In Stage 1 the minter
is a test-and-benchmark seam; when the runtime validation pipeline / governance enforcement engine (a later Phase 4
stage) is built, it becomes the sole minter, with no change to the executor's public contract.

## Public API (single barrel, Engineering Rule 1)

- `ProviderManager` (and `providerEngineModule`, `PROVIDER_MANAGER`): the engine facade and its DI module, registered
  through the frozen composition root's extension seam (ADR-0026).
- `ProviderRegistry`, `ProviderFactory`, `ProviderLifecycle`, `ProviderCapabilities`, `ProviderSelector`,
  `ProviderRouter`, `ProviderHealthMonitor`, `ProviderResponseNormalizer`, `ProviderExecutor`, `ProviderMetrics`,
  `ProviderEvents`, `ProviderConfiguration`, `ProviderPluginBridge`: the operational components.
- `Provider`, `ProviderDescriptor`, `ProviderRequest`, `ProviderResponse`, `ProviderNeed`, `HealthStatus`,
  `ExecutionOptions`, `ProviderStatistics`, `ProviderDiagnostics`, `GovernanceClearance`, `ProviderEngineSettings`,
  `ProviderPlugin`: the read-only types.
- `ProviderError`: a `BaseError` subtype (`infrastructure`) with `PROVIDER.*` codes; failures ride the `Result`
  channel (ADR-0006), never thrown out of the public API.

## Dependency direction

`@openlance/aios-provider-engine -> { @openlance/aios-providers, @openlance/aios-runtime, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges,
recorded in `dependency-graph.snapshot.json`). All are `app -> namespace` or `app -> substrate` edges, legal under
the frozen dependency rules; no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies (the engine registers into the composition root through its seam).

## Non-responsibilities

No vendor SDK, model, request/response shape, URL, or auth; no minting of a governance clearance in production; no
prompts, memory, retrieval, tools, reasoning, agent behavior, whole-task orchestration, or scheduling; no recreation
of the container, event bus, error taxonomy, or plugin host. It realizes provider operation and nothing else.
