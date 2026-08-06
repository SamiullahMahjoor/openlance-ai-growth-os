import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { SEO_CAPABILITIES, SeoFramer, SeoHash, isSeoCapability } from '../src/index';

/**
 * Architectural ownership boundary (ADR-0051): SEO Intelligence owns the SEO behavior only. It consumes a Marketing
 * direction and a Content output by reference, but must NEVER produce a MarketingBrief, a ContentPlan, or a SocialPlan,
 * create content, or produce any marketing/content/social output, and must never re-export those output contracts. These
 * are permanent boundary tests that fail the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

describe('ownership boundary: SEO owns SEO behavior only (ADR-0051)', () => {
  it('produces and re-exports no marketing, content, or social artifact (it only consumes upstream ones by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    // SEO may import the ContentPlan type internally (integration.ts) as input, but the public API must not re-export it,
    // the sibling capability sets, or the sibling facades.
    expect(index.includes('marketingbrief')).toBe(false);
    expect(index.includes('marketing_capabilities')).toBe(false);
    expect(index.includes('marketingintelligence')).toBe(false);
    expect(index.includes('contentplan')).toBe(false);
    expect(index.includes('content_capabilities')).toBe(false);
    expect(index.includes('contentintelligence')).toBe(false);
    expect(index.includes('socialplan')).toBe(false);
    expect(index.includes('social_capabilities')).toBe(false);
    expect(index.includes('socialintelligence')).toBe(false);
  });

  it('produces a SeoPlan (an SEO artifact), never a marketing, content, or social artifact', () => {
    const result = new SeoFramer(new SeoHash()).frame({
      capability: 'keyword-research',
      objective: 'rank for fair fees',
      agent: 'seo-intelligence',
      marketing: 'marketing-brief-1',
      content: 'content-plan-1',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const plan = result.value;
    expect(SEO_CAPABILITIES).toContain(plan.capability);
    // An SEO plan carries the SEO reference fields and no content-authoring or brand-ownership fields.
    expect('brandVoice' in plan).toBe(false);
    expect('marketing' in plan && 'content' in plan).toBe(true);
  });

  it('does not own any marketing, content, or social capability', () => {
    for (const foreign of [
      'positioning',
      'messaging',
      'blog',
      'landing-page',
      'platform-strategy',
      'hashtag-planning',
    ]) {
      expect(isSeoCapability(foreign)).toBe(false);
    }
  });
});
