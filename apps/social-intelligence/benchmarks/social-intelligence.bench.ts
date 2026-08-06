import { bench, describe } from 'vitest';

import { SocialFramer, SocialHash, SocialIntelligence } from '../src/index';
import type { SocialRequest } from '../src/index';

/**
 * Observational micro-baselines for Social Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle and
 * the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: SocialRequest = {
  capability: 'platform-strategy',
  objective: 'launch the fair-fees campaign',
  agent: 'social-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
};

const engine = new SocialIntelligence();
const framer = new SocialFramer(new SocialHash());

describe('social-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
