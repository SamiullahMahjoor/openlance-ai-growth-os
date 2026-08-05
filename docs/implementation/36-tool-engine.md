# 36. Tool Engine implementation design (Phase 4, Stage 5)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 5).** Built design-first per ADR-0007.
[ADR-0039](adr/0039-tool-engine.md) is Accepted. Package: `apps/tool-engine` (`@openlance/aios-tool-engine`).

## 1. Mandate and scope

Stage 5 builds the **Tool Engine**: the Runtime's operational tool subsystem, the operational realization of the frozen
Tools namespace. It carries out operational tool preparation over the frozen tool model: **register** a tool,
**discover** the tools that declare a needed capability, **select** one deterministically, **resolve** its
single-and-acyclic capability inheritance, **validate** it through the four frozen ordered checks, **normalize** the
requested capability name, and **prepare** a validated, governed `ToolExecution` (the invocation arguments are copied
through, their values preserved). It **prepares and stops**; it never carries out a tool
interaction, opens no network, and produces no outside effect.

Per [ADR-0039](adr/0039-tool-engine.md), it consumes only the frozen tools model and the substrate, and it is
**foundational**: it depends on no operational service. It follows the ADR-0035 operational discipline (apps/ package,
composition-root seam, no vendor knowledge).

It owns only operational tool preparation. It does not own provider execution, prompt preparation, memory, retrieval,
workflow orchestration, reasoning, governance, or scheduling.

## 2. The Ambiguity Gate (resolved) and the invariants

- **The mandate's "consume Provider Engine and Prompt Engine" and "delegate execution through the Provider Engine" were
  a frozen-boundary conflict.** The frozen `tool-boundaries` `provider-and-intelligence` boundary states a tool is "not
  a provider ... and **an agent composes both**"; the `executed-by-runtime-owns-no-intelligence` invariant and
  `tool-execution.md` assign carrying out a tool to `ai/runtime/`; and the Agents namespace owns composing a tool with a
  provider and a prompt, "in future." The gate was raised and the approved resolution (ADR-0039, Decision 2) is: the
  Tool Engine consumes **no** operational service; composing a tool with a provider and a prompt is the Agent Engine's
  concern (Stage 6).
- **Prepares, never executes.** It produces a `ToolExecution` model (the selected tool, the normalized matched
  capability, the arguments copied through with their values preserved, and the clearance requirement) and stops; the
  runtime carries it out (`tool-execution.md`).
- **Governance precedes execution (ADR-0035), applied not minted.** The four frozen checks run in order; the clearance a
  significant-action tool needs is applied, never minted (the ADR-0035 cleared seam).
- **No vendor knowledge and no SDK** (ADR-0035 invariant); capabilities are technology-neutral and name no provider.
  Both are enforced by guard tests.

## 3. Component inventory (implemented)

Every component consumes frozen truth and owns only operational preparation. Grouped by concern:

**Tools and lifecycle.**
- **Tool types.** `ToolDefinition` (a tool: id, declared `capabilities`, optional `basedOn` base tool, and
  `requiresClearance`), `ToolCapability` / `ToolParameter` / `ToolCapabilities` (a declared capability and its
  parameters), `ToolRequest` (a capability need, its arguments, and the governance-permitted tool ids and clearance the
  engine applies), `ToolExecution` (the prepared, bounded interaction the runtime carries out), `ToolResponse` (the
  validated preparation response).
- **`ToolRegistry`.** Registers, discovers, and looks up tools by id; deterministic order; no duplicate id (fails
  closed); `unregister`.
- **`ToolFactory`.** Validates a tool input and builds an immutable `ToolDefinition`, normalizing capability and
  parameter names; fails closed on a blank id, no capabilities, a blank capability name, a duplicate capability name, or
  a blank parameter name.
- **`ToolLifecycle`.** Consumes `TOOL_LIFECYCLE_PHASES` and `toolPhaseAtOrAfter`; exposes the ordered phases, the
  predicate, and whether a phase is active (at or after activation).
- **`ToolNormalizer`.** Normalizes the id, a capability or parameter name, and the requested-capability name to a
  consistent structural form (names only; it never alters an argument value).

**Preparation (drives the frozen selection, resolution, and validation).**
- **`ToolSelector`.** `discover` (the tools whose declared capabilities include the need) and `select` (the deterministic
  single choice by a defined id tiebreak). Deterministic and structural, over provided tools only; it matches, it does
  not reason.
- **`ToolResolver`.** Resolves a tool's single-and-acyclic capability inheritance from its `basedOn` chain (a derived
  capability overrides a base one of the same name); fails closed on an unknown base or an inheritance cycle. It reads
  the registry only; it loads and executes nothing.
- **`ToolValidator`.** Runs the frozen `TOOL_VALIDATION_CHECKS` in order (permission, safety, constitutional,
  compatibility), conjunctive and fail-closed: an impermissible tool, an undeclared capability, a missing clearance, or
  an unsatisfied required parameter is refused. It applies, never restates, the rules owned by ai/governance/ and
  ai/safety/. It consumes `toolValidationCheckAtOrAfter` to prove the frozen check order.
- **`ToolExecutor`.** Prepares the validated tool execution: discover, select, resolve inheritance, validate, then
  assemble the `ToolExecution` and the validated `ToolResponse`, or a refusal. It **prepares and stops**; it carries
  nothing out.

**Observability and cross-cutting.**
- **`ToolMetrics`, `ToolStatistics`, `ToolDiagnostics`.** Operational counters (registrations, preparations, successes,
  failures, validation failures) and a read-only view.
- **`ToolEvents`, `TOOL_EVENT_TYPES`.** Emits framework events (registered, prepared, failed) via the frozen
  `createEvent` and the injected `EventBus`.
- **`ToolConfiguration`, `ToolEngineSettings`.** Engine-owned operational settings (`strictPermission`).
- **`ToolError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `TOOL.*` codes.
- **`ToolPluginBridge`, `ToolPlugin`.** Adopts tool-carrying plugins into the registry, consuming the frozen
  `PluginManifest` type and validating each tool through the `ToolFactory`.
- **`ToolManager`.** The facade and DI entry (`TOOL_MANAGER`): register a tool, prepare a validated execution for a
  request, remove a tool, and read statistics and diagnostics; drives the frozen model and emits events.
- **`toolEngineModule`, `TOOL_MANAGER`.** The `di` `Module` and token, registered through the frozen composition-root
  seam (ADR-0026).

## 4. Consume, never recreate

| Concern | Owned by (frozen) | Stage 5 disposition |
|---|---|---|
| The tool model: lifecycle phases, validation checks, capabilities, boundaries, and predicates | `@openlance/aios-tools` (Phase 2B) | consume the arrays and predicates; restate none |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Provider execution, prompt preparation, retained memory, knowledge retrieval, reasoning, governance rules, safety hazards, runtime scheduling, and the composition of a tool with a provider | ai/providers, ai/prompts, ai/memory, ai/retrieval, ai/reasoning, ai/governance, ai/safety, ai/runtime, ai/agents, and the prior engines | referenced by boundary; the engine reaches into none of them and depends on no operational service |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 5. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-tool-engine -> {
@openlance/aios-tools, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (tools) and `app -> substrate` (the rest); all legal, no rule and no
namespace edge changes. There is **no** `app -> app` edge: the Tool Engine is foundational and reaches into no
operational service (in particular, not the Provider Engine or Prompt Engine). The composition root, config, and logging
are test-only devDependencies.

## 6. What it must not do

Execute or carry out a tool interaction, open a network, produce an outside effect, reach into a provider engine, a
prompt engine, or any operational service, compose a tool with a provider or a prompt, reason, retrieve, retain memory,
evaluate or restate a governance rule or a safety hazard, schedule or orchestrate, or name a vendor / import a client
library or SDK. It prepares a validated, governed tool execution over provided tools and stops, and nothing else.

## 7. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrel and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / no capabilities / blank capability / duplicate
  capability / blank parameter), lifecycle, normalizer, selector (discover, select, tiebreak), resolver (inheritance
  merge and override, unknown base, cycle), validator (each frozen check and its failure, and the frozen order),
  executor (the full preparation plus each refusal), metrics, events, configuration, plugin bridge, and the manager.
  Plus the no-vendor-knowledge and no-cross-boundary guards.
- **Fail-closed.** The public API never throws; every failure is a `Result` error.
- **Benchmarks (ADR-0022 Rule 5).** Registration, discovery, selection, validation, execution preparation, execution,
  and normalization, each with a recorded baseline.

## 8. Design-first checkpoint (met)

Per ADR-0007, ADR-0039 and this design are the Stage 5 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 6 (the Agent Engine, which composes tools,
providers, and prompts) is not begun.
