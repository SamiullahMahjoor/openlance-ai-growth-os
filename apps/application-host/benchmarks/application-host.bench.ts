import { DefaultsProvider } from '@openlance/aios-config';
import { bench, describe } from 'vitest';

import { bootstrapAios } from '../src/index';

/**
 * Observational micro-baseline for the application host (Engineering Rule 5, ADR-0022): a full substrate bootstrap.
 * Measurement only; deterministic over fixed inputs. Recorded results live in benchmarks/baseline.md.
 */
const clock = { now: () => 0 };
const sink = { write: () => undefined };
const config = [new DefaultsProvider({ app: { name: 'bench' } })];
const logging = { level: 'info' as const, clock, sinks: [sink] };

describe('application-host benchmarks', () => {
  bench('bootstrapAios (substrate)', async () => {
    const result = await bootstrapAios({ config, logging });
    if (result.ok) {
      await result.value.dispose();
    }
  });
});
