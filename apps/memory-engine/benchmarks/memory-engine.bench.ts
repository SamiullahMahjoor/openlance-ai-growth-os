import { bench, describe } from 'vitest';

import {
  MemoryIndexer,
  MemoryLookup,
  MemoryNormalizer,
  MemoryRegistry,
  MemoryResolver,
  MemoryValidator,
  MemoryLifecycle,
} from '../src/index';

/**
 * Observational micro-baselines for the Memory Engine's hot paths (Engineering Rule 5, ADR-0022):
 * registration, lookup, indexing, normalization, and validation. Measurement only; deterministic over
 * fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const record = Object.freeze({
  id: 'm1',
  type: 'working',
  retention: 'session',
  scope: 's',
  content: 'retained context',
  phase: 'retention',
});

const validator = new MemoryValidator();
const normalizer = new MemoryNormalizer();
const populatedRegistry = new MemoryRegistry();
const populatedIndexer = new MemoryIndexer();
populatedRegistry.register(record);
populatedIndexer.index(record);
const lookup = new MemoryLookup(populatedRegistry, populatedIndexer);
const resolver = new MemoryResolver(lookup, new MemoryLifecycle());

describe('memory-engine', () => {
  bench('register', () => {
    new MemoryRegistry().register(record);
  });
  bench('index', () => {
    new MemoryIndexer().index(record);
  });
  bench('lookup', () => {
    resolver.resolve({ scope: 's' });
  });
  bench('normalize', () => {
    normalizer.normalize('  a   b  \n\n\n\nc  ');
  });
  bench('validate', () => {
    validator.validate(record, true);
  });
});
