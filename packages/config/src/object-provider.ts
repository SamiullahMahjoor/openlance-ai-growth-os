import { ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { ConfigError, ConfigProvider, ConfigRecord } from './provider.js';

/**
 * A provider over a fixed, in-memory record contributed at a chosen name and
 * priority. Used to supply known configuration (and as the basis for defaults).
 */
export class ObjectProvider implements ConfigProvider {
  readonly name: string;
  readonly priority: number;
  readonly #record: ConfigRecord;

  constructor(name: string, priority: number, record: ConfigRecord) {
    this.name = name;
    this.priority = priority;
    this.#record = record;
  }

  load(): Result<ConfigRecord, ConfigError> {
    return ok(this.#record);
  }
}

/**
 * The lowest-priority provider (priority 0): the built-in defaults every other
 * source overrides. Defaults live in data supplied here, never in code paths.
 */
export class DefaultsProvider extends ObjectProvider {
  constructor(record: ConfigRecord) {
    super('defaults', 0, record);
  }
}
