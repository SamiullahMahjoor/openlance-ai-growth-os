# Subsystem 03, Dependency Injection (`@openlance/aios-di`)

## 1. Architectural analysis

DI is the composition mechanism through which every later namespace package is wired without hard-coding its collaborators. Its module graph is the runtime twin of the frozen `dependency-map.md`: modules declare dependencies, and startup validation refuses to boot a graph with a missing dependency, a cycle, or a lifetime violation (e.g. a singleton depending on a scoped service). This makes the constitution's "acyclic, one-directional, no missing dependency" properties enforceable at wiring time, not just at lint time.

Custom (not NestJS/inversify) per the locked framework-neutral decision: a small, explicit, decorator-optional container so the substrate carries no framework.

## 2. Package design

`@openlance/aios-di`, depends on `kernel`, `errors`. Modules: `token`, `provider`, `container`, `scope`, `module`, `registry`, `validation`. Decorator support is optional and additive (a thin layer over token registration) so packages can stay decorator-free.

## 3. Interface design

```ts
export type Lifetime = 'singleton' | 'scoped' | 'transient';
export type Token<T> = symbol & { readonly __type?: T };          // typed token
export const token: <T>(description: string) => Token<T>;

export type Provider<T> =
  | { useValue: T }
  | { useClass: new (...deps: never[]) => T; inject?: Token<unknown>[] }
  | { useFactory: (resolve: Resolver) => T; inject?: Token<unknown>[] };

export interface Resolver { resolve<T>(token: Token<T>): T; tryResolve<T>(token: Token<T>): Option<T> }

export interface Container extends Resolver, Disposable {
  register<T>(token: Token<T>, provider: Provider<T>, opts?: { lifetime?: Lifetime }): void;
  createScope(): Scope;
  validate(): Result<void, DependencyError[]>;   // missing deps, cycles, lifetime mismatches
  dispose(): Promise<void>;                       // disposes singletons in reverse order
}
export interface Scope extends Resolver, Disposable {}   // owns scoped instances

export interface Module {
  readonly name: string;
  readonly version: string;
  readonly dependsOn?: readonly string[];
  register(registry: Registry): void;
}
export interface Registry { register<T>(token: Token<T>, provider: Provider<T>, opts?: { lifetime?: Lifetime }): void }

export interface ModuleHost {
  add(module: Module): this;
  build(): Result<Container, DependencyError[]>;  // topological order; validates before returning
}
```

Lifetimes: **singleton** (one per container), **scoped** (one per `Scope`), **transient** (new each resolve). `validate()` runs at `build()` and is also callable standalone (startup validation), it returns `DependencyError[]` (never throws for expected graph problems).

## 4. Dependency graph

`di ◀ {kernel, errors}`. Depended on by config, logging, events, plugins, and every namespace package.

## 5. Folder structure

```
packages/di/
  src/ index.ts token.ts provider.ts container.ts scope.ts module.ts registry.ts validation.ts decorators.ts
  tests/ container.test.ts lifetimes.test.ts validation.test.ts module.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `token` + `provider` shapes; typed `Resolver`.
2. `Container` with the three lifetimes and reverse-order disposal.
3. `Scope` for scoped instances; leak checks in tests.
4. `Module` + `ModuleHost` with topological ordering.
5. `validation`: missing-dependency, cycle, and lifetime-mismatch detection returning structured `DependencyError[]`.
6. Optional `decorators` (additive `@injectable`/`@inject`) over token registration.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Reinventing a mature container | Keep surface minimal; exhaustive tests; decorators optional. |
| Hidden cycles at runtime | `validate()` runs at build and is CI-tested against crafted cyclic graphs. |
| Lifetime captivity (singleton holds scoped) | Explicit lifetime-mismatch rule in `validate()`. |
| Async construction ordering | Factories are sync-resolve; async init handled by plugin lifecycle hooks (subsystem 07), not the container. |

## 8. Acceptance criteria

- All three lifetimes behave correctly and are unit-proven (identity, per-scope, per-resolve).
- `build()`/`validate()` reject missing deps, cycles, and lifetime mismatches with structured errors, never a throw for expected cases.
- Container and scope dispose deterministically in reverse construction order.
- Zero framework imports; decorator layer is optional and side-effect-free when unused.
