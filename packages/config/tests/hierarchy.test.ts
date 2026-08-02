import { err } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { ConfigError, ObjectProvider } from '../src/index';
import type { ConfigProvider, ConfigRecord } from '../src/index';
import { mergeProviders } from '../src/hierarchy';

const failing: ConfigProvider = {
  name: 'failing',
  priority: 5,
  load: (): Result<ConfigRecord, ConfigError> =>
    err(new ConfigError('CONFIG.LOAD_FAILED', 'source failed', {})),
};

describe('mergeProviders', () => {
  it('merges by ascending priority, higher overriding lower', () => {
    const defaults = new ObjectProvider('defaults', 0, { host: 'default', port: 1 });
    const env = new ObjectProvider('env', 20, { host: 'env' });
    const merged = mergeProviders([defaults, env]);
    expect(merged).toEqual({ ok: true, value: { host: 'env', port: 1 } });
  });

  it('is independent of the order providers are registered', () => {
    const defaults = new ObjectProvider('defaults', 0, { host: 'default' });
    const env = new ObjectProvider('env', 20, { host: 'env' });
    const forward = mergeProviders([defaults, env]);
    const backward = mergeProviders([env, defaults]);
    expect(forward).toEqual(backward);
  });

  it('breaks equal priorities deterministically by name', () => {
    const a = new ObjectProvider('a', 10, { value: 'a' });
    const b = new ObjectProvider('b', 10, { value: 'b' });
    expect(mergeProviders([a, b])).toEqual({ ok: true, value: { value: 'b' } });
    expect(mergeProviders([b, a])).toEqual({ ok: true, value: { value: 'b' } });
  });

  it('deep-merges nested records rather than replacing them', () => {
    const base = new ObjectProvider('base', 0, { db: { host: 'localhost', port: 5432 } });
    const over = new ObjectProvider('over', 10, { db: { host: 'remote' } });
    expect(mergeProviders([base, over])).toEqual({
      ok: true,
      value: { db: { host: 'remote', port: 5432 } },
    });
  });

  it('returns a deeply frozen snapshot', () => {
    const merged = mergeProviders([new ObjectProvider('base', 0, { db: { host: 'localhost' } })]);
    expect(merged.ok).toBe(true);
    if (merged.ok) {
      expect(Object.isFrozen(merged.value)).toBe(true);
      expect(Object.isFrozen(merged.value['db'])).toBe(true);
    }
  });

  it('accepts an empty provider list', () => {
    expect(mergeProviders([])).toEqual({ ok: true, value: {} });
  });

  it('fails closed when a provider fails to load', () => {
    const merged = mergeProviders([new ObjectProvider('ok', 0, { a: 1 }), failing]);
    expect(merged.ok).toBe(false);
    if (!merged.ok) {
      expect(merged.error.code).toBe('CONFIG.LOAD_FAILED');
    }
  });
});
