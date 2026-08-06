import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_CAPABILITIES,
  AnalyticsFramer,
  AnalyticsHash,
  isAnalyticsCapability,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0053): Analytics Intelligence owns the analytics behavior only. It consumes a
 * Marketing, Content, SEO, and Social output by reference, but must NEVER produce a MarketingBrief, ContentPlan, SeoPlan,
 * or SocialPlan, and must never re-export those output contracts. These are permanent boundary tests that fail the build
 * on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

describe('ownership boundary: Analytics owns analytics behavior only (ADR-0053)', () => {
  it('produces and re-exports no upstream planner artifact (it only consumes them by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    // Analytics may import the SocialPlan type internally (integration.ts) as input, but the public API must not
    // re-export it, any sibling capability set, or any sibling facade.
    for (const forbidden of [
      'marketingbrief',
      'contentplan',
      'seoplan',
      'socialplan',
      'marketing_capabilities',
      'content_capabilities',
      'seo_capabilities',
      'social_capabilities',
      'marketingintelligence',
      'contentintelligence',
      'seointelligence',
      'socialintelligence',
    ]) {
      expect(index.includes(forbidden)).toBe(false);
    }
  });

  it('produces an AnalyticsPlan (an analytics artifact), never an upstream planner artifact', () => {
    const result = new AnalyticsFramer(new AnalyticsHash()).frame({
      capability: 'kpi-planning',
      objective: 'track the funnel',
      agent: 'analytics-intelligence',
      marketing: 'marketing-brief-1',
      content: 'content-plan-1',
      seo: 'seo-plan-1',
      social: 'social-plan-1',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const plan = result.value;
    expect(ANALYTICS_CAPABILITIES).toContain(plan.capability);
    // An analytics plan carries the four consumed reference fields and authors nothing.
    expect('marketing' in plan && 'content' in plan && 'seo' in plan && 'social' in plan).toBe(
      true,
    );
  });

  it('does not own any marketing, content, SEO, or social capability', () => {
    for (const foreign of [
      'positioning',
      'blog',
      'keyword-research',
      'serp-opportunity-analysis',
      'platform-strategy',
      'campaign-evaluation',
    ]) {
      expect(isAnalyticsCapability(foreign)).toBe(false);
    }
  });
});
