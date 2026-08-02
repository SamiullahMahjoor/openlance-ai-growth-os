import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { ConfigError } from './provider.js';

/**
 * An opaque reference to a secret. It carries only the secret's key, never its
 * value, so a secret never enters a `ConfigRecord` or a serialized configuration
 * dump. The value is fetched, at the point of use, through a `SecretProvider`.
 */
export interface SecretRef {
  readonly kind: 'secret';
  readonly key: string;
}

/** Resolves a `SecretRef` to its value at the point of use. */
export interface SecretProvider {
  resolve(ref: SecretRef): Promise<Result<string, ConfigError>>;
}

/**
 * A development `SecretProvider` that reads a secret from the environment at
 * resolve time and never stores it. This is a sanctioned reader of `process.env`;
 * the environment source is injectable so the provider is deterministic and
 * testable.
 */
export class EnvSecretProvider implements SecretProvider {
  readonly #source: Record<string, string | undefined>;

  constructor(source?: Record<string, string | undefined>) {
    this.#source = source ?? process.env;
  }

  async resolve(ref: SecretRef): Promise<Result<string, ConfigError>> {
    const value = this.#source[ref.key];
    if (value === undefined) {
      return err(
        new ConfigError('CONFIG.SECRET_NOT_FOUND', `Secret '${ref.key}' is not available.`, {
          key: ref.key,
        }),
      );
    }
    return ok(value);
  }
}
