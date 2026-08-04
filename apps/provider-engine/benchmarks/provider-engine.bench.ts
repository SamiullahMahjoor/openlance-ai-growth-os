import { bench, describe } from 'vitest';

import { err, ok } from '@openlance/aios-kernel';

import {
  ProviderError,
  ProviderExecutor,
  ProviderHealthMonitor,
  ProviderLifecycle,
  ProviderMetrics,
  ProviderRegistry,
  ProviderResponseNormalizer,
  ProviderRouter,
  ProviderSelector,
} from '../src/index';
import { mintClearance } from '../src/governance-clearance';

/**
 * Observational micro-baselines for the Provider Engine's hot paths (Engineering Rule 5, ADR-0022):
 * registration, lookup, selection, governed execution, and failover. Measurement only; deterministic
 * over fixed inputs (fixed clock, in-memory stub providers). Recorded results live in
 * benchmarks/baseline.md.
 */
const clock = { now: () => 0 };

const okProvider = {
  id: 'p1',
  capabilities: ['chat'],
  phase: 'operation',
  invoke: () => Promise.resolve(ok('output')),
  probe: () => Promise.resolve('healthy'),
};
const failProvider = {
  id: 'p0',
  capabilities: ['chat'],
  phase: 'operation',
  invoke: () => Promise.resolve(err(new ProviderError('PROVIDER.ADAPTER', 'failed', {}))),
  probe: () => Promise.resolve('healthy'),
};

const lifecycle = new ProviderLifecycle();
const health = new ProviderHealthMonitor();
const router = new ProviderRouter(lifecycle, health);
const selector = new ProviderSelector(router);
const normalizer = new ProviderResponseNormalizer();
const metrics = new ProviderMetrics();
const executor = new ProviderExecutor(router, normalizer, metrics, clock);

const need = { capability: 'chat' };
const request = { capability: 'chat', payload: {} };
const clearance = mintClearance('chat');
const options = { maxAttempts: 1, deadline: null, signal: null };

const populated = new ProviderRegistry();
populated.register(okProvider);

describe('provider-engine', () => {
  bench('register', () => {
    new ProviderRegistry().register(okProvider);
  });
  bench('lookup', () => {
    populated.get('p1');
  });
  bench('select', () => {
    selector.select(need, [okProvider]);
  });
  bench('execute', async () => {
    await executor.execute(clearance, need, request, [okProvider], options);
  });
  bench('failover', async () => {
    await executor.execute(clearance, need, request, [failProvider, okProvider], options);
  });
});
