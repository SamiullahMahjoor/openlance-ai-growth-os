# 32. Provider Engine implementation design (Phase 4, Stage 1)

**Status: PROPOSED, awaiting approval (design-first per ADR-0007).** This is the design artifact for Phase 4, Stage
1, the first operational stage. No package or code exists yet; this document and [ADR-0035](adr/0035-phase4-operational-layer-and-provider-engine.md)
(Proposed) are presented for approval before any implementation. Planned package: `apps/provider-engine`
(`@openlance/aios-provider-engine`).

## 1. Mandate and scope

Stage 1 builds the **Provider Engine**: the operational subsystem that carries out provider registration, discovery,
capability lookup, deterministic selection and routing, health, lifecycle, governed invocation, bounded failover,
response normalization, and observability, over a technology-neutral `Provider` abstraction. It is the first stage
with real executable behavior.

Per [ADR-0035](adr/0035-phase4-operational-layer-and-provider-engine.md), the engine is the **Runtime's vendor-neutral
operational provider subsystem**: it realizes the operational behavior the frozen `@openlance/aios-providers` model
describes and the frozen `@openlance/aios-runtime` model sequences, and it owns nothing those namespaces own. It binds
to no vendor: it depends only on the `Provider` abstraction, and every concrete adapter is a separate later sub-stage
against the frozen engine (Section 7).

It owns only provider operation. It does not own prompts, memory, retrieval, tools, reasoning, agents, workflows,
orchestration of a whole task, governance rules, safety rules, or any business truth; those are their namespaces' and
the runtime's, consumed by reference, never restated.

**Constitutional invariant (approved): the Provider Engine never contains vendor knowledge.** It holds no OpenAI,
Anthropic, Gemini, Grok, DeepSeek, or Ollama logic, no provider-specific request or response model, no SDK reference,
no API URL, and no authentication logic. It owns only: provider lifecycle, provider registry, provider selection,
provider routing, provider capability evaluation, the provider execution contract, provider health, provider metrics,
the provider normalization interface, and governed execution coordination. Concrete providers are implemented later as
independent adapter packages that depend on the frozen `Provider` abstraction, never the reverse. This is enforced
structurally (Section 7): the package declares no vendor dependency, imports no SDK, and a guard test fails the build
if any vendor name or SDK identifier appears in `src/`.

## 2. Constitutional review performed (from source, this session)

Read from origin, not memory: `ai/providers/README.md` (the Providers namespace guide, ownership and boundaries), the
frozen `@openlance/aios-providers` public barrel (the pure model surface), `ai/runtime/README.md` (the Runtime owns
execution and the run-time invocation of a provider, and the "Governance precedes execution" invariant), ADR-0026 (the
composition-root extension seam that later operational services register through), ADR-0031 and
`28-governance-enforcement.md` (governance enforcement, the future clearance minter, is a Phase 4 operational
capability), `PHASE-3-COMPLETE.md` and `RUNTIME-INTEGRATION-FREEZE.md` (what is and is not built), and a search of
`docs/implementation` confirming no prior Phase 4 or operational-layer design exists. Ownership was reconstructed from
these sources.

## 3. Ownership analysis and the three findings (with resolutions)

Stage 1 tripped the Ambiguity Gate on three findings, each resolved in ADR-0035:

1. **Provider execution and invocation are the Runtime's, not the Providers namespace's.** `ai/providers/README.md`:
   "A provider is not the runtime ... A provider never orchestrates, schedules, or executes; those are owned by
   ai/runtime/," boundary "Execution, orchestration, and run-time invocation of a provider: ai/runtime/," invariant
   "A provider serves; it owns none of the behavior it serves." The frozen barrel: "a provider is invoked and executed
   by ai/runtime/ (ADR-0020)," and selecting / routing / falling back for a concrete request "are deferred to the
   runtime." **Resolution:** the engine is framed and placed as the Runtime's operational provider subsystem that
   consumes the two frozen models; it is not a new namespace and re-owns neither. (ADR-0035, Decision 4.)

2. **Governance precedes execution, but the governance and runtime execution engines are unbuilt.** Runtime invariant:
   "Governance precedes execution. Every significant action is validated against governance before it runs." Providers
   invariant: "A provider is selected and used only within the rules governance sets." ADR-0020: "Governance provides
   truth. Runtime performs enforcement. This boundary is absolute." The clearance minter (the runtime validation
   pipeline / governance enforcement engine) is itself a later Phase 4 stage. **Resolution:** the executor requires a
   typed governance clearance as a precondition, produced only by that future stage; the engine never mints its own for
   an arbitrary request and offers no path to execute without one (Section 6). "Governance precedes execution" holds by
   construction. (ADR-0035, Decision 3.)

3. **No Phase 4 operational-layer architecture existed.** **Resolution:** ADR-0035 establishes it: operational services
   are `apps/`-layer packages that register through the frozen composition-root seam (ADR-0026) and execute behind the
   governance-cleared seam. Stage 1 is the first instance and the pattern for the rest of Phase 4. (ADR-0035, Decisions
   1, 2, 5.)

## 4. The operational-layer architecture applied (ADR-0035)

- **Placement.** `apps/provider-engine`, `aios.layer: "app"` (the existing frozen layer; no new layer or
  dependency-cruiser rule). Single explicit barrel `src/index.ts` (no wildcard; Engineering Rule 1).
- **Integration.** The package exposes a `@openlance/aios-di` `Module` (`providerEngineModule`) that registers the
  engine's public tokens (for example `PROVIDER_MANAGER`) in the container, wired through the composition root's
  documented extension seam (ADR-0026 `CompositionConfig.modules`). It defines no container, registry, module host,
  event bus, error taxonomy, config service, or plugin host; all are consumed from the frozen substrate.
- **It executes (Phase 4).** Unlike the Phase 3 chain, the engine performs real work: it invokes providers through the
  `Provider` abstraction, runs health probes, emits events on the frozen bus, keeps operational state (the registry,
  health status, metrics), and recovers from failures. All of it sits behind the governance-cleared seam and consumes
  the frozen models; none of it re-owns a frozen concern.

## 5. Component inventory (design plan)

Every component consumes frozen truth and owns only operational behavior. Grouped by concern:

**Abstraction (the vendor seam).**
- **`Provider` interface.** The technology-neutral contract every adapter implements: a stable id, a declared
  capability set (typed against the frozen capability model), a lifecycle phase, an async
  `invoke(cleared: GovernanceClearance, request: ProviderRequest): Promise<Result<ProviderResponse, ProviderError>>`,
  and a `probe(): Promise<HealthStatus>`. This is the only surface a vendor adapter implements (Section 7). Names no
  vendor; contains no SDK.

**Registry and lifecycle.**
- **`ProviderRegistry`.** Registers, discovers, and looks up `Provider` instances by id; deterministic ordering; no
  duplicate id (fails closed). Holds the operational set the selector and router read.
- **`ProviderFactory`.** Validates a `ProviderDescriptor` and constructs an immutable `Provider`, filling a default
  phase and probe; the plugin bridge routes through it too, so both registration paths enforce the same invariants.
  Stage 1 constructs from provided descriptors and the test provider.
- **`ProviderLifecycle`.** Drives a provider through the frozen `PROVIDER_LIFECYCLE_PHASES`, consuming `phaseAtOrAfter`
  and `usableInPhase` to decide when a provider may be selected or invoked. Restates no phase; delegates the ordering.
- **`ProviderManager`.** The engine facade and DI entry (`PROVIDER_MANAGER`): composes registry, lifecycle, health,
  selection, routing, and the executor; the one object the composition root registers.

**Selection and routing (deterministic, consuming the frozen model).**
- **`ProviderCapabilities`.** Capability lookup and matching against a need, typed on the frozen capability model.
- **`ProviderSelector`.** Deterministic selection over a need and the registry, honoring the frozen selection
  invariants ("the same need, the same registered providers, and the same governing rules yield the same selection,"
  no randomness).
- **`ProviderRouter`.** Deterministic routing and the bounded, acyclic fallback order, honoring the frozen routing and
  fallback invariants ("no infinite fallback and no routing cycle"). Failover is realized here (the ordered fallback
  set) and by the executor (advancing to the next provider on a bounded failure).

**Governed execution.**
- **`ProviderExecutor`.** The governed executor: given a `GovernanceClearance` it validates (present, and matching the
  request capability), a need whose capability must agree with the request, and a positive attempt bound, it routes the
  need and invokes the eligible providers with a bounded clock deadline, bounded per-provider retry, and cancellation,
  advancing the router's fallback when a provider is exhausted, and returns a normalized `Result` or the last error. It
  is the sole invocation path and requires the clearance (Section 6); it fails closed on every disqualifying condition.
- **`ProviderResponseNormalizer`.** Normalizes a provider response into the engine's neutral `ProviderResponse` shape,
  so callers never see a vendor-shaped result. Owns no intelligence; it shapes envelopes only.

**Health and observability.**
- **`ProviderHealthMonitor`.** Runs `probe()` on providers, marks each healthy or unhealthy, and feeds selection and
  routing (an unhealthy provider is skipped). Deterministic given probe results.
- **`ProviderMetrics`, `ProviderStatistics`, `ProviderDiagnostics`.** Operational counters, aggregates, and a
  read-only diagnostic view (registration counts, invocation counts, latencies, failover counts, health). Operational
  only; carry no business truth.
- **`ProviderEvents`.** Emits provider lifecycle and invocation framework events by consuming the frozen
  `createEvent` and publishing on the frozen `EVENT_BUS` (execution is permitted in Phase 4). Re-declares no event,
  bus, or dispatcher; restates no `RUNTIME_EVENTS`.

**Cross-cutting.**
- **`ProviderConfiguration`.** The engine's immutable operational settings (attempt bound, deadline) and the derived
  execution options; it defines no new configuration mechanism. Stage 1 holds engine-owned defaults; a later stage may
  source them from the frozen `CONFIG_SERVICE` (not a Stage-1 dependency).
- **`ProviderErrors`.** `@openlance/aios-errors` `BaseError` subtypes with `PROVIDER.*` codes; failures ride the
  `Result` channel (ADR-0006), never thrown out of the public API.
- **`ProviderPluginBridge`.** Adopts provider-carrying plugins into the engine's registry so a provider adapter may
  ship as a plugin, consuming the frozen `PluginManifest` identity type and validating each provider through the
  `ProviderFactory`. Driving the plugin host lifecycle (discovery, load, start, stop) stays the plugin-loading /
  runtime concern; the bridge recreates no plugin host, loader, lifecycle, or compatibility validator.

## 6. The governance-cleared execution seam (the crux)

The engine's only invocation path is `ProviderExecutor.execute`, which requires a `GovernanceClearance`: an opaque,
non-forgeable handle representing a completed governance validation for a specific request. Its constructor is not
public; it is minted only by the runtime validation pipeline / governance enforcement engine (a later Phase 4 stage,
ADR-0031). The engine therefore cannot invoke a provider for an unvalidated request: there is no code path from a raw
request to an invocation that does not pass a clearance, and the engine never fabricates one for an arbitrary request.
This makes the runtime invariant "Governance precedes execution" and the providers invariant "used only within the
rules governance sets" structural, not conventional.

Because the real minter is unbuilt, Stage 1 supplies clearances only through a clearly marked test-and-benchmark seam
(`__clearanceForTest` or an equivalent test-only export), standing in for a completed validation so the executor,
timeout, retry, and failover paths can be exercised and benchmarked. Production has no auto-clear. When the minter
lands, it becomes the sole source of clearances with no change to `ProviderExecutor.execute`'s public contract
(ADR-0035, Consequences).

## 7. Vendor neutrality and the adapter sub-stages (deferred)

Stage 1 ships the engine and the `Provider` abstraction, plus a neutral in-memory test provider used only by tests and
benchmarks. It ships **no** concrete vendor adapter and names no vendor, model, or SDK, honoring the providers
invariant "This namespace names none." Each concrete adapter (for a specific vendor or model) is a separate later
sub-stage: its own design artifact, implementing the frozen `Provider` interface against that vendor's SDK, registered
into the frozen engine (directly or via the plugin bridge). The engine core never imports a vendor SDK, so provider,
model, and technology churn is absorbed at the adapter edge and never touches the frozen core.

## 8. Consume, never recreate

| Concern | Owned by (frozen) | Stage 1 disposition |
|---|---|---|
| The provider model: identity, capability, abstraction, selection, routing, fallback, lifecycle phases, compatibility, versioning, boundaries | `@openlance/aios-providers` (Phase 2B) | consume the types, predicates, and invariants; restate none |
| The execution model: lifecycle states, validation stages, workflow order | `@openlance/aios-runtime` | consume by reference; the engine is its operational realization, not a re-owner |
| The clearance (governance validation of a request) | the runtime validation pipeline / governance enforcement engine (later Phase 4) | require it as a precondition; never mint it in production |
| DI container, module host, tokens, startup validation | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Config, logging | the frozen substrate (config, logging) | not a Stage-1 source dependency; the engine holds its own operational settings and emits through the event bus (a later stage may source settings from `CONFIG_SERVICE`); test-only devDependencies |
| The runtime integration chain and the composition root seam | Phase 3 (frozen) | register through the composition root's `modules` seam; recreate no chain handle |

## 9. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-provider-engine -> {
@openlance/aios-providers, @openlance/aios-runtime, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins,
@openlance/aios-errors, @openlance/aios-kernel }` (seven). All are `app -> namespace` (providers, runtime) or
`app -> substrate` edges, legal under the frozen dependency rules; no dependency-cruiser rule and no namespace edge
changes. The composition root, config, and logging are test-only devDependencies (the engine is registered into the
composition root through its seam, and config/logging back the integration test, not the engine's `src`).

## 10. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrels and type-only modules excluded (ADR-0015).
  Every component is unit-tested against the neutral test provider: registry (register, duplicate rejection, lookup,
  ordering), factory, lifecycle (phase gating via the frozen predicates), capabilities and selection (determinism:
  same need and registry yield the same choice), router (bounded acyclic fallback), executor (success, timeout, retry,
  cancellation, failover to the next provider, and refusal without a clearance), normalizer, health monitor (healthy /
  unhealthy skip), metrics / statistics / diagnostics, events (emitted via the frozen constructor and bus), errors
  (`PROVIDER.*` on the `Result` channel), configuration, and the plugin bridge.
- **Fail-closed.** The public API never throws; every failure is a `Result` error. The executor refuses (a
  `PROVIDER.NO_CLEARANCE` error) when handed no clearance.
- **Benchmarks (ADR-0022 Rule 5).** Registration, capability / lookup, selection, execution (the governed invoke path),
  and failover, each with a recorded baseline.

## 11. What it must not do

Name or import any vendor, model, or SDK; own or restate a provider-model rule, an execution-model rule, a governance
rule, a safety rule, or any business truth; mint a governance clearance in production or offer any path to invoke
without one; recreate the container, module host, event bus, error taxonomy, config service, or plugin host; own
prompts, memory, retrieval, tools, reasoning, agent behavior, whole-task orchestration, or scheduling. It realizes
provider operation and nothing else.

## 12. Acceptance criteria (for the build stage, once approved)

- The engine consumes the frozen `@openlance/aios-providers` and `@openlance/aios-runtime` models and the frozen
  substrate, re-owns nothing, and names no vendor or SDK.
- Provider invocation is reachable only through `ProviderExecutor.execute` behind a required `GovernanceClearance`, with
  no production path to invoke an unvalidated request.
- The engine registers through the composition-root seam as a `di` `Module`; the composition root and the Phase 3 chain
  are unchanged.
- Full `pnpm run validate` green; 100% coverage; benchmarks recorded; two independent source audits CLEAN.
- Zero regression: `ai/`, `knowledge/`, the frozen substrate, all thirteen namespaces, and the eight frozen Phase 3
  packages byte-identical; only additive Phase 4 files.

## 13. Design-first checkpoint

Per ADR-0007 and the Stage 1 mandate, implementation stops here pending approval of this design and
[ADR-0035](adr/0035-phase4-operational-layer-and-provider-engine.md). On approval, Stage 1 builds exactly the surface
above, and the concrete vendor adapters remain separate later sub-stages. Stage 2 (Prompt Engine) is not begun.
