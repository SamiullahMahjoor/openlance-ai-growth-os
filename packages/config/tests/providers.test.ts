import { describe, expect, it } from 'vitest';

import { DefaultsProvider, EnvProvider, ObjectProvider } from '../src/index';

describe('ObjectProvider', () => {
  it('contributes its record at the given name and priority', () => {
    const provider = new ObjectProvider('custom', 15, { a: 1 });
    expect(provider.name).toBe('custom');
    expect(provider.priority).toBe(15);
    const loaded = provider.load();
    expect(loaded).toEqual({ ok: true, value: { a: 1 } });
  });
});

describe('DefaultsProvider', () => {
  it('is the priority-0 defaults source', () => {
    const provider = new DefaultsProvider({ a: 1 });
    expect(provider.name).toBe('defaults');
    expect(provider.priority).toBe(0);
    expect(provider.load()).toEqual({ ok: true, value: { a: 1 } });
  });
});

describe('EnvProvider', () => {
  it('reads a prefixed environment, stripping the prefix and skipping the rest', () => {
    const provider = new EnvProvider({
      source: { AIOS_A: '1', AIOS_B: '2', OTHER: 'x', AIOS_C: undefined },
      prefix: 'AIOS_',
    });
    expect(provider.name).toBe('env');
    expect(provider.priority).toBe(20);
    expect(provider.load()).toEqual({ ok: true, value: { A: '1', B: '2' } });
  });

  it('reads the whole source when no prefix is given', () => {
    const provider = new EnvProvider({ source: { X: 'a', Y: 'b' } });
    expect(provider.load()).toEqual({ ok: true, value: { X: 'a', Y: 'b' } });
  });

  it('accepts a custom priority', () => {
    expect(new EnvProvider({ source: {}, priority: 25 }).priority).toBe(25);
  });

  it('defaults to the process environment when no source is given', () => {
    // Reads the real environment through the provider (the sanctioned edge); an
    // unlikely prefix keeps the outcome deterministic without asserting content.
    const provider = new EnvProvider({ prefix: 'AIOS_UNLIKELY_ENV_PREFIX_QWERTY_' });
    expect(provider.load().ok).toBe(true);
  });
});
