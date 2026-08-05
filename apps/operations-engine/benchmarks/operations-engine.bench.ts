import { createEventBus } from '@openlance/aios-events';
import type { ExecutionRecord } from '@openlance/aios-runtime-execution-engine';
import { bench, describe } from 'vitest';

import {
  HealthManager,
  IncidentManager,
  MetricsAggregator,
  MetricsCollector,
  OperationsHash,
  OperationsManager,
  TelemetryAggregator,
  TelemetryCollector,
} from '../src/index';
import type { Observation } from '../src/index';

/**
 * Observational micro-baselines for the Operations Engine's public operations (Engineering Rule 5, ADR-0022): observe (a
 * full cycle), health assessment, metrics aggregation, and incident recognition. Measurement only; deterministic over
 * fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const clock = { now: () => 0 };
const record: ExecutionRecord = {
  executionId: 'e',
  terminal: 'failed',
  terminalEvent: 'execution-failed',
  steps: [{ index: 0, capability: 'tool', status: 'failed', attempts: 2, detail: 'x' }],
  path: ['created', 'executing', 'recovering', 'failed', 'closed'],
  startedAt: 0,
  finishedAt: 1,
  governance: 'gov-1',
  safety: 'saf-1',
  reason: 'boom',
  validated: true,
};

const manager = new OperationsManager({ clock, bus: createEventBus() });
const telemetry = new TelemetryCollector();
const aggregator = new TelemetryAggregator();
const metrics = new MetricsAggregator(new MetricsCollector(), new OperationsHash());
const health = new HealthManager();
const incidents = new IncidentManager();

let seq = 0;
const observation = (): Observation => ({ kind: 'record', id: `o-${(seq += 1)}`, record });
const totals = {
  executions: 4,
  completed: 2,
  failed: 2,
  cancelled: 0,
  stepsRun: 4,
  retries: 2,
  recoveries: 1,
  timeouts: 0,
  unknown: 0,
};
const built = metrics.build(totals);

describe('operations-engine benchmarks', () => {
  bench('observe (full cycle)', async () => {
    await manager.observe(observation());
  });
  bench('metrics aggregation', () => {
    aggregator.record(telemetry.collect(observation()));
    metrics.build(aggregator.totals());
  });
  bench('health assessment', () => {
    health.assess(built, 0.5);
  });
  bench('incident recognition', () => {
    incidents.recognize('gov-1', 'critical', 'boom');
  });
});
