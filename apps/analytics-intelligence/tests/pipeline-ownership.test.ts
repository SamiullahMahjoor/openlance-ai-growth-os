import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Permanent planner-pipeline ownership guard (ADR-0051 / ADR-0052 / ADR-0053 / ADR-0054, ratified linear chain). The only
 * permitted planner chain is `Marketing -> Content -> SEO -> Social -> Analytics -> Campaign`: each subsystem depends
 * solely on its immediate predecessor, so the further-upstream context is reached transitively. No fan-in edges, no
 * reverse edges, no cycles. This guard reads every planner's declared dependencies (and this package's own source) and
 * fails the build on any forbidden edge. It is a permanent architectural regression test; a duplicate lives in the
 * Campaign package so either package alone enforces it.
 */
const appsDir = fileURLToPath(new URL('../../', import.meta.url));

/** The ordered planner chain, by package directory name; index i depends only on index i-1. */
const CHAIN = [
  'marketing-intelligence',
  'content-intelligence',
  'seo-intelligence',
  'social-intelligence',
  'analytics-intelligence',
  'campaign-intelligence',
];

const pkgName = (dir: string): string => `@openlance/aios-${dir}`;

const dependenciesOf = (dir: string): string[] => {
  const json = JSON.parse(readFileSync(join(appsDir, dir, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  return Object.keys(json.dependencies ?? {});
};

describe('planner pipeline ownership guard (ratified chain Marketing -> Content -> SEO -> Social -> Analytics -> Campaign)', () => {
  for (let index = 0; index < CHAIN.length; index += 1) {
    const dir = CHAIN[index] as string;
    const predecessor = index > 0 ? pkgName(CHAIN[index - 1] as string) : null;

    it(`${dir} depends only on its immediate predecessor among the planners`, () => {
      const deps = dependenciesOf(dir);
      if (predecessor !== null) {
        expect(deps).toContain(predecessor);
      }
      // No dependency on any planner other than the immediate predecessor (no fan-in, no reverse, no cycle).
      CHAIN.forEach((otherDir, otherIndex) => {
        if (otherIndex !== index - 1) {
          expect(deps).not.toContain(pkgName(otherDir));
        }
      });
    });
  }

  it('this package imports only its predecessor (Social) among the planners in source', () => {
    const srcDir = fileURLToPath(new URL('../src/', import.meta.url));
    const text = readdirSync(srcDir)
      .filter((name) => name.endsWith('.ts'))
      .map((name) => readFileSync(join(srcDir, name), 'utf8'))
      .join('\n');
    expect(text).toContain(pkgName('social-intelligence'));
    for (const dir of [
      'marketing-intelligence',
      'content-intelligence',
      'seo-intelligence',
      'campaign-intelligence',
    ]) {
      expect(text.includes(pkgName(dir))).toBe(false);
    }
  });
});
