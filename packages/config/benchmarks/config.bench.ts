import { ValidationError } from '@openlance/aios-errors';
import { err, ok } from '@openlance/aios-kernel';
import { bench, describe } from 'vitest';

import {
  createConfigService,
  DefaultsProvider,
  EnvProvider,
  loadConfig,
  ObjectProvider,
} from '../src/index';
import type { Schema } from '../src/index';
import { mergeProviders } from '../src/hierarchy';

/**
 * Observational micro-baselines for the configuration system (Engineering Rule 5).
 * Measurement only: these run outside `src`, never on a runtime path, and never
 * change behavior. Recorded results live in benchmarks/baseline.md.
 */
const schema: Schema<{ port: number }> = {
  parse: (input) =>
    typeof input === 'object' &&
    input !== null &&
    typeof (input as { port?: unknown }).port === 'number'
      ? ok({ port: (input as { port: number }).port })
      : err(
          new ValidationError('V.PORT', 'invalid', [{ path: 'port', message: 'must be a number' }]),
        ),
};

const providers = [
  new DefaultsProvider({ port: 1, db: { host: 'localhost', poolSize: 10 } }),
  new EnvProvider({ source: { AIOS_HOST: 'remote' }, prefix: 'AIOS_' }),
  new ObjectProvider('override', 30, { port: 8080 }),
];

describe('config primitives', () => {
  bench('merge providers', () => {
    mergeProviders(providers);
  });

  bench('build config service', () => {
    createConfigService(providers);
  });

  const built = createConfigService(providers);
  bench('lookup and validate (get)', () => {
    if (built.ok) {
      built.value.get(schema);
    }
  });

  bench('startup validate (loadConfig)', () => {
    loadConfig(providers, schema);
  });

  bench('snapshot creation (merge + freeze)', () => {
    mergeProviders([new DefaultsProvider({ a: { b: { c: 1 } } })]);
  });
});
