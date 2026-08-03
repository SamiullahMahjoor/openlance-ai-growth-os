import { bench, describe } from 'vitest';

import {
  assemblyStageAtOrAfter,
  promptLayerAtOrAfter,
  promptPhaseAtOrAfter,
  validationCheckAtOrAfter,
} from '../src/index';

/**
 * Observational micro-baselines for the prompt ordering predicates (Engineering Rule 5, ADR-0022).
 * Measurement only: these run outside `src`, never on a runtime path, and never change behavior. Recorded
 * results live in benchmarks/baseline.md. The prompts namespace's four pure predicates are the layer,
 * lifecycle-phase, assembly-stage, and validation-check orderings; the other concerns are immutable
 * definitions with no executable predicate to benchmark.
 */
describe('prompt predicates', () => {
  bench('promptLayerAtOrAfter', () => {
    promptLayerAtOrAfter('task', 'governing');
  });

  bench('promptPhaseAtOrAfter', () => {
    promptPhaseAtOrAfter('retirement', 'definition');
  });

  bench('assemblyStageAtOrAfter', () => {
    assemblyStageAtOrAfter('finalize-for-validation', 'resolve-inheritance');
  });

  bench('validationCheckAtOrAfter', () => {
    validationCheckAtOrAfter('grounding-and-separation', 'governance-conformance');
  });
});
