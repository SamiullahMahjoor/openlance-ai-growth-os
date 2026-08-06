import { CampaignIntelligence } from '@openlance/aios-campaign-intelligence';
import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  GrowthWorkflowFramer,
  GrowthWorkflowHash,
  GrowthWorkflowNormalizer,
  OpenLanceGrowthWorkflows,
  WORKFLOW_AGENT,
  WORKFLOW_DEFINITIONS,
  WORKFLOW_TYPES,
  isWorkflowType,
  workflowEvaluationRequest,
  workflowFromCampaign,
} from '../src/index';
import type { GrowthWorkflow, GrowthWorkflowRequest } from '../src/index';

const request = (over: Partial<GrowthWorkflowRequest> = {}): GrowthWorkflowRequest => ({
  type: 'freelancer-acquisition',
  objective: 'grow the freelancer supply side',
  agent: 'openlance-growth-workflows',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  analytics: 'analytics-plan-1',
  campaign: 'campaign-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
  ...over,
});

const workflow = (): GrowthWorkflow => {
  const result = new GrowthWorkflowFramer(new GrowthWorkflowHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const campaignPlan = () => {
  const framed = new CampaignIntelligence().plan({
    capability: 'campaign-orchestration-planning',
    objective: 'orchestrate the launch',
    agent: 'campaign-intelligence',
    marketing: 'marketing-brief-1',
    content: 'content-plan-1',
    seo: 'seo-plan-1',
    social: 'social-plan-1',
    analytics: 'analytics-plan-1',
  });
  if (!isOk(framed)) throw new Error('expected campaign ok');
  return framed.value;
};

describe('OpenLanceGrowthWorkflows.plan / GrowthWorkflowFramer', () => {
  it('frames a full-chain workflow composing all six planners in canonical order', () => {
    const result = new OpenLanceGrowthWorkflows().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.type).toBe('freelancer-acquisition');
    expect(value.sequence).toEqual([
      'marketing',
      'content',
      'seo',
      'social',
      'analytics',
      'campaign',
    ]);
    expect(value.plannerReferences).toEqual([
      'marketing-brief-1',
      'content-plan-1',
      'seo-plan-1',
      'social-plan-1',
      'analytics-plan-1',
      'campaign-plan-1',
    ]);
    expect(value.upstream).toEqual({
      marketing: 'marketing-brief-1',
      content: 'content-plan-1',
      seo: 'seo-plan-1',
      social: 'social-plan-1',
      analytics: 'analytics-plan-1',
      campaign: 'campaign-plan-1',
    });
    expect(value.metadata).toEqual({ category: 'acquisition', plannerCount: 6 });
    expect(value.request.agent).toBe('openlance-growth-workflows');
    expect(value.request.task).toBe('freelancer-acquisition: grow the freelancer supply side');
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: {
        objective: 'grow the freelancer supply side',
        workflowType: 'freelancer-acquisition',
      },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'seo-plan-1',
        'social-plan-1',
        'analytics-plan-1',
        'campaign-plan-1',
        'knowledge/customers/businesses.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('composes only the sequence subset for a workflow that skips planners', () => {
    const result = new GrowthWorkflowFramer(new GrowthWorkflowHash()).frame(
      request({ type: 'user-onboarding' }),
    );
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    // user-onboarding composes marketing -> content -> analytics -> campaign (skips seo and social).
    expect(value.sequence).toEqual(['marketing', 'content', 'analytics', 'campaign']);
    expect(value.plannerReferences).toEqual([
      'marketing-brief-1',
      'content-plan-1',
      'analytics-plan-1',
      'campaign-plan-1',
    ]);
    expect(value.metadata).toEqual({ category: 'activation', plannerCount: 4 });
    // The full upstream provenance is still recorded even though seo/social are not composed.
    expect(value.upstream.seo).toBe('seo-plan-1');
    expect(value.request.steps[0]?.request).toEqual({
      variables: { objective: 'grow the freelancer supply side', workflowType: 'user-onboarding' },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'analytics-plan-1',
        'campaign-plan-1',
        'knowledge/customers/businesses.md',
      ],
    });
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new GrowthWorkflowFramer(new GrowthWorkflowHash()).frame(
      request({ knowledge: undefined }),
    );
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: {
          objective: 'grow the freelancer supply side',
          workflowType: 'freelancer-acquisition',
        },
        contextReferences: [
          'marketing-brief-1',
          'content-plan-1',
          'seo-plan-1',
          'social-plan-1',
          'analytics-plan-1',
          'campaign-plan-1',
        ],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());
    const refs = [
      'knowledge/customers/businesses.md',
      'knowledge/marketing/positioning.md',
      'knowledge/company/mission.md',
    ];
    const a = framer.frame(request({ knowledge: refs }));
    const b = framer.frame(request({ knowledge: [...refs].reverse() }));
    const c = framer.frame(
      request({ knowledge: [refs[2], refs[0], refs[1], refs[2]] as string[] }),
    );
    expect(isOk(a) && isOk(b) && isOk(c)).toBe(true);
    if (isOk(a) && isOk(b) && isOk(c)) {
      expect(a.value.id).toBe(b.value.id);
      expect(a.value.id).toBe(c.value.id);
    }
  });

  it('changing the type or any planner reference changes the id', () => {
    const framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());
    const base = framer.frame(request());
    if (!isOk(base)) throw new Error('expected ok');
    for (const over of [
      { type: 'retention' as const },
      { marketing: 'other' },
      { content: 'other' },
      { seo: 'other' },
      { social: 'other' },
      { analytics: 'other' },
      { campaign: 'other' },
    ]) {
      const other = framer.frame(request(over));
      expect(isOk(other) && other.value.id !== base.value.id).toBe(true);
    }
  });

  it('fails closed on an unknown workflow type', () => {
    expect(
      codeOf(new OpenLanceGrowthWorkflows().plan(request({ type: 'viral-loop' as never }))),
    ).toBe('WORKFLOW.UNKNOWN_TYPE');
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ type: 5 as never })))).toBe(
      'WORKFLOW.UNKNOWN_TYPE',
    );
  });

  it('fails closed on a blank objective, agent, or any of the six planner references', () => {
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ objective: '  ' })))).toBe(
      'WORKFLOW.BLANK_OBJECTIVE',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ agent: '' })))).toBe(
      'WORKFLOW.BLANK_AGENT',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ marketing: '  ' })))).toBe(
      'WORKFLOW.MISSING_MARKETING',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ content: '' })))).toBe(
      'WORKFLOW.MISSING_CONTENT',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ seo: '   ' })))).toBe(
      'WORKFLOW.MISSING_SEO',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ social: '' })))).toBe(
      'WORKFLOW.MISSING_SOCIAL',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ analytics: '  ' })))).toBe(
      'WORKFLOW.MISSING_ANALYTICS',
    );
    expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ campaign: '' })))).toBe(
      'WORKFLOW.MISSING_CAMPAIGN',
    );
  });

  it('fails closed on a non-canonical, bare, non-document, or traversal knowledge reference', () => {
    for (const knowledge of [
      ['not/canonical'],
      [''] as string[],
      [123] as never,
      ['knowledge/customers/'],
      ['knowledge/customers/businesses'],
      ['knowledge/../secret.md'],
      ['knowledge/./x.md'],
    ]) {
      expect(codeOf(new OpenLanceGrowthWorkflows().plan(request({ knowledge })))).toBe(
        'WORKFLOW.INVALID_REFERENCE',
      );
    }
  });

  it('never throws on a null or structurally malformed request and fails closed', () => {
    expect(isErr(new OpenLanceGrowthWorkflows().plan(null as never))).toBe(true);
    const malformed = new OpenLanceGrowthWorkflows().plan({
      type: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      content: undefined,
      seo: undefined,
      social: undefined,
      analytics: undefined,
      campaign: undefined,
    } as unknown as GrowthWorkflowRequest);
    expect(isErr(malformed)).toBe(true);
  });

  it('produces a deeply-immutable workflow (top-level frozen)', () => {
    const value = workflow();
    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.request)).toBe(true);
    expect(Object.isFrozen(value.request.steps)).toBe(true);
    expect(Object.isFrozen(value.sequence)).toBe(true);
    expect(Object.isFrozen(value.plannerReferences)).toBe(true);
    expect(Object.isFrozen(value.upstream)).toBe(true);
    expect(Object.isFrozen(value.metadata)).toBe(true);
  });

  it('the workflow sequence is a frozen copy that never aliases the shared catalogue array', () => {
    const value = workflow();
    // The sequence is a fresh frozen array, not the shared catalogue array (mutating it cannot corrupt the catalogue).
    expect(value.sequence).not.toBe(WORKFLOW_DEFINITIONS['freelancer-acquisition'].sequence);
    expect(value.sequence).toEqual(WORKFLOW_DEFINITIONS['freelancer-acquisition'].sequence);
    // The exported catalogue is itself deeply frozen (each definition and its sequence array).
    expect(Object.isFrozen(WORKFLOW_DEFINITIONS)).toBe(true);
    expect(Object.isFrozen(WORKFLOW_DEFINITIONS['freelancer-acquisition'])).toBe(true);
    expect(Object.isFrozen(WORKFLOW_DEFINITIONS['freelancer-acquisition'].sequence)).toBe(true);
  });

  it('deduplicates knowledge references', () => {
    const deduped = new GrowthWorkflowFramer(new GrowthWorkflowHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });
});

describe('Campaign to Growth Workflows integration', () => {
  it('builds a workflow request from a Campaign Intelligence output, deriving all five earlier references', () => {
    const campaign = campaignPlan();
    const workflowRequest = workflowFromCampaign(campaign, {
      type: 'product-launch',
      objective: 'launch the product',
      agent: 'openlance-growth-workflows',
      knowledge: ['knowledge/customers/businesses.md'],
    });
    expect(workflowRequest.marketing).toBe(campaign.marketing);
    expect(workflowRequest.content).toBe(campaign.content);
    expect(workflowRequest.seo).toBe(campaign.seo);
    expect(workflowRequest.social).toBe(campaign.social);
    expect(workflowRequest.analytics).toBe(campaign.analytics);
    expect(workflowRequest.campaign).toBe(campaign.id);
    const result = new OpenLanceGrowthWorkflows().plan(workflowRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.upstream.campaign).toBe(campaign.id);
      expect(result.value.upstream.marketing).toBe(campaign.marketing);
    }
  });

  it('omits knowledge when the campaign framing supplies none', () => {
    const workflowRequest = workflowFromCampaign(campaignPlan(), {
      type: 'retention',
      objective: 'retain users',
      agent: 'openlance-growth-workflows',
    });
    expect(workflowRequest.knowledge).toBeUndefined();
  });
});

describe('OpenLanceGrowthWorkflows facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames a workflow-quality evaluation', () => {
    const engine = new OpenLanceGrowthWorkflows();
    engine.plan(request());
    engine.plan(request({ type: 'viral-loop' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(WORKFLOW_AGENT);
    const evaluation = engine.evaluationRequest(workflow(), [
      { metric: 'grounding', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`workflow:${workflow().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: workflow().id });
  });
});

describe('helpers', () => {
  it('recognizes known workflow types only and lists fifteen', () => {
    expect(isWorkflowType('conversion-optimization')).toBe(true);
    expect(isWorkflowType('positioning')).toBe(false);
    expect(WORKFLOW_TYPES).toHaveLength(15);
    expect(WORKFLOW_TYPES).toContain('marketplace-liquidity');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new GrowthWorkflowNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });
  it('the growth-workflow agent composes prompt and provider', () => {
    expect(WORKFLOW_AGENT.specialization).toBe('openlance-growth-workflows');
    expect(WORKFLOW_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('workflowEvaluationRequest frames the subject as the workflow output', () => {
    expect(workflowEvaluationRequest(workflow(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<OpenLanceGrowthWorkflows['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
