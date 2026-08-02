# @openlance/aios-config

The configuration system. It sits above the kernel, errors, and DI, and below logging and the namespace packages.

## Architecture

Configuration is the layer that absorbs environment and technology churn so the constitution and core stay stable. It is layered and deterministic: providers contribute records at fixed integer priorities, the records are deep-merged by precedence into one immutable snapshot, and every read is validated through a neutral typed `Schema<T>` seam. Secrets are references, never values.

## Responsibilities

- **Providers and sources.** `ConfigProvider` (name, priority, `load()`), with built-ins `DefaultsProvider` (priority 0), `EnvProvider` (priority 20, the single sanctioned reader of `process.env`), and `ObjectProvider` (a record at any priority).
- **Hierarchy and composition.** Providers are sorted by `(priority, name)` and deep-merged; the merge is independent of registration order and produces a deeply frozen snapshot.
- **Typed, validated access.** `ConfigService.get(schema)` and `getSection(key, schema)` return either a typed value or a structured `ConfigError`. There is no untyped `get(string)` escape hatch.
- **Schema seam.** `Schema<T>` abstracts the validator so a concrete library can be adopted later without touching consumers.
- **Secrets.** `SecretRef` carries only a key; `SecretProvider.resolve` fetches the value at the point of use. `EnvSecretProvider` reads it from the environment and never stores it in a `ConfigRecord`.
- **Startup validation.** `loadConfig(providers, schema)` builds and validates the whole configuration, failing closed on a load or validation failure so a process can refuse to start.

## Dependency rules

Depends only on `@openlance/aios-kernel` (`Result`), `@openlance/aios-errors` (`BaseError` for `ConfigError`, `ValidationError` from the schema seam), and `@openlance/aios-di` (the `CONFIG_SERVICE` token). It introduces no reverse dependency and stays within the substrate ordering.

## Does not own

Dependency injection, logging, runtime behavior, events, plugins, orchestration, AI concepts, business configuration, or application settings. Those are owned elsewhere.

## Public API

The single supported surface is the barrel (`@openlance/aios-config`); deep imports fail CI (Engineering Rule 1). The `ConfigService` implementation is internal and is built through `createConfigService`.

`ConfigRecord` · `ConfigProvider` · `ConfigError` · `ObjectProvider` · `DefaultsProvider` · `EnvProvider` · `Schema` · `ConfigService` · `createConfigService` · `loadConfig` · `CONFIG_SERVICE` · `SecretRef` · `SecretProvider` · `EnvSecretProvider`.

## Configuration hierarchy

Providers are ordered by ascending `priority` (ties broken by `name`), and higher priorities override lower ones. The built-in precedence is `DefaultsProvider (0) < EnvProvider (20) < override records (for example priority 30)`. Nested records are deep-merged; scalars are replaced. Because the order depends only on `(priority, name)`, registering the same providers in any order yields the same snapshot.

## Validation flow

1. Each provider loads its record; a load failure stops the merge and is returned (fail closed).
2. Records are deep-merged by precedence into one deeply frozen snapshot.
3. `get` / `getSection` parse the snapshot (or a section) through a `Schema<T>`; a failure returns a `ConfigError` whose cause is the originating `ValidationError`.
4. `loadConfig` performs steps 1 to 3 at startup so invalid or missing required configuration prevents start.

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. It is the code form of `ai/CONTRIBUTING.md`'s principle that change is absorbed by the provider, operations, and configuration layers, never by the constitution. It restates no constitutional text.

## Composition with DI

A built `ConfigService` is registered and resolved through the `CONFIG_SERVICE` di token:

```ts
import { createConfigService, CONFIG_SERVICE, DefaultsProvider, EnvProvider } from '@openlance/aios-config';
import { createContainer } from '@openlance/aios-di';

const built = createConfigService([new DefaultsProvider({ port: 8080 }), new EnvProvider({ prefix: 'AIOS_' })]);
if (built.ok) {
  const container = createContainer();
  container.register(CONFIG_SERVICE, { useValue: built.value });
}
```

## Limitations

- `EnvProvider` contributes flat string values (prefix-stripped); nested shaping is a schema concern.
- There is no live reload; a service is built over an immutable snapshot. (The design defines no reload contract.)
- No concrete validation library is bundled; consumers supply `Schema<T>` implementations behind the seam.
- Only `EnvProvider` / `EnvSecretProvider` read the environment; no other module reads `process.env`.

## Stability

`High` (Engineering Rule 4). Every package reads configuration; a public-surface change requires review and an ADR.
