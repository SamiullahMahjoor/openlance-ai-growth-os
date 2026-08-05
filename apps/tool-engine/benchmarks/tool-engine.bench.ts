import { bench, describe } from 'vitest';

import {
  ToolExecutor,
  ToolFactory,
  ToolNormalizer,
  ToolRegistry,
  ToolResolver,
  ToolSelector,
  ToolValidator,
} from '../src/index';

/**
 * Observational micro-baselines for the Tool Engine's hot paths (Engineering Rule 5, ADR-0022): registration,
 * discovery, selection, validation, execution preparation, execution, and normalization. Measurement only;
 * deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const factory = new ToolFactory();
const selector = new ToolSelector();
const resolver = new ToolResolver();
const validator = new ToolValidator();
const normalizer = new ToolNormalizer();

const definition = factory.create({
  id: 'a',
  capabilities: [{ name: 'act', parameters: [{ name: 'x', required: true }] }],
  requiresClearance: false,
});
const tool = definition.ok ? definition.value : undefined;
const tools = tool ? [tool] : [];
const registry = new ToolRegistry();
if (tool) registry.register(tool);
const executor = new ToolExecutor(selector, resolver, validator, normalizer);
const request = { capability: 'act', arguments: { x: '1' }, permitted: ['a'] };

describe('tool-engine', () => {
  bench('registration', () => {
    const built = factory.create({
      id: 'a',
      capabilities: [{ name: 'act', parameters: [] }],
      requiresClearance: false,
    });
    if (built.ok) new ToolRegistry().register(built.value);
  });
  bench('discovery', () => {
    selector.discover(tools, 'act');
  });
  bench('selection', () => {
    selector.select(tools);
  });
  bench('validation', () => {
    if (tool) validator.validate(tool, request);
  });
  bench('execution-preparation', () => {
    if (tool) resolver.resolve(tool, registry);
  });
  bench('execution', () => {
    executor.prepare(request, registry, false);
  });
  bench('normalization', () => {
    normalizer.normalize('  do   thing  ');
  });
});
