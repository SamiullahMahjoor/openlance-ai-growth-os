# Agent Engine, Freeze Declaration (Phase 4, Stage 7)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-agent-engine` (`apps/agent-engine`).
**Scope:** Phase 4, Stage 7: the Runtime's operational agent subsystem and the **first orchestration engine**, the
operational realization of the frozen Agents namespace, built on the frozen Phase 2A substrate, the frozen
`@openlance/aios-agents` model, and the six Phase 4 engines, and registered through the frozen Phase 3 composition-root
seam. Decision: [ADR-0041](adr/0041-agent-engine.md) (Accepted). Design:
[docs/implementation/38-agent-engine.md](38-agent-engine.md).

It is the seventh operational stage and the first **orchestration** one: the composition owner. It performs real
composition work (compose steps, validate capabilities and permissions, coordinate an acyclic topology) but **executes
nothing**: it produces an immutable `AgentExecutionPlan` and stops.

## What this stage owns

Operational agent composition: registering agent definitions (identity, capabilities, permissions, specialization), and,
for a request, **composing** the agent's steps over the six operational engines, **validating** them against the agent's
capabilities and permissions, **coordinating** any multi-agent topology (bounded, directed, acyclic), and **producing**
an immutable `AgentExecutionPlan`, per the frozen `@openlance/aios-agents` model. It re-owns nothing the Agents namespace
or any engine owns; executing the plan (invoking each engine, sequencing and combining their results, selecting a
provider, minting a clearance) is the runtime's, a later stage.

## No Ambiguity Gate; the two clarifications (ADR-0041)

No gate fired: the mandate is aligned with the frozen model (an agent composes the six operational namespaces and owns
none, and never orchestrates, schedules, or executes). ADR-0041 records two genuine architectural decisions: the Agent
Engine is the first **orchestration** engine, composing all six foundational engines through `app -> app` edges (legal:
no dependency-cruiser rule and no architectural-regression scenario forbids an `apps/` edge; the single-direction
`prompt-engine -> provider-engine` edge of ADR-0036 preceded them); and it composes a **static plan** and never executes
or combines results (ADR-0035: "Runtime sequences and combines their results").

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`AgentDefinition`, `AgentDefinitionInput`, `AgentCapability`, `AgentStep`, `AgentLink`, `AgentRequest`, `AgentExecutionPlan`, `AgentStatistics`, `AgentDiagnostics`, `AgentId`); type-only, excluded from coverage |
| `src/errors.ts` | `AgentError` (a `BaseError` subtype, `infrastructure`, `AGENT.*` codes) |
| `src/registry.ts` | `AgentRegistry` (register / has / get / list / unregister of agents) |
| `src/normalizer.ts` | `AgentNormalizer` (structural normalization) |
| `src/factory.ts` | `AgentFactory`, `AGENT_CAPABILITIES` (validates + freezes an `AgentDefinition`; fails closed on blank id, no capabilities, invalid capability, permission exceeding capability, or blank specialization; least privilege) |
| `src/lifecycle.ts` | `AgentLifecycle` (consumes `AGENT_LIFECYCLE_PHASES` / `agentPhaseAtOrAfter`) |
| `src/composer.ts` | `AgentComposer` (composes bounded steps within the agent's held capabilities; deeply frozen) |
| `src/validator.ts` | `AgentValidator` (applies the agent's permissions to each step, least privilege) |
| `src/coordinator.ts` | `AgentCoordinator` (validates a bounded, directed, acyclic coordination topology; deeply frozen) |
| `src/planner.ts` | `AgentPlanner` (composes the immutable `AgentExecutionPlan`; invokes no engine) |
| `src/metrics.ts` | `AgentMetrics` |
| `src/events.ts` | `AgentEvents`, `AGENT_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `AgentConfiguration`, `AgentSettings` (`maxSteps`, `maxLinks`), `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `AgentPluginBridge`, `AgentPlugin` (adopts agent-carrying plugins atomically; consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `AgentManager` (the facade + DI entry), `AgentManagerOptions` |
| `src/module.ts` | `agentEngineModule`, `AGENT_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Composition owner: legal app -> app edges; composes a static plan; never executes

The Agent Engine consumes each of the six engines' public **request contracts** (`ReasoningRequest`, `RetrievalRequest`,
`MemoryRequest`, `CompositionInput`, `ToolRequest`, `ProviderNeed`) to type the plan's steps, imports each only through
its public barrel, recreates none, and keeps each independently replaceable. It produces an immutable
`AgentExecutionPlan` (the agent, task, validated steps, validated coordination) and **carries out nothing**: it invokes
no engine, sequences and combines no results, opens no network, mints no clearance, and never selects a provider or
model (a provider step carries a provider-neutral `ProviderNeed`). It holds **no vendor knowledge**. Both boundaries are
enforced structurally by `src/`-scanning guard tests: `no-vendor-knowledge.test.ts` and `no-execution.test.ts` (which
forbids execution / scheduling calls and any of the six engines' executing managers, executors, modules, or tokens; the
agent's own `AgentManager` / `AGENT_MANAGER` are permitted).

## Governed, bounded, deterministic

An agent acts only within its **capabilities** (held) and its **permissions** (least privilege, a subset of its
capabilities; the factory enforces `permissions ⊆ capabilities`), and its composition and coordination are **bounded**
(`maxSteps`, `maxLinks`) and its coordination directed and **acyclic**. A step outside the agent's capabilities or
permissions, a plan or topology that exceeds its bound, or a coordination that would form a cycle, is refused.
Governance is applied, never defined or minted. The same agent, request, and rules always produce the same plan (no
`Date`, no randomness; the injected `Clock` stamps only event `occurredAt`).

## No operational-service dependency inversion; acyclic

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-agent-engine -> { agents,
provider-engine, prompt-engine, memory-engine, retrieval-engine, tool-engine, reasoning-engine, di, events, plugins,
errors, kernel }` (twelve). `app -> namespace` (agents), `app -> app` (the six engines), and `app -> substrate` (the
rest). All legal: no dependency-cruiser rule and no architectural-regression scenario forbids an `apps/` edge, the graph
stays acyclic (none of the six engines depends on the agent-engine), and every engine is imported only through its public barrel. The
composition root, config, and logging are test-only devDependencies.

## Consume, never recreate

Consumes the frozen `@openlance/aios-agents` model (`AGENT_LIFECYCLE_PHASES` and the predicate `agentPhaseAtOrAfter`)
and the six engines' request contracts, and the frozen substrate. `AGENT_CAPABILITIES` (the six operational namespaces)
is grounded in the frozen composition-boundary prose, not a recreation of a frozen enum (none exists). It recreates no
container, event bus, error taxonomy, or plugin host, and registers through the frozen composition-root extension seam
(ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Immutability

The built `AgentExecutionPlan`, its `steps` and `coordination` arrays, and each step and link wrapper are all
`Object.freeze`d, and the arrays and wrappers are copies independent of the caller's input (so a caller mutating a
retained input step or link cannot reassign a validated plan's `capability` / `supervisor` / `worker`); the
`AgentDefinition`, its `capabilities` and `permissions` arrays, the statistics and diagnostics views, and the module
consts are frozen; the registry returns fresh arrays; `AgentPluginBridge.adopt` is atomic. Both audits verified the
freezes and the copy-independence empirically.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 39 packages / 41 ADRs / 255 constitution ids, test, bench, docs, build). The depcruise, arch:check, and
  graph:check pass with the six new `app -> app` edges.
- 100% statements / branches / functions / lines coverage across all 15 executable modules (the barrel and the type-only
  `types.ts` excluded per ADR-0015); 29 tests across 4 files; benchmarks recorded (registration, planning, composition,
  validation, normalization, execution-plan generation); no `.only` / `.skip`.
- Two independent source audits, both CLEAN. Audit 1 (constitutional: composition ownership, the legal `app -> app`
  edges, composes-a-static-plan-never-executes, never-selects-a-provider, consume-not-recreate, governance
  applied-not-minted, composition-root seam, ADR traceability) confirmed the substance sound; one Medium documentation
  finding (an overstated "first `app -> app` edges in the repository" claim contradicting the Accepted ADR-0036) was
  corrected in ADR-0041 and the design doc. Audit 2 (correctness: determinism, immutability, purity, cycle detection,
  coverage honesty, regression) raised one Medium and three Low, addressed and re-verified: the plan is now deeply
  frozen (step and link wrappers, not just the arrays); the coordination topology is bounded (`maxLinks`) so the cycle
  DFS cannot overflow; and the tests now pin copy-independence and element-frozen-ness.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase 3
packages, and the frozen Phase 4 Stages 1-6 (Provider, Prompt, Memory, Retrieval, Tool, Reasoning engines) unchanged
(`git diff HEAD -- ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine apps/memory-engine
apps/retrieval-engine apps/tool-engine apps/reasoning-engine .dependency-cruiser.cjs tools/ scripts/` empty). The change
set is the new `apps/agent-engine/` package, ADR-0041, the design doc, this freeze doc, the ADR index row, the graph
snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Agent Engine's public API, the composes-not-executes boundary, the composition-owner `app -> app` edges (consuming
the six engines' contracts, re-owning none), the no-vendor-knowledge and never-selects-a-provider invariants, the
consume-not-recreate boundary, the deterministic and bounded composition / validation / coordination, the
governance-applied-not-minted seam, the fail-closed `Result` contract, the immutable return shapes, and the twelve
dependency edges are settled for Stage 7. Executing an `AgentExecutionPlan` (invoking the engines, sequencing and
combining their results, selecting providers, minting clearances) is the Runtime Execution Engine's (Stage 8), not part
of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
agent-engine file without an architecture change process, each still running the full validation pipeline. Any change to
the public API, the composes-not-executes boundary, the composition-owner edge set, the no-vendor-knowledge or
never-selects-a-provider invariant, the consume-not-recreate boundary, the fail-closed contract, or the dependency edges
is an architectural modification requiring a new or superseding ADR, an architecture review, an independent audit, and
full validation.

## Do not begin Stage 8

Phase 4 Stage 8 (the Runtime Execution Engine, which executes the plans this engine composes) is not started. It is a
separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
