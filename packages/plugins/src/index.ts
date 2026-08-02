/**
 * @packageDocumentation
 * `@openlance/aios-plugins`
 *
 * The plugin framework: the seam through which self-contained modules are validated
 * for compatibility, wired into the DI container, and driven through a lifecycle,
 * without the core knowing any concrete module. It is a module loader and nothing
 * more.
 *
 * It owns only the engineering plugin mechanism: plugin contracts, registration,
 * compatibility validation, lifecycle hooks, plugin metadata, version
 * compatibility, and the activation model. It does not own providers, tools,
 * runtime execution, agent loading, business modules, AI models, discovery
 * mechanisms, filesystem scanning, dynamic loading, deployment, or extension
 * marketplaces. Those are owned by other constitutional namespaces (Providers,
 * Tools, Evolution) and this package is only the seam through which they will later
 * register. It defines no provider, tool, or namespace and names none.
 *
 * Everything is in-memory and explicit: no runtime discovery, no auto-loading, no
 * reflection, no dynamic imports, no filesystem or package scanning.
 *
 * Dependencies: @openlance/aios-kernel, @openlance/aios-errors, @openlance/aios-di,
 * @openlance/aios-config, @openlance/aios-logging, @openlance/aios-events. A plugin
 * touches only the narrowed `PluginContext` (registry, config, logger, events),
 * never the raw container.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports
 * into internal modules are prohibited and fail CI.
 *
 * Design: docs/implementation/07-plugin-framework.md.
 */

export type { PluginManifest } from './manifest.js';
export type { PluginContext } from './context.js';
export type { LifecycleHooks, Plugin } from './plugin.js';
export type { PluginSource } from './source.js';
export type { PluginHost, PluginHostOptions } from './host.js';
export { createPluginHost } from './host.js';
export { PluginError } from './compatibility.js';
