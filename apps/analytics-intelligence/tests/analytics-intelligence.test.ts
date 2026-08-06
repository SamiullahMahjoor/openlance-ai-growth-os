import { isErr, isOk } from '@openlance/aios-kernel';
import { SocialIntelligence } from '@openlance/aios-social-intelligence';
import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_AGENT,
  ANALYTICS_CAPABILITIES,
  AnalyticsFramer,
  AnalyticsHash,
  AnalyticsIntelligence,
  AnalyticsNormalizer,
  analyticsEvaluationRequest,
  analyticsRequestFromSocial,
  isAnalyticsCapability,
} from '../src/index';
import type { AnalyticsPlan, AnalyticsRequest } from '../src/index';

const request = (over: Partial<AnalyticsRequest> = {}): AnalyticsRequest => ({
  capability: 'kpi-planning',
  objective: 'track the fair-fees funnel',
  agent: 'analytics-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
  ...over,
});

const plan = (): AnalyticsPlan => {
  const result = new AnalyticsFramer(new AnalyticsHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const socialPlan = () => {
  const framed = new SocialIntelligence().plan({
    capability: 'platform-strategy',
    objective: 'launch the campaign',
    agent: 'social-intelligence',
    marketing: 'marketing-brief-1',
    content: 'content-plan-1',
    seo: 'seo-plan-1',
  });
  if (!isOk(framed)) throw new Error('expected social ok');
  return framed.value;
};

describe('AnalyticsIntelligence.plan / AnalyticsFramer', () => {
  it('frames a governed analytics AgentRequest grounded in the four upstream plans and knowledge', () => {
    const result = new AnalyticsIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('kpi-planning');
    expect(value.marketing).toBe('marketing-brief-1');
    expect(value.content).toBe('content-plan-1');
    expect(value.seo).toBe('seo-plan-1');
    expect(value.social).toBe('social-plan-1');
    expect(value.request.agent).toBe('analytics-intelligence');
    expect(value.request.task).toBe('kpi-planning: track the fair-fees funnel');
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: { objective: 'track the fair-fees funnel', analyticsTask: 'kpi-planning' },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'seo-plan-1',
        'social-plan-1',
        'knowledge/customers/businesses.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new AnalyticsFramer(new AnalyticsHash()).frame(
      request({ knowledge: undefined }),
    );
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: { objective: 'track the fair-fees funnel', analyticsTask: 'kpi-planning' },
        contextReferences: ['marketing-brief-1', 'content-plan-1', 'seo-plan-1', 'social-plan-1'],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new AnalyticsFramer(new AnalyticsHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('fails closed on an unknown capability', () => {
    expect(
      codeOf(new AnalyticsIntelligence().plan(request({ capability: 'churn-analysis' as never }))),
    ).toBe('ANALYTICS.UNKNOWN_CAPABILITY');
    expect(codeOf(new AnalyticsIntelligence().plan(request({ capability: 5 as never })))).toBe(
      'ANALYTICS.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, or upstream plan reference', () => {
    expect(codeOf(new AnalyticsIntelligence().plan(request({ objective: '  ' })))).toBe(
      'ANALYTICS.BLANK_OBJECTIVE',
    );
    expect(codeOf(new AnalyticsIntelligence().plan(request({ agent: '' })))).toBe(
      'ANALYTICS.BLANK_AGENT',
    );
    expect(codeOf(new AnalyticsIntelligence().plan(request({ marketing: '  ' })))).toBe(
      'ANALYTICS.MISSING_MARKETING',
    );
    expect(codeOf(new AnalyticsIntelligence().plan(request({ content: '' })))).toBe(
      'ANALYTICS.MISSING_CONTENT',
    );
    expect(codeOf(new AnalyticsIntelligence().plan(request({ seo: '   ' })))).toBe(
      'ANALYTICS.MISSING_SEO',
    );
    expect(codeOf(new AnalyticsIntelligence().plan(request({ social: '' })))).toBe(
      'ANALYTICS.MISSING_SOCIAL',
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
      expect(codeOf(new AnalyticsIntelligence().plan(request({ knowledge })))).toBe(
        'ANALYTICS.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new AnalyticsFramer(new AnalyticsHash());
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
    const result = new AnalyticsIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      content: undefined,
      seo: undefined,
      social: undefined,
    } as unknown as AnalyticsRequest);
    expect(isErr(result)).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new AnalyticsIntelligence().plan(null as never))).toBe(true);
    const deduped = new AnalyticsFramer(new AnalyticsHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });
});

describe('Social to Analytics integration', () => {
  it('builds an analytics request from a Social Intelligence output, deriving seo, content, and marketing', () => {
    const social = socialPlan();
    const analyticsRequest = analyticsRequestFromSocial(social, {
      capability: 'funnel-analysis',
      objective: 'analyze the launch funnel',
      agent: 'analytics-intelligence',
      knowledge: ['knowledge/customers/businesses.md'],
    });
    expect(analyticsRequest.marketing).toBe(social.marketing);
    expect(analyticsRequest.content).toBe(social.content);
    expect(analyticsRequest.seo).toBe(social.seo);
    expect(analyticsRequest.social).toBe(social.id);
    const result = new AnalyticsIntelligence().plan(analyticsRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.social).toBe(social.id);
      expect(result.value.seo).toBe(social.seo);
      expect(result.value.marketing).toBe(social.marketing);
    }
  });

  it('omits knowledge when the social framing supplies none', () => {
    const analyticsRequest = analyticsRequestFromSocial(socialPlan(), {
      capability: 'attribution-planning',
      objective: 'plan attribution',
      agent: 'analytics-intelligence',
    });
    expect(analyticsRequest.knowledge).toBeUndefined();
  });
});

describe('AnalyticsIntelligence facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames an analytics-quality evaluation', () => {
    const engine = new AnalyticsIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'churn-analysis' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(ANALYTICS_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'grounding', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`analytics:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
  });
});

describe('helpers', () => {
  it('recognizes known analytics capabilities only', () => {
    expect(isAnalyticsCapability('cohort-analysis')).toBe(true);
    expect(isAnalyticsCapability('positioning')).toBe(false);
    expect(ANALYTICS_CAPABILITIES).toContain('attribution-planning');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new AnalyticsNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });
  it('the analytics agent composes prompt and provider', () => {
    expect(ANALYTICS_AGENT.specialization).toBe('analytics-intelligence');
    expect(ANALYTICS_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('analyticsEvaluationRequest frames the subject as the analytics output', () => {
    expect(analyticsEvaluationRequest(plan(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<AnalyticsIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
