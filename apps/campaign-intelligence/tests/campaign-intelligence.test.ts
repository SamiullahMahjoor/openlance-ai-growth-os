import { AnalyticsIntelligence } from '@openlance/aios-analytics-intelligence';
import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CAMPAIGN_AGENT,
  CAMPAIGN_CAPABILITIES,
  CampaignFramer,
  CampaignHash,
  CampaignIntelligence,
  CampaignNormalizer,
  campaignEvaluationRequest,
  campaignRequestFromAnalytics,
  isCampaignCapability,
} from '../src/index';
import type { CampaignPlan, CampaignRequest } from '../src/index';

const request = (over: Partial<CampaignRequest> = {}): CampaignRequest => ({
  capability: 'campaign-orchestration-planning',
  objective: 'orchestrate the fair-fees launch',
  agent: 'campaign-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  analytics: 'analytics-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
  ...over,
});

const plan = (): CampaignPlan => {
  const result = new CampaignFramer(new CampaignHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const analyticsPlan = () => {
  const framed = new AnalyticsIntelligence().plan({
    capability: 'kpi-planning',
    objective: 'track the funnel',
    agent: 'analytics-intelligence',
    marketing: 'marketing-brief-1',
    content: 'content-plan-1',
    seo: 'seo-plan-1',
    social: 'social-plan-1',
  });
  if (!isOk(framed)) throw new Error('expected analytics ok');
  return framed.value;
};

describe('CampaignIntelligence.plan / CampaignFramer', () => {
  it('frames a governed campaign AgentRequest grounded in the five upstream plans and knowledge', () => {
    const result = new CampaignIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('campaign-orchestration-planning');
    expect(value.marketing).toBe('marketing-brief-1');
    expect(value.content).toBe('content-plan-1');
    expect(value.seo).toBe('seo-plan-1');
    expect(value.social).toBe('social-plan-1');
    expect(value.analytics).toBe('analytics-plan-1');
    expect(value.request.agent).toBe('campaign-intelligence');
    expect(value.request.task).toBe(
      'campaign-orchestration-planning: orchestrate the fair-fees launch',
    );
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: {
        objective: 'orchestrate the fair-fees launch',
        campaignTask: 'campaign-orchestration-planning',
      },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'seo-plan-1',
        'social-plan-1',
        'analytics-plan-1',
        'knowledge/customers/businesses.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new CampaignFramer(new CampaignHash()).frame(request({ knowledge: undefined }));
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: {
          objective: 'orchestrate the fair-fees launch',
          campaignTask: 'campaign-orchestration-planning',
        },
        contextReferences: [
          'marketing-brief-1',
          'content-plan-1',
          'seo-plan-1',
          'social-plan-1',
          'analytics-plan-1',
        ],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new CampaignFramer(new CampaignHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('fails closed on an unknown capability', () => {
    expect(
      codeOf(
        new CampaignIntelligence().plan(request({ capability: 'campaign-planning' as never })),
      ),
    ).toBe('CAMPAIGN.UNKNOWN_CAPABILITY');
    expect(codeOf(new CampaignIntelligence().plan(request({ capability: 5 as never })))).toBe(
      'CAMPAIGN.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, or upstream plan reference', () => {
    expect(codeOf(new CampaignIntelligence().plan(request({ objective: '  ' })))).toBe(
      'CAMPAIGN.BLANK_OBJECTIVE',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ agent: '' })))).toBe(
      'CAMPAIGN.BLANK_AGENT',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ marketing: '  ' })))).toBe(
      'CAMPAIGN.MISSING_MARKETING',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ content: '' })))).toBe(
      'CAMPAIGN.MISSING_CONTENT',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ seo: '   ' })))).toBe(
      'CAMPAIGN.MISSING_SEO',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ social: '' })))).toBe(
      'CAMPAIGN.MISSING_SOCIAL',
    );
    expect(codeOf(new CampaignIntelligence().plan(request({ analytics: '  ' })))).toBe(
      'CAMPAIGN.MISSING_ANALYTICS',
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
      expect(codeOf(new CampaignIntelligence().plan(request({ knowledge })))).toBe(
        'CAMPAIGN.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new CampaignFramer(new CampaignHash());
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

  it('never throws on a structurally malformed request and fails closed', () => {
    const result = new CampaignIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      content: undefined,
      seo: undefined,
      social: undefined,
      analytics: undefined,
    } as unknown as CampaignRequest);
    expect(isErr(result)).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new CampaignIntelligence().plan(null as never))).toBe(true);
    const deduped = new CampaignFramer(new CampaignHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });
});

describe('Analytics to Campaign integration', () => {
  it('builds a campaign request from an Analytics Intelligence output, deriving all four earlier references', () => {
    const analytics = analyticsPlan();
    const campaignRequest = campaignRequestFromAnalytics(analytics, {
      capability: 'launch-planning',
      objective: 'plan the launch',
      agent: 'campaign-intelligence',
      knowledge: ['knowledge/customers/businesses.md'],
    });
    expect(campaignRequest.marketing).toBe(analytics.marketing);
    expect(campaignRequest.content).toBe(analytics.content);
    expect(campaignRequest.seo).toBe(analytics.seo);
    expect(campaignRequest.social).toBe(analytics.social);
    expect(campaignRequest.analytics).toBe(analytics.id);
    const result = new CampaignIntelligence().plan(campaignRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.analytics).toBe(analytics.id);
      expect(result.value.social).toBe(analytics.social);
      expect(result.value.marketing).toBe(analytics.marketing);
    }
  });

  it('omits knowledge when the analytics framing supplies none', () => {
    const campaignRequest = campaignRequestFromAnalytics(analyticsPlan(), {
      capability: 'multi-channel-planning',
      objective: 'plan channels',
      agent: 'campaign-intelligence',
    });
    expect(campaignRequest.knowledge).toBeUndefined();
  });
});

describe('CampaignIntelligence facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames a campaign-quality evaluation', () => {
    const engine = new CampaignIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'campaign-planning' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(CAMPAIGN_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'grounding', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`campaign:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
  });
});

describe('helpers', () => {
  it('recognizes known campaign capabilities only, and not the frozen Marketing/Social identifiers', () => {
    expect(isCampaignCapability('campaign-orchestration-planning')).toBe(true);
    expect(isCampaignCapability('campaign-plan-evaluation')).toBe(true);
    // The frozen Marketing 'campaign-planning' and Social 'campaign-evaluation' are NOT Campaign capabilities.
    expect(isCampaignCapability('campaign-planning')).toBe(false);
    expect(isCampaignCapability('campaign-evaluation')).toBe(false);
    expect(CAMPAIGN_CAPABILITIES).toContain('budget-recommendations');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new CampaignNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });
  it('the campaign agent composes prompt and provider', () => {
    expect(CAMPAIGN_AGENT.specialization).toBe('campaign-intelligence');
    expect(CAMPAIGN_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('campaignEvaluationRequest frames the subject as the campaign output', () => {
    expect(campaignEvaluationRequest(plan(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<CampaignIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
