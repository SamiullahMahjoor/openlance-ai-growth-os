import { ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { ConfigError, ConfigProvider, ConfigRecord } from './provider.js';

/**
 * Reads configuration from the environment (priority 20 by default). This is the
 * single sanctioned place that reads `process.env`; every other package receives
 * typed, validated configuration instead. The environment source is injectable so
 * the provider is deterministic and testable; production uses `process.env`.
 *
 * Keys matching the optional prefix are included with the prefix stripped; values
 * are contributed as strings. Nested shaping is left to the typed schema.
 */
export class EnvProvider implements ConfigProvider {
  readonly name = 'env';
  readonly priority: number;
  readonly #source: Record<string, string | undefined>;
  readonly #prefix: string;

  constructor(
    options: {
      source?: Record<string, string | undefined>;
      prefix?: string;
      priority?: number;
    } = {},
  ) {
    this.priority = options.priority ?? 20;
    this.#source = options.source ?? process.env;
    this.#prefix = options.prefix ?? '';
  }

  load(): Result<ConfigRecord, ConfigError> {
    const record: Record<string, string> = {};
    for (const key of Object.keys(this.#source).sort()) {
      const value = this.#source[key];
      if (value === undefined) {
        continue;
      }
      if (!key.startsWith(this.#prefix)) {
        continue;
      }
      record[key.slice(this.#prefix.length)] = value;
    }
    return ok(record);
  }
}
