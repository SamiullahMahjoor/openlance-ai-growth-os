import { bench, describe } from 'vitest';

import { MarketingFramer, MarketingHash, MarketingIntelligence } from '../src/index';
import type { MarketingRequest } from '../src/index';

/**
 * Observational micro-baselines for Marketing Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle
 * and the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: MarketingRequest = {
  capability: 'positioning',
  objective: 'win the mid-market',
  agent: 'marketing-intelligence',
  knowledge: ['knowledge/marketing/positioning.md', 'knowledge/brand/messaging.md'],
};

const engine = new MarketingIntelligence();
const framer = new MarketingFramer(new MarketingHash());

describe('marketing-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
