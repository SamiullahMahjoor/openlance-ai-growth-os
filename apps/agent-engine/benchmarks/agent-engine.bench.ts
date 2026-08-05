import { bench, describe } from 'vitest';

import {
  AgentComposer,
  AgentCoordinator,
  AgentFactory,
  AgentNormalizer,
  AgentPlanner,
  AgentRegistry,
  AgentValidator,
} from '../src/index';

/**
 * Observational micro-baselines for the Agent Engine's public operations (Engineering Rule 5, ADR-0022): registration,
 * planning, composition, validation, normalization, and execution-plan generation. Measurement only; deterministic over
 * fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const factory = new AgentFactory();
const composer = new AgentComposer();
const validator = new AgentValidator();
const coordinator = new AgentCoordinator();
const normalizer = new AgentNormalizer();
const planner = new AgentPlanner(composer, validator, coordinator, normalizer);

const definition = factory.create({
  id: 'a',
  capabilities: ['reasoning', 'tool'],
  specialization: 'lead',
});
const agent = definition.ok ? definition.value : undefined;
const registry = new AgentRegistry();
if (agent) registry.register(agent);
const steps = [
  { capability: 'reasoning', request: {} },
  { capability: 'tool', request: {} },
];
const request = { agent: 'a', task: 'do the work', steps };

describe('agent-engine', () => {
  bench('registration', () => {
    const built = factory.create({ id: 'a', capabilities: ['reasoning'], specialization: 'lead' });
    if (built.ok) new AgentRegistry().register(built.value);
  });
  bench('planning', () => {
    planner.plan(request, registry, 64, 64);
  });
  bench('composition', () => {
    if (agent) composer.compose(agent, steps, 64);
  });
  bench('validation', () => {
    if (agent) validator.validate(agent, steps);
  });
  bench('normalization', () => {
    normalizer.normalize('  do   the   work  ');
  });
  bench('execution-plan-generation', () => {
    planner.plan(request, registry, 64, 64);
  });
});
