import type { AgentExecutionPlan, AgentStep } from '@openlance/aios-agent-engine';
import { createEventBus } from '@openlance/aios-events';
import type { GovernanceDecision } from '@openlance/aios-governance-engine';
import type { SafetyDecision } from '@openlance/aios-safety-engine';
import { bench, describe } from 'vitest';

import {
  DependencyResolver,
  ResultAggregator,
  RuntimeExecutionManager,
  Scheduler,
} from '../src/index';
import type { ExecutionRequest, StepExecutor } from '../src/index';

/**
 * Observational micro-baselines for the Runtime Execution Engine's public operations (Engineering Rule 5, ADR-0022):
 * a full execution, dependency resolution, scheduling, and aggregation. Measurement only; deterministic over fixed
 * inputs. Recorded results live in benchmarks/baseline.md.
 */
const clock = { now: () => 0 };
const executor: StepExecutor = { execute: async () => ({ status: 'succeeded' }) };
const toolStep = (capability: string): AgentStep => ({
  capability: 'tool',
  request: { capability },
});
const steps: AgentStep[] = Array.from({ length: 8 }, (_, i) => toolStep(`t${i}`));
const plan: AgentExecutionPlan = {
  agent: 'a',
  task: 't',
  steps,
  coordination: [],
  validated: true,
};
const governance: GovernanceDecision = {
  subject: 'a',
  decision: 'AUTHORIZE',
  reason: '',
  oversight: 'standing-rules',
  violations: [],
  permitted: [],
  trust: 'low',
  id: 'gov-1',
  validated: true,
};
const safety: SafetyDecision = {
  subject: 'a',
  outcome: 'SAFE',
  reason: '',
  hazards: [],
  directives: [],
  refusalCategory: null,
  escalated: false,
  emergencyStop: false,
  impact: [],
  oversight: 'standing-rules',
  trust: 'low',
  governance: 'gov-1',
  evaluated: true,
  id: 'saf-1',
  validated: true,
};
const request: ExecutionRequest = {
  plan,
  governance,
  safety,
  context: {
    executionId: 'e',
    correlationId: 'c',
    deadline: null,
    cancellation: { isCancelled: () => false },
    traceId: 't',
    mode: 'standard',
    tenant: 'default',
  },
};

const manager = new RuntimeExecutionManager({ clock, bus: createEventBus(), executor });
const resolver = new DependencyResolver();
const scheduler = new Scheduler();
const aggregator = new ResultAggregator();
const resolved = steps.map((step, index) => ({ index, step }));

describe('runtime-execution-engine benchmarks', () => {
  bench('execute (full run)', async () => {
    await manager.execute(request);
  });
  bench('dependency resolution', () => {
    resolver.resolve(plan);
  });
  bench('scheduling', () => {
    scheduler.schedule(resolved, 4, new Set());
  });
  bench('aggregation', () => {
    aggregator.aggregate({
      executionId: 'e',
      terminal: 'completed',
      terminalEvent: 'execution-completed',
      steps: resolved.map((r) => ({
        index: r.index,
        capability: 'tool',
        status: 'succeeded' as const,
        attempts: 1,
        detail: '',
      })),
      path: ['created', 'closed'],
      startedAt: 0,
      finishedAt: 1,
      governance: 'g',
      safety: 's',
      reason: 'r',
    });
  });
});
