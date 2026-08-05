import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  AGENT_CAPABILITIES,
  AGENT_EVENT_TYPES,
  AgentComposer,
  AgentConfiguration,
  AgentCoordinator,
  AgentEvents,
  AgentFactory,
  AgentLifecycle,
  AgentManager,
  AgentMetrics,
  AgentNormalizer,
  AgentPlanner,
  AgentPluginBridge,
  AgentRegistry,
  AgentValidator,
  DEFAULT_SETTINGS,
} from '../src/index';

/** An agent definition (frozen), for direct component tests that bypass the factory. */
const agentDef = (id, extra = {}) =>
  Object.freeze({
    id,
    capabilities: ['reasoning'],
    permissions: ['reasoning'],
    specialization: 'role',
    ...extra,
  });
/** An agent registration input. */
const agentInput = (id, extra = {}) => ({
  id,
  capabilities: ['reasoning'],
  specialization: 'role',
  ...extra,
});
/** A composition step (the request is opaque to the engine, which never executes it). */
const step = (capability) => ({ capability, request: {} });
/** A plan request. */
const req = (extra = {}) => ({ agent: 'a', task: 't', steps: [step('reasoning')], ...extra });

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

describe('AgentNormalizer', () => {
  it('collapses whitespace and trims', () => {
    expect(new AgentNormalizer().normalize('  a   b\t c  ')).toBe('a b c');
  });
});

describe('AgentRegistry', () => {
  it('registers, looks up, lists in order, and unregisters', () => {
    const registry = new AgentRegistry();
    expectOk(registry.register(agentDef('a')));
    expectOk(registry.register(agentDef('b')));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.id).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((agent) => agent.id)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((agent) => agent.id)).toEqual(['b']);
  });

  it('fails closed on a duplicate id', () => {
    const registry = new AgentRegistry();
    expectOk(registry.register(agentDef('a')));
    expect(expectErr(registry.register(agentDef('a'))).code).toBe('AGENT.DUPLICATE_ID');
  });
});

describe('AgentFactory', () => {
  it('exposes the six operational capabilities', () => {
    expect(AGENT_CAPABILITIES).toEqual([
      'reasoning',
      'retrieval',
      'memory',
      'prompt',
      'tool',
      'provider',
    ]);
  });

  it('builds a frozen agent, normalizing the specialization and defaulting permissions to capabilities', () => {
    const built = expectOk(
      new AgentFactory().create(
        agentInput('a', { capabilities: ['reasoning', 'tool'], specialization: '  lead  role ' }),
      ),
    );
    expect(built.specialization).toBe('lead role');
    expect(built.permissions).toEqual(['reasoning', 'tool']); // defaulted to capabilities
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.capabilities)).toBe(true);
    expect(Object.isFrozen(built.permissions)).toBe(true);
    // explicit permissions (a subset) are accepted
    expect(
      expectOk(
        new AgentFactory().create(
          agentInput('b', { capabilities: ['reasoning', 'tool'], permissions: ['reasoning'] }),
        ),
      ).permissions,
    ).toEqual(['reasoning']);
  });

  it('fails closed on blank id, no capabilities, invalid capability, over-permission, or blank specialization', () => {
    const factory = new AgentFactory();
    expect(expectErr(factory.create(agentInput('  '))).code).toBe('AGENT.BLANK_ID');
    expect(expectErr(factory.create(agentInput('a', { capabilities: [] }))).code).toBe(
      'AGENT.NO_CAPABILITIES',
    );
    expect(expectErr(factory.create(agentInput('a', { capabilities: ['bogus'] }))).code).toBe(
      'AGENT.INVALID_CAPABILITY',
    );
    expect(
      expectErr(
        factory.create(agentInput('a', { capabilities: ['reasoning'], permissions: ['tool'] })),
      ).code,
    ).toBe('AGENT.PERMISSION_EXCEEDS_CAPABILITY');
    expect(expectErr(factory.create(agentInput('a', { specialization: '   ' }))).code).toBe(
      'AGENT.BLANK_SPECIALIZATION',
    );
  });
});

describe('AgentLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases, the predicate, and the active window', () => {
    const lifecycle = new AgentLifecycle();
    expect(lifecycle.phases()).toEqual([
      'registration',
      'discovery',
      'activation',
      'operation',
      'retirement',
    ]);
    expect(lifecycle.atOrAfter('activation', 'registration')).toBe(true);
    expect(lifecycle.atOrAfter('registration', 'activation')).toBe(false);
    expect(lifecycle.isActive('activation')).toBe(true);
    expect(lifecycle.isActive('operation')).toBe(true);
    expect(lifecycle.isActive('discovery')).toBe(false);
    expect(lifecycle.isActive('retirement')).toBe(false); // active window ends before retirement
  });
});

describe('AgentComposer', () => {
  const composer = new AgentComposer();
  const agent = agentDef('a', { capabilities: ['reasoning', 'tool'] });

  it('composes bounded steps within the agent capabilities, deeply frozen and independent of the input', () => {
    const input = [step('reasoning'), step('tool')];
    const steps = expectOk(composer.compose(agent, input, 64));
    expect(steps.map((s) => s.capability)).toEqual(['reasoning', 'tool']);
    expect(Object.isFrozen(steps)).toBe(true);
    expect(Object.isFrozen(steps[0])).toBe(true); // each step wrapper is frozen
    // the composed steps are a copy: mutating the input array or a retained input step does not touch them
    input.push(step('memory'));
    input[1].capability = 'provider';
    expect(steps).toHaveLength(2);
    expect(steps[1].capability).toBe('tool');
  });

  it('fails closed on an empty plan, an over-large plan, and an uncapable step', () => {
    expect(expectErr(composer.compose(agent, [], 64)).code).toBe('AGENT.EMPTY_PLAN');
    expect(expectErr(composer.compose(agent, [step('reasoning'), step('tool')], 1)).code).toBe(
      'AGENT.PLAN_TOO_LARGE',
    );
    expect(expectErr(composer.compose(agent, [step('memory')], 64)).code).toBe('AGENT.NOT_CAPABLE');
  });
});

describe('AgentValidator', () => {
  const validator = new AgentValidator();

  it('accepts permitted steps and refuses a not-permitted one', () => {
    const agent = agentDef('a', {
      capabilities: ['reasoning', 'tool'],
      permissions: ['reasoning'],
    });
    expectOk(validator.validate(agent, [step('reasoning')]));
    expect(expectErr(validator.validate(agent, [step('tool')])).code).toBe('AGENT.NOT_PERMITTED');
  });
});

describe('AgentCoordinator (directed, acyclic topology)', () => {
  const coordinator = new AgentCoordinator();
  const build = (ids) => {
    const registry = new AgentRegistry();
    for (const id of ids) registry.register(agentDef(id));
    return registry;
  };

  it('accepts an empty topology and an acyclic diamond, deeply frozen and independent of the input', () => {
    const registry = build(['a', 'b', 'c', 'd']);
    expect(expectOk(coordinator.coordinate([], registry, 64))).toEqual([]);
    const links = [
      { supervisor: 'a', worker: 'b' },
      { supervisor: 'a', worker: 'c' },
      { supervisor: 'b', worker: 'd' }, // the diamond re-reaches 'd', exercising the visited early-return
      { supervisor: 'c', worker: 'd' },
    ];
    const validated = expectOk(coordinator.coordinate(links, registry, 64));
    expect(validated).toHaveLength(4);
    expect(Object.isFrozen(validated)).toBe(true);
    expect(Object.isFrozen(validated[0])).toBe(true); // each link wrapper is frozen
    links[0].supervisor = 'mutated'; // mutating a retained input link does not touch the validated copy
    expect(validated[0].supervisor).toBe('a');
  });

  it('fails closed on an over-large topology, an unknown agent, self-coordination, and a cycle', () => {
    const registry = build(['a', 'b']);
    expect(
      expectErr(
        coordinator.coordinate(
          [
            { supervisor: 'a', worker: 'b' },
            { supervisor: 'b', worker: 'a' },
          ],
          registry,
          1,
        ),
      ).code,
    ).toBe('AGENT.COORDINATION_TOO_LARGE');
    expect(
      expectErr(coordinator.coordinate([{ supervisor: 'a', worker: 'z' }], registry, 64)).code,
    ).toBe('AGENT.UNKNOWN_AGENT');
    expect(
      expectErr(coordinator.coordinate([{ supervisor: 'a', worker: 'a' }], registry, 64)).code,
    ).toBe('AGENT.SELF_COORDINATION');
    expect(
      expectErr(
        coordinator.coordinate(
          [
            { supervisor: 'a', worker: 'b' },
            { supervisor: 'b', worker: 'a' },
          ],
          registry,
          64,
        ),
      ).code,
    ).toBe('AGENT.COORDINATION_CYCLE');
  });
});

describe('AgentPlanner (composes the immutable plan)', () => {
  const buildPlanner = () =>
    new AgentPlanner(
      new AgentComposer(),
      new AgentValidator(),
      new AgentCoordinator(),
      new AgentNormalizer(),
    );
  const buildRegistry = (inputs) => {
    const registry = new AgentRegistry();
    const factory = new AgentFactory();
    for (const input of inputs) registry.register(expectOk(factory.create(input)));
    return registry;
  };

  it('composes a validated, frozen plan with steps and coordination', () => {
    const planner = buildPlanner();
    const registry = buildRegistry([
      agentInput('a', { capabilities: ['reasoning', 'tool'] }),
      agentInput('b'),
    ]);
    const steps = [step('reasoning'), step('tool')];
    const coordinate = [{ supervisor: 'a', worker: 'b' }];
    const plan = expectOk(
      planner.plan(req({ task: '  do   it ', steps, coordinate }), registry, 64, 64),
    );
    expect(plan.agent).toBe('a');
    expect(plan.task).toBe('do it');
    expect(plan.steps.map((s) => s.capability)).toEqual(['reasoning', 'tool']);
    expect(plan.coordination).toHaveLength(1);
    expect(plan.validated).toBe(true);
    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.steps)).toBe(true);
    expect(Object.isFrozen(plan.steps[0])).toBe(true);
    expect(Object.isFrozen(plan.coordination)).toBe(true);
    expect(Object.isFrozen(plan.coordination[0])).toBe(true);
    // the plan is independent of the caller's input arrays and step/link objects
    steps[0].capability = 'provider';
    coordinate[0].supervisor = 'mutated';
    expect(plan.steps[0].capability).toBe('reasoning');
    expect(plan.coordination[0].supervisor).toBe('a');
  });

  it('fails closed on unknown agent, blank task, empty plan, uncapable step, not-permitted, and a cycle', () => {
    const planner = buildPlanner();
    const registry = buildRegistry([
      agentInput('a', { capabilities: ['reasoning', 'tool'], permissions: ['reasoning'] }),
      agentInput('b'),
    ]);
    expect(expectErr(planner.plan(req({ agent: 'missing' }), registry, 64, 64)).code).toBe(
      'AGENT.UNKNOWN_AGENT',
    );
    expect(expectErr(planner.plan(req({ task: '   ' }), registry, 64, 64)).code).toBe(
      'AGENT.BLANK_TASK',
    );
    expect(expectErr(planner.plan(req({ steps: [] }), registry, 64, 64)).code).toBe(
      'AGENT.EMPTY_PLAN',
    );
    expect(expectErr(planner.plan(req({ steps: [step('memory')] }), registry, 64, 64)).code).toBe(
      'AGENT.NOT_CAPABLE',
    );
    expect(expectErr(planner.plan(req({ steps: [step('tool')] }), registry, 64, 64)).code).toBe(
      'AGENT.NOT_PERMITTED',
    );
    expect(
      expectErr(
        planner.plan(
          req({
            coordinate: [
              { supervisor: 'a', worker: 'b' },
              { supervisor: 'b', worker: 'a' },
            ],
          }),
          registry,
          64,
          64,
        ),
      ).code,
    ).toBe('AGENT.COORDINATION_CYCLE');
  });
});

describe('AgentMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new AgentMetrics();
    metrics.recordRegistration();
    metrics.recordPlan();
    metrics.recordSuccess();
    metrics.recordFailure();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      plans: 1,
      successes: 1,
      failures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('AgentConfiguration', () => {
  it('defaults the step and link bounds and applies overrides', () => {
    expect(new AgentConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new AgentConfiguration().settings.maxSteps).toBe(64);
    expect(new AgentConfiguration().settings.maxLinks).toBe(64);
    expect(new AgentConfiguration({ maxSteps: 4 }).settings.maxSteps).toBe(4);
    expect(new AgentConfiguration({ maxLinks: 8 }).settings.maxLinks).toBe(8);
  });
});

describe('AgentEvents', () => {
  it('publishes registered, planned, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new AgentEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.planned('a', 't');
    await events.failed('a');
    expect(seen.map((e) => e.type)).toEqual([
      AGENT_EVENT_TYPES.registered,
      AGENT_EVENT_TYPES.planned,
      AGENT_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ agentId: 'a' });
    expect(seen[1].payload).toEqual({ agentId: 'a', task: 't' });
    expect(seen[2].payload).toEqual({ agentId: 'a' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('AgentPluginBridge (adopts agent-carrying plugins, atomically)', () => {
  const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin agent into the registry', () => {
    const registry = new AgentRegistry();
    const adopted = expectOk(
      new AgentPluginBridge(registry).adopt([
        { manifest, definition: agentInput('a') },
        { manifest, definition: agentInput('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((agent) => agent.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new AgentPluginBridge(new AgentRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid agent and a conflicting agent', () => {
    const registry = new AgentRegistry();
    expect(
      expectErr(new AgentPluginBridge(registry).adopt([{ manifest, definition: agentInput('  ') }]))
        .code,
    ).toBe('AGENT.BLANK_ID');
    expectOk(registry.register(expectOk(new AgentFactory().create(agentInput('a')))));
    expect(
      expectErr(new AgentPluginBridge(registry).adopt([{ manifest, definition: agentInput('a') }]))
        .code,
    ).toBe('AGENT.DUPLICATE_ID');
  });

  it('adopts atomically: a mid-batch failure leaves the registry unchanged', () => {
    const registry = new AgentRegistry();
    expect(
      expectErr(
        new AgentPluginBridge(registry).adopt([
          { manifest, definition: agentInput('a') },
          { manifest, definition: agentInput('  ') },
        ]),
      ).code,
    ).toBe('AGENT.BLANK_ID');
    expect(registry.has('a')).toBe(false);
    expect(
      expectErr(
        new AgentPluginBridge(registry).adopt([
          { manifest, definition: agentInput('dup') },
          { manifest, definition: agentInput('dup') },
        ]),
      ).code,
    ).toBe('AGENT.DUPLICATE_ID');
    expect(registry.has('dup')).toBe(false);
  });
});

describe('AgentManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new AgentManager({ clock, bus }), bus };
  };

  it('registers an agent and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(agentInput('a')))).toBe('a');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(AGENT_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid agent and on a duplicate, and removes', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(agentInput('  '))).code).toBe('AGENT.BLANK_ID');
    expectOk(await manager.register(agentInput('a')));
    expect(expectErr(await manager.register(agentInput('a'))).code).toBe('AGENT.DUPLICATE_ID');
    expect(manager.remove('a')).toBe(true);
    expect(manager.remove('a')).toBe(false);
  });

  it('composes a plan and emits planned', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(agentInput('a')));
    const plan = expectOk(await manager.plan(req()));
    expect(plan.agent).toBe('a');
    expect(events).toContain(AGENT_EVENT_TYPES.planned);
    expect(manager.statistics()).toMatchObject({ plans: 1, successes: 1 });
  });

  it('refuses a plan for an unknown agent and emits failed', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectErr(await manager.plan(req({ agent: 'missing' }))).code).toBe(
      'AGENT.UNKNOWN_AGENT',
    );
    expect(events).toContain(AGENT_EVENT_TYPES.failed);
    expect(manager.statistics()).toMatchObject({ failures: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(agentInput('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.agentCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
