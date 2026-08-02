# @openlance/aios-plugins

The plugin framework. It is the terminal substrate package: it sits above the kernel, errors, DI, config, logging, and events, and nothing in the substrate depends on it.

## Architecture

A module loader. It lets self-contained modules be validated for compatibility, wired into the DI container, and driven through a lifecycle, without the core knowing any concrete module. Everything is in-memory and explicit: the host is given the plugins it manages; nothing is discovered from the filesystem or network, dynamically imported, scanned, or reflected upon.

## Ownership and constitutional boundaries

This package owns only the engineering plugin mechanism: plugin contracts, registration, compatibility validation, lifecycle hooks, plugin metadata, version compatibility, and the activation model.

It explicitly does **not** own providers, tools, runtime execution, agent loading, business modules, AI models, discovery mechanisms, filesystem scanning, dynamic loading, deployment, or extension marketplaces. It is the *seam through which* providers, tools, and namespace modules will later register; those concerns are owned by the constitutional Providers, Tools, and Evolution namespaces (`ai/providers`, `ai/tools`, `ai/evolution`). Phase 2A ships zero plugins and names no provider, tool, or namespace; `provides` entries are opaque strings.

## Dependency rules

Depends only on `@openlance/aios-kernel`, `@openlance/aios-errors`, `@openlance/aios-di`, `@openlance/aios-config`, `@openlance/aios-logging`, and `@openlance/aios-events`. It introduces no reverse dependency; it is the most-dependent substrate package.

## Registration model

Plugins are provided to the host in memory (`createPluginHost({ plugins, ... })`). The host does not load code:

- `discover(source)` lists the manifests a `PluginSource` exposes over a provided list.
- `validateCompatibility(manifests)` fails closed before any load (below).
- `load(manifest)` returns the in-memory `Plugin` whose manifest name matches, or a `PluginError` if none is available.
- Loading the same manifest twice activates the plugin once (deduplicated by name during ordering).

## Compatibility model

`validateCompatibility` checks, and reports every problem as a `PluginError`:

- each manifest's `apiVersion` satisfies the host's supported range;
- every `dependsOn` entry is present and its version is in range;
- the inter-plugin dependency graph is acyclic.

Version ranges use a small, documented semver subset (no external semver dependency): `^X.Y.Z` (caret) means the same major at or above `X.Y.Z`; comparators `>=`, `>`, `<=`, `<`, `=` may be space-separated as a conjunction; a bare `X.Y.Z` means exact equality.

## Lifecycle

Load order is a topological sort of `dependsOn` (a plugin follows the ones it depends on). `start()` runs three phases in that order: all plugins **register** their services into DI, then all **onInit**, then all **onStart**; a failing phase is reported and the next phase does not run (fail closed), with failures isolated within a phase. `stop()` runs **onStop** then **onDispose** in reverse order, isolating teardown failures. Each transition emits a `framework.plugin.*` event.

## Public API

The single supported surface is the barrel (`@openlance/aios-plugins`); deep imports fail CI (Engineering Rule 1). The host implementation is internal and is created through `createPluginHost`.

`PluginManifest` · `PluginContext` · `LifecycleHooks` · `Plugin` · `PluginSource` · `PluginHost` · `PluginHostOptions` · `createPluginHost` · `PluginError`.

## Integration points

- **DI.** A plugin registers services through `PluginContext.registry` (the narrowed capability surface, not the raw container).
- **Config.** A plugin reads typed configuration through `PluginContext.config`.
- **Logging.** A plugin logs through `PluginContext.logger`.
- **Events.** A plugin publishes and subscribes through `PluginContext.events`; the host also emits `framework.plugin.*` lifecycle events there.
- **Kernel.** Lifecycle event timestamps come from the injected `Clock`.

## Constitutional traceability

Owns no constitutional concept; `aios.constitution` is intentionally empty. It is the code realization of the constitution's promise that provider, framework, and tool churn is absorbed at the edges: later, a provider or tool ships as a plugin and registers here, and the core never changes. It enforces the same compatibility and acyclicity discipline the constitution requires, without owning it, and restates no constitutional text.

## Limitations

- **No dynamic loading.** The host is given plugins in memory; there is no filesystem discovery, package scanning, npm loading, dynamic import, reflection, or code generation.
- The `PluginContext` is a narrowed capability surface, not the raw container.
- Version ranges support the documented semver subset only.
- No plugin marketplace, deployment, or provider/tool/namespace module is defined here.

## Stability

`Medium` (Engineering Rule 4). An extension seam, additive by nature; a public-surface change requires review.
