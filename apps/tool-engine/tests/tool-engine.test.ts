import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  DEFAULT_SETTINGS,
  TOOL_EVENT_TYPES,
  ToolConfiguration,
  ToolEvents,
  ToolExecutor,
  ToolFactory,
  ToolLifecycle,
  ToolManager,
  ToolMetrics,
  ToolNormalizer,
  ToolPluginBridge,
  ToolRegistry,
  ToolResolver,
  ToolSelector,
  ToolValidator,
  VALIDATION_ERROR_CODES,
} from '../src/index';

/** A declared capability. */
const cap = (name, parameters = []) => ({ name, parameters });
/** A declared parameter. */
const param = (name, required = true) => ({ name, required });

/** A tool definition (frozen), for direct component tests that bypass the factory. */
const def = (id, extra = {}) =>
  Object.freeze({
    id,
    capabilities: [cap('act')],
    requiresClearance: false,
    ...extra,
  });

/** A tool registration input. */
const input = (id, extra = {}) => ({
  id,
  capabilities: [cap('act')],
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

describe('ToolNormalizer', () => {
  it('collapses whitespace and trims', () => {
    expect(new ToolNormalizer().normalize('  a   b\t c  ')).toBe('a b c');
  });
});

describe('ToolRegistry', () => {
  it('registers, looks up, lists in order, and unregisters', () => {
    const registry = new ToolRegistry();
    expectOk(registry.register(def('a')));
    expectOk(registry.register(def('b')));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((t) => t.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((t) => t.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new ToolRegistry();
    expectOk(registry.register(def('a')));
    expect(expectErr(registry.register(def('a'))).code).toBe('TOOL.DUPLICATE_ID');
  });
});

describe('ToolFactory', () => {
  it('builds a frozen tool, normalizing id, names, and base, defaulting clearance, and keeping a base', () => {
    const built = expectOk(
      new ToolFactory().create(
        input('  a  ', {
          capabilities: [cap('  do   thing  ', [param('  x  ')])],
          basedOn: '  base  ',
          requiresClearance: true,
        }),
      ),
    );
    expect(built.id).toBe('a');
    expect(built.capabilities[0].name).toBe('do thing');
    expect(built.capabilities[0].parameters[0].name).toBe('x');
    expect(built.basedOn).toBe('base');
    expect(built.requiresClearance).toBe(true);
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.capabilities)).toBe(true);
    expect(Object.isFrozen(built.capabilities[0].parameters)).toBe(true);
  });

  it('defaults clearance to false and omits an absent base', () => {
    const built = expectOk(new ToolFactory().create(input('a')));
    expect(built.requiresClearance).toBe(false);
    expect(built.basedOn).toBeUndefined();
  });

  it('fails closed on blank id, no capabilities, blank/duplicate capability, or blank parameter', () => {
    const factory = new ToolFactory();
    expect(expectErr(factory.create(input('  '))).code).toBe('TOOL.BLANK_ID');
    expect(expectErr(factory.create(input('a', { capabilities: [] }))).code).toBe(
      'TOOL.NO_CAPABILITIES',
    );
    expect(expectErr(factory.create(input('a', { capabilities: [cap('  ')] }))).code).toBe(
      'TOOL.BLANK_CAPABILITY',
    );
    expect(expectErr(factory.create(input('a', { capabilities: [cap('x'), cap('x')] }))).code).toBe(
      'TOOL.DUPLICATE_CAPABILITY',
    );
    expect(
      expectErr(factory.create(input('a', { capabilities: [cap('x', [param('  ')])] }))).code,
    ).toBe('TOOL.BLANK_PARAMETER');
  });
});

describe('ToolLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases, the predicate, and activation gating', () => {
    const lifecycle = new ToolLifecycle();
    expect(lifecycle.phases()).toEqual([
      'registration',
      'discovery',
      'activation',
      'execution-lifecycle',
      'retirement',
    ]);
    expect(lifecycle.atOrAfter('activation', 'registration')).toBe(true);
    expect(lifecycle.atOrAfter('registration', 'activation')).toBe(false);
    expect(lifecycle.isActive('activation')).toBe(true);
    expect(lifecycle.isActive('execution-lifecycle')).toBe(true);
    expect(lifecycle.isActive('discovery')).toBe(false);
    expect(lifecycle.isActive('retirement')).toBe(false); // active window ends before retirement
  });
});

describe('ToolSelector', () => {
  it('discovers by declared capability and selects deterministically by id tiebreak', () => {
    const selector = new ToolSelector();
    const tools = [
      def('b', { capabilities: [cap('act')] }),
      def('a', { capabilities: [cap('act')] }),
      def('c', { capabilities: [cap('other')] }),
    ];
    expect(selector.discover(tools, 'act').map((t) => t.id)).toEqual(['b', 'a']);
    expect(selector.select(selector.discover(tools, 'act'))?.id).toBe('a'); // lowest id
    expect(selector.select([])).toBeUndefined();
  });
});

describe('ToolResolver (single, acyclic capability inheritance)', () => {
  const build = (tools) => {
    const registry = new ToolRegistry();
    for (const t of tools) registry.register(t);
    return { registry, resolver: new ToolResolver() };
  };

  it('passes a tool with no base through, and merges a base with derived override', () => {
    const passthrough = build([def('a')]);
    expect(
      expectOk(passthrough.resolver.resolve(def('a'), passthrough.registry)).capabilities.map(
        (c) => c.name,
      ),
    ).toEqual(['act']);

    const base = def('base', { capabilities: [cap('shared', [param('b')]), cap('baseonly')] });
    const derived = def('d', {
      basedOn: 'base',
      capabilities: [cap('shared', [param('d')]), cap('derivedonly')],
    });
    const { registry, resolver } = build([base, derived]);
    const resolved = expectOk(resolver.resolve(derived, registry));
    expect(resolved.capabilities.map((c) => c.name).sort()).toEqual([
      'baseonly',
      'derivedonly',
      'shared',
    ]);
    // derived 'shared' (param 'd') overrides base 'shared' (param 'b')
    const shared = resolved.capabilities.find((c) => c.name === 'shared');
    expect(shared?.parameters[0].name).toBe('d');
  });

  it('fails closed on an unknown base and on an inheritance cycle', () => {
    const unknown = build([def('a', { basedOn: 'missing' })]);
    expect(
      expectErr(unknown.resolver.resolve(def('a', { basedOn: 'missing' }), unknown.registry)).code,
    ).toBe('TOOL.UNKNOWN_BASE');

    const a = def('a', { basedOn: 'b' });
    const b = def('b', { basedOn: 'a' });
    const { registry, resolver } = build([a, b]);
    expect(expectErr(resolver.resolve(a, registry)).code).toBe('TOOL.INHERITANCE_CYCLE');
  });
});

describe('ToolValidator (frozen checks, in order, conjunctive)', () => {
  const validator = new ToolValidator();
  const tool = def('a', {
    capabilities: [cap('act', [param('x'), param('y', false)])],
    requiresClearance: false,
  });

  it('exposes the frozen checks, proves their order, and accepts a valid request', () => {
    expect(validator.checks()).toEqual([
      'permission-validation',
      'safety-validation',
      'constitutional-validation',
      'compatibility-validation',
    ]);
    expect(validator.checksInConstitutionalOrder()).toBe(true);
    expectOk(validator.validate(tool, { capability: 'act', arguments: { x: '1' } }));
    // permitted includes the tool, non-required param may be omitted
    expectOk(
      validator.validate(tool, { capability: 'act', arguments: { x: '1' }, permitted: ['a'] }),
    );
    // a required parameter supplied as an empty string is present (Object.hasOwn, not truthiness)
    expectOk(validator.validate(tool, { capability: 'act', arguments: { x: '' } }));
  });

  it('rejects each disqualifying check in order', () => {
    expect(
      expectErr(validator.validate(tool, { capability: 'act', permitted: ['other'] })).code,
    ).toBe('TOOL.NOT_PERMITTED');
    expect(expectErr(validator.validate(tool, { capability: 'ghost' })).code).toBe(
      'TOOL.UNDECLARED_CAPABILITY',
    );
    const cleared = def('c', { capabilities: [cap('act')], requiresClearance: true });
    expect(expectErr(validator.validate(cleared, { capability: 'act' })).code).toBe(
      'TOOL.CLEARANCE_REQUIRED',
    );
    expectOk(validator.validate(cleared, { capability: 'act', cleared: true }));
    expect(expectErr(validator.validate(tool, { capability: 'act' })).code).toBe(
      'TOOL.MISSING_PARAMETER',
    );
  });

  it('exposes the validation error codes', () => {
    expect(VALIDATION_ERROR_CODES.has('TOOL.NOT_PERMITTED')).toBe(true);
    expect(VALIDATION_ERROR_CODES.has('TOOL.NO_TOOL')).toBe(false);
  });
});

describe('ToolExecutor (prepares the validated execution)', () => {
  const build = (inputs) => {
    const registry = new ToolRegistry();
    const factory = new ToolFactory();
    for (const inp of inputs) registry.register(expectOk(factory.create(inp)));
    const executor = new ToolExecutor(
      new ToolSelector(),
      new ToolResolver(),
      new ToolValidator(),
      new ToolNormalizer(),
    );
    return { registry, executor };
  };

  it('prepares a validated, frozen execution and normalizes the requested capability', () => {
    const { registry, executor } = build([
      input('a', { capabilities: [cap('act', [param('x')])], requiresClearance: true }),
    ]);
    const response = expectOk(
      executor.prepare(
        { capability: '  act  ', arguments: { x: '1' }, permitted: ['a'], cleared: true },
        registry,
        false,
      ),
    );
    expect(response.validated).toBe(true);
    expect(response.execution.tool).toBe('a');
    expect(response.execution.capability).toBe('act');
    expect(response.execution.arguments).toEqual({ x: '1' });
    expect(response.execution.clearanceRequired).toBe(true);
    expect(Object.isFrozen(response)).toBe(true);
    expect(Object.isFrozen(response.execution)).toBe(true);
    expect(Object.isFrozen(response.execution.arguments)).toBe(true);
  });

  it('defaults absent arguments and proceeds under strict permission with a set', () => {
    const { registry, executor } = build([input('a', { capabilities: [cap('act')] })]);
    const response = expectOk(
      executor.prepare({ capability: 'act', permitted: ['a'] }, registry, true),
    );
    expect(response.execution.arguments).toEqual({});
  });

  it('refuses on missing permission set, no tool, a resolver error, and a validation failure', () => {
    const { registry: r1, executor: e1 } = build([input('a', { capabilities: [cap('act')] })]);
    expect(expectErr(e1.prepare({ capability: 'act' }, r1, true)).code).toBe(
      'TOOL.PERMISSION_REQUIRED',
    );
    expect(expectErr(e1.prepare({ capability: 'ghost' }, r1, false)).code).toBe('TOOL.NO_TOOL');

    const { registry: r2, executor: e2 } = build([
      input('a', { capabilities: [cap('act')], basedOn: 'missing' }),
    ]);
    expect(expectErr(e2.prepare({ capability: 'act' }, r2, false)).code).toBe('TOOL.UNKNOWN_BASE');

    const { registry: r3, executor: e3 } = build([
      input('a', { capabilities: [cap('act', [param('x')])] }),
    ]);
    expect(expectErr(e3.prepare({ capability: 'act' }, r3, false)).code).toBe(
      'TOOL.MISSING_PARAMETER',
    );
  });
});

describe('ToolMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new ToolMetrics();
    metrics.recordRegistration();
    metrics.recordPreparation();
    metrics.recordSuccess();
    metrics.recordFailure();
    metrics.recordValidationFailure();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      preparations: 1,
      successes: 1,
      failures: 1,
      validationFailures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('ToolConfiguration', () => {
  it('defaults to non-strict permission and applies overrides', () => {
    expect(new ToolConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new ToolConfiguration().settings.strictPermission).toBe(false);
    expect(new ToolConfiguration({ strictPermission: true }).settings.strictPermission).toBe(true);
  });
});

describe('ToolEvents', () => {
  it('publishes registered, prepared, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new ToolEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.prepared('act', 'a');
    await events.failed('act');
    expect(seen.map((e) => e.type)).toEqual([
      TOOL_EVENT_TYPES.registered,
      TOOL_EVENT_TYPES.prepared,
      TOOL_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ toolId: 'a' });
    expect(seen[1].payload).toEqual({ capability: 'act', toolId: 'a' });
    expect(seen[2].payload).toEqual({ capability: 'act' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('ToolPluginBridge (adopts tool-carrying plugins)', () => {
  const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin tool into the registry', () => {
    const registry = new ToolRegistry();
    const adopted = expectOk(
      new ToolPluginBridge(registry).adopt([
        { manifest, definition: input('a') },
        { manifest, definition: input('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((t) => t.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new ToolPluginBridge(new ToolRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid tool and a conflicting tool', () => {
    const registry = new ToolRegistry();
    expect(
      expectErr(new ToolPluginBridge(registry).adopt([{ manifest, definition: input('  ') }])).code,
    ).toBe('TOOL.BLANK_ID');
    expectOk(registry.register(expectOk(new ToolFactory().create(input('a')))));
    expect(
      expectErr(new ToolPluginBridge(registry).adopt([{ manifest, definition: input('a') }])).code,
    ).toBe('TOOL.DUPLICATE_ID');
  });

  it('adopts atomically: a mid-batch failure leaves the registry unchanged', () => {
    const registry = new ToolRegistry();
    // valid then blank -> whole batch rejected, nothing registered
    expect(
      expectErr(
        new ToolPluginBridge(registry).adopt([
          { manifest, definition: input('a') },
          { manifest, definition: input('  ') },
        ]),
      ).code,
    ).toBe('TOOL.BLANK_ID');
    expect(registry.has('a')).toBe(false);
    // a duplicate id within the batch -> rejected before any is registered
    expect(
      expectErr(
        new ToolPluginBridge(registry).adopt([
          { manifest, definition: input('dup') },
          { manifest, definition: input('dup') },
        ]),
      ).code,
    ).toBe('TOOL.DUPLICATE_ID');
    expect(registry.has('dup')).toBe(false);
  });
});

describe('ToolManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new ToolManager({ clock, bus }), bus };
  };

  it('registers a tool and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(input('a')))).toBe('a');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(TOOL_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid tool and on a duplicate, and removes', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(input('  '))).code).toBe('TOOL.BLANK_ID');
    expectOk(await manager.register(input('a')));
    expect(expectErr(await manager.register(input('a'))).code).toBe('TOOL.DUPLICATE_ID');
    expect(manager.remove('a')).toBe(true);
    expect(manager.remove('a')).toBe(false);
  });

  it('prepares a validated execution and emits prepared', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(input('a', { capabilities: [cap('act')] })));
    const response = expectOk(await manager.prepare({ capability: 'act' }));
    expect(response.execution.tool).toBe('a');
    expect(events).toContain(TOOL_EVENT_TYPES.prepared);
    expect(manager.statistics()).toMatchObject({ preparations: 1, successes: 1 });
  });

  it('refuses and counts a validation failure distinctly from another failure', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    // no tool -> a non-validation failure
    expect(expectErr(await manager.prepare({ capability: 'none' })).code).toBe('TOOL.NO_TOOL');
    expect(events).toContain(TOOL_EVENT_TYPES.failed);
    expect(manager.statistics()).toMatchObject({ failures: 1, validationFailures: 0 });
    // missing required parameter -> a validation failure
    expectOk(await manager.register(input('a', { capabilities: [cap('act', [param('x')])] })));
    expect(expectErr(await manager.prepare({ capability: 'act' })).code).toBe(
      'TOOL.MISSING_PARAMETER',
    );
    expect(manager.statistics()).toMatchObject({ failures: 2, validationFailures: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(input('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.toolCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
