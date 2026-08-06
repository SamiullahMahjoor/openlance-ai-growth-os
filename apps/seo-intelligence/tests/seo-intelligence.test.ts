import { ContentIntelligence } from '@openlance/aios-content-intelligence';
import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  SEO_AGENT,
  SEO_CAPABILITIES,
  SeoFramer,
  SeoHash,
  SeoIntelligence,
  SeoNormalizer,
  isSeoCapability,
  seoEvaluationRequest,
  seoRequestFromContent,
} from '../src/index';
import type { SeoPlan, SeoRequest } from '../src/index';

const request = (over: Partial<SeoRequest> = {}): SeoRequest => ({
  capability: 'keyword-research',
  objective: 'rank for fair freelancing fees',
  agent: 'seo-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  knowledge: ['knowledge/product/features.md', 'knowledge/competitors/upwork.md'],
  ...over,
});

const plan = (): SeoPlan => {
  const result = new SeoFramer(new SeoHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const contentPlan = () => {
  const framed = new ContentIntelligence().plan({
    capability: 'blog',
    objective: 'explain fair fees',
    agent: 'content-intelligence',
    marketing: 'marketing-brief-1',
    brandVoice: 'knowledge/brand/voice.md',
  });
  if (!isOk(framed)) throw new Error('expected content ok');
  return framed.value;
};

describe('SeoIntelligence.plan / SeoFramer', () => {
  it('frames a governed SEO AgentRequest grounded in marketing, content, and knowledge', () => {
    const result = new SeoIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('keyword-research');
    expect(value.marketing).toBe('marketing-brief-1');
    expect(value.content).toBe('content-plan-1');
    expect(value.knowledge).toEqual([
      'knowledge/competitors/upwork.md',
      'knowledge/product/features.md',
    ]);
    expect(value.request.agent).toBe('seo-intelligence');
    expect(value.request.task).toBe('keyword-research: rank for fair freelancing fees');
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: { objective: 'rank for fair freelancing fees', seoTask: 'keyword-research' },
      contextReferences: [
        'marketing-brief-1',
        'content-plan-1',
        'knowledge/competitors/upwork.md',
        'knowledge/product/features.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new SeoFramer(new SeoHash()).frame(request({ knowledge: undefined }));
    expect(isOk(result) && result.value.knowledge).toEqual([]);
    if (isOk(result))
      expect(result.value.request.steps[0]?.request).toEqual({
        variables: { objective: 'rank for fair freelancing fees', seoTask: 'keyword-research' },
        contextReferences: ['marketing-brief-1', 'content-plan-1'],
      });
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new SeoFramer(new SeoHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new SeoIntelligence().plan(null as never))).toBe(true);
    const deduped = new SeoFramer(new SeoHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });

  it('fails closed on an unknown capability', () => {
    expect(
      codeOf(new SeoIntelligence().plan(request({ capability: 'link-building' as never }))),
    ).toBe('SEO.UNKNOWN_CAPABILITY');
    expect(codeOf(new SeoIntelligence().plan(request({ capability: 5 as never })))).toBe(
      'SEO.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, marketing, or content reference', () => {
    expect(codeOf(new SeoIntelligence().plan(request({ objective: '  ' })))).toBe(
      'SEO.BLANK_OBJECTIVE',
    );
    expect(codeOf(new SeoIntelligence().plan(request({ agent: '' })))).toBe('SEO.BLANK_AGENT');
    expect(codeOf(new SeoIntelligence().plan(request({ marketing: '  ' })))).toBe(
      'SEO.MISSING_MARKETING',
    );
    expect(codeOf(new SeoIntelligence().plan(request({ content: '' })))).toBe(
      'SEO.MISSING_CONTENT',
    );
  });

  it('fails closed on a non-canonical, bare, non-document, or traversal knowledge reference', () => {
    for (const knowledge of [
      ['not/canonical'],
      [''] as string[],
      [123] as never,
      ['knowledge/product/'],
      ['knowledge/product/features'],
      ['knowledge/../secret.md'],
      ['knowledge/./x.md'],
    ]) {
      expect(codeOf(new SeoIntelligence().plan(request({ knowledge })))).toBe(
        'SEO.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new SeoFramer(new SeoHash());
    const refs = [
      'knowledge/product/features.md',
      'knowledge/competitors/upwork.md',
      'knowledge/customers/businesses.md',
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
    const result = new SeoIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      content: undefined,
    } as unknown as SeoRequest);
    expect(isErr(result)).toBe(true);
  });
});

describe('Content to SEO integration', () => {
  it('builds an SEO request from a Content Intelligence output, deriving the marketing direction', () => {
    const content = contentPlan();
    const seoRequest = seoRequestFromContent(content, {
      capability: 'topical-clustering',
      objective: 'cluster the pillar topics',
      agent: 'seo-intelligence',
      knowledge: ['knowledge/product/features.md'],
    });
    expect(seoRequest.marketing).toBe(content.marketing);
    expect(seoRequest.content).toBe(content.id);
    const result = new SeoIntelligence().plan(seoRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.marketing).toBe(content.marketing);
      expect(result.value.content).toBe(content.id);
    }
  });

  it('omits knowledge when the content framing supplies none', () => {
    const seoRequest = seoRequestFromContent(contentPlan(), {
      capability: 'search-intent-analysis',
      objective: 'map the intent',
      agent: 'seo-intelligence',
    });
    expect(seoRequest.knowledge).toBeUndefined();
  });
});

describe('SeoIntelligence facade', () => {
  it('counts framed and rejected requests', () => {
    const engine = new SeoIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'bogus' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
  });

  it('exposes the SEO growth agent and frames an SEO evaluation', () => {
    const engine = new SeoIntelligence();
    expect(engine.agentDefinition()).toBe(SEO_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'search-relevance', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`seo:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
    expect(evaluation.metrics).toHaveLength(1);
  });
});

describe('helpers', () => {
  it('recognizes known SEO capabilities only', () => {
    expect(isSeoCapability('serp-opportunity-analysis')).toBe(true);
    expect(isSeoCapability('positioning')).toBe(false);
    expect(SEO_CAPABILITIES).toContain('schema-recommendations');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new SeoNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });
  it('the SEO agent composes prompt and provider', () => {
    expect(SEO_AGENT.specialization).toBe('seo-intelligence');
    expect(SEO_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('seoEvaluationRequest frames the subject as the SEO output', () => {
    expect(seoEvaluationRequest(plan(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<SeoIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
