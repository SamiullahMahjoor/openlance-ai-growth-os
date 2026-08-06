import { bench, describe } from 'vitest';

import { GrowthWorkflowFramer, GrowthWorkflowHash, OpenLanceGrowthWorkflows } from '../src/index';
import type { GrowthWorkflowRequest } from '../src/index';

/**
 * Observational micro-baselines for OpenLance Growth Workflows (Engineering Rule 5, ADR-0022): a full plan (framing)
 * cycle and the framer in isolation. Measurement only; deterministic over fixed inputs. Recorded results live in
 * benchmarks/baseline.md.
 */
const request: GrowthWorkflowRequest = {
  type: 'freelancer-acquisition',
  objective: 'grow the freelancer supply side',
  agent: 'openlance-growth-workflows',
  marketing: 'marketing-brief-1',
  content: 'content-plan-1',
  seo: 'seo-plan-1',
  social: 'social-plan-1',
  analytics: 'analytics-plan-1',
  campaign: 'campaign-plan-1',
  knowledge: ['knowledge/customers/businesses.md'],
};

const engine = new OpenLanceGrowthWorkflows();
const framer = new GrowthWorkflowFramer(new GrowthWorkflowHash());

describe('openlance-growth-workflows benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
