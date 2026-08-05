import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  DEFAULT_SETTINGS,
  REASONING_EVENT_TYPES,
  ReasoningConfiguration,
  ReasoningDecomposer,
  ReasoningEvents,
  ReasoningFactory,
  ReasoningLifecycle,
  ReasoningManager,
  ReasoningMetrics,
  ReasoningNormalizer,
  ReasoningPlanner,
  ReasoningPluginBridge,
  ReasoningRegistry,
  ReasoningValidator,
} from '../src/index';

/** A premise (frozen), for direct component tests that bypass the factory. */
const prem = (id, extra = {}) => Object.freeze({ id, statement: 's', source: 'src', ...extra });
/** A premise registration input. */
const premiseInput = (id, extra = {}) => ({ id, statement: 's', source: 'src', ...extra });
/** A reasoning request. */
const req = (extra = {}) => ({ task: 't', strategy: 'decomposition', ...extra });

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

describe('ReasoningNormalizer', () => {
  it('collapses whitespace and trims', () => {
    expect(new ReasoningNormalizer().normalize('  a   b\t c  ')).toBe('a b c');
  });
});

describe('ReasoningRegistry', () => {
  it('registers, looks up, lists in order, and unregisters', () => {
    const registry = new ReasoningRegistry();
    expectOk(registry.register(prem('a')));
    expectOk(registry.register(prem('b')));
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
    const registry = new ReasoningRegistry();
    expectOk(registry.register(prem('a')));
    expect(expectErr(registry.register(prem('a'))).code).toBe('REASONING.DUPLICATE_ID');
  });
});

describe('ReasoningFactory', () => {
  it('builds a frozen premise, normalizing the statement', () => {
    const built = expectOk(
      new ReasoningFactory().create(premiseInput('a', { statement: '  x   y ' })),
    );
    expect(built.statement).toBe('x y');
    expect(built.source).toBe('src');
    expect(Object.isFrozen(built)).toBe(true);
  });

  it('fails closed on a blank id, blank statement, or blank source', () => {
    const factory = new ReasoningFactory();
    expect(expectErr(factory.create(premiseInput('  '))).code).toBe('REASONING.BLANK_ID');
    expect(expectErr(factory.create(premiseInput('a', { statement: '   ' }))).code).toBe(
      'REASONING.BLANK_STATEMENT',
    );
    expect(expectErr(factory.create(premiseInput('a', { source: '  ' }))).code).toBe(
      'REASONING.BLANK_SOURCE',
    );
  });
});

describe('ReasoningLifecycle (consumes the frozen lifecycle model)', () => {
  it('exposes the frozen ordered phases, the predicate, and validation gating', () => {
    const lifecycle = new ReasoningLifecycle();
    expect(lifecycle.phases()).toEqual(['framing', 'transformation', 'conclusion', 'validation']);
    expect(lifecycle.atOrAfter('validation', 'framing')).toBe(true);
    expect(lifecycle.atOrAfter('framing', 'validation')).toBe(false);
    expect(lifecycle.isValidated('validation')).toBe(true);
    expect(lifecycle.isValidated('framing')).toBe(false);
  });
});

describe('ReasoningDecomposer (the decompose step)', () => {
  const decomposer = new ReasoningDecomposer();

  it('uses the whole task when no parts are given, and structures provided parts, normalizing each', () => {
    expect(expectOk(decomposer.decompose('  the   task  ', undefined))).toEqual(['the task']);
    expect(expectOk(decomposer.decompose('the task', []))).toEqual(['the task']);
    expect(expectOk(decomposer.decompose('t', ['  part  one ', 'two']))).toEqual([
      'part one',
      'two',
    ]);
  });

  it('fails closed on a blank part, including a blank whole task', () => {
    expect(expectErr(decomposer.decompose('t', ['ok', '   '])).code).toBe('REASONING.BLANK_PART');
    expect(expectErr(decomposer.decompose('   ', undefined)).code).toBe('REASONING.BLANK_PART');
  });
});

describe('ReasoningValidator (frozen dimensions, in order, conjunctive)', () => {
  const validator = new ReasoningValidator();

  it('exposes the frozen dimensions', () => {
    expect(validator.dimensions()).toEqual([
      'assumption-identification',
      'grounding',
      'evidence-sufficiency',
      'governed-validation',
    ]);
  });

  it('determines the governed disposition per dimension', () => {
    // assumption-identification: a blank assumption is a hidden one -> fails closed.
    expect(expectErr(validator.validate(['p'], ['  '], true)).code).toBe(
      'REASONING.ASSUMPTION_UNIDENTIFIED',
    );
    // grounding / evidence-sufficiency: nothing to rest on -> inconclusive, classified knowledge uncertainty.
    expect(expectOk(validator.validate([], [], undefined))).toEqual({
      stage: 'inconclusive',
      uncertainty: 'knowledge',
    });
    // grounded only on an assumption, no premise -> still evidence-insufficient -> inconclusive.
    expect(expectOk(validator.validate([], ['assume'], undefined))).toEqual({
      stage: 'inconclusive',
      uncertainty: 'knowledge',
    });
    // precedence: insufficiency outranks a denied verdict; an ungrounded reasoning is inconclusive, not escalated.
    expect(expectOk(validator.validate([], [], false))).toEqual({
      stage: 'inconclusive',
      uncertainty: 'knowledge',
    });
    // governed-validation: with sufficient evidence, a denied verdict escalates.
    expect(expectOk(validator.validate(['p'], [], false))).toEqual({ stage: 'escalated' });
    // grounded, sufficient, permitted -> concluded.
    expect(expectOk(validator.validate(['p'], [], true))).toEqual({ stage: 'concluded' });
    expect(expectOk(validator.validate(['p'], [], undefined))).toEqual({ stage: 'concluded' });
  });
});

describe('ReasoningPlanner', () => {
  const buildPlanner = () =>
    new ReasoningPlanner(
      new ReasoningDecomposer(),
      new ReasoningValidator(),
      new ReasoningNormalizer(),
    );
  const buildRegistry = (ids) => {
    const registry = new ReasoningRegistry();
    const factory = new ReasoningFactory();
    for (const id of ids) registry.register(expectOk(factory.create(premiseInput(id))));
    return registry;
  };

  it('consumes the frozen workflow, its order, the stages, and the terminal-stage predicate', () => {
    const planner = buildPlanner();
    expect(planner.workflow()).toEqual([
      'receive-request',
      'frame',
      'decompose',
      'analyze',
      'synthesize',
      'handle-uncertainty',
      'form-conclusion',
      'validate',
      'produce-outcome',
    ]);
    expect(planner.workflowInConstitutionalOrder()).toBe(true);
    expect(planner.stages()).toContain('complete');
    expect(planner.reachesComplete('concluded')).toBe(true);
    expect(planner.reachesComplete('reasoning')).toBe(false);
  });

  it('produces a concluded, frozen plan grounded on a premise', () => {
    const planner = buildPlanner();
    const registry = buildRegistry(['p']);
    const plan = expectOk(
      planner.plan(
        req({
          premises: ['p'],
          parts: ['part a', 'part b'],
          assumptions: ['  assume  '],
          permitted: true,
        }),
        registry,
        false,
      ),
    );
    expect(plan.stage).toBe('concluded');
    expect('uncertainty' in plan).toBe(false); // absent key, not a present undefined
    expect(plan.parts).toEqual(['part a', 'part b']);
    expect(plan.premises).toEqual(['p']);
    expect(plan.assumptions).toEqual(['assume']);
    expect(plan.validated).toBe(true);
    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.parts)).toBe(true);
    expect(Object.isFrozen(plan.premises)).toBe(true);
    expect(Object.isFrozen(plan.assumptions)).toBe(true);
  });

  it('copies the premise ids, so the plan is independent of the request array', () => {
    const planner = buildPlanner();
    const registry = buildRegistry(['p']);
    const premises = ['p'];
    const plan = expectOk(planner.plan(req({ premises, permitted: true }), registry, false));
    premises.push('mutated');
    expect(plan.premises).toEqual(['p']);
  });

  it('yields inconclusive with a classified uncertainty and escalates on a denied verdict', () => {
    const planner = buildPlanner();
    const registry = buildRegistry(['p']);
    const inconclusive = expectOk(planner.plan(req({ task: 'no basis' }), registry, false));
    expect(inconclusive.stage).toBe('inconclusive');
    expect(inconclusive.uncertainty).toBe('knowledge');
    expect(inconclusive.parts).toEqual(['no basis']); // whole task as one part
    const escalated = expectOk(
      planner.plan(req({ premises: ['p'], permitted: false }), registry, false),
    );
    expect(escalated.stage).toBe('escalated');
    expect('uncertainty' in escalated).toBe(false); // uncertainty is classified only when inconclusive
  });

  it('fails closed on strict-governance, blank task, invalid strategy, unknown premise, blank part, hidden assumption', () => {
    const planner = buildPlanner();
    const registry = buildRegistry(['p']);
    expect(expectErr(planner.plan(req(), registry, true)).code).toBe(
      'REASONING.PERMISSION_REQUIRED',
    );
    expect(expectErr(planner.plan(req({ task: '   ' }), registry, false)).code).toBe(
      'REASONING.BLANK_TASK',
    );
    expect(expectErr(planner.plan(req({ strategy: 'bogus' }), registry, false)).code).toBe(
      'REASONING.INVALID_STRATEGY',
    );
    expect(expectErr(planner.plan(req({ premises: ['missing'] }), registry, false)).code).toBe(
      'REASONING.UNKNOWN_PREMISE',
    );
    expect(expectErr(planner.plan(req({ parts: ['   '] }), registry, false)).code).toBe(
      'REASONING.BLANK_PART',
    );
    expect(
      expectErr(planner.plan(req({ premises: ['p'], assumptions: ['  '] }), registry, false)).code,
    ).toBe('REASONING.ASSUMPTION_UNIDENTIFIED');
  });
});

describe('ReasoningMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new ReasoningMetrics();
    metrics.recordRegistration();
    metrics.recordReasoning();
    metrics.recordConcluded();
    metrics.recordInconclusive();
    metrics.recordEscalated();
    metrics.recordFailure();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      reasonings: 1,
      concluded: 1,
      inconclusive: 1,
      escalated: 1,
      failures: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('ReasoningConfiguration', () => {
  it('defaults to non-strict governance and applies overrides', () => {
    expect(new ReasoningConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new ReasoningConfiguration().settings.strictGovernance).toBe(false);
    expect(new ReasoningConfiguration({ strictGovernance: true }).settings.strictGovernance).toBe(
      true,
    );
  });
});

describe('ReasoningEvents', () => {
  it('publishes registered, reasoned, and failed on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new ReasoningEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.reasoned('t', 'concluded');
    await events.failed('t');
    expect(seen.map((e) => e.type)).toEqual([
      REASONING_EVENT_TYPES.registered,
      REASONING_EVENT_TYPES.reasoned,
      REASONING_EVENT_TYPES.failed,
    ]);
    expect(seen[0].payload).toEqual({ premiseId: 'a' });
    expect(seen[1].payload).toEqual({ task: 't', stage: 'concluded' });
    expect(seen[2].payload).toEqual({ task: 't' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('ReasoningPluginBridge (adopts premise-carrying plugins, atomically)', () => {
  const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin premise into the registry', () => {
    const registry = new ReasoningRegistry();
    const adopted = expectOk(
      new ReasoningPluginBridge(registry).adopt([
        { manifest, premise: premiseInput('a') },
        { manifest, premise: premiseInput('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new ReasoningPluginBridge(new ReasoningRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid premise and a conflicting premise', () => {
    const registry = new ReasoningRegistry();
    expect(
      expectErr(
        new ReasoningPluginBridge(registry).adopt([{ manifest, premise: premiseInput('  ') }]),
      ).code,
    ).toBe('REASONING.BLANK_ID');
    expectOk(registry.register(expectOk(new ReasoningFactory().create(premiseInput('a')))));
    expect(
      expectErr(
        new ReasoningPluginBridge(registry).adopt([{ manifest, premise: premiseInput('a') }]),
      ).code,
    ).toBe('REASONING.DUPLICATE_ID');
  });

  it('adopts atomically: a mid-batch failure leaves the registry unchanged', () => {
    const registry = new ReasoningRegistry();
    expect(
      expectErr(
        new ReasoningPluginBridge(registry).adopt([
          { manifest, premise: premiseInput('a') },
          { manifest, premise: premiseInput('  ') },
        ]),
      ).code,
    ).toBe('REASONING.BLANK_ID');
    expect(registry.has('a')).toBe(false);
    expect(
      expectErr(
        new ReasoningPluginBridge(registry).adopt([
          { manifest, premise: premiseInput('dup') },
          { manifest, premise: premiseInput('dup') },
        ]),
      ).code,
    ).toBe('REASONING.DUPLICATE_ID');
    expect(registry.has('dup')).toBe(false);
  });
});

describe('ReasoningManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new ReasoningManager({ clock, bus }), bus };
  };

  it('registers a premise and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(premiseInput('p')))).toBe('p');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(REASONING_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid premise and on a duplicate, and removes', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(premiseInput('  '))).code).toBe('REASONING.BLANK_ID');
    expectOk(await manager.register(premiseInput('p')));
    expect(expectErr(await manager.register(premiseInput('p'))).code).toBe(
      'REASONING.DUPLICATE_ID',
    );
    expect(manager.remove('p')).toBe(true);
    expect(manager.remove('p')).toBe(false);
  });

  it('reasons to a conclusion, an inconclusive outcome, and an escalation, counting each', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(await manager.register(premiseInput('p')));
    expect(expectOk(await manager.reason(req({ premises: ['p'], permitted: true }))).stage).toBe(
      'concluded',
    );
    expect(expectOk(await manager.reason(req({ task: 'no basis' }))).stage).toBe('inconclusive');
    expect(expectOk(await manager.reason(req({ premises: ['p'], permitted: false }))).stage).toBe(
      'escalated',
    );
    expect(events).toContain(REASONING_EVENT_TYPES.reasoned);
    expect(manager.statistics()).toMatchObject({
      reasonings: 3,
      concluded: 1,
      inconclusive: 1,
      escalated: 1,
    });
  });

  it('refuses a malformed request and emits failed', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectErr(await manager.reason(req({ task: '   ' }))).code).toBe('REASONING.BLANK_TASK');
    expect(events).toContain(REASONING_EVENT_TYPES.failed);
    expect(manager.statistics()).toMatchObject({ failures: 1 });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(premiseInput('p')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.premiseCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
