import { bench, describe } from 'vitest';

import {
  PromptAssembler,
  PromptCompiler,
  PromptFactory,
  PromptNormalizer,
  PromptRegistry,
  PromptTemplateResolver,
  PromptValidator,
  PromptVariableResolver,
} from '../src/index';

/**
 * Observational micro-baselines for the Prompt Engine's hot paths (Engineering Rule 5, ADR-0022):
 * registration, compilation, variable resolution, normalization, validation, and assembly. Measurement
 * only; deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const factory = new PromptFactory();
const templates = new PromptTemplateResolver();
const variables = new PromptVariableResolver();
const assembler = new PromptAssembler();
const normalizer = new PromptNormalizer();
const validator = new PromptValidator();
const compiler = new PromptCompiler(templates, variables, assembler, normalizer, validator);

const parts = [
  { layer: 'governing', content: 'Stay within the rules.' },
  { layer: 'task', content: 'Summarize {{topic}}.' },
];
const input = { id: 'summary', capability: 'chat', parts, requiredVariables: ['topic'] };
const built = factory.create(input);
const definition = built.ok ? built.value : undefined;
const composition = { variables: { topic: 'the report' } };
const registry = new PromptRegistry();

describe('prompt-engine', () => {
  bench('register', () => {
    new PromptRegistry().register(input);
  });
  bench('compile', () => {
    if (definition) {
      compiler.compile(definition, composition, registry, true);
    }
  });
  bench('resolve-variables', () => {
    variables.resolve(parts, ['topic'], { topic: 'the report' }, true);
  });
  bench('normalize', () => {
    normalizer.normalize('  a   b  \n\n\n\nc  ');
  });
  bench('validate', () => {
    validator.validate(parts, 'Stay within the rules.\n\nSummarize the report.');
  });
  bench('assemble', () => {
    assembler.assemble(parts);
  });
});
