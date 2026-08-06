import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { ANALYTICS_CAPABILITIES } from '@openlance/aios-analytics-intelligence';
import { CAMPAIGN_CAPABILITIES } from '@openlance/aios-campaign-intelligence';
import { CONTENT_CAPABILITIES } from '@openlance/aios-content-intelligence';
import { isOk } from '@openlance/aios-kernel';
import { MARKETING_CAPABILITIES } from '@openlance/aios-marketing-intelligence';
import { WORKFLOW_TYPES } from '@openlance/aios-openlance-growth-workflows';
import { SEO_CAPABILITIES } from '@openlance/aios-seo-intelligence';
import { SOCIAL_CAPABILITIES } from '@openlance/aios-social-intelligence';
import { describe, expect, it } from 'vitest';

import {
  AUTOMATION_CAPABILITIES,
  AutomationFramer,
  AutomationHash,
  isAutomationCapability,
} from '../src/index';

/**
 * Architectural ownership boundary (ADR-0056): Automation Intelligence owns the automation-planning behavior only. It
 * consumes a Growth Workflows output by reference, but must NEVER produce a planner artifact (MarketingBrief, ContentPlan,
 * SeoPlan, SocialPlan, AnalyticsPlan, CampaignPlan) or a GrowthWorkflow, and must never re-export those output contracts,
 * any sibling capability set, or any sibling facade. Its automation capabilities are a distinct namespace from the
 * sixty-eight planner capabilities and the fifteen Growth Workflows types. These are permanent boundary tests that fail
 * the build on ownership drift.
 */
const indexPath = fileURLToPath(new URL('../src/index.ts', import.meta.url));

const PLANNER_CAPABILITIES = [
  ...MARKETING_CAPABILITIES,
  ...CONTENT_CAPABILITIES,
  ...SEO_CAPABILITIES,
  ...SOCIAL_CAPABILITIES,
  ...ANALYTICS_CAPABILITIES,
  ...CAMPAIGN_CAPABILITIES,
];

describe('ownership boundary: Automation owns automation-planning behavior only (ADR-0056)', () => {
  it('produces and re-exports no planner artifact or growth workflow (it only consumes them by reference)', () => {
    const index = readFileSync(indexPath, 'utf8').toLowerCase();
    for (const forbidden of [
      'marketingbrief',
      'contentplan',
      'seoplan',
      'socialplan',
      'analyticsplan',
      'campaignplan',
      'growthworkflow ',
      'growthworkflowframer',
      'workflow_definitions',
      'workflow_types',
      'marketing_capabilities',
      'content_capabilities',
      'seo_capabilities',
      'social_capabilities',
      'analytics_capabilities',
      'campaign_capabilities',
    ]) {
      expect(index.includes(forbidden), `index re-exports '${forbidden}'`).toBe(false);
    }
  });

  it('AUTOMATION_CAPABILITIES are internally unique and disjoint from all 68 planner capabilities and 15 workflow types', () => {
    expect(new Set(AUTOMATION_CAPABILITIES).size).toBe(AUTOMATION_CAPABILITIES.length);
    const foreign = new Set<string>([...PLANNER_CAPABILITIES, ...WORKFLOW_TYPES]);
    // The foreign namespace is exactly the ratified architecture: 68 planner capabilities + 15 workflow types.
    expect(PLANNER_CAPABILITIES.length).toBe(68);
    expect(WORKFLOW_TYPES.length).toBe(15);
    expect(foreign.size).toBe(83);
    const collisions = AUTOMATION_CAPABILITIES.filter((capability) => foreign.has(capability));
    expect(
      collisions,
      `automation-capability / foreign-identifier collisions: ${JSON.stringify(collisions)}`,
    ).toEqual([]);
  });

  it('produces an AutomationPlan (an automation artifact), never a planner artifact or growth workflow', () => {
    const result = new AutomationFramer(new AutomationHash()).frame({
      capability: 'workflow-automation-planning',
      objective: 'automate onboarding',
      agent: 'automation-intelligence',
      workflow: 'growth-workflow-1',
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(AUTOMATION_CAPABILITIES).toContain(value.capability);
    // An automation plan carries the single consumed workflow reference and no planner-composition fields.
    expect('workflow' in value).toBe(true);
    expect('sequence' in value || 'plannerReferences' in value || 'upstream' in value).toBe(false);
  });

  it('does not own any planner capability or Growth Workflows type', () => {
    for (const foreign of [
      'positioning',
      'blog',
      'keyword-research',
      'platform-strategy',
      'kpi-planning',
      'campaign-orchestration-planning',
      'freelancer-acquisition',
      'product-launch',
    ]) {
      expect(isAutomationCapability(foreign)).toBe(false);
    }
  });
});
