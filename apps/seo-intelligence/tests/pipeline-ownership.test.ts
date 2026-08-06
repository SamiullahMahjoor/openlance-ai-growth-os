import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Permanent planner-pipeline ownership guard (ADR-0051 / ADR-0052, ratified linear chain). The only permitted planner
 * chain is `Marketing -> Content -> SEO -> Social`: each subsystem depends solely on its immediate predecessor, so the
 * further-upstream context is reached transitively. No fan-in edges may be introduced. This guard reads the four
 * subsystems' declared dependencies (and this package's own source) and fails the build on any forbidden edge. It is a
 * permanent architectural regression test; a duplicate lives in the Social package so either package alone enforces it.
 */
const appsDir = fileURLToPath(new URL('../../', import.meta.url));

const MARKETING = '@openlance/aios-marketing-intelligence';
const CONTENT = '@openlance/aios-content-intelligence';
const SEO = '@openlance/aios-seo-intelligence';
const SOCIAL = '@openlance/aios-social-intelligence';

const dependenciesOf = (pkg: string): string[] => {
  const json = JSON.parse(readFileSync(join(appsDir, pkg, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  return Object.keys(json.dependencies ?? {});
};

const srcDir = fileURLToPath(new URL('../src/', import.meta.url));
const sourceText = (): string =>
  readdirSync(srcDir)
    .filter((name) => name.endsWith('.ts'))
    .map((name) => readFileSync(join(srcDir, name), 'utf8'))
    .join('\n');

describe('planner pipeline ownership guard (ratified chain Marketing -> Content -> SEO -> Social)', () => {
  it('Marketing (chain head) imports no downstream planner (not Content, SEO, or Social)', () => {
    const marketing = dependenciesOf('marketing-intelligence');
    expect(marketing).not.toContain(CONTENT);
    expect(marketing).not.toContain(SEO);
    expect(marketing).not.toContain(SOCIAL);
  });

  it('Content imports only its predecessor Marketing, never SEO or Social', () => {
    const content = dependenciesOf('content-intelligence');
    expect(content).toContain(MARKETING);
    expect(content).not.toContain(SEO);
    expect(content).not.toContain(SOCIAL);
  });

  it('SEO imports only its predecessor Content, never Marketing directly or Social', () => {
    const seo = dependenciesOf('seo-intelligence');
    expect(seo).toContain(CONTENT);
    expect(seo).not.toContain(MARKETING);
    expect(seo).not.toContain(SOCIAL);
  });

  it('Social imports only its predecessor SEO, never Marketing or Content directly', () => {
    const social = dependenciesOf('social-intelligence');
    expect(social).toContain(SEO);
    expect(social).not.toContain(MARKETING);
    expect(social).not.toContain(CONTENT);
  });

  it('this package imports no forbidden planner in source (only Content by reference)', () => {
    const text = sourceText();
    expect(text).toContain(CONTENT);
    expect(text.includes(MARKETING)).toBe(false);
    expect(text.includes(SOCIAL)).toBe(false);
  });
});
