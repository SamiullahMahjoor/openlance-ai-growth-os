import { token } from '@openlance/aios-di';
import type { Token } from '@openlance/aios-di';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { mergeProviders } from './hierarchy.js';
import { ConfigError } from './provider.js';
import type { ConfigProvider, ConfigRecord } from './provider.js';
import type { Schema } from './schema.js';

/**
 * Typed, validated access to configuration. There is no untyped `get(string)`
 * escape hatch: every read is validated through a `Schema<T>` and returns either a
 * typed value or a structured `ConfigError`.
 */
export interface ConfigService {
  get<T>(schema: Schema<T>): Result<T, ConfigError>;
  getSection<T>(key: string, schema: Schema<T>): Result<T, ConfigError>;
}

/**
 * The dependency-injection token under which a built `ConfigService` is registered
 * and resolved within a container. The composition root builds the service (see
 * `createConfigService`) and registers it under this token.
 */
export const CONFIG_SERVICE: Token<ConfigService> = token<ConfigService>('aios.config.service');

class ConfigServiceImpl implements ConfigService {
  readonly #snapshot: ConfigRecord;

  constructor(snapshot: ConfigRecord) {
    this.#snapshot = snapshot;
  }

  get<T>(schema: Schema<T>): Result<T, ConfigError> {
    return this.#validate(this.#snapshot, schema);
  }

  getSection<T>(key: string, schema: Schema<T>): Result<T, ConfigError> {
    const section = this.#snapshot[key];
    if (section === undefined) {
      return err(
        new ConfigError('CONFIG.MISSING_SECTION', `Missing configuration section '${key}'.`, {
          key,
        }),
      );
    }
    return this.#validate(section, schema);
  }

  #validate<T>(input: unknown, schema: Schema<T>): Result<T, ConfigError> {
    const parsed = schema.parse(input);
    if (parsed.ok) {
      return parsed;
    }
    return err(
      new ConfigError(
        'CONFIG.VALIDATION_FAILED',
        'Configuration failed validation.',
        { issues: parsed.error.issues },
        parsed.error,
      ),
    );
  }
}

/**
 * Builds an immutable, merged configuration snapshot from the given providers and
 * returns a `ConfigService` over it. Fails closed: if any provider fails to load,
 * the error is returned and no service is produced.
 */
export const createConfigService = (
  providers: readonly ConfigProvider[],
): Result<ConfigService, ConfigError> => {
  const merged = mergeProviders(providers);
  if (!merged.ok) {
    return merged;
  }
  return ok(new ConfigServiceImpl(merged.value));
};

/**
 * Startup validation helper. Builds the service from the providers and validates
 * the whole configuration against the schema, returning the typed value or a
 * `ConfigError`. It fails closed on a source load failure or a validation failure,
 * so a process can refuse to start on invalid or missing required configuration.
 */
export const loadConfig = <T>(
  providers: readonly ConfigProvider[],
  schema: Schema<T>,
): Result<T, ConfigError> => {
  const service = createConfigService(providers);
  if (!service.ok) {
    return service;
  }
  return service.value.get(schema);
};
