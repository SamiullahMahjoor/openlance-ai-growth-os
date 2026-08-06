import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { ANALYTICS_CAPABILITIES } from '@openlance/aios-analytics-intelligence';
import { CAMPAIGN_CAPABILITIES } from '@openlance/aios-campaign-intelligence';
import { CONTENT_CAPABILITIES } from '@openlance/aios-content-intelligence';
import { isOk } from '@openlance/aios-kernel';
import { MARKETING_CAPABILITIES } from '@openlance/aios-marketing-intelligence';
import { SEO_CAPABILITIES } from '@openlance/aios-seo-intelligence';
import { SOCIAL_CAPABILITIES } from '@openlance/aios-social-intelligence';
import { describe, expect, it } from 'vitest';

import {
  GrowthWorkflowFramer,
  GrowthWorkflowHash,
  WORKFLOW_TYPES,
  isWorkflowType,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0055): OpenLance Growth Workflows owns the growth-workflow behavior only. It
 * composes the six planners by reference, but must NEVER produce a planner artifact (MarketingBrief, ContentPlan,
 * SeoPlan, SocialPlan, AnalyticsPlan, CampaignPlan), and must never re-export those output contracts or facades. Its
 * WORKFLOW_TYPES are a distinct namespace from the planners' capabilities. These are permanent boundary tests that fail
 * the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

const ALL_CAPABILITIES = [
  ...MARKETING_CAPABILITIES,
  ...CONTENT_CAPABILITIES,
  ...SEO_CAPABILITIES,
  ...SOCIAL_CAPABILITIES,
  ...ANALYTICS_CAPABILITIES,
  ...CAMPAIGN_CAPABILITIES,
];

describe('ownership boundary: Growth Workflows owns workflow behavior only (ADR-0055)', () => {
  it('produces and re-exports no planner artifact (it only composes them by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    for (const forbidden of [
      'marketingbrief',
      'contentplan',
      'seoplan',
      'socialplan',
      'analyticsplan',
      'campaignplan',
      'marketing_capabilities',
      'content_capabilities',
      'seo_capabilities',
      'social_capabilities',
      'analytics_capabilities',
      'campaign_capabilities',
    ]) {
      expect(index.includes(forbidden)).toBe(false);
    }
  });

  it('WORKFLOW_TYPES are internally unique and disjoint from all 68 planner capabilities', () => {
    // Workflow types own a distinct namespace from planner capabilities; no identifier may cross the boundary.
    expect(new Set(WORKFLOW_TYPES).size).toBe(WORKFLOW_TYPES.length);
    const capabilities = new Set<string>(ALL_CAPABILITIES);
    const collisions = WORKFLOW_TYPES.filter((type) => capabilities.has(type));
    expect(
      collisions,
      `workflow-type / capability collisions: ${JSON.stringify(collisions)}`,
    ).toEqual([]);
  });

  it('produces a GrowthWorkflow (a workflow artifact), never a planner artifact, and owns no planner capability', () => {
    const result = new GrowthWorkflowFramer(new GrowthWorkflowHash()).frame({
      type: 'freelancer-acquisition',
      objective: 'grow supply',
      agent: 'openlance-growth-workflows',
      marketing: 'm',
      content: 'c',
      seo: 's',
      social: 'so',
      analytics: 'a',
      campaign: 'cp',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const workflow = result.value;
    // A growth workflow carries the composition fields (sequence, plannerReferences, upstream) and no planner capability.
    expect(
      'sequence' in workflow && 'plannerReferences' in workflow && 'upstream' in workflow,
    ).toBe(true);
    expect('capability' in workflow).toBe(false);
    for (const capability of [
      'positioning',
      'blog',
      'keyword-research',
      'kpi-planning',
      'campaign-orchestration-planning',
    ]) {
      expect(isWorkflowType(capability)).toBe(false);
    }
  });
});
