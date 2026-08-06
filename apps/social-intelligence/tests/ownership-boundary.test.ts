import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import { SOCIAL_CAPABILITIES, SocialFramer, SocialHash, isSocialCapability } from '../src/index';

/**
 * Architectural ownership boundary (ADR-0052): Social Intelligence owns the social-media behavior only. It consumes a
 * Marketing, Content, and SEO output by reference, but must NEVER produce a MarketingBrief, a ContentPlan, or a SeoPlan,
 * author content, or produce any marketing/content/SEO output, and must never re-export those output contracts. These are
 * permanent boundary tests that fail the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

describe('ownership boundary: Social owns social behavior only (ADR-0052)', () => {
  it('produces and re-exports no marketing, content, or SEO artifact (it only consumes them by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    // Social may import the SeoPlan type internally (integration.ts) as input, but the public API must not re-export it,
    // the sibling capability sets, or the sibling facades.
    expect(index.includes('marketingbrief')).toBe(false);
    expect(index.includes('marketing_capabilities')).toBe(false);
    expect(index.includes('marketingintelligence')).toBe(false);
    expect(index.includes('contentplan')).toBe(false);
    expect(index.includes('content_capabilities')).toBe(false);
    expect(index.includes('contentintelligence')).toBe(false);
    expect(index.includes('seoplan')).toBe(false);
    expect(index.includes('seo_capabilities')).toBe(false);
    expect(index.includes('seointelligence')).toBe(false);
  });

  it('produces a SocialPlan (a social artifact), never a marketing, content, or SEO artifact', () => {
    const result = new SocialFramer(new SocialHash()).frame({
      capability: 'platform-strategy',
      objective: 'launch the campaign',
      agent: 'social-intelligence',
      marketing: 'marketing-brief-1',
      content: 'content-plan-1',
      seo: 'seo-plan-1',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const plan = result.value;
    expect(SOCIAL_CAPABILITIES).toContain(plan.capability);
    // A social plan carries the consumed reference fields (marketing, content, seo) and authors nothing.
    expect('marketing' in plan && 'content' in plan && 'seo' in plan).toBe(true);
  });

  it('authors no content and owns no marketing, content, or SEO capability', () => {
    for (const foreign of [
      'positioning',
      'messaging',
      'blog',
      'landing-page',
      'keyword-research',
      'serp-opportunity-analysis',
    ]) {
      expect(isSocialCapability(foreign)).toBe(false);
    }
  });
});
