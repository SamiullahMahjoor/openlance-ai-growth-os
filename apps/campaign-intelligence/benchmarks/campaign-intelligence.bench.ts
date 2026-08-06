import { bench, describe } from 'vitest';

import { CampaignFramer, CampaignHash, CampaignIntelligence } from '../src/index';
import type { CampaignRequest } from '../src/index';

/**
 * Observational micro-baselines for Campaign Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle and
 * the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: CampaignRequest = {
  capability: 'campaign-orchestration-planning',
  objective: 'orchestrate the fair-fees launch',
  agent: 'campaign-intelligence',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  analytics: 'analytics-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
};

const engine = new CampaignIntelligence();
const framer = new CampaignFramer(new CampaignHash());

describe('campaign-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
