---
id: ADR-0048
title: The AIOS Bootstrap is the operational application host; it consumes the frozen composition root to compose the engine modules into one validated application and registers provider adapters, exposing a governed entrypoint, and it owns no engine behavior, no execution, and no composition mechanism
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0048: The AIOS Bootstrap is the operational application host; it consumes the frozen composition root to compose the engine modules into one validated application and registers provider adapters, exposing a governed entrypoint, and it owns no engine behavior, no execution, and no composition mechanism

## Status

**Accepted** (Platform Completion, PC-3). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and preserves the `phase-4-frozen` baseline and every prior ADR.

## Context

Platform Completion has delivered the Evaluation Engine (PC-1) and the OpenAI provider adapter (PC-2). To make the certified engines a runnable system, one thin layer must build the object graph, load configuration, register the engine modules, register provider adapters, and expose a governed application entrypoint. The Platform Completion mandate scopes this as "a thin bootstrap layer, not a new engine," which "consumes the existing Composition Root" and owns "no business logic, no execution policies, and no architectural responsibilities already owned elsewhere."

A source reading fixes the seam this ADR must honor:

- The frozen composition root (`apps/composition-root`, ADR-0026) exposes `bootstrap(config: CompositionConfig): Result<Application, CompositionError[]>`, where `CompositionConfig = { config, logging, modules? }` and each engine registers its manager through the `modules` extension seam. Its own docstring records that "later Phase 3 stages register their services through the extension seam (`CompositionConfig.modules`)," so consumers of that seam are anticipated by design. It "performs registration only: no runtime execution."
- Each Phase 4 engine and the PC-1 Evaluation Engine export a DI module (for example `evaluationEngineModule(manager)`, `operationsEngineModule(manager)`, `providerEngineModule(manager)`) and a resolution token. The frozen `di` `Container` resolves a registered service by token.
- The Provider Engine's `ProviderManager.register(descriptor)` validates and registers a provider adapter (a PC-2 `ProviderDescriptor`); registration is not execution and requires no governance clearance. `invoke` requires a clearance whose minter is unexported.

**Ownership analysis (why no Ambiguity Gate fires).** The composition root owns the generic composition mechanism: composing the substrate services plus arbitrary extension modules into a validated `Application`. The AIOS Bootstrap owns a distinct, AIOS-specific operational responsibility that no existing package owns: assembling the concrete AIOS engine module set into one application through that seam, registering the provider adapters, and exposing a single governed application handle. The composition root is the "how to compose"; the Bootstrap is the "what the AIOS composes." Because the composition root explicitly anticipates seam consumers, and no package already owns the AIOS-specific assembly, the responsibility is singular and unambiguous. No ownership conflict exists, so no gate is raised.

## Decision

1. **The AIOS Bootstrap (`@openlance/aios-application-host`, Platform Completion PC-3) is the operational application host.** It is a thin `apps/*` package that consumes the frozen composition root and exposes `bootstrapAios(options): Promise<Result<AiosApplication, AiosError>>`. It defines no container, registry, module host, or composition mechanism; those are the composition root's and `di`'s. It is not an engine and holds no engine behavior.

2. **It composes the provided engine modules through the frozen composition-root seam.** `options = { config, logging, modules?, providers? }`. It calls `bootstrap({ config, logging, modules })` and, on success, holds the validated immutable `Application`. It constructs no engine itself: the engine managers, with their own construction policies, are supplied by the caller as DI modules, so the Bootstrap owns no engine's construction and no engine's behavior.

3. **It registers provider adapters with the Provider Engine.** When `options.providers = { manager, adapters }` is supplied, it registers each PC-2 adapter descriptor through `ProviderManager.register`, collecting the registered ids. Registration is not execution and mints no clearance.

4. **It exposes a governed application entrypoint.** It returns an immutable `AiosApplication` holding the composed `Application`, a `resolve(token)` that returns any registered engine manager from the frozen container, the registered provider ids, and `dispose()`. The entrypoint exposes only the governed engine APIs; it adds no ungoverned path, drives no pipeline, mints no clearance, and invokes no provider. Running work remains the engines' governed responsibility; a provider is still reachable only through the executor behind a real clearance.

5. **It is fail-closed and atomic.** If composition fails, it returns `AiosError` and builds no application. If any adapter registration fails after a successful composition, it disposes the composed application and returns `AiosError`, so no partially wired application is ever exposed. Its public surface does not throw.

6. **It owns nothing already owned.** It owns no composition mechanism (composition root), no execution (runtime-execution-engine), no provider invocation or vendor knowledge (provider-engine and its adapters), no governance decision, no safety decision, and no assessment. A guard test enforces structurally that it drives no execution and mints no clearance.

## Rationale

The decision keeps the Bootstrap a thin, decoupled seam consumer: by accepting engine modules rather than constructing engines, it depends on no individual engine at runtime and therefore owns no engine's construction policy, while still assembling them into one governed, resolvable application and wiring the concrete provider adapters. Alternatives considered and rejected:

- **The Bootstrap constructs every engine itself.** Rejected: it would couple the Bootstrap to each engine's construction policy (which each engine owns) and create a large fan-in that duplicates responsibilities better left to each engine. The module-accepting seam keeps it thin and decoupled; the concrete engines appear only in the Bootstrap's tests, which prove real wiring.
- **A new container, registry, or composition mechanism in the Bootstrap.** Rejected: the composition root and `di` already own composition; a second mechanism violates one-owner and the frozen dependency rules.
- **An end-to-end "run a task" entrypoint that drives the pipeline and invokes a provider.** Rejected: that would require minting a governance clearance, which is deliberately impossible until the governance enforcement stage exists, and would re-own execution and orchestration. The Bootstrap exposes only the governed engine handles.

## Consequences

- The AIOS gains a single operational entrypoint that composes the engines and registers adapters, making the platform runnable end to end (short of the deferred clearance minter).
- The Bootstrap is where a deployment supplies configuration, the engine modules, a concrete transport and credential for an adapter, and receives a governed application handle. When the governance enforcement stage mints clearances, no change to the Bootstrap is required.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/operations/` (ADR-0024 category 5, the Composition Root role the composition root realizes), `ai/runtime/README.md` ("Governance precedes execution"), and the frozen `@openlance/aios-composition-root` (`bootstrap`, `CompositionConfig`, `Application`) and `@openlance/aios-provider-engine` (`ProviderManager.register`) seams. Builds on ADR-0026 (the composition-root seam), ADR-0035 (the operational-layer pattern), and ADR-0047 (the provider adapters it registers).

## Related ADRs

Supersedes none. Builds on ADR-0026, ADR-0035, ADR-0046 (PC-1), and ADR-0047 (PC-2). Third and final item of the Platform Completion milestone (PC-3).
