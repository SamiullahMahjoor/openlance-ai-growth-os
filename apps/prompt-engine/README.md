# @openlance/aios-prompt-engine

The AIOS **Prompt Engine** (Phase 4, Stage 2): the Runtime's operational prompt subsystem, the operational realization
of the frozen Prompts namespace. It carries out operational **prompt preparation up to expression** (definition
registration, template and inheritance resolution, variable resolution, assembly in the frozen layer order,
normalization, validation) and produces an **execution-ready payload** (a frozen Provider-Engine `ProviderRequest`).

- **Layer:** `app` (`apps/*`), the second executable Phase 4 operational service.
- **Design:** [docs/implementation/33-prompt-engine.md](../../docs/implementation/33-prompt-engine.md).
  **Decision:** [ADR-0036](../../docs/implementation/adr/0036-prompt-engine.md).
- **Stability:** Experimental (Engineering Rule 4).

## What this package is

The operational realization of the frozen `@openlance/aios-prompts` model, sequenced by the runtime. It **consumes,
never recreates**: the prompt model (layers, assembly stages, validation checks, lifecycle phases, and their ordering
predicates) and the Provider Engine's request contract. It re-owns nothing those namespaces own: it never reasons,
retrieves or determines knowledge, assembles the execution context, retains or persists, or executes.

## Single-direction Prompt to Provider

The engine's execution-ready output is a frozen `ProviderRequest` (from `@openlance/aios-provider-engine`), executable
only through that engine's governance-cleared executor. The engine **never invokes** a provider; the dependency is
one-directional, `prompt-engine -> provider-engine`. Governance is honored downstream: the request is inert until
executed behind a `GovernanceClearance` the Prompt Engine never mints or holds. The engine introduces no second
governance model; its `governance-conformance` validation check is a structural presence check that applies, never
restates, governance.

## No vendor knowledge, no caching (ADR-0036)

The engine holds **no vendor knowledge**: no SDK, no vendor request or response model, no API URL, no auth; enforced by
a `src/`-scanning guard test. It also builds **no prompt cache**: a composed prompt is transient and is never stored or
cached (prompt invariants). The registry holds durable prompt **definitions** (architecture, not prompts), an in-memory
operational registry, not storage or versioning.

## Public API (single barrel, Engineering Rule 1)

- `PromptManager` (and `promptEngineModule`, `PROMPT_MANAGER`): the engine facade and its DI module, registered through
  the frozen composition root's extension seam (ADR-0026).
- `PromptRegistry`, `PromptFactory`, `PromptLifecycle`, `PromptTemplateResolver`, `PromptVariableResolver`,
  `PromptAssembler`, `PromptNormalizer`, `PromptValidator`, `PromptCompiler`, `PromptMetrics`, `PromptEvents`,
  `PromptConfiguration`, `PromptPluginBridge`: the operational components.
- `PromptDefinition`, `PromptDefinitionInput`, `PromptPart`, `CompositionInput`, `CompiledPrompt`, `PromptStatistics`,
  `PromptDiagnostics`, `PromptEngineSettings`, `PromptPlugin`, `PromptId`, `VariableName`: the read-only types.
- `PromptError`: a `BaseError` subtype (`infrastructure`) with `PROMPT.*` codes; failures ride the `Result` channel.

## Dependency direction

`@openlance/aios-prompt-engine -> { @openlance/aios-prompts, @openlance/aios-provider-engine, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges,
recorded in `dependency-graph.snapshot.json`). `app -> namespace` (prompts), `app -> app` (provider-engine), and
`app -> substrate` (the rest); all legal, no rule and no namespace edge changes. The composition root, config, and
logging are test-only devDependencies.

## Non-responsibilities

No reasoning, retrieval, context assembly, memory, provider invocation, prompt execution/expression, workflows, tools,
plugin execution, scheduling, governance-rule enforcement, template language, prompt caching/storage/versioning/
authoring, or vendor SDK. It registers definitions and compiles execution-ready payloads, and nothing else.
