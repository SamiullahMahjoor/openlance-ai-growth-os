import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';
import { err, ok } from '@openlance/aios-kernel';

import {
  DEFAULT_SETTINGS,
  PROVIDER_EVENT_TYPES,
  ProviderCapabilities,
  ProviderConfiguration,
  ProviderError,
  ProviderEvents,
  ProviderExecutor,
  ProviderFactory,
  ProviderHealthMonitor,
  ProviderLifecycle,
  ProviderManager,
  ProviderMetrics,
  ProviderPluginBridge,
  ProviderRegistry,
  ProviderResponseNormalizer,
  ProviderRouter,
  ProviderSelector,
  isEligible,
  providerSatisfies,
} from '../src/index';
import { isClearance, mintClearance } from '../src/governance-clearance';

/** A minimal Provider stub. Adapters supply invoke/probe; the engine holds no vendor knowledge. */
const provider = (id, capabilities, opts = {}) => ({
  id,
  capabilities,
  phase: opts.phase ?? 'operation',
  invoke: opts.invoke ?? (() => Promise.resolve(ok('output'))),
  probe: () => Promise.resolve(opts.health ?? 'healthy'),
});

const failInvoke =
  (code = 'PROVIDER.ADAPTER') =>
  () =>
    Promise.resolve(err(new ProviderError(code, 'adapter failed', {})));

const clock = { now: () => 0 };

const expectOk = (result) => {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(`expected ok, got ${JSON.stringify(result.error)}`);
  return result.value;
};
const expectErr = (result) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error('expected an error');
  return result.error;
};

const buildExecutor = (now = () => 0) => {
  const lifecycle = new ProviderLifecycle();
  const health = new ProviderHealthMonitor();
  const router = new ProviderRouter(lifecycle, health);
  const normalizer = new ProviderResponseNormalizer();
  const metrics = new ProviderMetrics();
  const executor = new ProviderExecutor(router, normalizer, metrics, { now });
  return { executor, metrics, health, router };
};

const need = { capability: 'chat' };
const request = { capability: 'chat', payload: {} };
const options = { maxAttempts: 1, deadline: null, signal: null };

describe('capabilities (ADR-0035, ai/providers/provider-capabilities.md)', () => {
  it('providerSatisfies is true only when the capability is declared', () => {
    expect(providerSatisfies(provider('p', ['chat']), need)).toBe(true);
    expect(providerSatisfies(provider('p', ['vision']), need)).toBe(false);
  });

  it('matching returns the providers that satisfy the need, in order', () => {
    const caps = new ProviderCapabilities();
    const matched = caps.matching(
      [provider('a', ['chat']), provider('b', ['vision']), provider('c', ['chat'])],
      need,
    );
    expect(matched.map((p) => p.id)).toEqual(['a', 'c']);
  });
});

describe('ProviderRegistry', () => {
  it('registers, discovers, lists in order, and unregisters', () => {
    const registry = new ProviderRegistry();
    expectOk(registry.register(provider('a', ['chat'])));
    expectOk(registry.register(provider('b', ['chat'])));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((p) => p.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((p) => p.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new ProviderRegistry();
    expectOk(registry.register(provider('a', ['chat'])));
    const error = expectErr(registry.register(provider('a', ['vision'])));
    expect(error.code).toBe('PROVIDER.DUPLICATE_ID');
    expect(error.category).toBe('infrastructure');
  });
});

describe('ProviderLifecycle (consumes the frozen provider-lifecycle model)', () => {
  it('exposes the frozen ordered phases', () => {
    expect(new ProviderLifecycle().phases()).toEqual([
      'registration',
      'discovery',
      'activation',
      'operation',
      'retirement',
    ]);
  });

  it('is usable only in activation and operation', () => {
    const lifecycle = new ProviderLifecycle();
    expect(lifecycle.isUsable(provider('a', ['chat'], { phase: 'operation' }))).toBe(true);
    expect(lifecycle.isUsable(provider('a', ['chat'], { phase: 'activation' }))).toBe(true);
    expect(lifecycle.isUsable(provider('a', ['chat'], { phase: 'registration' }))).toBe(false);
    expect(lifecycle.isUsable(provider('a', ['chat'], { phase: 'retirement' }))).toBe(false);
  });

  it('answers at-or-after by the constitutional order', () => {
    const lifecycle = new ProviderLifecycle();
    expect(lifecycle.atOrAfter(provider('a', ['chat'], { phase: 'operation' }), 'activation')).toBe(
      true,
    );
    expect(lifecycle.atOrAfter(provider('a', ['chat'], { phase: 'discovery' }), 'operation')).toBe(
      false,
    );
  });
});

describe('ProviderHealthMonitor', () => {
  it('probes and records health; an unprobed provider is unknown', async () => {
    const health = new ProviderHealthMonitor();
    expect(health.status('a')).toBe('unknown');
    expect(await health.check(provider('a', ['chat'], { health: 'healthy' }))).toBe('healthy');
    expect(await health.check(provider('b', ['chat'], { health: 'unhealthy' }))).toBe('unhealthy');
    expect(health.status('a')).toBe('healthy');
    expect(health.isUnhealthy('a')).toBe(false);
    expect(health.isUnhealthy('b')).toBe(true);
    expect(health.isUnhealthy('z')).toBe(false);
  });

  it('forgets a provider health so a retired id leaves no stale status', async () => {
    const health = new ProviderHealthMonitor();
    await health.check(provider('a', ['chat'], { health: 'unhealthy' }));
    expect(health.isUnhealthy('a')).toBe(true);
    health.forget('a');
    expect(health.status('a')).toBe('unknown');
    expect(health.isUnhealthy('a')).toBe(false);
  });
});

describe('ProviderRouter / isEligible', () => {
  it('routes only eligible providers, in registration order', async () => {
    const lifecycle = new ProviderLifecycle();
    const health = new ProviderHealthMonitor();
    const router = new ProviderRouter(lifecycle, health);
    const a = provider('a', ['chat']);
    const wrongCap = provider('b', ['vision']);
    const retired = provider('c', ['chat'], { phase: 'retirement' });
    const sick = provider('d', ['chat'], { health: 'unhealthy' });
    await health.check(sick);
    const routed = router.route(need, [a, wrongCap, retired, sick, provider('e', ['chat'])]);
    expect(routed.map((p) => p.id)).toEqual(['a', 'e']);
  });

  it('isEligible is false at each disqualifying condition', () => {
    const lifecycle = new ProviderLifecycle();
    const health = new ProviderHealthMonitor();
    expect(isEligible(provider('a', ['vision']), need, lifecycle, health)).toBe(false);
    expect(
      isEligible(provider('a', ['chat'], { phase: 'retirement' }), need, lifecycle, health),
    ).toBe(false);
    expect(isEligible(provider('a', ['chat']), need, lifecycle, health)).toBe(true);
  });
});

describe('ProviderSelector', () => {
  it('selects the first eligible provider, or undefined', () => {
    const lifecycle = new ProviderLifecycle();
    const health = new ProviderHealthMonitor();
    const selector = new ProviderSelector(new ProviderRouter(lifecycle, health));
    expect(selector.select(need, [provider('a', ['chat']), provider('b', ['chat'])])?.id).toBe('a');
    expect(selector.select(need, [provider('a', ['vision'])])).toBeUndefined();
  });
});

describe('ProviderResponseNormalizer', () => {
  it('wraps raw output in a frozen neutral envelope', () => {
    const response = new ProviderResponseNormalizer().normalize('p', 'chat', { text: 'hi' });
    expect(response).toEqual({
      providerId: 'p',
      capability: 'chat',
      output: { text: 'hi' },
      normalized: true,
    });
    expect(Object.isFrozen(response)).toBe(true);
  });
});

describe('ProviderMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new ProviderMetrics();
    metrics.recordRegistration();
    metrics.recordInvocation();
    metrics.recordSuccess();
    metrics.recordFailure();
    metrics.recordFailover();
    const stats = metrics.statistics();
    expect(stats).toEqual({
      registrations: 1,
      invocations: 1,
      successes: 1,
      failures: 1,
      failovers: 1,
    });
    expect(Object.isFrozen(stats)).toBe(true);
  });
});

describe('governance clearance (the structural gate)', () => {
  it('mints a clearance carrying the request capability and the frozen validation stages', () => {
    const clearance = mintClearance('chat');
    expect(clearance.capability).toBe('chat');
    expect(clearance.clearedStages).toEqual([
      'constitutional-validation',
      'permission-validation',
      'policy-validation',
    ]);
    expect(Object.isFrozen(clearance)).toBe(true);
  });

  it('recognizes only a genuinely branded clearance', () => {
    expect(isClearance(mintClearance('chat'))).toBe(true);
    expect(isClearance(undefined)).toBe(false);
    expect(isClearance(null)).toBe(false);
    expect(isClearance(42)).toBe(false);
    expect(isClearance({ capability: 'chat' })).toBe(false);
  });
});

describe('ProviderExecutor (governed invocation)', () => {
  it('invokes an eligible provider under a valid clearance and normalizes the response', async () => {
    const { executor, metrics } = buildExecutor();
    const result = await executor.execute(
      mintClearance('chat'),
      need,
      request,
      [provider('p', ['chat'])],
      options,
    );
    const response = expectOk(result);
    expect(response).toEqual({
      providerId: 'p',
      capability: 'chat',
      output: 'output',
      normalized: true,
    });
    expect(metrics.statistics()).toMatchObject({ invocations: 1, successes: 1, failures: 0 });
  });

  it('refuses an invocation with no clearance (the structural gate)', async () => {
    const { executor, metrics } = buildExecutor();
    const error = expectErr(
      await executor.execute(undefined, need, request, [provider('p', ['chat'])], options),
    );
    expect(error.code).toBe('PROVIDER.NO_CLEARANCE');
    expect(metrics.statistics()).toMatchObject({ invocations: 1, failures: 1 });
  });

  it('refuses when the clearance is for a different capability', async () => {
    const { executor } = buildExecutor();
    const error = expectErr(
      await executor.execute(
        mintClearance('vision'),
        need,
        request,
        [provider('p', ['chat'])],
        options,
      ),
    );
    expect(error.code).toBe('PROVIDER.CLEARANCE_MISMATCH');
  });

  it('refuses when no provider is eligible', async () => {
    const { executor } = buildExecutor();
    const error = expectErr(
      await executor.execute(mintClearance('chat'), need, request, [], options),
    );
    expect(error.code).toBe('PROVIDER.NO_PROVIDER');
  });

  it('refuses a cancelled invocation', async () => {
    const { executor } = buildExecutor();
    const error = expectErr(
      await executor.execute(mintClearance('chat'), need, request, [provider('p', ['chat'])], {
        maxAttempts: 1,
        deadline: null,
        signal: { aborted: true },
      }),
    );
    expect(error.code).toBe('PROVIDER.CANCELLED');
  });

  it('refuses when the deadline has passed', async () => {
    const { executor } = buildExecutor();
    const error = expectErr(
      await executor.execute(mintClearance('chat'), need, request, [provider('p', ['chat'])], {
        maxAttempts: 1,
        deadline: -1,
        signal: null,
      }),
    );
    expect(error.code).toBe('PROVIDER.TIMEOUT');
  });

  it('proceeds when a deadline is set but not passed and a non-aborted signal is present', async () => {
    const { executor } = buildExecutor();
    const response = expectOk(
      await executor.execute(mintClearance('chat'), need, request, [provider('p', ['chat'])], {
        maxAttempts: 1,
        deadline: 100,
        signal: { aborted: false },
      }),
    );
    expect(response.providerId).toBe('p');
  });

  it('retries the same provider up to the attempt bound before succeeding', async () => {
    const { executor } = buildExecutor();
    let calls = 0;
    const flaky = provider('f', ['chat'], {
      invoke: () => {
        calls += 1;
        return Promise.resolve(calls === 1 ? err(new ProviderError('E', 'e', {})) : ok('second'));
      },
    });
    const response = expectOk(
      await executor.execute(mintClearance('chat'), need, request, [flaky], {
        maxAttempts: 2,
        deadline: null,
        signal: null,
      }),
    );
    expect(response.output).toBe('second');
    expect(calls).toBe(2);
  });

  it('fails over to the next provider when one is exhausted', async () => {
    const { executor, metrics } = buildExecutor();
    const response = expectOk(
      await executor.execute(
        mintClearance('chat'),
        need,
        request,
        [provider('p0', ['chat'], { invoke: failInvoke() }), provider('p1', ['chat'])],
        options,
      ),
    );
    expect(response.providerId).toBe('p1');
    expect(metrics.statistics()).toMatchObject({ failovers: 1, successes: 1 });
  });

  it('returns the last error when every eligible provider fails', async () => {
    const { executor, metrics } = buildExecutor();
    const error = expectErr(
      await executor.execute(
        mintClearance('chat'),
        need,
        request,
        [
          provider('p0', ['chat'], { invoke: failInvoke('PROVIDER.A') }),
          provider('p1', ['chat'], { invoke: failInvoke('PROVIDER.B') }),
        ],
        options,
      ),
    );
    expect(error.code).toBe('PROVIDER.B');
    expect(metrics.statistics()).toMatchObject({ failovers: 1, failures: 1, successes: 0 });
  });

  it('refuses when the routing need capability diverges from the request capability', async () => {
    const { executor } = buildExecutor();
    const error = expectErr(
      await executor.execute(
        mintClearance('chat'),
        { capability: 'summarize' },
        request,
        [provider('p', ['summarize'])],
        options,
      ),
    );
    expect(error.code).toBe('PROVIDER.CAPABILITY_MISMATCH');
  });

  it('refuses a non-positive, non-integer, or non-finite attempt bound', async () => {
    const { executor } = buildExecutor();
    for (const maxAttempts of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      const error = expectErr(
        await executor.execute(mintClearance('chat'), need, request, [provider('p', ['chat'])], {
          maxAttempts,
          deadline: null,
          signal: null,
        }),
      );
      expect(error.code).toBe('PROVIDER.INVALID_ATTEMPTS');
    }
  });
});

describe('ProviderConfiguration', () => {
  it('uses the default settings and derives execution options', () => {
    const config = new ProviderConfiguration();
    expect(config.settings).toEqual(DEFAULT_SETTINGS);
    expect(config.executionOptions()).toEqual({ maxAttempts: 1, deadline: null, signal: null });
  });

  it('applies overrides', () => {
    const config = new ProviderConfiguration({ maxAttempts: 3, deadline: 500 });
    expect(config.settings).toEqual({ maxAttempts: 3, deadline: 500 });
    expect(config.executionOptions()).toEqual({ maxAttempts: 3, deadline: 500, signal: null });
  });
});

describe('ProviderFactory', () => {
  it('fills a default phase and probe when the descriptor omits them', async () => {
    const built = expectOk(
      new ProviderFactory().create({
        id: 'p',
        capabilities: ['chat'],
        invoke: () => Promise.resolve(ok('x')),
      }),
    );
    expect(built.phase).toBe('operation');
    expect(await built.probe()).toBe('unknown');
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.capabilities)).toBe(true);
  });

  it('keeps a provided phase and probe', async () => {
    const built = expectOk(
      new ProviderFactory().create({
        id: 'p',
        capabilities: ['chat'],
        phase: 'activation',
        invoke: () => Promise.resolve(ok('x')),
        probe: () => Promise.resolve('healthy'),
      }),
    );
    expect(built.phase).toBe('activation');
    expect(await built.probe()).toBe('healthy');
  });

  it('fails closed on a blank id or no capabilities', () => {
    const factory = new ProviderFactory();
    expect(
      expectErr(
        factory.create({
          id: '  ',
          capabilities: ['chat'],
          invoke: () => Promise.resolve(ok('x')),
        }),
      ).code,
    ).toBe('PROVIDER.BLANK_ID');
    expect(
      expectErr(
        factory.create({ id: 'p', capabilities: [], invoke: () => Promise.resolve(ok('x')) }),
      ).code,
    ).toBe('PROVIDER.NO_CAPABILITIES');
  });
});

describe('ProviderEvents', () => {
  it('publishes registered, invoked, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new ProviderEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => {
      seen.push(event);
    });
    await events.registered('p');
    await events.invoked('p', 'chat');
    await events.failed('chat');
    expect(seen.map((e) => e.type)).toEqual([
      PROVIDER_EVENT_TYPES.registered,
      PROVIDER_EVENT_TYPES.invoked,
      PROVIDER_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ providerId: 'p' });
    expect(seen[1].payload).toEqual({ providerId: 'p', capability: 'chat' });
    expect(seen[2].payload).toEqual({ capability: 'chat' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('ProviderPluginBridge (adopts provider-carrying plugins)', () => {
  const manifest = { name: 'chat-adapter', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin provider into the registry', () => {
    const registry = new ProviderRegistry();
    const bridge = new ProviderPluginBridge(registry);
    const adopted = expectOk(
      bridge.adopt([
        { manifest, provider: provider('a', ['chat']) },
        { manifest, provider: provider('b', ['chat']) },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new ProviderPluginBridge(new ProviderRegistry()).adopt([]))).toEqual([]);
  });

  it('validates each plugin provider through the factory (no blank id can slip in)', () => {
    const error = expectErr(
      new ProviderPluginBridge(new ProviderRegistry()).adopt([
        { manifest, provider: provider('   ', ['chat']) },
      ]),
    );
    expect(error.code).toBe('PROVIDER.BLANK_ID');
  });

  it('fails closed on a conflicting provider', () => {
    const registry = new ProviderRegistry();
    expectOk(registry.register(provider('a', ['chat'])));
    const error = expectErr(
      new ProviderPluginBridge(registry).adopt([{ manifest, provider: provider('a', ['chat']) }]),
    );
    expect(error.code).toBe('PROVIDER.DUPLICATE_ID');
  });
});

describe('ProviderManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new ProviderManager({ clock, bus }), bus };
  };

  const descriptor = (id, capabilities = ['chat'], extra = {}) => ({
    id,
    capabilities,
    invoke: () => Promise.resolve(ok('output')),
    ...extra,
  });

  it('registers a provider and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(descriptor('m1')))).toBe('m1');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(PROVIDER_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid descriptor and on a duplicate', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(descriptor('  '))).code).toBe('PROVIDER.BLANK_ID');
    expectOk(await manager.register(descriptor('m1')));
    expect(expectErr(await manager.register(descriptor('m1'))).code).toBe('PROVIDER.DUPLICATE_ID');
  });

  it('checks health for a known provider and refuses an unknown one', async () => {
    const { manager } = build();
    expectOk(
      await manager.register(
        descriptor('m1', ['chat'], { probe: () => Promise.resolve('healthy') }),
      ),
    );
    expect(expectOk(await manager.checkHealth('m1'))).toBe('healthy');
    expect(expectErr(await manager.checkHealth('nope')).code).toBe('PROVIDER.UNKNOWN');
  });

  it('retires a provider, clearing its recorded health (orderly retirement)', async () => {
    const { manager } = build();
    expectOk(
      await manager.register(
        descriptor('m1', ['chat'], { probe: () => Promise.resolve('unhealthy') }),
      ),
    );
    expectOk(await manager.checkHealth('m1'));
    expect(manager.unregister('m1')).toBe(true);
    expect(manager.unregister('m1')).toBe(false);
    expect(manager.select(need)).toBeUndefined();
    // A fresh provider under the same id inherits no stale 'unhealthy' status.
    expectOk(await manager.register(descriptor('m1')));
    expect(manager.select(need)?.id).toBe('m1');
  });

  it('evaluates candidates, selection, and routing', async () => {
    const { manager } = build();
    expectOk(await manager.register(descriptor('m1')));
    expect(manager.candidates(need).map((p) => p.id)).toEqual(['m1']);
    expect(manager.candidates({ capability: 'vision' })).toEqual([]);
    expect(manager.select(need)?.id).toBe('m1');
    expect(manager.select({ capability: 'vision' })).toBeUndefined();
    expect(manager.route(need).map((p) => p.id)).toEqual(['m1']);
  });

  it('invokes behind a clearance and emits an invoked event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(descriptor('m1')));
    const response = expectOk(await manager.invoke(mintClearance('chat'), need, request));
    expect(response.providerId).toBe('m1');
    expect(events).toContain(PROVIDER_EVENT_TYPES.invoked);
  });

  it('emits a failed event and returns the error when invocation fails', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    const error = expectErr(await manager.invoke(undefined, need, request));
    expect(error.code).toBe('PROVIDER.NO_CLEARANCE');
    expect(events).toContain(PROVIDER_EVENT_TYPES.failed);
  });

  it('reports statistics and a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(descriptor('m1')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.providerCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
    expect(manager.statistics().registrations).toBe(1);
  });
});
