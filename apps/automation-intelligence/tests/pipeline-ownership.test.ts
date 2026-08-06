import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Permanent pipeline ownership guard (ADR-0051..0056, ratified linear chain). The only permitted chain is
 * `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows -> Automation`: each subsystem
 * depends solely on its immediate predecessor, so the further-upstream context is reached transitively. No fan-in edges,
 * no reverse edges, no cycles. This guard reads every stage's declared runtime dependencies (and this package's own
 * source) and fails the build on any forbidden edge. It is a permanent architectural regression test.
 */
const appsDir = fileURLToPath(new URL('../../', import.meta.url));

/** The ordered chain, by package directory name; index i depends only on index i-1. */
const CHAIN = [
  'marketing-intelligence',
  'content-intelligence',
  'seo-intelligence',
  'social-intelligence',
  'analytics-intelligence',
  'campaign-intelligence',
  'openlance-growth-workflows',
  'automation-intelligence',
];

const pkgName = (dir: string): string => `@openlance/aios-${dir}`;

const dependenciesOf = (dir: string): string[] => {
  const json = JSON.parse(readFileSync(join(appsDir, dir, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  return Object.keys(json.dependencies ?? {});
};

describe('pipeline ownership guard (chain Marketing -> ... -> Growth Workflows -> Automation)', () => {
  for (let index = 0; index < CHAIN.length; index += 1) {
    const dir = CHAIN[index] as string;
    const predecessor = index > 0 ? pkgName(CHAIN[index - 1] as string) : null;

    it(`${dir} depends only on its immediate predecessor among the chain packages`, () => {
      const deps = dependenciesOf(dir);
      if (predecessor !== null) {
        expect(deps).toContain(predecessor);
      }
      // No runtime dependency on any chain package other than the immediate predecessor (no fan-in, reverse, or cycle).
      CHAIN.forEach((otherDir, otherIndex) => {
        if (otherIndex !== index - 1) {
          expect(deps).not.toContain(pkgName(otherDir));
        }
      });
    });
  }

  it('this package imports only its predecessor (Growth Workflows) among the chain packages in source', () => {
    const srcDir = fileURLToPath(new URL('../src/', import.meta.url));
    const text = readdirSync(srcDir)
      .filter((name) => name.endsWith('.ts'))
      .map((name) => readFileSync(join(srcDir, name), 'utf8'))
      .join('\n');
    expect(text).toContain(pkgName('openlance-growth-workflows'));
    for (const dir of [
      'marketing-intelligence',
      'content-intelligence',
      'seo-intelligence',
      'social-intelligence',
      'analytics-intelligence',
      'campaign-intelligence',
    ]) {
      expect(text.includes(pkgName(dir))).toBe(false);
    }
  });
});
