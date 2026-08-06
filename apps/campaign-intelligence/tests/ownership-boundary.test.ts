import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CAMPAIGN_CAPABILITIES,
  CampaignFramer,
  CampaignHash,
  isCampaignCapability,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0054): Campaign Intelligence owns the campaign planning behavior only. It
 * consumes a Marketing, Content, SEO, Social, and Analytics output by reference, but must NEVER produce a MarketingBrief,
 * ContentPlan, SeoPlan, SocialPlan, or AnalyticsPlan, and must never re-export those output contracts. It must never own
 * the frozen Marketing `campaign-planning` or Social `campaign-evaluation` identifiers. These are permanent boundary
 * tests that fail the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

describe('ownership boundary: Campaign owns campaign planning behavior only (ADR-0054)', () => {
  it('produces and re-exports no upstream planner artifact (it only consumes them by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    // Campaign may import the AnalyticsPlan type internally (integration.ts) as input, but the public API must not
    // re-export it, any sibling capability set, or any sibling facade.
    for (const forbidden of [
      'marketingbrief',
      'contentplan',
      'seoplan',
      'socialplan',
      'analyticsplan',
      'marketing_capabilities',
      'content_capabilities',
      'seo_capabilities',
      'social_capabilities',
      'analytics_capabilities',
      'marketingintelligence',
      'contentintelligence',
      'seointelligence',
      'socialintelligence',
      'analyticsintelligence',
    ]) {
      expect(index.includes(forbidden)).toBe(false);
    }
  });

  it('produces a CampaignPlan (a campaign artifact), never an upstream planner artifact', () => {
    const result = new CampaignFramer(new CampaignHash()).frame({
      capability: 'campaign-orchestration-planning',
      objective: 'orchestrate the launch',
      agent: 'campaign-intelligence',
      marketing: 'marketing-brief-1',
      content: 'content-plan-1',
      seo: 'seo-plan-1',
      social: 'social-plan-1',
      analytics: 'analytics-plan-1',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const plan = result.value;
    expect(CAMPAIGN_CAPABILITIES).toContain(plan.capability);
    // A campaign plan carries the five consumed reference fields and authors nothing.
    expect(
      'marketing' in plan &&
        'content' in plan &&
        'seo' in plan &&
        'social' in plan &&
        'analytics' in plan,
    ).toBe(true);
  });

  it('does not own any frozen upstream capability, nor the frozen campaign-planning / campaign-evaluation identifiers', () => {
    for (const foreign of [
      'positioning',
      'blog',
      'keyword-research',
      'platform-strategy',
      'kpi-planning',
      'campaign-planning',
      'campaign-evaluation',
    ]) {
      expect(isCampaignCapability(foreign)).toBe(false);
    }
  });
});
