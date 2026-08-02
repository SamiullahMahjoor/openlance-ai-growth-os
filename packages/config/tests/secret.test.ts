import { describe, expect, it } from 'vitest';

import { EnvSecretProvider } from '../src/index';
import type { SecretRef } from '../src/index';

describe('EnvSecretProvider', () => {
  it('resolves a secret from the injected environment source', async () => {
    const provider = new EnvSecretProvider({ DB_PASSWORD: 's3cr3t' });
    const result = await provider.resolve({ kind: 'secret', key: 'DB_PASSWORD' });
    expect(result).toEqual({ ok: true, value: 's3cr3t' });
  });

  it('fails with CONFIG.SECRET_NOT_FOUND when the secret is absent', async () => {
    const provider = new EnvSecretProvider({});
    const result = await provider.resolve({ kind: 'secret', key: 'MISSING' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('CONFIG.SECRET_NOT_FOUND');
    }
  });

  it('defaults to the process environment when no source is given', async () => {
    // Reads the real environment through the provider (the sanctioned edge); an
    // unlikely key keeps the outcome deterministic (not found).
    const provider = new EnvSecretProvider();
    const result = await provider.resolve({
      kind: 'secret',
      key: 'AIOS_UNLIKELY_SECRET_KEY_QWERTY_1',
    });
    expect(result.ok).toBe(false);
  });
});

describe('SecretRef', () => {
  it('carries only the secret key, never the value', () => {
    const ref: SecretRef = { kind: 'secret', key: 'API_KEY' };
    expect(Object.keys(ref).sort()).toEqual(['key', 'kind']);
    expect(ref.kind).toBe('secret');
  });
});
