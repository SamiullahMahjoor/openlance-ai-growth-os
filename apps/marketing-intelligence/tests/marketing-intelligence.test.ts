import { isErr, isOk } from '@openlance/aios-kernel';
import { describe, expect, it } from 'vitest';

import {
  MARKETING_AGENT,
  MARKETING_CAPABILITIES,
  MarketingFramer,
  MarketingHash,
  MarketingIntelligence,
  MarketingNormalizer,
  isMarketingCapability,
  marketingEvaluationRequest,
} from '../src/index';
import type { MarketingBrief, MarketingRequest } from '../src/index';

const request = (over: Partial<MarketingRequest> = {}): MarketingRequest => ({
  capability: 'positioning',
  objective: 'win the mid-market',
  agent: 'marketing-intelligence',
  knowledge: ['knowledge/marketing/positioning.md', 'knowledge/brand/messaging.md'],
  ...over,
});

const brief = (): MarketingBrief => {
  const result = new MarketingFramer(new MarketingHash()).frame(request());
  if (!isOk(result)) throw new Error('expected ok');
  return result.value;
};

describe('MarketingIntelligence.plan / MarketingFramer', () => {
  it('frames a grounded governed AgentRequest and an immutable brief', () => {
    const result = new MarketingIntelligence().plan(request({ audience: 'employers' }));
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const value = result.value;
    expect(value.capability).toBe('positioning');
    expect(value.objective).toBe('win the mid-market');
    expect(value.audience).toBe('employers');
    expect(value.knowledge).toEqual([
      'knowledge/brand/messaging.md',
      'knowledge/marketing/positioning.md',
    ]);
    expect(value.request.agent).toBe('marketing-intelligence');
    expect(value.request.task).toBe('positioning: win the mid-market');
    expect(value.request.steps.map((step) => step.capability)).toEqual([
      'retrieval',
      'prompt',
      'provider',
    ]);
    expect(value.request.steps[0]?.request).toEqual({ scope: 'positioning' });
    expect(value.request.steps[1]?.request).toEqual({
      variables: { objective: 'win the mid-market', audience: 'employers' },
      contextReferences: ['knowledge/brand/messaging.md', 'knowledge/marketing/positioning.md'],
    });
    expect(value.request.steps[2]?.request).toEqual({ capability: 'text-generation' });
    expect(value.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('never throws on a null request and fails closed, and deduplicates knowledge references', () => {
    expect(isErr(new MarketingIntelligence().plan(null as never))).toBe(true);
    const deduped = new MarketingFramer(new MarketingHash()).frame(
      request({ knowledge: ['knowledge/a.md', 'knowledge/a.md'] }),
    );
    expect(isOk(deduped) && deduped.value.knowledge).toEqual(['knowledge/a.md']);
  });

  it('is deterministic: the same request yields the same id', () => {
    const framer = new MarketingFramer(new MarketingHash());
    const a = framer.frame(request());
    const b = framer.frame(request());
    expect(isOk(a) && isOk(b) && a.value.id === b.value.id).toBe(true);
  });

  it('defaults an absent or blank audience to null', () => {
    expect(brief().audience).toBeNull();
    const blank = new MarketingFramer(new MarketingHash()).frame(request({ audience: '   ' }));
    expect(isOk(blank) && blank.value.audience).toBeNull();
  });

  it('fails closed on an unknown capability', () => {
    expect(codeOf(new MarketingIntelligence().plan(request({ capability: 'seo' as never })))).toBe(
      'MARKETING.UNKNOWN_CAPABILITY',
    );
    expect(codeOf(new MarketingIntelligence().plan(request({ capability: 5 as never })))).toBe(
      'MARKETING.UNKNOWN_CAPABILITY',
    );
  });

  it('fails closed on a blank objective or agent', () => {
    expect(codeOf(new MarketingIntelligence().plan(request({ objective: '  ' })))).toBe(
      'MARKETING.BLANK_OBJECTIVE',
    );
    expect(codeOf(new MarketingIntelligence().plan(request({ agent: '' })))).toBe(
      'MARKETING.BLANK_AGENT',
    );
  });

  it('fails closed on an ungrounded request (none, non-array, non-string, non-canonical, bare namespace, or non-document reference)', () => {
    for (const knowledge of [
      [] as string[],
      undefined as never,
      [123] as never,
      ['not/canonical'],
      ['knowledge/brand/'],
      ['knowledge/marketing/'],
      ['knowledge/marketing/positioning'],
      ['knowledge/../secret.md'],
      ['knowledge/../../etc/passwd.md'],
      ['knowledge/./x.md'],
    ]) {
      expect(codeOf(new MarketingIntelligence().plan(request({ knowledge })))).toBe(
        'MARKETING.UNGROUNDED',
      );
    }
  });

  it('produces identical ids regardless of knowledge reference order and duplication (canonical ordering)', () => {
    const framer = new MarketingFramer(new MarketingHash());
    const refs = [
      'knowledge/brand/messaging.md',
      'knowledge/marketing/positioning.md',
      'knowledge/customers/icp.md',
    ];
    const a = framer.frame(request({ knowledge: refs }));
    const b = framer.frame(request({ knowledge: [...refs].reverse() }));
    const c = framer.frame(
      request({ knowledge: [refs[1], refs[0], refs[2], refs[0]] as string[] }),
    );
    expect(isOk(a) && isOk(b) && isOk(c)).toBe(true);
    if (isOk(a) && isOk(b) && isOk(c)) {
      expect(a.value.id).toBe(b.value.id);
      expect(a.value.id).toBe(c.value.id);
    }
  });

  it('never throws on a structurally malformed request and fails closed', () => {
    const result = new MarketingIntelligence().plan({
      capability: undefined,
      objective: undefined,
      agent: undefined,
      knowledge: undefined,
    } as unknown as MarketingRequest);
    expect(isErr(result)).toBe(true);
  });
});

describe('MarketingIntelligence facade', () => {
  it('counts framed and rejected requests', () => {
    const engine = new MarketingIntelligence();
    engine.plan(request());
    engine.plan(request({ capability: 'bogus' as never }));
    expect(engine.statistics()).toEqual({ framed: 1, rejected: 1 });
  });

  it('exposes the marketing growth agent and frames a marketing evaluation', () => {
    const engine = new MarketingIntelligence();
    expect(engine.agentDefinition()).toBe(MARKETING_AGENT);
    const evaluation = engine.evaluationRequest(brief(), [
      { metric: 'grounding', value: 0.9, grounded: true },
    ]);
    expect(evaluation.evaluation).toBe(`marketing:${brief().id}`);
    expect(evaluation.subject).toEqual({ kind: 'agent', reference: brief().id });
    expect(evaluation.metrics).toHaveLength(1);
  });
});

describe('helpers', () => {
  it('recognizes known marketing capabilities only', () => {
    expect(isMarketingCapability('positioning')).toBe(true);
    expect(isMarketingCapability('seo')).toBe(false);
    expect(MARKETING_CAPABILITIES).toContain('market-research');
  });
  it('normalizes text and settles a non-string to blank', () => {
    const normalizer = new MarketingNormalizer();
    expect(normalizer.normalize('  a   b ')).toBe('a b');
    expect(normalizer.normalize(42)).toBe('');
  });
  it('the marketing agent composes retrieval, prompt, and provider', () => {
    expect(MARKETING_AGENT.specialization).toBe('marketing-intelligence');
    expect(MARKETING_AGENT.capabilities).toEqual(['retrieval', 'prompt', 'provider']);
  });
  it('marketingEvaluationRequest frames the subject as the marketing output', () => {
    const evaluation = marketingEvaluationRequest(brief(), []);
    expect(evaluation.subject.kind).toBe('agent');
  });
});

function codeOf(result: ReturnType<MarketingIntelligence['plan']>): string | undefined {
  return isErr(result) ? result.error.code : undefined;
}
