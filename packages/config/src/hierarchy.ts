import { ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { ConfigError, ConfigProvider, ConfigRecord } from './provider.js';

const isRecord = (value: string | number | boolean | ConfigRecord): value is ConfigRecord =>
  typeof value === 'object';

const deepMerge = (base: ConfigRecord, override: ConfigRecord): ConfigRecord => {
  const result: Record<string, string | number | boolean | ConfigRecord> = { ...base };
  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = base[key];
    if (baseValue !== undefined && isRecord(baseValue) && isRecord(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }
  return result;
};

const deepFreeze = (record: ConfigRecord): ConfigRecord => {
  for (const value of Object.values(record)) {
    if (isRecord(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(record);
};

/**
 * Loads every provider, merges the results deep by ascending priority (higher
 * overrides lower), and returns a frozen snapshot. Merge order depends only on
 * `(priority, name)`, so it is independent of the order providers were registered.
 * If any provider fails to load, the failure is returned and merging stops (fail
 * closed).
 */
export const mergeProviders = (
  providers: readonly ConfigProvider[],
): Result<ConfigRecord, ConfigError> => {
  const sorted = [...providers].sort(
    (a, b) => a.priority - b.priority || a.name.localeCompare(b.name),
  );
  let merged: ConfigRecord = {};
  for (const provider of sorted) {
    const loaded = provider.load();
    if (!loaded.ok) {
      return loaded;
    }
    merged = deepMerge(merged, loaded.value);
  }
  return ok(deepFreeze(merged));
};
