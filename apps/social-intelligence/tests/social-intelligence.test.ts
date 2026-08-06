import { isErr, isOk } from '@openlance/aios-kernel';
import { SeoIntelligence } from '@openlance/aios-seo-intelligence';
import { describe, expect, it } from 'vitest';

import {
  SOCIAL_AGENT,
  SOCIAL_CAPABILITIES,
  SocialFramer,
  SocialHash,
  SocialIntelligence,
  SocialNormalizer,
  isSocialCapability,
  socialEvaluationRequest,
  socialRequestFromSeo,
} from '../src/index';
import type { SocialPlan, SocialRequest } from '../src/index';

const request = (over: Partial<SocialRequest> = {}): SocialRequest => ({
  capability: 'platform-strategy',
  objective: 'launch the fair-fees campaign',
  agent: 'social-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
  ...over,
});

const plan = (): SocialPlan => {
  const result = new SocialFramer(new SocialHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const seoPlan = () => {
  const framed = new SeoIntelligence().plan({
    capability: 'keyword-research',
    objective: 'rank for fair fees',
    agent: 'seo-intelligence',
    marketing: 'marketing-brief-1',
    content: 'content-plan-1',
  });
  if (!isOk(framed)) throw new Error('expected seo ok');
  return framed.value;
};

describe('SocialIntelligence.plan / SocialFramer', () => {
  it('frames a governed social AgentRequest grounded in marketing, content, SEO, and knowledge', () => {
    const result = new SocialIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('platform-strategy');
    expect(value.marketing).toBe('marketing-brief-1');
    expect(value.content).toBe('content-plan-1');
    expect(value.seo).toBe('seo-plan-1');
    expect(value.request.task).toBe('platform-strategy: launch the fair-fees campaign');
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: { objective: 'launch the fair-fees campaign', socialTask: 'platform-strategy' },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'seo-plan-1',
        'knowledge/customers/businesses.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new SocialFramer(new SocialHash()).frame(request({ knowledge: undefined }));
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: { objective: 'launch the fair-fees campaign', socialTask: 'platform-strategy' },
        contextReferences: ['marketing-brief-1', 'content-plan-1', 'seo-plan-1'],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new SocialFramer(new SocialHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('fails closed on an unknown capability', () => {
    expect(
      codeOf(new SocialIntelligence().plan(request({ capability: 'reddit-planning' as never }))),
    ).toBe('SOCIAL.UNKNOWN_CAPABILITY');
    expect(codeOf(new SocialIntelligence().plan(request({ capability: 7 as never })))).toBe(
      'SOCIAL.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, marketing, content, or SEO reference', () => {
    expect(codeOf(new SocialIntelligence().plan(request({ objective: ' ' })))).toBe(
      'SOCIAL.BLANK_OBJECTIVE',
    );
    expect(codeOf(new SocialIntelligence().plan(request({ agent: '' })))).toBe(
      'SOCIAL.BLANK_AGENT',
    );
    expect(codeOf(new SocialIntelligence().plan(request({ marketing: '  ' })))).toBe(
      'SOCIAL.MISSING_MARKETING',
    );
    expect(codeOf(new SocialIntelligence().plan(request({ content: '' })))).toBe(
      'SOCIAL.MISSING_CONTENT',
    );
    expect(codeOf(new SocialIntelligence().plan(request({ seo: '   ' })))).toBe(
      'SOCIAL.MISSING_SEO',
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
      expect(codeOf(new SocialIntelligence().plan(request({ knowledge })))).toBe(
        'SOCIAL.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new SocialFramer(new SocialHash());
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
    const result = new SocialIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      content: undefined,
      seo: undefined,
    } as unknown as SocialRequest);
    expect(isErr(result)).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new SocialIntelligence().plan(null as never))).toBe(true);
    const deduped = new SocialFramer(new SocialHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });
});

describe('SEO to Social integration', () => {
  it('builds a social request from an SEO Intelligence output, deriving content and marketing', () => {
    const seo = seoPlan();
    const socialRequest = socialRequestFromSeo(seo, {
      capability: 'post-planning',
      objective: 'plan the launch posts',
      agent: 'social-intelligence',
      knowledge: ['knowledge/customers/businesses.md'],
    });
    expect(socialRequest.marketing).toBe(seo.marketing);
    expect(socialRequest.content).toBe(seo.content);
    expect(socialRequest.seo).toBe(seo.id);
    const result = new SocialIntelligence().plan(socialRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.seo).toBe(seo.id);
      expect(result.value.content).toBe(seo.content);
      expect(result.value.marketing).toBe(seo.marketing);
    }
  });

  it('omits knowledge when the SEO framing supplies none', () => {
    const socialRequest = socialRequestFromSeo(seoPlan(), {
      capability: 'campaign-framing',
      objective: 'frame the campaign',
      agent: 'social-intelligence',
    });
    expect(socialRequest.knowledge).toBeUndefined();
  });
});

describe('SocialIntelligence facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames a social-quality evaluation', () => {
    const engine = new SocialIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'reddit-planning' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(SOCIAL_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'channel-fit', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`social:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
  });
});

describe('helpers', () => {
  it('recognizes known social capabilities only', () => {
    expect(isSocialCapability('platform-strategy')).toBe(true);
    expect(isSocialCapability('blog')).toBe(false);
    expect(SOCIAL_CAPABILITIES).toContain('hashtag-planning');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new SocialNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(true)).toBe('');
  });
  it('the social agent composes prompt and provider', () => {
    expect(SOCIAL_AGENT.specialization).toBe('social-intelligence');
    expect(SOCIAL_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('socialEvaluationRequest frames the subject as the social output', () => {
    expect(socialEvaluationRequest(plan(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<SocialIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
