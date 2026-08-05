import { createEventBus } from '@openlance/aios-events';
import { bench, describe } from 'vitest';

import { Comparator, EvaluationManager, Measurer, Scorer, Validator } from '../src/index';
import type { EvaluationRequest } from '../src/index';

/**
 * Observational micro-baselines for the Evaluation Engine's public operations (Engineering Rule 5, ADR-0022): evaluate (a
 * full cycle), measurement, scoring, and validation. Measurement only; deterministic over fixed inputs. Recorded results
 * live in benchmarks/baseline.md.
 */
const clock = { now: () => 0 };

const request: EvaluationRequest = {
  evaluation: 'eval-1',
  subject: { kind: 'reasoning', reference: 'output-1' },
  metrics: [
    { metric: 'accuracy', value: 0.9, grounded: true },
    { metric: 'grounding', value: 0.8, grounded: true },
  ],
};

const manager = new EvaluationManager({ clock, bus: createEventBus() });
const measurer = new Measurer();
const scorer = new Scorer();
const comparator = new Comparator();
const validator = new Validator();
const measured = measurer.measure(request.metrics);
const score = scorer.derive(measured);
const benchmark = { name: 'b', version: '1', values: [{ metric: 'accuracy', value: 0.7 }] };

let seq = 0;

describe('evaluation-engine benchmarks', () => {
  bench('evaluate (full cycle)', async () => {
    await manager.evaluate({ ...request, evaluation: `eval-${(seq += 1)}` });
  });
  bench('measurement', () => {
    measurer.measure(request.metrics);
  });
  bench('scoring', () => {
    scorer.derive(measured);
  });
  bench('comparison', () => {
    comparator.compare(measured, benchmark);
  });
  bench('validation', () => {
    validator.validate({ request, measured, score, benchmark: null, benchmarkRequested: false });
  });
});
