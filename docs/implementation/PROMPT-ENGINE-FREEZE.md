# Prompt Engine, Freeze Declaration (Phase 4, Stage 2)

**Status:** FROZEN (implemented, validated, and independently audited twice CLEAN).
**Package:** `@openlance/aios-prompt-engine` (`apps/prompt-engine`).
**Scope:** Phase 4, Stage 2: the Runtime's operational prompt subsystem, the operational realization of the frozen
Prompts namespace, built on the frozen Phase 2A substrate, the frozen `@openlance/aios-prompts` model, and the Phase 4
Stage 1 `@openlance/aios-provider-engine` request contract, registered through the frozen Phase 3 composition-root seam.
Decision: [ADR-0036](adr/0036-prompt-engine.md) (Accepted). Design: [docs/implementation/33-prompt-engine.md](33-prompt-engine.md).

It is the second operational stage. It performs real preparation work (registration, template and inheritance
resolution, variable resolution, assembly, normalization, validation) but **executes nothing**: it produces an
execution-ready payload for the Provider Engine and never invokes a provider.

## What this stage owns

Operational **prompt preparation up to expression**: prompt definition registration, template and inheritance
resolution, variable resolution, assembly in the frozen layer order, normalization, and validation, per the frozen
`@openlance/aios-prompts` model. Its output is an execution-ready `ProviderRequest`. It re-owns nothing the Prompts or
Provider namespaces own; the run-time carrying and execution of a prompt are the runtime's and the Provider Engine's.

## What was built

| Module | Owns |
|---|---|
| `src/types.ts` | the neutral public types (`PromptPart`, `PromptDefinition`, `PromptDefinitionInput`, `CompositionInput`, `CompiledPrompt`, `PromptStatistics`, `PromptDiagnostics`); type-only, excluded from coverage |
| `src/errors.ts` | `PromptError` (a `BaseError` subtype, `infrastructure`, `PROMPT.*` codes) |
| `src/registry.ts` | `PromptRegistry` (register / has / get / list / unregister of durable definitions) |
| `src/factory.ts` | `PromptFactory` (validates + freezes a `PromptDefinition`) |
| `src/lifecycle.ts` | `PromptLifecycle` (consumes `PROMPT_LIFECYCLE_PHASES` / `promptPhaseAtOrAfter`) |
| `src/template-resolver.ts` | `PromptTemplateResolver` (bounded, acyclic inheritance resolution) |
| `src/variable-resolver.ts` | `PromptVariableResolver` (own-property variable substitution, strict / non-strict) |
| `src/assembler.ts` | `PromptAssembler` (composes in `PROMPT_LAYERS` order via `promptLayerAtOrAfter`) |
| `src/normalizer.ts` | `PromptNormalizer` (structural normalization) |
| `src/validator.ts` | `PromptValidator`, `VALIDATION_ERROR_CODES` (the frozen `PROMPT_VALIDATION_CHECKS` in order) |
| `src/compiler.ts` | `PromptCompiler` (drives the frozen `PROMPT_ASSEMBLY_STAGES`; builds the `ProviderRequest`) |
| `src/metrics.ts` | `PromptMetrics` |
| `src/events.ts` | `PromptEvents`, `PROMPT_EVENT_TYPES` (consumes frozen `createEvent` / `EVENT_BUS`) |
| `src/configuration.ts` | `PromptConfiguration`, `PromptEngineSettings`, `DEFAULT_SETTINGS` |
| `src/plugin-bridge.ts` | `PromptPluginBridge`, `PromptPlugin` (consumes the frozen `PluginManifest` type) |
| `src/manager.ts` | `PromptManager` (the facade + DI entry), `PromptManagerOptions` |
| `src/module.ts` | `promptEngineModule`, `PROMPT_MANAGER` (the `di` `Module` + token) |
| `src/index.ts` | the single explicit barrel (no wildcard) |

Not built: `PromptCache` (constitutionally not owned; see below).

## Single-direction Prompt to Provider

The execution-ready output is a frozen `ProviderRequest` (`{ capability, payload: { prompt } }`) built by the compiler.
`ProviderRequest` and `Capability` are consumed as types from `@openlance/aios-provider-engine`; the engine **never**
invokes a provider (no reference to the Provider Engine's executor or `GovernanceClearance`). The dependency is
one-directional, `prompt-engine -> provider-engine` (a legal `app -> app` edge). Governance is honored downstream: the
request is inert until executed behind a clearance the Prompt Engine never mints or holds. The engine introduces **no
second governance model**; its `governance-conformance` validation check is a structural presence check that applies,
never restates, governance.

## No vendor knowledge, no caching (ADR-0036)

The engine holds **no vendor knowledge** (no vendor client library, request or response model, API URL, or auth);
enforced by a `src/`-scanning guard test whose forbidden set includes every ADR-0035 vendor plus `sdk`, URL, and auth
tokens. It builds **no prompt cache**: a composed prompt is transient and is never stored or cached (prompt
invariants). The registry holds durable prompt **definitions** ("a durable definition persists as architecture, not as
a prompt"), an in-memory operational registry, not storage or versioning.

## Consume, never recreate

Consumes the frozen `@openlance/aios-prompts` model (`PROMPT_LAYERS`, `PROMPT_ASSEMBLY_STAGES`,
`PROMPT_VALIDATION_CHECKS`, `PROMPT_LIFECYCLE_PHASES` and the four ordering predicates), the `@openlance/aios-provider-engine`
request contract, and the frozen substrate (`di` token/`Module`, `events` `createEvent`/`EVENT_BUS`, `errors`
`BaseError`/`Result`, `plugins` `PluginManifest` type, `kernel`). It recreates no container, event bus, dispatcher,
error taxonomy, config service, or plugin host, and registers through the frozen composition-root extension seam
(ADR-0026 `CompositionConfig.modules`) as one `di` `Module`.

## Immutability

The built `PromptDefinition` (and its parts array and each part), the template resolver's and variable resolver's
returned parts, the `CompiledPrompt` (and its `request` and `request.payload`), `PromptStatistics`, `PromptDiagnostics`,
the adopted-ids array, and the module consts (`PROMPT_EVENT_TYPES`, `DEFAULT_SETTINGS`, config settings) are all
`Object.freeze`d. Both audits verified the freezes empirically.

## Dependency graph

`@openlance/aios-prompt-engine -> { @openlance/aios-prompts, @openlance/aios-provider-engine, @openlance/aios-di,
@openlance/aios-events, @openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (its `src/` edges,
recorded in `dependency-graph.snapshot.json`). `app -> namespace` (prompts), `app -> app` (provider-engine, the first
operational-service to operational-service edge), and `app -> substrate` (the rest); all legal, no dependency-cruiser
rule and no namespace edge changed. The composition root, config, and logging are test-only devDependencies.

## Validation and audits

- Full `pnpm run validate` green end to end (typecheck, lint, format:check, depcruise, arch:check 10/10, graph:check,
  docs-check 34 packages / 36 ADRs / 255 constitution ids, test, bench, docs, build).
- 100% statements / branches / functions / lines coverage across all 16 executable modules (barrel and the type-only
  `types.ts` excluded per ADR-0015); 41 tests; benchmarks recorded (register, compile, resolve-variables, normalize,
  validate, assemble); no `.only` / `.skip`.
- Two independent source audits, both CLEAN (no Critical/High/Medium). Audit 1 (constitutional ownership, boundaries,
  single-direction, no-second-governance, no-cache, vendor neutrality, traceability) and Audit 2 (dependency,
  immutability, determinism, implementation correctness, coverage honesty, regression). Low findings raised were all
  addressed: own-property variable resolution (`Object.hasOwn`, so a prototype-chain name cannot masquerade as a
  supplied variable); the guard's forbidden set extended to `sdk`; and three design-doc wording corrections (the
  lifecycle composability predicate, the assembler-versus-validator attribution of context separation, and the
  compiler stage-order wording).

## Regression

`ai/` and `knowledge/` byte-identical; the frozen Phase 2A substrate, all 13 frozen namespaces, the eight frozen Phase
3 packages, and the frozen Phase 4 Stage 1 Provider Engine unchanged (`git diff HEAD -- ai/ knowledge/ packages/
apps/provider-engine .dependency-cruiser.cjs tools/` empty). The change set is the new `apps/prompt-engine/` package,
ADR-0036, the design doc, this freeze doc, the ADR index row, the graph snapshot, and `pnpm-lock.yaml`.

## What "frozen" means

The Prompt Engine's public API, the single-direction Prompt-to-Provider contract (it produces a `ProviderRequest` and
never invokes a provider), the no-vendor-knowledge and no-cache invariants, the consume-not-recreate boundary, the
deterministic composition and validation, the fail-closed `Result` contract, the immutable return shapes, and the
dependency edges are settled for Stage 2. The real governance enforcement (the clearance minter) and the actual
execution of a compiled prompt are the Provider Engine's and later Phase 4 stages', not part of this stage.

## Allowed changes (no architecture review required)

Only compiler compatibility, security vulnerabilities, dependency updates, and critical bug fixes may change a frozen
prompt-engine file without an architecture change process, each still running the full validation pipeline. Any change
to the public API, the no-vendor-knowledge or no-cache invariant, the single-direction Prompt-to-Provider contract, the
consume-not-recreate boundary, the fail-closed contract, or the dependency edges is an architectural modification
requiring a new or superseding ADR, an architecture review, an independent audit, and full validation.

## Do not begin Stage 3

Phase 4 Stage 3 (Memory Engine) is not started. It is a separate, design-first stage.

## Full validation pipeline (must pass green for any change)

```
pnpm install --frozen-lockfile
pnpm run validate
  = typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build
```
