import { err, isErr, map, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import type { ExecutionPipelinePlan } from '@openlance/aios-execution-pipeline';
import type { PluginHost, PluginManifest } from '@openlance/aios-plugins';

import { PluginLoadingError } from './errors.js';

/**
 * The application's declared plugin set: the available plugin manifests, and which of them are enabled. The
 * manifests are metadata only (name, version, apiVersion, dependencies); no `Plugin` object, and therefore no
 * executable `register`/lifecycle hook, enters this layer. `enabled` names a subset of the available plugins;
 * when omitted, every available plugin is enabled. Today the set is empty, because the substrate ships zero
 * plugins (subsystem 07).
 */
export interface PluginDeclaration {
  readonly manifests: readonly PluginManifest[];
  readonly enabled?: readonly string[];
}

/** A read-only report over the plugin loading plan. */
export interface PluginLoadingDiagnostics {
  readonly availableCount: number;
  readonly enabledCount: number;
  readonly compatibleCount: number;
  readonly readyCount: number;
}

/**
 * The immutable application-level plugin loading plan, attached to the runtime integration chain. Descriptive
 * planning metadata only: it declares which plugins are available, enabled, compatible, and ready, and holds no
 * runtime state. It is never a plugin host, registry, or loader, and it executes nothing: it does not discover,
 * load, initialize, start, stop, or schedule plugins. A Phase 4 loader consumes it.
 */
export interface PluginLoadingPlan {
  readonly pipeline: ExecutionPipelinePlan;
  readonly available: readonly PluginManifest[];
  readonly enabled: readonly PluginManifest[];
  readonly compatible: readonly PluginManifest[];
  readonly ready: readonly PluginManifest[];
  readonly diagnostics: PluginLoadingDiagnostics;
  readonly validated: true;
}

/**
 * Validate a set of plugin manifests, failing closed. Pure: it delegates entirely to the frozen plugin framework's
 * `host.validateCompatibility` (apiVersion range, dependency presence and range, and acyclicity), and on any
 * problem returns one `PLUGIN_LOADING.INCOMPATIBLE` error per frozen `PluginError`, wrapping it as the cause, and
 * no validated set. It re-declares no compatibility logic, drives no lifecycle, and holds no state. On success it
 * returns the frozen manifests. Pure; no IO.
 */
export function validatePluginLoading(
  host: PluginHost,
  manifests: readonly PluginManifest[],
): Result<readonly PluginManifest[], PluginLoadingError[]> {
  const validation = host.validateCompatibility(manifests);
  if (isErr(validation)) {
    return err(
      validation.error.map(
        (cause) =>
          new PluginLoadingError(
            'PLUGIN_LOADING.INCOMPATIBLE',
            `A declared plugin is not compatible: ${cause.message}`,
            { cause: cause.code },
            cause,
          ),
      ),
    );
  }
  return ok(Object.freeze([...manifests]));
}

/**
 * Build the immutable plugin loading plan from a declared plugin set, attaching it to the Stage 5 runtime
 * integration chain handle, failing closed. It computes the enabled subset (all available, or the named subset),
 * validates the enabled set through {@link validatePluginLoading} (delegating to the frozen host), and on success
 * returns an immutable {@link PluginLoadingPlan} whose `compatible` and `ready` are the validated enabled set. It
 * consumes the frozen `PluginHost` and the `ExecutionPipelinePlan`, recreates neither, and executes nothing: it
 * does not discover, load, initialize, start, stop, or schedule plugins. On any incompatibility it returns
 * `PluginLoadingError[]` and builds no partial plan. Pure; no IO.
 */
export function buildPluginLoadingPlan(
  pipeline: ExecutionPipelinePlan,
  host: PluginHost,
  declaration: PluginDeclaration,
): Result<PluginLoadingPlan, PluginLoadingError[]> {
  const available = declaration.manifests;
  const enabledNames = declaration.enabled;
  const enabled =
    enabledNames === undefined
      ? available
      : available.filter((manifest) => enabledNames.includes(manifest.name));

  return map(validatePluginLoading(host, enabled), (compatible) =>
    Object.freeze({
      pipeline,
      available: Object.freeze([...available]),
      enabled: Object.freeze([...enabled]),
      compatible,
      ready: compatible,
      diagnostics: Object.freeze({
        availableCount: available.length,
        enabledCount: enabled.length,
        compatibleCount: compatible.length,
        readyCount: compatible.length,
      }),
      validated: true,
    }),
  );
}
