import { bench, describe } from 'vitest';

import { AnalyticsFramer, AnalyticsHash, AnalyticsIntelligence } from '../src/index';
import type { AnalyticsRequest } from '../src/index';

/**
 * Observational micro-baselines for Analytics Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle
 * and the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: AnalyticsRequest = {
  capability: 'kpi-planning',
  objective: 'track the fair-fees funnel',
  agent: 'analytics-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
};

const engine = new AnalyticsIntelligence();
const framer = new AnalyticsFramer(new AnalyticsHash());

describe('analytics-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
