# Subsystem 07, Plugin Framework (`@openlance/aios-plugins`)

> **Classification:** Engineering mechanism (module loader). Owns no AI concept.
> **Adjacent architecture (deferred, not implemented in 2A):** additive **extensibility** (each namespace README's growth model), **provider registration**: `ai/providers/`, and **tool registration**: `ai/tools/`, plus repository growth, `ai/evolution/repository-growth.md`. This package is the *seam through which such modules will later register*; it implements only discovery, registration, compatibility, and lifecycle. It defines no provider, no tool, no namespace, and no growth policy.

## 1. Architectural analysis

The plugin framework lets self-contained modules be discovered, validated for compatibility, wired into the DI container, and driven through a lifecycle, without the core knowing any concrete module. This is the code realization of the constitution's promise that provider/framework/tool churn is absorbed at the edges (`ai/CONTRIBUTING.md` line 176): later, a provider or a tool ships as a plugin and registers here, and the core never changes. In Phase 2A only the mechanism exists; no runtime, provider, or tool module is written. Compatibility is enforced (apiVersion ranges, acyclic inter-plugin dependencies) so an incompatible module is refused rather than loaded, mirroring the constitution's compatibility discipline without owning it.

## 2. Package design

`@openlance/aios-plugins`, depends on `kernel`, `errors`, `di`, `config`, `logging`, `events`. Modules: `manifest`, `plugin`, `host`, `compatibility`, `lifecycle`, `context`. The most-dependent substrate package; nothing in the substrate depends on it.

## 3. Interface design

```ts
export interface PluginManifest {
  readonly name: string;
  readonly version: string;                 // semver
  readonly apiVersion: string;              // host API contract this plugin targets
  readonly dependsOn?: readonly { name: string; range: string }[];
  readonly provides?: readonly string[];    // capability identifiers (opaque strings in 2A)
}

export interface PluginContext {            // what a plugin may touch, a narrowed surface
  readonly registry: Registry;              // DI registration (subsystem 03)
  readonly config: ConfigService;
  readonly logger: Logger;
  readonly events: EventBus;
}

export interface LifecycleHooks {
  onInit?(ctx: PluginContext): void | Promise<void>;
  onStart?(): void | Promise<void>;
  onStop?(): void | Promise<void>;
  onDispose?(): void | Promise<void>;
}

export interface Plugin {
  readonly manifest: PluginManifest;
  register(ctx: PluginContext): void | Promise<void>;
  readonly hooks?: LifecycleHooks;
}

export interface PluginHost {
  discover(source: PluginSource): Result<PluginManifest[], PluginError>;
  validateCompatibility(manifests: readonly PluginManifest[]): Result<void, PluginError[]>;
  load(manifest: PluginManifest): Result<Plugin, PluginError>;
  start(): Promise<Result<void, PluginError[]>>;   // ordered init→start
  stop(): Promise<void>;                            // reverse-ordered stop→dispose
}
export interface PluginSource { list(): Result<PluginManifest[], PluginError> }
```

`validateCompatibility` checks: `apiVersion` satisfies the host's supported range; every `dependsOn` is present and version-in-range; the inter-plugin dependency graph is acyclic (reuses the same acyclicity discipline as DI). Load order is a topological sort of `dependsOn`; start runs `onInit`→`onStart` in that order; stop runs `onStop`→`onDispose` in reverse.

## 4. Dependency graph

`plugins ◀ {kernel, errors, di, config, logging, events}`. The terminal substrate package; namespace packages and future provider/tool modules depend on it, never the reverse.

## 5. Folder structure

```
packages/plugins/
  src/ index.ts manifest.ts plugin.ts host.ts compatibility.ts lifecycle.ts context.ts source.ts
  tests/ host.test.ts compatibility.test.ts lifecycle.test.ts topo-order.test.ts
  package.json tsconfig.json README.md
```

## 6. Implementation plan

1. `PluginManifest` + `PluginSource` (discovery over a provided list; no filesystem/network assumptions baked into the contract).
2. `compatibility`: apiVersion range check, dependency presence/range, acyclic dep-graph, returning structured `PluginError[]`.
3. `PluginHost.load` + topological ordering.
4. `PluginContext` (narrowed surface: registry, config, logger, events).
5. `lifecycle`: ordered init/start and reverse stop/dispose; emit `framework.plugin.*` events.

## 7. Risks

| Risk | Mitigation |
|---|---|
| Implying providers/tools/namespaces exist | 2A ships zero plugins; `provides` are opaque strings; README states the deferral to Providers/Tools/Evolution. |
| Over-broad plugin surface (a plugin touches the whole container) | `PluginContext` is a narrowed capability surface, not the raw container. |
| Incompatible module loading silently | `validateCompatibility` fails closed before load; tested with version-mismatch and cyclic fixtures. |
| Lifecycle ordering bugs | Topological load; reverse teardown; tested. |

## 8. Acceptance criteria

- A compatible plugin is discovered, validated, registered into DI, and driven through init/start/stop/dispose in correct order.
- An incompatible or cyclically-dependent set is refused with structured errors before any load.
- The package ships no provider, tool, or namespace module and names none.
- Plugin surface is the narrowed `PluginContext`, not the raw container.
