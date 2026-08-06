import { bench, describe } from 'vitest';

import { SeoFramer, SeoHash, SeoIntelligence } from '../src/index';
import type { SeoRequest } from '../src/index';

/**
 * Observational micro-baselines for SEO Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle and the
 * framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const request: SeoRequest = {
  capability: 'keyword-research',
  objective: 'rank for fair freelancing fees',
  agent: 'seo-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  knowledge: ['knowledge/product/features.md', 'knowledge/competitors/upwork.md'],
};

const engine = new SeoIntelligence();
const framer = new SeoFramer(new SeoHash());

describe('seo-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
