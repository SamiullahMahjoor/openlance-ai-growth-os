# Tool Engine, Freeze Declaration (Phase 4, Stage 5)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-tool-engine` (`apps/tool-engine`).
**Scope:** Phase 4, Stage 5: the Runtime's operational tool subsystem, the operational realization of the frozen Tools
namespace, built on the frozen Phase 2A substrate and the frozen `@openlance/aios-tools` model, and registered through
the frozen Phase 3 composition-root seam. Decision: [ADR-0039](adr/0039-tool-engine.md) (Accepted). Design:
[docs/implementation/36-tool-engine.md](36-tool-engine.md).

It is the fifth operational stage. It performs real tool preparation (register, discover, select, resolve capability
inheritance, validate, normalize, prepare) but **carries out nothing**: it prepares the model of a bounded tool
interaction and stops.

## What this stage owns

Operational tool preparation: **registering** a tool, **discovering** the tools that declare a needed capability,
**selecting** one deterministically, **resolving** its single-and-acyclic capability inheritance, **validating** it
through the four frozen ordered checks, **normalizing** names, and **preparing** a validated, governed `ToolExecution`,
per the frozen `@openlance/aios-tools` model. It re-owns nothing the Tools namespace owns; carrying out a tool
interaction is the runtime's, composing a tool with a provider and a prompt is the agent's, and the governance rules and
safety hazards the validation applies are governance's and safety's.

## The Ambiguity Gate (resolved)

The mandate listed the Provider Engine and Prompt Engine as dependencies and directed that "tool execution must delegate
through the frozen Provider Engine." That conflicts with three frozen invariants: a tool is **not a provider** and "an
agent composes both" (`tool-boundaries` `provider-and-intelligence`); a tool is **carried out by ai/runtime/**, not by a
provider (`executed-by-runtime-owns-no-intelligence`, `tool-execution.md`); and prompts are an abstraction around a tool
owned by ai/prompts/. The gate was raised and the approved resolution (ADR-0039, Decision 2) is: the Tool Engine
consumes **no** operational service; composing a tool with a provider and a prompt is the Agent Engine's concern (Stage
6), which the Agents namespace names as its owner "in future."

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`ToolDefinition`, `ToolCapability`, `ToolParameter`, `ToolCapabilities`, `ToolRequest`, `ToolExecution`, `ToolResponse`, `ToolStatistics`, `ToolDiagnostics`, `ToolId`); type-only, excluded from coverage |
| `src/errors.ts` | `ToolError` (a `BaseError` subtype, `infrastructure`, `TOOL.*` codes) |
| `src/registry.ts` | `ToolRegistry` (register / has / get / list / unregister of tools) |
| `src/normalizer.ts` | `ToolNormalizer` (structural normalization of names) |
| `src/factory.ts` | `ToolFactory` (validates + freezes a `ToolDefinition`; fails closed on blank id, no capabilities, blank/duplicate capability, or blank parameter; normalizes the id, names, and base) |
| `src/lifecycle.ts` | `ToolLifecycle` (consumes `TOOL_LIFECYCLE_PHASES` / `toolPhaseAtOrAfter`) |
| `src/selector.ts` | `ToolSelector` (the `discover` and `select` steps, deterministic, over declared capabilities) |
| `src/resolver.ts` | `ToolResolver` (single, acyclic capability-inheritance resolution; fails closed on unknown base or cycle) |
| `src/validator.ts` | `ToolValidator`, `VALIDATION_ERROR_CODES` (consumes `TOOL_VALIDATION_CHECKS` / `toolValidationCheckAtOrAfter`) |
| `src/executor.ts` | `ToolExecutor` (prepares the validated execution; carries nothing out) |
| `src/metrics.ts` | `ToolMetrics` |
| `src/events.ts` | `ToolEvents`, `TOOL_EVENT_TYPES` (consumes frozen `createEvent` / the injected `EventBus`) |
| `src/configuration.ts` | `ToolConfiguration`, `ToolEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `ToolPluginBridge`, `ToolPlugin` (adopts tool-carrying plugins atomically; consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `ToolManager` (the facade + DI entry), `ToolManagerOptions` |
| `src/module.ts` | `toolEngineModule`, `TOOL_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

## Prepares, never executes; a tool is not a provider; no vendor knowledge

Discovery, selection, inheritance resolution, and the four frozen validation checks are **deterministic and
structural**. The engine produces a `ToolExecution` model (the selected tool, the matched capability, the arguments
copied through, and the clearance requirement) and **carries out nothing**: it opens no network and produces no outside
effect (carrying out is the runtime's, per `tool-execution.md`). It is **not a provider** and names none; capabilities
are technology-neutral (`tool-capabilities`). It holds **no vendor knowledge and no vendor client library**. Both
boundaries are enforced structurally by `src/`-scanning guard tests: `no-vendor-knowledge.test.ts` (no vendor / client
library / URL / auth token) and `no-cross-boundary.test.ts` (no import of a provider, prompt, memory, retrieval, agent,
reasoning, or runtime package).

## Governance precedes execution, applied not minted

Validation runs the frozen `TOOL_VALIDATION_CHECKS` in order (permission, safety, constitutional, compatibility),
conjunctive and fail-closed. Permission is applied against the request's permission set; an invocation that would leave
the tool's declared, bounded capability surface is refused; a significant-action tool (`requiresClearance`) must carry a
governance clearance the engine **applies but never mints** (the ADR-0035 cleared seam); and the arguments must satisfy
the capability's required parameters. The engine restates no governance rule and no hazard
(`validation-defines-what-and-order-never-the-rule-or-hazard`).

## No operational-service dependency

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-tool-engine -> {
@openlance/aios-tools, @openlance/aios-di, @openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors,
@openlance/aios-kernel }` (six). `app -> namespace` (tools) and `app -> substrate` (the rest); there is **no** `app ->
app` edge, and specifically no edge to the Provider, Prompt, Memory, or Retrieval engine. All legal, no dependency-cruiser
rule and no namespace edge changed. The composition root, config, and logging are test-only devDependencies.

## Consume, never recreate

Consumes the frozen `@openlance/aios-tools` model (`TOOL_LIFECYCLE_PHASES`, `TOOL_VALIDATION_CHECKS`, and the predicates
`toolPhaseAtOrAfter` / `toolValidationCheckAtOrAfter`) and the frozen substrate. It recreates no container, event bus,
error taxonomy, or plugin host, and registers through the frozen composition-root extension seam (ADR-0026
`CompositionConfig.modules`) as one `di` `Module`.

## Determinism and immutability

Selection ordering is total and environment-independent: ties break by the lowest id in UTF-16 lexicographic (code-unit)
order. The built `ToolResponse`, its `ToolExecution`, and the execution's `arguments`, together with the `ToolDefinition`
and its `capabilities` / `parameters` arrays, the statistics and diagnostics views, and the module consts, are all
`Object.freeze`d; the registry and selection return fresh arrays; the resolver copies its chain rather than mutating it;
`ToolPluginBridge.adopt` is atomic (it validates and conflict-checks the whole batch before registering any). Both
audits verified the freezes and the determinism empirically.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 37 packages / 39 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 15 executable modules (the barrel and the
  type-only `types.ts` excluded per ADR-0015); 31 tests across 4 files; benchmarks recorded (registration, discovery,
  selection, validation, execution preparation, execution, normalization); no `.only` / `.skip`.
- Two independent source audits, both CLEAN. Audit 1 (constitutional: ownership, the resolved provider/prompt gate,
  never-executes, consume-not-recreate, vendor neutrality, governance-applied-not-minted, composition-root seam, ADR
  traceability) finished CLEAN on the first pass. Audit 2 (correctness: determinism, edge cases, coverage honesty, error
  propagation, immutability, regression) raised two Medium and several Low, all addressed and re-verified: the lifecycle
  active window now excludes retirement; `ToolPluginBridge.adopt` is now atomic; the factory normalizes the id and base;
  the empty-string required-argument contract is pinned; and the "normalized arguments" doc drift is corrected.

## Known design (intentional, not defects)

- **Discovery is over declared capabilities** (`tool-lifecycle`: "discoverable by declared capabilities"); a
  capability available only by inheritance is surfaced by declaring it. Resolving every registered tool during discovery
  was rejected because one malformed base would then poison every preparation; inheritance is resolved for the selected
  tool before validation, and the resolver's merge/override is unit-tested directly.
- **`validate()` runs a fixed check sequence** that matches the frozen `TOOL_VALIDATION_CHECKS`;
  `checksInConstitutionalOrder()` proves the frozen list order over `toolValidationCheckAtOrAfter`.

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase 3
packages, and the frozen Phase 4 Stages 1-4 (Provider, Prompt, Memory, Retrieval engines) unchanged (`git diff HEAD --
ai/ knowledge/ packages/ apps/provider-engine apps/prompt-engine apps/memory-engine apps/retrieval-engine
.dependency-cruiser.cjs tools/` empty). The change set is the new `apps/tool-engine/` package, ADR-0039, the design doc,
this freeze doc, the ADR index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Tool Engine's public API, the prepares-not-executes boundary, the not-a-provider / no-vendor-knowledge invariants,
the no-operational-service-dependency (and specifically no-provider, no-prompt) boundary, the consume-not-recreate
boundary, the deterministic and structural discover / select / resolve / validate, the governance-applied-not-minted
seam, the fail-closed `Result` contract, the immutable return shapes, and the dependency edges are settled for Stage 5.
Carrying out a tool interaction, composing a tool with a provider and a prompt, and enforcing tool governance are later
stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
tool-engine file without an architecture change process, each still running the full validation pipeline. Any change to
the public API, the prepares-not-executes boundary, the not-a-provider or no-vendor-knowledge invariant, the
no-operational-service-dependency boundary, the consume-not-recreate boundary, the fail-closed contract, or the
dependency edges is an architectural modification requiring a new or superseding ADR, an architecture review, an
independent audit, and full validation.

## Do not begin Stage 6

Phase 4 Stage 6 (the Agent Engine, which composes tools, providers, and prompts) is not started. It is a separate,
design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
