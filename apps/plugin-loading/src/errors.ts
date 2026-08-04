import { BaseError } from '@openlance/aios-errors';

/**
 * A plugin loading integration failure: a declared enabled plugin is not compatible with the host (an unsupported
 * apiVersion, a missing or out-of-range dependency, or a circular dependency), as determined by the frozen plugin
 * framework's compatibility validation. It is an infrastructure error (a wiring/planning problem, not domain logic
 * or input validation), distinguished by its stable `PLUGIN_LOADING.*` code, and it wraps the originating frozen
 * `PluginError` as its cause.
 *
 * The plan fails closed: on any incompatibility `buildPluginLoadingPlan` and `validatePluginLoading` return
 * `PluginLoadingError[]` and build no partial plan. This error owns no new error framework; it is a `BaseError`
 * subtype (ADR-0006), carrying the `Result` channel's failure exactly like every other engineering error.
 */
export class PluginLoadingError extends BaseError {
  readonly category = 'infrastructure';
}
