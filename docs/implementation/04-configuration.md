# Subsystem 04, Configuration System (`@openlance/aios-config`)

## 1. Architectural analysis

Configuration is the layer that **absorbs environment and technology churn** so the constitution and core stay stable, the direct code form of `ai/CONTRIBUTING.md` line 176 ("change is absorbed by the provider, operations, and configuration layers, never by the constitution"). Config is layered and deterministic: sources are merged by fixed precedence, the result is validated against a typed schema, and **secrets are references, never values**. No package reads `process.env` directly; they read typed, validated config from this service.

## 2. Package design

`@openlance/aios-config`, depends on `kernel`, `errors`, `di`. Modules: `provider`, `env-provider`, `object-provider`, `hierarchy`, `schema`, `service`, `secret`. A neutral `Schema<T>` seam abstracts the validator so a concrete library can be adopted later without touching consumers.

## 3. Interface design

```ts
export interface ConfigRecord { readonly [key: string]: string | number | boolean | ConfigRecord }

export interface ConfigProvider {
  readonly name: string;
  readonly priority: number;         // higher overrides lower; deterministic merge order
  load(): Result<ConfigRecord, ConfigError>;
}
// Built-ins: DefaultsProvider(priority 0) < FileProvider(10) < EnvProvider(20) < OverrideProvider(30)

export interface Schema<T> {         // neutral validation seam
  parse(input: unknown): Result<T, ValidationError>;
}

export interface ConfigService {
  get<T>(schema: Schema<T>): Result<T, ConfigError>;              // whole typed config
  getSection<T>(key: string, schema: Schema<T>): Result<T, ConfigError>;
}

export interface SecretRef { readonly kind: 'secret'; readonly key: string }   // never the value
export interface SecretProvider {
  resolve(ref: SecretRef): Promise<Result<string, ConfigError>>;
}
// Dev impl: EnvSecretProvider (reads a secret from env at resolve time, never stores it in ConfigRecord).
```

Hierarchy: providers are sorted by `priority` and deep-merged deterministically; the merged record is parsed once through the typed `Schema<T>`. A missing required key or a schema failure yields a `ConfigError`/`ValidationError`, the process can refuse to start (fail-closed, mirroring the safety posture).

## 4. Dependency graph

`config ◀ {kernel, errors, di}`. Depended on by logging, plugins, and namespace packages.

## 5. Folder structure

```
packages/config/
  src/ index.ts provider.ts env-provider.ts object-provider.ts hierarchy.ts schema.ts service.ts secret.ts
  tests/ hierarchy.test.ts service.test.ts secret.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `ConfigProvider` contract + `DefaultsProvider`, `EnvProvider`, `ObjectProvider`.
2. `hierarchy`: priority sort + deterministic deep merge.
3. `Schema<T>` seam + `ConfigService.get/getSection`.
4. `SecretRef` + `SecretProvider` + `EnvSecretProvider` (references only; values never enter `ConfigRecord`).
5. Startup validation helper that fails closed on missing/invalid required config.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Hardcoded values creeping in | Lint rule + review; all values come from providers; defaults live in `DefaultsProvider`, not code paths. |
| Secrets leaking into logs/config dumps | `SecretRef` is opaque; a secret value is never placed in `ConfigRecord`; logging redaction pairs with subsystem 05. |
| Merge nondeterminism | Fixed integer priorities; stable deep-merge; tests assert order independence of provider registration. |
| Schema-library lock-in | Neutral `Schema<T>` seam; concrete validator chosen later behind it. |

## 8. Acceptance criteria

- Precedence is deterministic and covered by tests (env overrides file overrides defaults).
- Typed access returns validated config or a structured error; no untyped `get(string)` escape hatch in the public surface.
- No package reads `process.env` outside `EnvProvider`/`EnvSecretProvider` (CI lint gate).
- Secret values never appear in a `ConfigRecord` or a serialized config dump.
