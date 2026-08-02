import { err, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';

import { orderByDeps, PluginError, validateCompatibility } from './compatibility.js';
import type { PluginContext } from './context.js';
import { activate, deactivate } from './lifecycle.js';
import type { PluginManifest } from './manifest.js';
import type { Plugin } from './plugin.js';
import type { PluginSource } from './source.js';

/**
 * Drives plugins through discovery, compatibility validation, loading, and the
 * lifecycle. It holds the in-memory plugins it manages; nothing is loaded
 * dynamically from the filesystem or network.
 */
export interface PluginHost {
  discover(source: PluginSource): Result<PluginManifest[], PluginError>;
  validateCompatibility(manifests: readonly PluginManifest[]): Result<void, PluginError[]>;
  load(manifest: PluginManifest): Result<Plugin, PluginError>;
  start(): Promise<Result<void, PluginError[]>>;
  stop(): Promise<void>;
}

/** Options for constructing a plugin host. Collaborators are injected. */
export interface PluginHostOptions {
  readonly plugins: readonly Plugin[];
  readonly context: PluginContext;
  readonly supportedApiVersion: string;
  readonly clock: Clock;
}

class PluginHostImpl implements PluginHost {
  readonly #available: Map<string, Plugin>;
  readonly #context: PluginContext;
  readonly #supportedApiVersion: string;
  readonly #clock: Clock;
  readonly #loaded: Plugin[] = [];
  #active: readonly Plugin[] = [];

  constructor(options: PluginHostOptions) {
    this.#available = new Map(options.plugins.map((plugin) => [plugin.manifest.name, plugin]));
    this.#context = options.context;
    this.#supportedApiVersion = options.supportedApiVersion;
    this.#clock = options.clock;
  }

  discover(source: PluginSource): Result<PluginManifest[], PluginError> {
    return source.list();
  }

  validateCompatibility(manifests: readonly PluginManifest[]): Result<void, PluginError[]> {
    return validateCompatibility(manifests, this.#supportedApiVersion);
  }

  load(manifest: PluginManifest): Result<Plugin, PluginError> {
    const plugin = this.#available.get(manifest.name);
    if (!plugin) {
      return err(
        new PluginError(
          'PLUGIN.NOT_AVAILABLE',
          `No plugin available for manifest '${manifest.name}'.`,
          {
            plugin: manifest.name,
          },
        ),
      );
    }
    this.#loaded.push(plugin);
    return ok(plugin);
  }

  async start(): Promise<Result<void, PluginError[]>> {
    const ordered = orderByDeps(
      this.#loaded,
      (plugin) => plugin.manifest.name,
      (plugin) => (plugin.manifest.dependsOn ?? []).map((dependency) => dependency.name),
    );
    if (!ordered.ok) {
      return err(ordered.error);
    }
    this.#active = ordered.value;
    return activate(this.#active, this.#context, this.#clock);
  }

  async stop(): Promise<void> {
    await deactivate(this.#active, this.#context, this.#clock);
    this.#active = [];
  }
}

/** Creates a plugin host over an in-memory set of plugins and injected collaborators. */
export const createPluginHost = (options: PluginHostOptions): PluginHost =>
  new PluginHostImpl(options);
