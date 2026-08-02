import type { SecretRef } from '@openlance/aios-config';

const REDACTED = '[redacted]';

const isSecretRef = (value: unknown): value is SecretRef =>
  typeof value === 'object' && value !== null && (value as { kind?: unknown }).kind === 'secret';

/**
 * Removes secret-shaped values from a field set before it reaches a record, so a
 * secret never appears in a log. It redacts any field whose value is a `SecretRef`
 * (the configuration secret convention) and any field whose key is configured as
 * sensitive.
 */
export interface Redactor {
  redact(fields: Record<string, unknown>): Record<string, unknown>;
}

const DEFAULT_SENSITIVE_KEYS: readonly string[] = [
  'password',
  'secret',
  'token',
  'apikey',
  'credential',
];

/**
 * Creates a redactor. Field keys matching `sensitiveKeys` (case-insensitive) and
 * any `SecretRef` value are replaced with a fixed marker; all other fields pass
 * through unchanged.
 */
export const createRedactor = (
  sensitiveKeys: readonly string[] = DEFAULT_SENSITIVE_KEYS,
): Redactor => {
  const sensitive = new Set(sensitiveKeys.map((key) => key.toLowerCase()));
  return {
    redact: (fields) => {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        result[key] = sensitive.has(key.toLowerCase()) || isSecretRef(value) ? REDACTED : value;
      }
      return result;
    },
  };
};
