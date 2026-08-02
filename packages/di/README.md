# @openlance/aios-di

The custom, framework-neutral dependency-injection container. It sits above the kernel and errors, and below configuration, logging, events, and plugins.

## Architecture

A small, explicit container (ADR-0005): typed tokens key the graph, providers say how to build each service, lifetimes say how long instances live, and startup validation refuses a graph that cannot be wired. It is decorator-optional by design; this build ships no decorators. There is no reflection, no ambient registration, and no hidden service locator. Registration is explicit and resolution is deterministic.

## Responsibilities

- **Registration and providers.** `register(token, provider, { lifetime })` with `useValue`, `useClass` (constructor injection via `inject`), and `useFactory` (given a `Resolver`).
- **Lifetimes.** `singleton` (one per container), `scoped` (one per `Scope`), `transient` (new per resolve).
- **Scopes.** `createScope()` returns a `Scope` that owns its scoped instances and disposes them, in reverse construction order, when disposed.
- **Validation.** `validate()` (also run by `build()`) returns a `Result<void, DependencyError[]>`, reporting every missing dependency, cycle, and lifetime mismatch. Expected graph problems are returned, never thrown.
- **Composition.** `createModuleHost()` collects `Module`s, orders them by `dependsOn`, registers them, validates, and returns a ready `Container`.
- **Disposal.** `Container.dispose()` disposes the instances it owns in reverse construction order.

## Dependency rules

Depends only on `@openlance/aios-kernel` (`Result`, `Option`, `Disposable`) and `@openlance/aios-errors` (`BaseError`, the base of `DependencyError`). It introduces no reverse dependency and stays within the substrate ordering. It is not a utility package.

## Does not own

Runtime execution, configuration, logging, events, plugins, providers, orchestration, monitoring, AI concepts, or business logic. Those are owned elsewhere and depend on this package, never the reverse.

## Public API

The single supported surface is the barrel (`@openlance/aios-di`); deep imports fail CI (Engineering Rule 1). Implementation classes are internal; containers, scopes, and hosts are created through `createContainer` and `createModuleHost` and used through their interfaces.

`token` · `Token` · `Lifetime` · `Provider` · `Resolver` · `Registry` · `Scope` · `Container` · `createContainer` · `Module` · `ModuleHost` · `createModuleHost` · `DependencyError`.

## Examples

```ts
import { createContainer, token } from '@openlance/aios-di';

class Clock {
  now(): number {
    return 0;
  }
}
class Service {
  constructor(readonly clock: Clock) {}
}

const clockToken = token<Clock>('clock');
const serviceToken = token<Service>('service');

const container = createContainer();
container.register(clockToken, { useClass: Clock });
container.register(serviceToken, { useClass: Service, inject: [clockToken] });

const check = container.validate(); // Result<void, DependencyError[]>
if (check.ok) {
  const service = container.resolve(serviceToken);
}
```

```ts
import { createModuleHost, token } from '@openlance/aios-di';
import type { Module } from '@openlance/aios-di';

const portToken = token<number>('port');
const configModule: Module = {
  name: 'config',
  version: '1.0.0',
  register(registry) {
    registry.register(portToken, { useValue: 8080 });
  },
};

const built = createModuleHost().add(configModule).build(); // topological order + validation
```

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. Its `validate()` makes the acyclic, one-directional, no-missing-dependency property the constitution requires (`ai/architecture/dependency-map.md`) enforceable at wiring time, in addition to lint time (ADR-0005). It restates no constitutional text.

## Limitations

- Lifetime-mismatch validation reports the design's stated rule: a singleton must not directly depend on a scoped service.
- Duplicate registration of a token is last-wins.
- Factories resolve synchronously; asynchronous initialization is a plugin-lifecycle concern (subsystem 07), not the container's.
- Decorators are intentionally not provided.

## Stability

`High` (Engineering Rule 4). The composition mechanism with a wide blast radius; a public-surface change requires review and an ADR.
