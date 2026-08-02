import { createEvent } from '@openlance/aios-events';
import { err, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';

import { PluginError } from './compatibility.js';
import type { PluginContext } from './context.js';
import type { Plugin } from './plugin.js';

const emit = async (
  context: PluginContext,
  clock: Clock,
  type: string,
  name: string,
): Promise<void> => {
  await context.events.publish(createEvent(clock, type, { plugin: name }));
};

const invokeInit = async (
  hook: ((ctx: PluginContext) => void | Promise<void>) | undefined,
  context: PluginContext,
): Promise<void> => {
  if (hook) {
    await hook(context);
  }
};

const invokeHook = async (hook: (() => void | Promise<void>) | undefined): Promise<void> => {
  if (hook) {
    await hook();
  }
};

/**
 * Registers, initializes, then starts plugins in dependency order. All plugins
 * register their services into DI first, then all initialize, then all start; a
 * failing phase is reported and the next phase does not run (fail closed). Failures
 * within a phase are isolated so every plugin in that phase is attempted. Emits
 * `framework.plugin.initialized` and `framework.plugin.started`.
 */
export const activate = async (
  plugins: readonly Plugin[],
  context: PluginContext,
  clock: Clock,
): Promise<Result<void, PluginError[]>> => {
  const errors: PluginError[] = [];

  for (const plugin of plugins) {
    try {
      await plugin.register(context);
    } catch (error) {
      errors.push(
        new PluginError(
          'PLUGIN.REGISTER_FAILED',
          `Plugin '${plugin.manifest.name}' failed to register.`,
          {
            plugin: plugin.manifest.name,
          },
          error,
        ),
      );
    }
  }
  if (errors.length > 0) {
    return err(errors);
  }

  for (const plugin of plugins) {
    try {
      await invokeInit(plugin.hooks?.onInit, context);
      await emit(context, clock, 'framework.plugin.initialized', plugin.manifest.name);
    } catch (error) {
      errors.push(
        new PluginError(
          'PLUGIN.INIT_FAILED',
          `Plugin '${plugin.manifest.name}' failed to initialize.`,
          {
            plugin: plugin.manifest.name,
          },
          error,
        ),
      );
    }
  }
  if (errors.length > 0) {
    return err(errors);
  }

  for (const plugin of plugins) {
    try {
      await invokeHook(plugin.hooks?.onStart);
      await emit(context, clock, 'framework.plugin.started', plugin.manifest.name);
    } catch (error) {
      errors.push(
        new PluginError(
          'PLUGIN.START_FAILED',
          `Plugin '${plugin.manifest.name}' failed to start.`,
          {
            plugin: plugin.manifest.name,
          },
          error,
        ),
      );
    }
  }
  return errors.length === 0 ? ok(undefined) : err(errors);
};

/**
 * Stops then disposes plugins in reverse dependency order. Teardown is isolated: a
 * failing hook does not prevent the remaining teardown. Emits
 * `framework.plugin.stopped` and `framework.plugin.disposed`.
 */
export const deactivate = async (
  plugins: readonly Plugin[],
  context: PluginContext,
  clock: Clock,
): Promise<void> => {
  const reversed = [...plugins].reverse();
  for (const plugin of reversed) {
    try {
      await invokeHook(plugin.hooks?.onStop);
      await emit(context, clock, 'framework.plugin.stopped', plugin.manifest.name);
    } catch {
      // teardown failures are isolated
    }
  }
  for (const plugin of reversed) {
    try {
      await invokeHook(plugin.hooks?.onDispose);
      await emit(context, clock, 'framework.plugin.disposed', plugin.manifest.name);
    } catch {
      // teardown failures are isolated
    }
  }
};
