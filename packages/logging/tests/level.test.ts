import { describe, expect, it } from 'vitest';

import { meetsThreshold } from '../src/level';
import { logLevelSchema } from '../src/index';

describe('meetsThreshold', () => {
  it('passes a level at or above the threshold', () => {
    expect(meetsThreshold('info', 'info')).toBe(true);
    expect(meetsThreshold('error', 'info')).toBe(true);
  });

  it('drops a level below the threshold', () => {
    expect(meetsThreshold('debug', 'info')).toBe(false);
  });
});

describe('logLevelSchema', () => {
  it('parses a valid level', () => {
    expect(logLevelSchema.parse('warn')).toEqual({ ok: true, value: 'warn' });
  });

  it('rejects an unknown level string', () => {
    expect(logLevelSchema.parse('verbose').ok).toBe(false);
  });

  it('rejects a non-string input', () => {
    expect(logLevelSchema.parse(42).ok).toBe(false);
  });
});
