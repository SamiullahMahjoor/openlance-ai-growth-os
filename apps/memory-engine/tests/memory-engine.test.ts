import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  DEFAULT_SETTINGS,
  MEMORY_EVENT_TYPES,
  MemoryConfiguration,
  MemoryEvents,
  MemoryFactory,
  MemoryIndexer,
  MemoryLifecycle,
  MemoryLookup,
  MemoryManager,
  MemoryMetrics,
  MemoryNormalizer,
  MemoryPluginBridge,
  MemoryRegistry,
  MemoryResolver,
  MemoryValidator,
} from '../src/index';

/** A retained record (frozen). */
const rec = (id, extra = {}) =>
  Object.freeze({
    id,
    type: 'working',
    retention: 'session',
    scope: 's',
    content: 'ctx',
    phase: 'retention',
    ...extra,
  });

/** A record formation input. */
const input = (id, extra = {}) => ({
  id,
  type: 'working',
  retention: 'session',
  scope: 's',
  content: 'ctx',
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

describe('MemoryRegistry', () => {
  it('registers, discovers, lists in order, and unregisters', () => {
    const registry = new MemoryRegistry();
    expectOk(registry.register(rec('a')));
    expectOk(registry.register(rec('b')));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((r) => r.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((r) => r.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new MemoryRegistry();
    expectOk(registry.register(rec('a')));
    expect(expectErr(registry.register(rec('a'))).code).toBe('MEMORY.DUPLICATE_ID');
  });
});

describe('MemoryFactory', () => {
  it('builds a frozen record, filling the default retention phase', () => {
    const built = expectOk(new MemoryFactory().create(input('a')));
    expect(built.phase).toBe('retention');
    expect(Object.isFrozen(built)).toBe(true);
  });

  it('keeps a provided phase', () => {
    const built = expectOk(new MemoryFactory().create(input('a', { phase: 'formation' })));
    expect(built.phase).toBe('formation');
  });

  it('fails closed on a blank id, invalid type, invalid retention, or blank scope', () => {
    const factory = new MemoryFactory();
    expect(expectErr(factory.create(input('  '))).code).toBe('MEMORY.BLANK_ID');
    expect(expectErr(factory.create(input('a', { type: 'bogus' }))).code).toBe(
      'MEMORY.INVALID_TYPE',
    );
    expect(expectErr(factory.create(input('a', { retention: 'bogus' }))).code).toBe(
      'MEMORY.INVALID_RETENTION',
    );
    expect(expectErr(factory.create(input('a', { scope: '  ' }))).code).toBe('MEMORY.BLANK_SCOPE');
    expect(expectErr(factory.create(input('a', { phase: 'bogus' }))).code).toBe(
      'MEMORY.INVALID_PHASE',
    );
  });
});

describe('MemoryLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases and the ordering predicate', () => {
    const lifecycle = new MemoryLifecycle();
    expect(lifecycle.phases()).toEqual(['formation', 'retention', 'removal']);
    expect(lifecycle.atOrAfter('retention', 'formation')).toBe(true);
    expect(lifecycle.atOrAfter('formation', 'retention')).toBe(false);
  });

  it('is recallable only while retained and not removed', () => {
    const lifecycle = new MemoryLifecycle();
    expect(lifecycle.isRecallable(rec('a', { phase: 'formation' }))).toBe(false);
    expect(lifecycle.isRecallable(rec('a', { phase: 'retention' }))).toBe(true);
    expect(lifecycle.isRecallable(rec('a', { phase: 'removal' }))).toBe(false);
  });
});

describe('MemoryValidator', () => {
  const validator = new MemoryValidator();
  it('accepts grounded content and rejects empty content when strict', () => {
    expectOk(validator.validate(rec('a', { content: 'ctx' }), true));
    expect(expectErr(validator.validate(rec('a', { content: '   ' }), true)).code).toBe(
      'MEMORY.NOT_GROUNDED',
    );
    expectOk(validator.validate(rec('a', { content: '' }), false));
  });
});

describe('MemoryNormalizer', () => {
  it('settles structure', () => {
    expect(new MemoryNormalizer().normalize('  a   b  \n\n\n\nc  \n  ')).toBe('a b\n\nc');
  });
});

describe('MemoryIndexer', () => {
  it('indexes, deindexes, and looks up ids by scope and type, deterministically', () => {
    const indexer = new MemoryIndexer();
    indexer.index(rec('a', { scope: 's1', type: 'working' }));
    indexer.index(rec('b', { scope: 's1', type: 'session' }));
    indexer.index(rec('a', { scope: 's1', type: 'working' })); // duplicate id is not added twice
    expect(indexer.idsForScope('s1')).toEqual(['a', 'b']);
    expect(indexer.idsForType('working')).toEqual(['a']);
    expect(indexer.idsForScope('none')).toEqual([]);
    expect(indexer.idsForType('episodic')).toEqual([]);
    indexer.deindex(rec('a', { scope: 's1', type: 'working' }));
    expect(indexer.idsForScope('s1')).toEqual(['b']);
    indexer.deindex(rec('z', { scope: 'never', type: 'working' })); // deindexing an unindexed scope is a no-op
    expect(indexer.idsForScope('never')).toEqual([]);
  });
});

describe('MemoryLookup', () => {
  it('looks up records by id, scope, and type; skips an index entry with no record', () => {
    const registry = new MemoryRegistry();
    const indexer = new MemoryIndexer();
    const lookup = new MemoryLookup(registry, indexer);
    const a = rec('a', { scope: 's', type: 'working' });
    expectOk(registry.register(a));
    indexer.index(a);
    const ghost = rec('ghost', { scope: 's', type: 'working' });
    indexer.index(ghost); // indexed but never registered
    expect(lookup.byId('a')?.id).toBe('a');
    expect(lookup.byId('missing')).toBeUndefined();
    expect(lookup.byScope('s').map((r) => r.id)).toEqual(['a']); // ghost is skipped
    expect(lookup.byType('working').map((r) => r.id)).toEqual(['a']);
  });
});

describe('MemoryResolver (recall; consumes retentionAtLeast)', () => {
  const build = () => {
    const registry = new MemoryRegistry();
    const indexer = new MemoryIndexer();
    const resolver = new MemoryResolver(new MemoryLookup(registry, indexer), new MemoryLifecycle());
    const add = (record) => {
      registry.register(record);
      indexer.index(record);
    };
    return { resolver, add };
  };

  it('resolves recallable records for a scope, narrowed by type, recallability, and retention', () => {
    const { resolver, add } = build();
    add(rec('working-session', { type: 'working', retention: 'session' }));
    add(rec('session-permanent', { type: 'session', retention: 'permanent' }));
    add(rec('removed', { type: 'working', retention: 'session', phase: 'removal' }));

    expect(resolver.resolve({ scope: 's' }).map((r) => r.id)).toEqual([
      'working-session',
      'session-permanent',
    ]);
    expect(resolver.resolve({ scope: 's', type: 'working' }).map((r) => r.id)).toEqual([
      'working-session',
    ]);
    expect(
      resolver.resolve({ scope: 's', minimumRetention: 'long-term' }).map((r) => r.id),
    ).toEqual(['session-permanent']);
    expect(resolver.resolve({ scope: 'none' })).toEqual([]);
  });
});

describe('MemoryMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new MemoryMetrics();
    metrics.recordFormation();
    metrics.recordRecall();
    metrics.recordRemoval();
    metrics.recordFailure();
    metrics.recordValidationFailure();
    expect(metrics.statistics()).toEqual({
      formations: 1,
      recalls: 1,
      removals: 1,
      failures: 1,
      validationFailures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('MemoryConfiguration', () => {
  it('defaults to strict grounding and applies overrides', () => {
    expect(new MemoryConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new MemoryConfiguration().settings.strictGrounding).toBe(true);
    expect(new MemoryConfiguration({ strictGrounding: false }).settings.strictGrounding).toBe(
      false,
    );
  });
});

describe('MemoryEvents', () => {
  it('publishes formed, recalled, removed, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new MemoryEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.formed('a', 'working');
    await events.recalled('s', 2);
    await events.removed('a');
    await events.failed('s');
    expect(seen.map((e) => e.type)).toEqual([
      MEMORY_EVENT_TYPES.formed,
      MEMORY_EVENT_TYPES.recalled,
      MEMORY_EVENT_TYPES.removed,
      MEMORY_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ memoryId: 'a', type: 'working' });
    expect(seen[1].payload).toEqual({ scope: 's', count: 2 });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('MemoryPluginBridge (adopts record-carrying plugins)', () => {
  const manifest = { name: 'seed', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin record into the registry and index', () => {
    const registry = new MemoryRegistry();
    const indexer = new MemoryIndexer();
    const adopted = expectOk(
      new MemoryPluginBridge(registry, indexer).adopt([
        { manifest, record: input('a') },
        { manifest, record: input('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((r) => r.id)).toEqual(['a', 'b']);
    expect(indexer.idsForScope('s')).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(
      expectOk(new MemoryPluginBridge(new MemoryRegistry(), new MemoryIndexer()).adopt([])),
    ).toEqual([]);
  });

  it('rejects an invalid record and a conflicting record', () => {
    const registry = new MemoryRegistry();
    const indexer = new MemoryIndexer();
    expect(
      expectErr(
        new MemoryPluginBridge(registry, indexer).adopt([{ manifest, record: input('  ') }]),
      ).code,
    ).toBe('MEMORY.BLANK_ID');
    expectOk(registry.register(rec('a')));
    expect(
      expectErr(new MemoryPluginBridge(registry, indexer).adopt([{ manifest, record: input('a') }]))
        .code,
    ).toBe('MEMORY.DUPLICATE_ID');
  });
});

describe('MemoryManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new MemoryManager({ clock, bus }), bus };
  };

  it('exposes and proves the frozen workflow step order', () => {
    const { manager } = build();
    expect(manager.steps()).toEqual([
      'receive',
      'classify',
      'validate',
      'retain',
      'recall',
      'reconcile',
      'evolve-or-remove',
    ]);
    expect(manager.stepsInConstitutionalOrder()).toBe(true);
  });

  it('forms a record and makes it recallable, emitting formed and recalled', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.form(input('a', { content: '  hello  world ' })))).toBe('a');
    expect(manager.statistics()).toMatchObject({ formations: 1 });
    expect(events).toContain(MEMORY_EVENT_TYPES.formed);
    const recalled = expectOk(await manager.recall({ scope: 's' }));
    expect(recalled.map((r) => r.id)).toEqual(['a']);
    expect(recalled[0].content).toBe('hello world');
    expect(events).toContain(MEMORY_EVENT_TYPES.recalled);
  });

  it('fails closed on an invalid record, an ungrounded record, and a duplicate', async () => {
    const { manager } = build();
    expect(expectErr(await manager.form(input('  '))).code).toBe('MEMORY.BLANK_ID');
    expect(expectErr(await manager.form(input('b', { content: '   ' }))).code).toBe(
      'MEMORY.NOT_GROUNDED',
    );
    expect(manager.statistics()).toMatchObject({ failures: 2, validationFailures: 1 });
    expectOk(await manager.form(input('c')));
    expect(expectErr(await manager.form(input('c'))).code).toBe('MEMORY.DUPLICATE_ID');
  });

  it('refuses a recall with a blank scope', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectErr(await manager.recall({ scope: '  ' })).code).toBe('MEMORY.BLANK_SCOPE');
    expect(events).toContain(MEMORY_EVENT_TYPES.failed);
  });

  it('removes a record so it is no longer recallable', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.form(input('a')));
    expect(await manager.remove('a')).toBe(true);
    expect(await manager.remove('a')).toBe(false);
    expect(expectOk(await manager.recall({ scope: 's' }))).toEqual([]);
    expect(events).toContain(MEMORY_EVENT_TYPES.removed);
    expect(manager.statistics()).toMatchObject({ removals: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.form(input('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.recordCount).toBe(1);
    expect(diagnostics.statistics.formations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
