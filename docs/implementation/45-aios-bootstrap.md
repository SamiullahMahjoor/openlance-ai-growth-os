# 45 - AIOS Bootstrap / Runtime Host (Platform Completion, PC-3)

Design artifact for `@openlance/aios-application-host`, approved with [ADR-0048](adr/0048-aios-bootstrap.md) under the ADR-0007 design-first cadence. This is the third and final item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## 1. Purpose

The AIOS Bootstrap is the thin operational application host: it consumes the frozen composition root to compose the engine modules into one validated application, loads configuration, registers the engine modules and the provider adapters, and exposes a single governed application entrypoint. It makes the certified engines a runnable system without owning any engine behavior, any execution, or the composition mechanism.

## 2. Ownership (no gate)

The composition root (ADR-0026) owns the generic composition mechanism and explicitly anticipates seam consumers. The Bootstrap owns a distinct, AIOS-specific operational responsibility no package owns: assembling the AIOS engine module set through that seam, registering the provider adapters, and exposing one governed handle. It is the "what the AIOS composes" over the composition root's "how to compose." The responsibility is singular and unambiguous, so no Ambiguity Gate is raised (ADR-0048).

## 3. Public API

`bootstrapAios(options): Promise<Result<AiosApplication, AiosError>>`.

- `options = { config: ConfigProvider[], logging: LoggerOptions, modules?: Module[], providers?: { manager: ProviderManager, adapters: ProviderDescriptor[] } }`.
- `AiosApplication = { application: Application, resolve<T>(token: Token<T>): T, providers: readonly string[], dispose(): Promise<void> }`.
- `AiosError` is a `BaseError` subtype with a stable `AIOS.*` code.

## 4. Behavior

1. Compose: call the frozen `bootstrap({ config, logging, modules })`. On failure, return `AiosError('AIOS.COMPOSITION_FAILED', ...)` and build no application.
2. Register adapters: when `providers` is supplied, register each adapter descriptor through `ProviderManager.register` (registration is not execution and mints no clearance). On any failure, dispose the composed application and return `AiosError('AIOS.PROVIDER_REGISTRATION_FAILED', ...)`, so no partially wired application is exposed.
3. Return a governed handle: the composed `Application`, a `resolve(token)` that returns any registered engine manager from the frozen container, the registered provider ids, and `dispose()`.

The entrypoint exposes only the governed engine APIs. It drives no pipeline, mints no clearance, and invokes no provider; a provider stays reachable only through the executor behind a real clearance. The Bootstrap constructs no engine itself, so it owns no engine's construction policy; engine managers are supplied by the caller as DI modules.

## 5. Determinism, fail-closed, boundaries

- Deterministic and fail-closed: composition failure or a failed adapter registration yields an `AiosError`, never a partial application; the public surface does not throw.
- It owns nothing already owned: no composition mechanism (composition root), no execution (runtime-execution-engine), no provider invocation or vendor knowledge (provider-engine and adapters), no governance/safety decision, no assessment.

## 6. Dependencies and boundaries

- Runtime edges: `composition-root` (bootstrap, Application, CompositionConfig, CompositionError), `provider-engine` (ProviderManager, ProviderDescriptor, ProviderError types), `di` (Module, Token, Container types), `config` (ConfigProvider type), `logging` (LoggerOptions type), `kernel` (Result), `errors` (BaseError). Barrel-only, acyclic leaf: nothing depends on it.
- Test-only devDependencies (to prove real wiring): the concrete engines (`evaluation-engine`, `operations-engine`, `provider-engine`), the OpenAI adapter (`provider-adapter-openai`), and `events`/`config`/`logging` for construction. These are test-only and create no runtime edge.

## 7. Module inventory

`errors` (`AiosError`, `AIOS.*` codes), `bootstrap` (`bootstrapAios`, `AiosApplication`, `AiosOptions`), `index` (barrel). Guard test: `no-execution` (drives no execution, mints no clearance).

## 8. Validation and Definition of Done

`pnpm run validate` exits 0. 100% coverage (ADR-0015): a success path composing real engine modules and registering the OpenAI adapter, a composition-failure path, a provider-registration-failure path (with disposal), and the no-providers and no-modules paths. Benchmarks recorded. Two independent audits (architecture/constitution and correctness/security) CLEAN, all Tier-1 and Tier-2 resolved. Frozen with `APPLICATION-HOST-FREEZE.md`. `ai/`, `knowledge/`, and every engine remain byte-identical.
