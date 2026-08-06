import { bench, describe } from 'vitest';

import { AutomationFramer, AutomationHash, AutomationIntelligence } from '../src/index';
import type { AutomationRequest } from '../src/index';

/**
 * Observational micro-baselines for Automation Intelligence (Engineering Rule 5, ADR-0022): a full plan (framing) cycle
 * and the framer in isolation. Measurement only; deterministic over fixed inputs.
 */
const request: AutomationRequest = {
  capability: 'workflow-automation-planning',
  objective: 'automate the freelancer onboarding workflow',
  agent: 'automation-intelligence',
  workflow: 'growth-workflow-1',
  knowledge: ['knowledge/processes/onboarding.md'],
};

const engine = new AutomationIntelligence();
const framer = new AutomationFramer(new AutomationHash());

describe('automation-intelligence benchmarks', () => {
  bench('plan (full framing cycle)', () => {
    engine.plan(request);
  });
  bench('frame', () => {
    framer.frame(request);
  });
});
