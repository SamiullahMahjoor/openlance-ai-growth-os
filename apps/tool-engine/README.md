# @openlance/aios-tool-engine

The AIOS **Tool Engine** (Phase 4, Stage 5): the Runtime's operational tool subsystem, the operational realization of
the frozen Tools namespace. It prepares a validated, governed tool execution over provided tools (**register**,
**discover**, **select**, **resolve** capability inheritance, **validate**, **normalize**, **prepare**), per the frozen
`@openlance/aios-tools` model, and produces a validated `ToolResponse`. It **prepares and stops**; it never carries out
a tool interaction.

- **Layer:** `app` (`apps/*`), the fifth Phase 4 operational service and the third **foundational** one.
- **Design:** [docs/implementation/36-tool-engine.md](../../docs/implementation/36-tool-engine.md).
  **Decision:** [ADR-0039](../../docs/implementation/adr/0039-tool-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-tools` model. It **consumes, never recreates**: the tool
model (lifecycle phases, validation checks, and their predicates). It is **foundational** and depends on **no
operational service**.

## Never executes; never reaches into a provider or prompt; an agent composes those (ADR-0039)

Per the frozen `tool-boundaries`, a tool is **not a provider** and "an agent composes both"; a tool is **carried out by
ai/runtime/**, not by the tool subsystem and not by a provider; and prompts are an abstraction around a tool owned by
ai/prompts/. So the Tool Engine has **no** Provider Engine and **no** Prompt Engine dependency, and it never carries out
a tool interaction. It prepares a validated `ToolExecution` (the selected tool, matched capability, normalized
arguments, and clearance requirement) and stops; the runtime carries it out, and composing a tool with a provider and a
prompt is the Agent Engine's concern (Stage 6).

## Governed, deterministic; no vendor knowledge, no SDK (ADR-0039)

Discovery, selection, capability-inheritance resolution, and the four frozen ordered validation checks (permission,
safety, constitutional, compatibility) are **deterministic and structural**, applying (never restating) the rules owned
by ai/governance/ and ai/safety/. Governance precedes execution: a significant-action tool's clearance is applied, never
minted (the ADR-0035 cleared seam). The engine holds **no vendor knowledge** and **no SDK**, and names no provider. Both
boundaries are enforced structurally by `src/`-scanning guard tests (`no-vendor-knowledge.test.ts` and
`no-cross-boundary.test.ts`).

## Public API (single barrel, Engineering Rule 1)

- `ToolManager` (and `toolEngineModule`, `TOOL_MANAGER`): the engine facade and its DI module, registered through the
  frozen composition root's extension seam (ADR-0026).
- `ToolRegistry`, `ToolFactory`, `ToolLifecycle`, `ToolNormalizer`, `ToolSelector`, `ToolResolver`, `ToolValidator`,
  `ToolExecutor`, `ToolMetrics`, `ToolEvents`, `ToolConfiguration`, `ToolPluginBridge`: the operational components.
- `ToolDefinition`, `ToolCapability`, `ToolParameter`, `ToolCapabilities`, `ToolRequest`, `ToolExecution`,
  `ToolResponse`, `ToolStatistics`, `ToolDiagnostics`, `ToolEngineSettings`, `ToolPlugin`, `ToolId`: the read-only types.
- `ToolError`: a `BaseError` subtype (`infrastructure`) with `TOOL.*` codes; failures ride the `Result` channel.

## Dependency direction

`@openlance/aios-tool-engine -> { @openlance/aios-tools, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges, recorded in
`dependency-graph.snapshot.json`). `app -> namespace` (tools) and `app -> substrate` (the rest); **no** `app -> app`
edge (foundational). All legal, no rule and no namespace edge changes. The composition root, config, and logging are
test-only devDependencies.

## Non-responsibilities

No tool execution or carrying out, network, outside effect, reaching into a provider / prompt / memory / retrieval
engine or any operational service, composing a tool with a provider or prompt, reasoning, retrieval, memory retention,
governance-rule or safety-hazard enforcement, scheduling, or vendor client library / SDK. It prepares a validated,
governed tool execution over provided tools, and nothing else.
