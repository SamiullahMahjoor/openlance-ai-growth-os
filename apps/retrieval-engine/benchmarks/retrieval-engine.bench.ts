import { bench, describe } from 'vitest';

import {
  RetrievalExecutor,
  RetrievalFilter,
  RetrievalNormalizer,
  RetrievalRanker,
  RetrievalRegistry,
  RetrievalResolver,
  RetrievalValidator,
} from '../src/index';

/**
 * Observational micro-baselines for the Retrieval Engine's hot paths (Engineering Rule 5, ADR-0022):
 * register, retrieve, filter, rank, normalize, and validate. Measurement only; deterministic over fixed
 * inputs. Recorded results live in benchmarks/baseline.md.
 */
const candidate = Object.freeze({
  id: 'k1',
  owner: 'owner-k1',
  authority: 3,
  topics: ['t'],
  dependsOn: [],
  content: 'a knowledge reference',
});

const filter = new RetrievalFilter();
const ranker = new RetrievalRanker();
const validator = new RetrievalValidator();
const normalizer = new RetrievalNormalizer();
const populated = new RetrievalRegistry();
populated.register(candidate);
const executor = new RetrievalExecutor(filter, new RetrievalResolver(), ranker, validator);
const candidates = [candidate];

describe('retrieval-engine', () => {
  bench('register', () => {
    new RetrievalRegistry().register(candidate);
  });
  bench('retrieve', () => {
    executor.execute({ scope: 't' }, populated, false);
  });
  bench('filter', () => {
    filter.discover(candidates, 't');
  });
  bench('rank', () => {
    ranker.rank(candidates);
  });
  bench('normalize', () => {
    normalizer.normalize('  a   b  \n\n\n\nc  ');
  });
  bench('validate', () => {
    validator.validate(candidates, undefined);
  });
});
