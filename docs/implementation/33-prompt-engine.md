# 33. Prompt Engine implementation design (Phase 4, Stage 2)

**Status: IMPLEMENTED and frozen (Phase 4, Stage 2).** Built design-first per ADR-0007.
[ADR-0036](adr/0036-prompt-engine.md) is Accepted. Package: `apps/prompt-engine` (`@openlance/aios-prompt-engine`).

## 1. Mandate and scope

Stage 2 builds the **Prompt Engine**: the Runtime's operational prompt subsystem, the operational realization of the
frozen Prompts namespace. It carries out operational **prompt preparation up to expression**: definition registration,
template and inheritance resolution, variable resolution, assembly in the frozen layer order, normalization, and
validation, producing an **execution-ready payload** (a frozen Provider-Engine `ProviderRequest`).

Per [ADR-0036](adr/0036-prompt-engine.md), it consumes the frozen `@openlance/aios-prompts` model and the Provider
Engine's request contract, and re-owns neither prompt semantics nor execution. It follows the ADR-0035 operational
discipline (apps/ package, composition-root seam, no vendor knowledge, governed execution downstream).

It owns only operational prompt preparation. It does not own reasoning, retrieval, memory, the execution context
assembly, provider execution, governance rules, a template language, prompt content, prompt storage, prompt versioning,
prompt authoring, or prompt caching.

**Constitutional invariant (ADR-0035, carried forward): the Prompt Engine never contains vendor knowledge.** No SDK, no
vendor request or response model, no API URL, no authentication; enforced by a `src/`-scanning guard test.

## 2. Constitutional review performed (from source, this session)

Read from origin: `ai/prompts/README.md`; the frozen `@openlance/aios-prompts` barrel and the concern models
`prompt-architecture.ts` (`PROMPT_LAYERS`, `promptLayerAtOrAfter`), `prompt-assembly.ts` (`PROMPT_ASSEMBLY_STAGES`,
`assemblyStageAtOrAfter`), `prompt-validation.ts` (`PROMPT_VALIDATION_CHECKS`, `validationCheckAtOrAfter`), and
`prompt-lifecycle.ts` (`PROMPT_LIFECYCLE_PHASES`, `promptPhaseAtOrAfter`); `ai/runtime/README.md`; the Stage 1 Provider
Engine (`@openlance/aios-provider-engine` public types) and ADR-0035.

## 3. Ownership analysis (Ambiguity Gate: no conflict)

The gate did not fire; this is a clean application of ADR-0035. The frozen model owns the prompt **model** (layers,
assembly stages, validation checks, lifecycle, composition, templates, context, inheritance, versioning) as pure
ordered arrays and predicates, with **no operational compiler** to duplicate. "Prompt content is an operational output
produced at runtime," and "Prompts define how the prompt is built from that context," while the runtime assembles the
context and carries and executes. So the operational prompt composition is the Prompts namespace's own realization,
sequenced by the runtime, exactly as provider invocation is the Provider Engine's realization. Boundaries respected: no
reasoning, no retrieval, no context assembly, no persistence, no execution. Two dispositions:

- **PromptCache omitted (constitutionally not owned).** "A prompt is a transient instruction, never stored"; a prompt
  "never copies, caches, or paraphrases" knowledge. The registry holds durable **definitions** ("a durable definition,
  template, or base prompt persists as architecture, not as a prompt"), which is permitted; composed prompts are
  transient and never cached.
- **No second governance model.** The `governance-conformance` validation check is a structural presence check that
  applies, never restates, governance; real enforcement stays at execution via the Provider Engine's clearance seam.

## 4. Single-direction Prompt to Provider

The engine's execution-ready output is a frozen `ProviderRequest` (`{ capability, payload }`, from
`@openlance/aios-provider-engine`), whose `payload` carries the composed prompt. The engine **never invokes** a
provider; the caller (the future runtime) hands the request to the Provider Engine's governance-cleared executor. The
dependency is one-directional: `prompt-engine -> provider-engine` (a legal `app -> app` edge). Governance is honored
downstream: the request is inert until executed behind a `GovernanceClearance` the Prompt Engine never mints or holds.

## 5. Component inventory (implemented)

Every component consumes frozen truth and owns only operational preparation. Grouped by concern:

**Definition and lifecycle.**
- **`Prompt` types.** `PromptPart` (`{ layer: PromptLayer, content, reference? }`), `PromptDefinition` (durable
  architecture: id, target `Capability`, ordered parts, required variables, lifecycle phase, optional `inheritsFrom`),
  `CompositionInput` (the supplied variables and context references), `CompiledPrompt` (the execution-ready result
  carrying the composed content and the `ProviderRequest`).
- **`PromptRegistry`.** Registers, discovers, and looks up prompt **definitions** by id; deterministic order; no
  duplicate id (fails closed); `unregister` (retirement of the durable architecture).
- **`PromptFactory`.** Validates a definition input and builds an immutable frozen `PromptDefinition`; fills the default
  phase (`definition`); fails closed on a blank id, blank capability, or no parts.
- **`PromptLifecycle`.** Consumes the frozen `PROMPT_LIFECYCLE_PHASES` and `promptPhaseAtOrAfter`; exposes the phases
  and whether a definition is still composable (its phase has not reached `expression`).

**Preparation (drives the frozen assembly stages, in order).**
- **`PromptTemplateResolver`.** Resolves a definition and its `inheritsFrom` chain into a single ordered part set (the
  `resolve-inheritance` and `gather-layers-and-template` stages); bounded and acyclic (fails closed on an unknown base
  or an inheritance cycle).
- **`PromptVariableResolver`.** Substitutes provided variable values into part content; fails closed on a missing
  required variable. Neutral placeholder resolution (`{{name}}`); it defines no template language.
- **`PromptAssembler`.** Composes the resolved parts into one prompt in the frozen `PROMPT_LAYERS` order
  (governing to task), consuming `promptLayerAtOrAfter` (the `compose` stage). Context-layer parts carry a reference
  flag; the `PromptValidator` (not the assembler) enforces that context is referenced, not embedded.
- **`PromptNormalizer`.** Normalizes the composed prompt to a consistent structural form (the `normalize` stage);
  settles structure only, never alters referenced content.
- **`PromptValidator`.** Runs the frozen `PROMPT_VALIDATION_CHECKS` in order (governance-conformance,
  boundary-conformance, structural-completeness, grounding-and-separation), consuming `validationCheckAtOrAfter`,
  conjunctive and fail-closed; each check is structural (it applies, never restates, governance).
- **`PromptCompiler`.** Drives the pipeline in the frozen `PROMPT_ASSEMBLY_STAGES` order (resolve inheritance, resolve
  variables, assemble, normalize, validate) and consumes `assemblyStageAtOrAfter` to prove that stage order; then it
  builds the execution-ready `ProviderRequest`. It composes and validates only; it executes nothing.

**Observability and cross-cutting.**
- **`PromptMetrics`, `PromptStatistics`, `PromptDiagnostics`.** Operational counters (registrations, compilations,
  successes, failures, validation failures) and a read-only view.
- **`PromptEvents`, `PROMPT_EVENT_TYPES`.** Emits framework events (registered, compiled, failed) via the frozen
  `createEvent` and `EVENT_BUS`; restates no runtime event model.
- **`PromptConfiguration`, `PromptEngineSettings`.** Engine-owned operational settings (strict-variable resolution);
  defines no new configuration mechanism.
- **`PromptError`.** `@openlance/aios-errors` `BaseError` subtype (`infrastructure`) with `PROMPT.*` codes; failures
  ride the `Result` channel, never thrown.
- **`PromptPluginBridge`, `PromptPlugin`.** Adopts definition-carrying plugins into the registry, consuming the frozen
  `PluginManifest` type and validating each definition through the `PromptFactory`; drives no plugin host lifecycle.
- **`PromptManager`.** The facade and DI entry (`PROMPT_MANAGER`): register a definition, compile a prompt (definition
  id plus a `CompositionInput`) into an execution-ready `ProviderRequest`, retire a definition, and read diagnostics and
  statistics; emits events.
- **`promptEngineModule`, `PROMPT_MANAGER`.** The `di` `Module` and token, registered through the frozen
  composition-root seam (ADR-0026).

Not built: `PromptCache` (constitutionally not owned; Section 3).

## 6. Consume, never recreate

| Concern | Owned by (frozen) | Stage 2 disposition |
|---|---|---|
| The prompt model: layers, assembly stages, validation checks, lifecycle phases, composition, templates, context, inheritance, versioning | `@openlance/aios-prompts` (Phase 2B) | consume the arrays, predicates, and invariants; restate none |
| The execution-ready request contract | `@openlance/aios-provider-engine` (Phase 4 Stage 1) | consume `ProviderRequest` / `Capability`; never invoke the executor |
| DI container, module host, tokens | `@openlance/aios-di` (ADR-0005) | consume; expose one `Module`; define no container |
| Events, errors, plugin identity | the frozen substrate (events, errors, plugins) | consume `createEvent` / `EVENT_BUS`, `BaseError` / `Result`, the `PluginManifest` type; recreate none |
| Governance enforcement, execution, context assembly, retrieval, memory, reasoning | ai/governance, ai/runtime + Providers, ai/retrieval, ai/memory, ai/reasoning | referenced by boundary; the engine performs none of them |
| The composition root seam | Phase 3 (frozen) | register through the `modules` seam; recreate no chain handle |

## 7. Dependency graph and layer wiring

Realized production edges (recorded in `dependency-graph.snapshot.json`): `@openlance/aios-prompt-engine -> {
@openlance/aios-prompts, @openlance/aios-provider-engine, @openlance/aios-di, @openlance/aios-events,
@openlance/aios-plugins, @openlance/aios-errors, @openlance/aios-kernel }` (seven). `app -> namespace` (prompts),
`app -> app` (provider-engine), and `app -> substrate` (the rest); all legal, no rule and no namespace edge changes.
The composition root, config, and logging are test-only devDependencies. The runtime model is referenced conceptually
(the runtime sequences the engine and carries the composed prompt), not a Stage-2 source dependency.

## 8. What it must not do

Reason, retrieve or determine knowledge, assemble the execution context, retain or persist, invoke a provider, execute
or express a prompt, run a workflow, call tools, execute plugins, schedule work, run or restate governance rules, define
a template language, cache or store a composed prompt, version prompts, author prompts, or name a vendor / import an
SDK. It registers definitions and compiles execution-ready payloads, and nothing else.

## 9. Testing, coverage, and benchmarks (ADR-0022 / ADR-0015)

- **Coverage.** 100% statements / branches / functions / lines, barrels and the type-only module excluded (ADR-0015).
  Every component is unit-tested: registry, factory (blank id / blank capability / no parts), lifecycle (phase gating
  via the frozen predicate), template resolver (inheritance chain, unknown base, cycle), variable resolver (missing
  variable, substitution), assembler (frozen layer order, context separation), normalizer, validator (each frozen check
  in order, each failure), compiler (the full stage pipeline plus each fail-closed path), metrics, events, configuration,
  plugin bridge, and the manager. Plus the no-vendor-knowledge guard and the single-direction Prompt to Provider
  integration.
- **Fail-closed.** The public API never throws; every failure is a `Result` error.
- **Benchmarks (ADR-0022 Rule 5).** Prompt registration, compilation, variable resolution, normalization, validation,
  and assembly, each with a recorded baseline.

## 10. Design-first checkpoint (met)

Per ADR-0007, this ADR-0036 and design doc are the Stage 2 artifacts. On completion the stage is validated, benchmarked,
independently audited twice, documented, committed, and frozen. Stage 3 (Memory Engine) is not begun.
