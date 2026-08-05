import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  DEFAULT_SETTINGS,
  RETRIEVAL_EVENT_TYPES,
  RetrievalConfiguration,
  RetrievalEvents,
  RetrievalExecutor,
  RetrievalFactory,
  RetrievalFilter,
  RetrievalLifecycle,
  RetrievalManager,
  RetrievalMetrics,
  RetrievalNormalizer,
  RetrievalPlanner,
  RetrievalPluginBridge,
  RetrievalRanker,
  RetrievalRegistry,
  RetrievalResolver,
  RetrievalValidator,
  VALIDATION_ERROR_CODES,
} from '../src/index';

/** A retrieval candidate (frozen). */
const cand = (id, extra = {}) =>
  Object.freeze({
    id,
    owner: `owner-${id}`,
    authority: 1,
    topics: ['t'],
    dependsOn: [],
    content: 'c',
    ...extra,
  });

/** A candidate registration input. */
const input = (id, extra = {}) => ({
  id,
  owner: `owner-${id}`,
  authority: 1,
  topics: ['t'],
  content: 'c',
  ...extra,
});

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

describe('RetrievalRegistry', () => {
  it('registers, discovers, lists in order, and unregisters', () => {
    const registry = new RetrievalRegistry();
    expectOk(registry.register(cand('a')));
    expectOk(registry.register(cand('b')));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((c) => c.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((c) => c.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new RetrievalRegistry();
    expectOk(registry.register(cand('a')));
    expect(expectErr(registry.register(cand('a'))).code).toBe('RETRIEVAL.DUPLICATE_ID');
  });
});

describe('RetrievalNormalizer', () => {
  it('settles structure', () => {
    expect(new RetrievalNormalizer().normalize('  a   b  \n\n\n\nc  \n  ')).toBe('a b\n\nc');
  });
});

describe('RetrievalFactory', () => {
  it('builds a frozen candidate, normalizing content and defaulting dependsOn', () => {
    const built = expectOk(new RetrievalFactory().create(input('a', { content: '  x   y ' })));
    expect(built.content).toBe('x y');
    expect(built.dependsOn).toEqual([]);
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.topics)).toBe(true);
  });

  it('fails closed on a blank id, blank owner, invalid authority, no topics, or empty content', () => {
    const factory = new RetrievalFactory();
    expect(expectErr(factory.create(input('  '))).code).toBe('RETRIEVAL.BLANK_ID');
    expect(expectErr(factory.create(input('a', { owner: '  ' }))).code).toBe(
      'RETRIEVAL.BLANK_OWNER',
    );
    expect(expectErr(factory.create(input('a', { authority: Number.NaN }))).code).toBe(
      'RETRIEVAL.INVALID_AUTHORITY',
    );
    expect(expectErr(factory.create(input('a', { authority: -1 }))).code).toBe(
      'RETRIEVAL.INVALID_AUTHORITY',
    );
    expect(expectErr(factory.create(input('a', { topics: [] }))).code).toBe('RETRIEVAL.NO_TOPICS');
    expect(expectErr(factory.create(input('a', { content: '   ' }))).code).toBe(
      'RETRIEVAL.BLANK_CONTENT',
    );
  });
});

describe('RetrievalLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases, the predicate, and validation gating', () => {
    const lifecycle = new RetrievalLifecycle();
    expect(lifecycle.phases()).toEqual([
      'request',
      'determination',
      'assembly',
      'validation',
      'result',
    ]);
    expect(lifecycle.atOrAfter('result', 'validation')).toBe(true);
    expect(lifecycle.atOrAfter('request', 'validation')).toBe(false);
    expect(lifecycle.isValidated('validation')).toBe(true);
    expect(lifecycle.isValidated('request')).toBe(false);
  });
});

describe('RetrievalPlanner (consumes the frozen workflow model)', () => {
  it('exposes and proves the frozen workflow step order', () => {
    const planner = new RetrievalPlanner();
    expect(planner.plan()).toEqual([
      'receive-request',
      'discover',
      'select',
      'resolve-dependencies',
      'prioritize',
      'assemble',
      'validate',
      'produce-result',
    ]);
    expect(planner.stepsInConstitutionalOrder()).toBe(true);
  });
});

describe('RetrievalFilter', () => {
  it('discovers by topic and selects the permitted subset', () => {
    const filter = new RetrievalFilter();
    const candidates = [cand('a', { topics: ['t'] }), cand('b', { topics: ['u'] })];
    expect(filter.discover(candidates, 't').map((c) => c.id)).toEqual(['a']);
    expect(filter.select(candidates, undefined).map((c) => c.id)).toEqual(['a', 'b']);
    expect(filter.select(candidates, ['b']).map((c) => c.id)).toEqual(['b']);
  });
});

describe('RetrievalResolver (dependency resolution, bounded and acyclic)', () => {
  const build = (candidates) => {
    const registry = new RetrievalRegistry();
    for (const c of candidates) registry.register(c);
    return { registry, resolver: new RetrievalResolver() };
  };

  it('expands to a dependency-complete set, deduplicating shared dependencies', () => {
    const c = cand('c');
    const a = cand('a', { dependsOn: ['c'] });
    const b = cand('b', { dependsOn: ['c'] });
    const { registry, resolver } = build([a, b, c]);
    const resolved = expectOk(resolver.resolve([a, b], registry));
    expect(resolved.map((x) => x.id)).toEqual(['c', 'a', 'b']);
  });

  it('fails closed on an unknown dependency and on a dependency cycle', () => {
    const a1 = cand('a', { dependsOn: ['missing'] });
    const { registry: r1, resolver: res1 } = build([a1]);
    expect(expectErr(res1.resolve([a1], r1)).code).toBe('RETRIEVAL.UNKNOWN_DEPENDENCY');

    const a2 = cand('a', { dependsOn: ['b'] });
    const b2 = cand('b', { dependsOn: ['a'] });
    const { registry: r2, resolver: res2 } = build([a2, b2]);
    expect(expectErr(res2.resolve([a2], r2)).code).toBe('RETRIEVAL.DEPENDENCY_CYCLE');
  });
});

describe('RetrievalRanker', () => {
  it('orders by authority (governing first) with a stable, environment-independent id tiebreak', () => {
    const ranker = new RetrievalRanker();
    // authority dominates
    expect(
      ranker
        .rank([
          cand('b', { authority: 1 }),
          cand('a', { authority: 1 }),
          cand('c', { authority: 5 }),
        ])
        .map((c) => c.id),
    ).toEqual(['c', 'a', 'b']);
    // equal authority falls back to id by code point, resolved in both directions
    expect(
      ranker
        .rank([
          cand('b', { authority: 1 }),
          cand('c', { authority: 1 }),
          cand('a', { authority: 1 }),
        ])
        .map((c) => c.id),
    ).toEqual(['a', 'b', 'c']);
    // equal authority and equal id tie to zero, leaving the pair intact
    expect(
      ranker.rank([cand('x', { authority: 1 }), cand('x', { authority: 1 })]).map((c) => c.id),
    ).toEqual(['x', 'x']);
  });
});

describe('RetrievalValidator (frozen dimensions, in order, conjunctive)', () => {
  const validator = new RetrievalValidator();

  it('exposes the frozen dimensions and accepts a valid result', () => {
    expect(validator.dimensions()).toEqual([
      'ownership',
      'authority',
      'dependency-completeness',
      'boundaries',
      'governance-permission',
    ]);
    expectOk(
      validator.validate([cand('a', { authority: 2 }), cand('b', { authority: 1 })], undefined),
    );
  });

  it('rejects each disqualifying dimension', () => {
    expect(
      expectErr(
        validator.validate([cand('a', { owner: 'x' }), cand('b', { owner: 'x' })], undefined),
      ).code,
    ).toBe('RETRIEVAL.OWNERSHIP');
    expect(
      expectErr(
        validator.validate([cand('a', { authority: 1 }), cand('b', { authority: 2 })], undefined),
      ).code,
    ).toBe('RETRIEVAL.AUTHORITY_ORDER');
    expect(
      expectErr(validator.validate([cand('a', { dependsOn: ['missing'] })], undefined)).code,
    ).toBe('RETRIEVAL.DEPENDENCY_INCOMPLETE');
    expect(expectErr(validator.validate([cand('a', { content: '  ' })], undefined)).code).toBe(
      'RETRIEVAL.BOUNDARY',
    );
    expect(expectErr(validator.validate([cand('a')], ['other'])).code).toBe(
      'RETRIEVAL.NOT_PERMITTED',
    );
    expectOk(validator.validate([cand('a')], ['a']));
  });

  it('exposes the validation error codes', () => {
    expect(VALIDATION_ERROR_CODES.has('RETRIEVAL.OWNERSHIP')).toBe(true);
    expect(VALIDATION_ERROR_CODES.has('RETRIEVAL.NO_CANDIDATES')).toBe(false);
  });
});

describe('RetrievalExecutor (drives the frozen workflow)', () => {
  const build = (candidates) => {
    const registry = new RetrievalRegistry();
    for (const c of candidates) registry.register(c);
    const executor = new RetrievalExecutor(
      new RetrievalFilter(),
      new RetrievalResolver(),
      new RetrievalRanker(),
      new RetrievalValidator(),
    );
    return { registry, executor };
  };

  it('determines a validated, prioritized, dependency-complete result', () => {
    const dep = cand('dep', { owner: 'owner-dep', authority: 5, topics: ['t'] });
    const a = cand('a', { owner: 'owner-a', authority: 1, topics: ['t'], dependsOn: ['dep'] });
    const { registry, executor } = build([a, dep]);
    const result = expectOk(executor.execute({ scope: 't' }, registry, false));
    expect(result.candidates.map((c) => c.id)).toEqual(['dep', 'a']); // authority 5 first
    expect(result.validated).toBe(true);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.candidates)).toBe(true);
  });

  it('proceeds under a permission set and refuses when strict without one', () => {
    const { registry, executor } = build([cand('a', { topics: ['t'] })]);
    expect(
      expectOk(executor.execute({ scope: 't', permitted: ['a'] }, registry, true)).validated,
    ).toBe(true);
    expect(expectErr(executor.execute({ scope: 't' }, registry, true)).code).toBe(
      'RETRIEVAL.PERMISSION_REQUIRED',
    );
  });

  it('refuses on no candidates, none permitted, an unknown dependency, and a validation failure', () => {
    const { registry: r1, executor: e1 } = build([cand('a', { topics: ['t'] })]);
    expect(expectErr(e1.execute({ scope: 'other' }, r1, false)).code).toBe(
      'RETRIEVAL.NO_CANDIDATES',
    );
    expect(expectErr(e1.execute({ scope: 't', permitted: [] }, r1, false)).code).toBe(
      'RETRIEVAL.NONE_PERMITTED',
    );

    const { registry: r2, executor: e2 } = build([cand('a', { topics: ['t'], dependsOn: ['x'] })]);
    expect(expectErr(e2.execute({ scope: 't' }, r2, false)).code).toBe(
      'RETRIEVAL.UNKNOWN_DEPENDENCY',
    );

    const { registry: r3, executor: e3 } = build([
      cand('a', { owner: 'same', topics: ['t'] }),
      cand('b', { owner: 'same', topics: ['t'] }),
    ]);
    expect(expectErr(e3.execute({ scope: 't' }, r3, false)).code).toBe('RETRIEVAL.OWNERSHIP');
  });
});

describe('RetrievalMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new RetrievalMetrics();
    metrics.recordRegistration();
    metrics.recordRetrieval();
    metrics.recordSuccess();
    metrics.recordFailure();
    metrics.recordValidationFailure();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      retrievals: 1,
      successes: 1,
      failures: 1,
      validationFailures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('RetrievalConfiguration', () => {
  it('defaults to non-strict permission and applies overrides', () => {
    expect(new RetrievalConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new RetrievalConfiguration().settings.strictPermission).toBe(false);
    expect(new RetrievalConfiguration({ strictPermission: true }).settings.strictPermission).toBe(
      true,
    );
  });
});

describe('RetrievalEvents', () => {
  it('publishes registered, retrieved, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new RetrievalEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.retrieved('t', 3);
    await events.failed('t');
    expect(seen.map((e) => e.type)).toEqual([
      RETRIEVAL_EVENT_TYPES.registered,
      RETRIEVAL_EVENT_TYPES.retrieved,
      RETRIEVAL_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ candidateId: 'a' });
    expect(seen[1].payload).toEqual({ scope: 't', count: 3 });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('RetrievalPluginBridge (adopts candidate-carrying plugins)', () => {
  const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin candidate into the registry', () => {
    const registry = new RetrievalRegistry();
    const adopted = expectOk(
      new RetrievalPluginBridge(registry).adopt([
        { manifest, candidate: input('a') },
        { manifest, candidate: input('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new RetrievalPluginBridge(new RetrievalRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid candidate and a conflicting candidate', () => {
    const registry = new RetrievalRegistry();
    expect(
      expectErr(new RetrievalPluginBridge(registry).adopt([{ manifest, candidate: input('  ') }]))
        .code,
    ).toBe('RETRIEVAL.BLANK_ID');
    expectOk(registry.register(cand('a')));
    expect(
      expectErr(new RetrievalPluginBridge(registry).adopt([{ manifest, candidate: input('a') }]))
        .code,
    ).toBe('RETRIEVAL.DUPLICATE_ID');
  });
});

describe('RetrievalManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new RetrievalManager({ clock, bus }), bus };
  };

  it('registers a candidate and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(input('a')))).toBe('a');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(RETRIEVAL_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid candidate and on a duplicate, and removes', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(input('  '))).code).toBe('RETRIEVAL.BLANK_ID');
    expectOk(await manager.register(input('a')));
    expect(expectErr(await manager.register(input('a'))).code).toBe('RETRIEVAL.DUPLICATE_ID');
    expect(manager.remove('a')).toBe(true);
    expect(manager.remove('a')).toBe(false);
  });

  it('retrieves a validated result and emits retrieved', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(input('a', { topics: ['t'] })));
    const result = expectOk(await manager.retrieve({ scope: 't' }));
    expect(result.candidates.map((c) => c.id)).toEqual(['a']);
    expect(events).toContain(RETRIEVAL_EVENT_TYPES.retrieved);
    expect(manager.statistics()).toMatchObject({ retrievals: 1, successes: 1 });
  });

  it('refuses and counts a validation failure distinctly from another failure', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    // no candidates -> a non-validation failure
    expect(expectErr(await manager.retrieve({ scope: 'none' })).code).toBe(
      'RETRIEVAL.NO_CANDIDATES',
    );
    expect(events).toContain(RETRIEVAL_EVENT_TYPES.failed);
    expect(manager.statistics()).toMatchObject({ failures: 1, validationFailures: 0 });
    // duplicate owner -> a validation failure
    expectOk(await manager.register(input('a', { owner: 'same', topics: ['t'] })));
    expectOk(await manager.register(input('b', { owner: 'same', topics: ['t'] })));
    expect(expectErr(await manager.retrieve({ scope: 't' })).code).toBe('RETRIEVAL.OWNERSHIP');
    expect(manager.statistics()).toMatchObject({ failures: 2, validationFailures: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(input('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.candidateCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
