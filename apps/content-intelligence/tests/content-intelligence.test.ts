import { MarketingIntelligence } from '@openlance/aios-marketing-intelligence';
import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  CONTENT_AGENT,
  CONTENT_CAPABILITIES,
  ContentFramer,
  ContentHash,
  ContentIntelligence,
  ContentNormalizer,
  contentEvaluationRequest,
  contentRequestFromMarketing,
  isContentCapability,
} from '../src/index';
import type { ContentPlan, ContentRequest } from '../src/index';

const request = (over: Partial<ContentRequest> = {}): ContentRequest => ({
  capability: 'blog',
  objective: 'explain fair fees',
  agent: 'content-intelligence',
  marketing: 'marketing-brief-1',
  brandVoice: 'knowledge/brand/voice.md',
  knowledge: ['knowledge/product/features.md'],
  ...over,
});

const plan = (): ContentPlan => {
  const result = new ContentFramer(new ContentHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

const marketingBrief = () => {
  const framed = new MarketingIntelligence().plan({
    capability: 'positioning',
    objective: 'win the mid-market',
    agent: 'marketing-intelligence',
    knowledge: ['knowledge/marketing/positioning.md'],
  });
  if (!isOk(framed)) throw new Error('expected marketing ok');
  return framed.value;
};

describe('ContentIntelligence.plan / ContentFramer', () => {
  it('frames a governed content-generation AgentRequest grounded in marketing and brand voice', () => {
    const result = new ContentIntelligence().plan(request());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('blog');
    expect(value.marketing).toBe('marketing-brief-1');
    expect(value.brandVoice).toBe('knowledge/brand/voice.md');
    expect(value.request.task).toBe('blog: explain fair fees');
    expect(value.request.steps.map((step) => step.capability)).toEqual(['prompt', 'provider']);
    expect(value.request.steps[0]?.request).toEqual({
      variables: { objective: 'explain fair fees', contentType: 'blog' },
      contextReferences: [
        'marketing-brief-1',
        'knowledge/brand/voice.md',
        'knowledge/product/features.md',
      ],
    });
    expect(value.request.steps[1]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new ContentFramer(new ContentHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('accepts a request with no extra knowledge references', () => {
    const result = new ContentFramer(new ContentHash()).frame(request({ knowledge: undefined }));
    expect(isOk(result) && result.value.knowledge).toEqual([]);
  });

  it('fails closed on an unknown capability', () => {
    expect(codeOf(new ContentIntelligence().plan(request({ capability: 'tweet' as never })))).toBe(
      'CONTENT.UNKNOWN_CAPABILITY',
    );
    expect(codeOf(new ContentIntelligence().plan(request({ capability: 7 as never })))).toBe(
      'CONTENT.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective, agent, or marketing reference', () => {
    expect(codeOf(new ContentIntelligence().plan(request({ objective: ' ' })))).toBe(
      'CONTENT.BLANK_OBJECTIVE',
    );
    expect(codeOf(new ContentIntelligence().plan(request({ agent: '' })))).toBe(
      'CONTENT.BLANK_AGENT',
    );
    expect(codeOf(new ContentIntelligence().plan(request({ marketing: '  ' })))).toBe(
      'CONTENT.MISSING_MARKETING',
    );
  });

  it('fails closed on a non-brand, bare, or non-document brand-voice reference', () => {
    for (const brandVoice of [
      'knowledge/marketing/x.md',
      'knowledge/brand/',
      'knowledge/brand/voice',
      'knowledge/brand/../secret.md',
    ]) {
      expect(codeOf(new ContentIntelligence().plan(request({ brandVoice })))).toBe(
        'CONTENT.INVALID_BRAND_VOICE',
      );
    }
  });

  it('fails closed on a non-canonical, bare, or non-document extra knowledge reference', () => {
    for (const knowledge of [
      ['not/canonical'],
      [''] as string[],
      [123] as never,
      ['knowledge/product/'],
      ['knowledge/product/features'],
      ['knowledge/../secret.md'],
      ['knowledge/./x.md'],
    ]) {
      expect(codeOf(new ContentIntelligence().plan(request({ knowledge })))).toBe(
        'CONTENT.INVALID_REFERENCE',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new ContentFramer(new ContentHash());
    const refs = [
      'knowledge/product/features.md',
      'knowledge/customers/businesses.md',
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
    const result = new ContentIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      marketing: undefined,
      brandVoice: undefined,
    } as unknown as ContentRequest);
    expect(isErr(result)).toBe(true);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new ContentIntelligence().plan(null as never))).toBe(true);
    const deduped = new ContentFramer(new ContentHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });
});

describe('Marketing to Content integration', () => {
  it('builds a content request from a Marketing Intelligence output by reference', () => {
    const brief = marketingBrief();
    const contentRequest = contentRequestFromMarketing(brief, {
      capability: 'landing-page',
      objective: 'launch the campaign',
      agent: 'content-intelligence',
      brandVoice: 'knowledge/brand/tone.md',
    });
    expect(contentRequest.marketing).toBe(brief.id);
    expect(contentRequest.knowledge).toBeUndefined();
    const result = new ContentIntelligence().plan(contentRequest);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value.marketing).toBe(brief.id);
  });

  it('carries additional knowledge references from the marketing framing', () => {
    const request = contentRequestFromMarketing(marketingBrief(), {
      capability: 'case-study',
      objective: 'show the outcome',
      agent: 'content-intelligence',
      brandVoice: 'knowledge/brand/voice.md',
      knowledge: ['knowledge/customers/businesses.md'],
    });
    expect(request.knowledge).toEqual(['knowledge/customers/businesses.md']);
  });
});

describe('ContentIntelligence facade', () => {
  it('counts framed and rejected requests, exposes the agent, and frames a content-quality evaluation', () => {
    const engine = new ContentIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'tweet' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
    expect(engine.agentDefinition()).toBe(CONTENT_AGENT);
    const evaluation = engine.evaluationRequest(plan(), [
      { metric: 'brand-fidelity', value: 0.95, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`content:${plan().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: plan().id });
  });
});

describe('helpers', () => {
  it('recognizes known content capabilities only', () => {
    expect(isContentCapability('blog')).toBe(true);
    expect(isContentCapability('tweet')).toBe(false);
    expect(CONTENT_CAPABILITIES).toContain('email-campaign');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new ContentNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(true)).toBe('');
  });
  it('the content agent composes prompt and provider', () => {
    expect(CONTENT_AGENT.specialization).toBe('content-intelligence');
    expect(CONTENT_AGENT.capabilities).toEqual(['prompt', 'provider']);
  });
  it('contentEvaluationRequest frames the subject as the content output', () => {
    expect(contentEvaluationRequest(plan(), []).subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<ContentIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
