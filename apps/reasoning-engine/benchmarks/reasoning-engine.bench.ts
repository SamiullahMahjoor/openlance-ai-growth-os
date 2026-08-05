import { bench, describe } from 'vitest';

import {
  ReasoningDecomposer,
  ReasoningFactory,
  ReasoningNormalizer,
  ReasoningPlanner,
  ReasoningRegistry,
  ReasoningValidator,
} from '../src/index';

/**
 * Observational micro-baselines for the Reasoning Engine's public operations (Engineering Rule 5, ADR-0022):
 * registration, reasoning, decomposition, validation, normalization, and the workflow order. Measurement only;
 * deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const factory = new ReasoningFactory();
const decomposer = new ReasoningDecomposer();
const validator = new ReasoningValidator();
const normalizer = new ReasoningNormalizer();
const planner = new ReasoningPlanner(decomposer, validator, normalizer);

const premise = factory.create({ id: 'p', statement: 'a fact', source: 'src' });
const registry = new ReasoningRegistry();
if (premise.ok) registry.register(premise.value);
const request = { task: 'the task', strategy: 'decomposition', premises: ['p'], permitted: true };

describe('reasoning-engine', () => {
  bench('registration', () => {
    const built = factory.create({ id: 'p', statement: 'a fact', source: 'src' });
    if (built.ok) new ReasoningRegistry().register(built.value);
  });
  bench('reasoning', () => {
    planner.plan(request, registry, false);
  });
  bench('decomposition', () => {
    decomposer.decompose('the task', ['part a', 'part b']);
  });
  bench('validation', () => {
    validator.validate(['p'], [], true);
  });
  bench('normalization', () => {
    normalizer.normalize('  a   fact  ');
  });
  bench('workflow-order', () => {
    planner.workflowInConstitutionalOrder();
  });
});
