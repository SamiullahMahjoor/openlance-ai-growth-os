import { describe, expect, it } from 'vitest';

import { validateCompatibility } from '../src/compatibility';
import type { PluginManifest } from '../src/index';

const manifest = (
  name: string,
  version: string,
  apiVersion: string,
  dependsOn?: readonly { name: string; range: string }[],
): PluginManifest =>
  dependsOn ? { name, version, apiVersion, dependsOn } : { name, version, apiVersion };

const codes = (result: ReturnType<typeof validateCompatibility>): string[] =>
  result.ok ? [] : result.error.map((error) => error.code);

describe('validateCompatibility', () => {
  it('accepts a compatible manifest', () => {
    expect(validateCompatibility([manifest('a', '1.0.0', '1.2.0')], '^1.0.0').ok).toBe(true);
  });

  it('rejects an apiVersion outside the supported range', () => {
    const result = validateCompatibility([manifest('a', '1.0.0', '2.0.0')], '^1.0.0');
    expect(result.ok).toBe(false);
    expect(codes(result)).toContain('PLUGIN.INCOMPATIBLE_API');
  });

  it('reports a missing dependency', () => {
    const result = validateCompatibility(
      [manifest('a', '1.0.0', '1.0.0', [{ name: 'b', range: '^1.0.0' }])],
      '^1.0.0',
    );
    expect(codes(result)).toContain('PLUGIN.MISSING_DEPENDENCY');
  });

  it('reports an out-of-range dependency', () => {
    const result = validateCompatibility(
      [
        manifest('a', '1.0.0', '1.0.0', [{ name: 'b', range: '^2.0.0' }]),
        manifest('b', '1.0.0', '1.0.0'),
      ],
      '^1.0.0',
    );
    expect(codes(result)).toContain('PLUGIN.INCOMPATIBLE_DEPENDENCY');
  });

  it('accepts an in-range dependency', () => {
    const result = validateCompatibility(
      [
        manifest('a', '1.0.0', '1.0.0', [{ name: 'b', range: '^1.0.0' }]),
        manifest('b', '1.5.0', '1.0.0'),
      ],
      '^1.0.0',
    );
    expect(result.ok).toBe(true);
  });

  it('reports a circular dependency', () => {
    const result = validateCompatibility(
      [
        manifest('a', '1.0.0', '1.0.0', [{ name: 'b', range: '^1.0.0' }]),
        manifest('b', '1.0.0', '1.0.0', [{ name: 'a', range: '^1.0.0' }]),
      ],
      '^1.0.0',
    );
    expect(codes(result)).toContain('PLUGIN.CIRCULAR_DEPENDENCY');
  });
});

describe('semver range subset (through the apiVersion check)', () => {
  const ok = (apiVersion: string, range: string): boolean =>
    validateCompatibility([manifest('a', '1.0.0', apiVersion)], range).ok;

  it('caret matches the same major at or above the base', () => {
    expect(ok('1.5.0', '^1.2.0')).toBe(true);
    expect(ok('1.1.0', '^1.2.0')).toBe(false);
    expect(ok('2.0.0', '^1.2.0')).toBe(false);
  });

  it('supports comparator ranges', () => {
    expect(ok('1.2.0', '>=1.0.0')).toBe(true);
    expect(ok('0.9.0', '>=1.0.0')).toBe(false);
    expect(ok('1.0.0', '<=1.0.0')).toBe(true);
    expect(ok('1.0.1', '<=1.0.0')).toBe(false);
    expect(ok('1.1.0', '>1.0.0')).toBe(true);
    expect(ok('1.0.0', '>1.0.0')).toBe(false);
    expect(ok('0.9.0', '<1.0.0')).toBe(true);
    expect(ok('1.0.0', '<1.0.0')).toBe(false);
  });

  it('supports exact versions and conjunctions', () => {
    expect(ok('1.2.3', '1.2.3')).toBe(true);
    expect(ok('1.2.4', '1.2.3')).toBe(false);
    expect(ok('1.2.3', '=1.2.3')).toBe(true);
    expect(ok('1.5.0', '>=1.0.0 <2.0.0')).toBe(true);
    expect(ok('2.0.0', '>=1.0.0 <2.0.0')).toBe(false);
  });

  it('rejects an invalid version or range', () => {
    expect(ok('not-a-version', '^1.0.0')).toBe(false);
    expect(ok('1.0.0', '^not-a-version')).toBe(false);
    expect(ok('1.0.0', '>=not-a-version')).toBe(false);
  });
});
