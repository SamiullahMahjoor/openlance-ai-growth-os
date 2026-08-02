import type { PluginContext } from './context.js';
import type { PluginManifest } from './manifest.js';

/**
 * Optional lifecycle hooks a plugin may implement. They run in a defined order:
 * `onInit` then `onStart` on the way up (in dependency order), `onStop` then
 * `onDispose` on the way down (in reverse). Each may be synchronous or asynchronous.
 */
export interface LifecycleHooks {
  onInit?(ctx: PluginContext): void | Promise<void>;
  onStart?(): void | Promise<void>;
  onStop?(): void | Promise<void>;
  onDispose?(): void | Promise<void>;
}

/**
 * A self-contained module. It declares its `manifest`, registers its services into
 * the DI registry through `register`, and may implement lifecycle `hooks`.
 */
export interface Plugin {
  readonly manifest: PluginManifest;
  register(ctx: PluginContext): void | Promise<void>;
  readonly hooks?: LifecycleHooks;
}
