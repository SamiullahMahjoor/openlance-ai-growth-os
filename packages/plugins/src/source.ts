import type { Result } from '@openlance/aios-kernel';

import type { PluginError } from './compatibility.js';
import type { PluginManifest } from './manifest.js';

/**
 * A discovery source: it lists the manifests available over a provided in-memory
 * list. The contract bakes in no filesystem or network assumption; a concrete
 * source is supplied by the caller.
 */
export interface PluginSource {
  list(): Result<PluginManifest[], PluginError>;
}
