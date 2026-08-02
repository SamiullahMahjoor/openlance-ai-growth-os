import { BaseError } from '@openlance/aios-errors';

import type { Result } from '@openlance/aios-kernel';

/**
 * A tree of configuration values. Leaves are `string`, `number`, or `boolean`;
 * branches are nested records. A secret value never appears here; only a
 * `SecretRef` reference does.
 */
export interface ConfigRecord {
  readonly [key: string]: string | number | boolean | ConfigRecord;
}

/**
 * A configuration error: a source failed to load, a required section is missing,
 * or the merged configuration failed schema validation. It is a domain error
 * distinguished by its stable `CONFIG.*` code; a wrapped schema failure carries the
 * originating `ValidationError` as its cause.
 */
export class ConfigError extends BaseError {
  readonly category = 'domain';
}

/**
 * A source of configuration. Each provider contributes a record at a fixed integer
 * priority; higher priorities override lower ones during the deterministic merge.
 */
export interface ConfigProvider {
  readonly name: string;
  readonly priority: number;
  load(): Result<ConfigRecord, ConfigError>;
}
