/**
 * @packageDocumentation
 * `@openlance/aios-plugin-loading`
 *
 * The AIOS application-level plugin loading (Phase 3, Stage 6). It declares, for the integrated application, which
 * plugins are available, enabled, compatible, and ready, and attaches that declaration to the Stage 5 runtime
 * integration chain handle (`ExecutionPipelinePlan`), producing one immutable `PluginLoadingPlan`. It validates
 * compatibility by delegating to the frozen plugin framework's `PluginHost.validateCompatibility`, failing closed
 * with `PluginLoadingError[]`.
 *
 * It is a thin application layer over the frozen `@openlance/aios-plugins` framework (subsystem 07, ADR-0012,
 * ADR-0013) and the frozen Stage 5 execution pipeline plan (ADR-0030). It consumes them and re-declares no plugin
 * host, registry, loader, lifecycle, compatibility validator, or contract, and no chain handle. It holds no runtime
 * state and executes nothing: it does not discover, load, initialize, start, stop, or schedule plugins, and runs
 * no provider, tool, agent, or workflow. Those are Phase 4. Decision: ADR-0032 (which supersedes ADR-0031 and
 * reopens Phase 3). This file is the single supported public API (Engineering Rule 1); deep imports into internal
 * modules are prohibited and fail CI.
 *
 * Design: docs/implementation/29-plugin-loading.md.
 */

export { buildPluginLoadingPlan, validatePluginLoading } from './plugin-loading.js';
export type {
  PluginDeclaration,
  PluginLoadingDiagnostics,
  PluginLoadingPlan,
} from './plugin-loading.js';
export { PluginLoadingError } from './errors.js';
