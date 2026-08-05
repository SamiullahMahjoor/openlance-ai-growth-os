import { describe, expect, it } from 'vitest';

import { createEventBus } from '@openlance/aios-events';

import {
  AutonomyEvaluator,
  ConstitutionalValidator,
  DEFAULT_SETTINGS,
  GOVERNANCE_EVENT_TYPES,
  GovernanceConfiguration,
  GovernanceEvaluator,
  GovernanceEvents,
  GovernanceFactory,
  GovernanceHash,
  GovernanceManager,
  GovernanceMetrics,
  GovernanceNormalizer,
  GovernancePluginBridge,
  GovernanceRegistry,
  OversightEvaluator,
  PermissionEvaluator,
} from '../src/index';

/** A governance grant (frozen), for direct component tests that bypass the factory. */
const grant = (subject, extra = {}) =>
  Object.freeze({ subject, permissions: ['reasoning'], autonomy: 'governed', ...extra });
/** A grant registration input. */
const grantInput = (subject, extra = {}) => ({
  subject,
  permissions: ['reasoning'],
  autonomy: 'governed',
  ...extra,
});
/** A composition step. */
const step = (capability) => ({ capability, request: {} });
/** An immutable agent execution plan (as the agent engine produces it). */
const plan = (extra = {}) =>
  Object.freeze({
    agent: 'a',
    task: 't',
    steps: [step('reasoning')],
    coordination: [],
    validated: true,
    ...extra,
  });
/** A governance request. */
const req = (extra = {}) => ({ plan: plan(), trust: 'low', ...extra });

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

describe('GovernanceNormalizer', () => {
  it('collapses whitespace and trims', () => {
    expect(new GovernanceNormalizer().normalize('  a   b\t c  ')).toBe('a b c');
  });
});

describe('GovernanceHash', () => {
  it('is deterministic and distinguishes distinct content', () => {
    const hash = new GovernanceHash();
    expect(hash.hash('governance')).toBe(hash.hash('governance'));
    expect(hash.hash('a')).not.toBe(hash.hash('b'));
    expect(hash.hash('a')).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('GovernanceRegistry', () => {
  it('registers, looks up, lists in order, and unregisters', () => {
    const registry = new GovernanceRegistry();
    expectOk(registry.register(grant('a')));
    expectOk(registry.register(grant('b')));
    expect(registry.has('a')).toBe(true);
    expect(registry.has('z')).toBe(false);
    expect(registry.get('a')?.subject).toBe('a');
    expect(registry.get('z')).toBeUndefined();
    expect(registry.list().map((g) => g.subject)).toEqual(['a', 'b']);
    expect(registry.unregister('a')).toBe(true);
    expect(registry.unregister('a')).toBe(false);
    expect(registry.list().map((g) => g.subject)).toEqual(['b']);
  });

  it('fails closed on a duplicate subject', () => {
    const registry = new GovernanceRegistry();
    expectOk(registry.register(grant('a')));
    expect(expectErr(registry.register(grant('a'))).code).toBe('GOVERNANCE.DUPLICATE_SUBJECT');
  });
});

describe('GovernanceFactory', () => {
  it('builds a frozen grant, normalizing the subject and capabilities; an empty permission set is valid', () => {
    const built = expectOk(
      new GovernanceFactory().create(
        grantInput('  subj ', { permissions: ['  reasoning ', 'tool'], autonomy: 'bounded' }),
      ),
    );
    expect(built.subject).toBe('subj');
    expect(built.permissions).toEqual(['reasoning', 'tool']);
    expect(built.autonomy).toBe('bounded');
    expect(Object.isFrozen(built)).toBe(true);
    expect(Object.isFrozen(built.permissions)).toBe(true);
    expect(
      expectOk(new GovernanceFactory().create(grantInput('a', { permissions: [] }))).permissions,
    ).toEqual([]);
  });

  it('fails closed on a blank subject, an invalid autonomy, or a blank capability', () => {
    const factory = new GovernanceFactory();
    expect(expectErr(factory.create(grantInput('  '))).code).toBe('GOVERNANCE.BLANK_SUBJECT');
    expect(expectErr(factory.create(grantInput('a', { autonomy: 'bogus' }))).code).toBe(
      'GOVERNANCE.INVALID_AUTONOMY',
    );
    expect(expectErr(factory.create(grantInput('a', { permissions: ['  '] }))).code).toBe(
      'GOVERNANCE.BLANK_CAPABILITY',
    );
  });
});

describe('PermissionEvaluator', () => {
  it('partitions distinct plan capabilities into granted and ungranted, frozen', () => {
    const evaluator = new PermissionEvaluator();
    const g = grant('a', { permissions: ['reasoning'] });
    const result = evaluator.evaluate(
      g,
      plan({ steps: [step('reasoning'), step('reasoning'), step('tool'), step('tool')] }),
    );
    expect(result.permitted).toEqual(['reasoning']);
    expect(result.ungranted).toEqual(['tool']);
    expect(Object.isFrozen(result.permitted)).toBe(true);
    // all granted -> no ungranted
    expect(evaluator.evaluate(g, plan({ steps: [step('reasoning')] })).ungranted).toEqual([]);
  });
});

describe('ConstitutionalValidator (consumes the frozen dimensions)', () => {
  it('exposes the six frozen validation dimensions and gates on a validated plan', () => {
    const validator = new ConstitutionalValidator();
    expect(validator.dimensions()).toEqual([
      'ai-constitution',
      'knowledge-constitution',
      'governance',
      'authority',
      'ownership',
      'boundaries',
    ]);
    expect(validator.isValidated(plan())).toBe(true);
    expect(validator.isValidated(plan({ validated: false }))).toBe(false); // a forged unvalidated plan
  });
});

describe('AutonomyEvaluator (consumes the frozen autonomy model)', () => {
  it('exposes the frozen levels and applies autonomyAtLeast', () => {
    const evaluator = new AutonomyEvaluator();
    expect(evaluator.levels()).toEqual(['assisted', 'supervised', 'bounded', 'governed']);
    expect(evaluator.isSufficient('governed', undefined)).toBe(true); // no requirement
    expect(evaluator.isSufficient('governed', 'assisted')).toBe(true);
    expect(evaluator.isSufficient('assisted', 'governed')).toBe(false);
  });
});

describe('OversightEvaluator (consumes the frozen trust model)', () => {
  it('maps each trust level to its oversight and human requirement', () => {
    const evaluator = new OversightEvaluator();
    expect(evaluator.evaluate('low')).toEqual({ oversight: 'standing-rules', needsHuman: false });
    expect(evaluator.evaluate('moderate')).toEqual({
      oversight: 'standing-rules-with-traceability',
      needsHuman: false,
    });
    expect(evaluator.evaluate('high')).toEqual({ oversight: 'human-review', needsHuman: true });
    expect(evaluator.evaluate('critical')).toEqual({
      oversight: 'human-approval',
      needsHuman: true,
    });
  });
});

describe('GovernanceEvaluator (authorizes into an immutable decision)', () => {
  const build = () =>
    new GovernanceEvaluator(
      new PermissionEvaluator(),
      new ConstitutionalValidator(),
      new AutonomyEvaluator(),
      new OversightEvaluator(),
      new GovernanceHash(),
    );
  const registryWith = (grants) => {
    const registry = new GovernanceRegistry();
    for (const g of grants) registry.register(g);
    return registry;
  };

  it('authorizes a permitted, validated, low-trust plan, deeply frozen, deterministic, and input-independent', () => {
    const evaluator = build();
    const registry = registryWith([grant('a', { permissions: ['reasoning'] })]);
    const request = req();
    const decision = evaluator.evaluate(request, registry, false);
    expect(decision.decision).toBe('AUTHORIZE');
    expect(decision.permitted).toEqual(['reasoning']);
    expect(decision.violations).toEqual([]);
    expect(decision.oversight).toBe('standing-rules');
    expect(decision.validated).toBe(true);
    expect(decision.id).toMatch(/^[0-9a-f]{8}$/);
    expect(Object.isFrozen(decision)).toBe(true);
    expect(Object.isFrozen(decision.violations)).toBe(true);
    expect(Object.isFrozen(decision.permitted)).toBe(true);
    // deterministic: identical inputs -> identical decision, including the content-hash id
    expect(evaluator.evaluate(req(), registry, false).id).toBe(decision.id);
    // input-independent: mutating the source plan/steps after the call cannot change the decision
    request.plan.steps.push(step('tool'));
    expect(decision.permitted).toEqual(['reasoning']);
  });

  it('fails closed to DENY on an unrecognized trust level, and authorizes an empty (no-op) plan', () => {
    const evaluator = build();
    const registry = registryWith([grant('a', { permissions: ['reasoning'] })]);
    const denied = evaluator.evaluate(req({ trust: 'extreme' }), registry, false); // a bad, externally-provided trust
    expect(denied.decision).toBe('DENY');
    expect(denied.violations).toEqual(['GOVERNANCE.UNKNOWN_TRUST']);
    expect(denied.oversight).toBe('human-approval'); // strictest oversight, fail closed
    // an empty-steps plan requests nothing, so it authorizes with an empty permitted set (a no-op)
    const empty = evaluator.evaluate(req({ plan: plan({ steps: [] }) }), registry, false);
    expect(empty.decision).toBe('AUTHORIZE');
    expect(empty.permitted).toEqual([]);
  });

  it('denies an unknown subject, an unvalidated plan, and an ungranted capability (fail closed)', () => {
    const evaluator = build();
    const registry = registryWith([grant('a', { permissions: ['reasoning'] })]);
    expect(
      evaluator.evaluate(req({ plan: plan({ agent: 'ghost' }) }), registry, false).decision,
    ).toBe('DENY');
    expect(
      evaluator.evaluate(req({ plan: plan({ validated: false }) }), registry, false).violations,
    ).toEqual(['GOVERNANCE.UNVALIDATED_PLAN']);
    const denied = evaluator.evaluate(
      req({ plan: plan({ steps: [step('tool')] }) }),
      registry,
      false,
    );
    expect(denied.decision).toBe('DENY');
    expect(denied.violations).toEqual(['GOVERNANCE.NOT_GRANTED:tool']);
  });

  it('escalates when the action needs more autonomy than the grant', () => {
    const evaluator = build();
    const registry = registryWith([
      grant('a', { permissions: ['reasoning'], autonomy: 'assisted' }),
    ]);
    const decision = evaluator.evaluate(req({ requiredAutonomy: 'governed' }), registry, false);
    expect(decision.decision).toBe('ESCALATE');
    expect(decision.violations).toEqual(['GOVERNANCE.INSUFFICIENT_AUTONOMY']);
  });

  it('requires approval for high and critical trust, denies a human rejection, authorizes an approval', () => {
    const evaluator = build();
    const registry = registryWith([grant('a', { permissions: ['reasoning'] })]);
    const high = evaluator.evaluate(req({ trust: 'high' }), registry, false);
    expect(high.decision).toBe('REQUIRE_APPROVAL');
    expect(high.reason).toContain('review'); // high trust -> human review
    expect(evaluator.evaluate(req({ trust: 'critical' }), registry, false).reason).toContain(
      'approval', // critical trust -> human approval
    );
    expect(
      evaluator.evaluate(req({ trust: 'high', approved: false }), registry, false).decision,
    ).toBe('DENY');
    expect(
      evaluator.evaluate(req({ trust: 'high', approved: true }), registry, false).decision,
    ).toBe('AUTHORIZE');
  });

  it('requires approval for every action when explicit approval is configured', () => {
    const evaluator = build();
    const registry = registryWith([grant('a', { permissions: ['reasoning'] })]);
    expect(evaluator.evaluate(req(), registry, true).decision).toBe('REQUIRE_APPROVAL');
  });
});

describe('GovernanceMetrics', () => {
  it('records each operational counter', () => {
    const metrics = new GovernanceMetrics();
    metrics.recordRegistration();
    metrics.recordEvaluation();
    metrics.recordAuthorized();
    metrics.recordDenied();
    metrics.recordApprovalRequired();
    metrics.recordEscalated();
    expect(metrics.statistics()).toEqual({
      registrations: 1,
      evaluations: 1,
      authorized: 1,
      denied: 1,
      approvalsRequired: 1,
      escalated: 1,
    });
    expect(Object.isFrozen(metrics.statistics())).toBe(true);
  });
});

describe('GovernanceConfiguration', () => {
  it('defaults explicit approval off and applies overrides', () => {
    expect(new GovernanceConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(new GovernanceConfiguration().settings.requireExplicitApproval).toBe(false);
    expect(
      new GovernanceConfiguration({ requireExplicitApproval: true }).settings
        .requireExplicitApproval,
    ).toBe(true);
  });
});

describe('GovernanceEvents', () => {
  it('publishes registered and decided on the frozen bus', async () => {
    const bus = createEventBus();
    const events = new GovernanceEvents(bus, clock);
    const seen = [];
    bus.subscribeAll((event) => seen.push(event));
    await events.registered('a');
    await events.decided('a', 'AUTHORIZE');
    expect(seen.map((e) => e.type)).toEqual([
      GOVERNANCE_EVENT_TYPES.registered,
      GOVERNANCE_EVENT_TYPES.decided,
    ]);
    expect(seen[0].payload).toEqual({ subject: 'a' });
    expect(seen[1].payload).toEqual({ subject: 'a', decision: 'AUTHORIZE' });
    expect(seen[0].occurredAt).toBe(0);
  });
});

describe('GovernancePluginBridge (adopts grant-carrying plugins, atomically)', () => {
  const manifest = { name: 'source', version: '1.0.0', apiVersion: '1.0.0' };

  it('adopts each plugin grant into the registry', () => {
    const registry = new GovernanceRegistry();
    const adopted = expectOk(
      new GovernancePluginBridge(registry).adopt([
        { manifest, grant: grantInput('a') },
        { manifest, grant: grantInput('b') },
      ]),
    );
    expect(adopted).toEqual(['a', 'b']);
    expect(registry.list().map((g) => g.subject)).toEqual(['a', 'b']);
  });

  it('adopts nothing from an empty set', () => {
    expect(expectOk(new GovernancePluginBridge(new GovernanceRegistry()).adopt([]))).toEqual([]);
  });

  it('rejects an invalid grant and a conflicting grant', () => {
    const registry = new GovernanceRegistry();
    expect(
      expectErr(new GovernancePluginBridge(registry).adopt([{ manifest, grant: grantInput('  ') }]))
        .code,
    ).toBe('GOVERNANCE.BLANK_SUBJECT');
    expectOk(registry.register(expectOk(new GovernanceFactory().create(grantInput('a')))));
    expect(
      expectErr(new GovernancePluginBridge(registry).adopt([{ manifest, grant: grantInput('a') }]))
        .code,
    ).toBe('GOVERNANCE.DUPLICATE_SUBJECT');
  });

  it('adopts atomically: a mid-batch failure leaves the registry unchanged', () => {
    const registry = new GovernanceRegistry();
    expect(
      expectErr(
        new GovernancePluginBridge(registry).adopt([
          { manifest, grant: grantInput('a') },
          { manifest, grant: grantInput('  ') },
        ]),
      ).code,
    ).toBe('GOVERNANCE.BLANK_SUBJECT');
    expect(registry.has('a')).toBe(false);
    expect(
      expectErr(
        new GovernancePluginBridge(registry).adopt([
          { manifest, grant: grantInput('dup') },
          { manifest, grant: grantInput('dup') },
        ]),
      ).code,
    ).toBe('GOVERNANCE.DUPLICATE_SUBJECT');
    expect(registry.has('dup')).toBe(false);
  });
});

describe('GovernanceManager (facade)', () => {
  const build = () => {
    const bus = createEventBus();
    return { manager: new GovernanceManager({ clock, bus }), bus };
  };

  it('registers a grant and emits a registered event', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expect(expectOk(await manager.register(grantInput('a')))).toBe('a');
    expect(manager.statistics().registrations).toBe(1);
    expect(events).toContain(GOVERNANCE_EVENT_TYPES.registered);
  });

  it('fails closed on an invalid grant and on a duplicate, and removes', async () => {
    const { manager } = build();
    expect(expectErr(await manager.register(grantInput('  '))).code).toBe(
      'GOVERNANCE.BLANK_SUBJECT',
    );
    expectOk(await manager.register(grantInput('a')));
    expect(expectErr(await manager.register(grantInput('a'))).code).toBe(
      'GOVERNANCE.DUPLICATE_SUBJECT',
    );
    expect(manager.remove('a')).toBe(true);
    expect(manager.remove('a')).toBe(false);
  });

  it('decides each outcome and counts it, emitting decided', async () => {
    const { manager, bus } = build();
    const events = [];
    bus.subscribeAll((event) => events.push(event.type));
    expectOk(
      await manager.register(grantInput('a', { permissions: ['reasoning'], autonomy: 'assisted' })),
    );
    expect((await manager.decide(req())).decision).toBe('AUTHORIZE');
    expect((await manager.decide(req({ plan: plan({ steps: [step('tool')] }) }))).decision).toBe(
      'DENY',
    );
    expect((await manager.decide(req({ trust: 'critical' }))).decision).toBe('REQUIRE_APPROVAL');
    expect((await manager.decide(req({ requiredAutonomy: 'governed' }))).decision).toBe('ESCALATE');
    expect(events).toContain(GOVERNANCE_EVENT_TYPES.decided);
    expect(manager.statistics()).toMatchObject({
      evaluations: 4,
      authorized: 1,
      denied: 1,
      approvalsRequired: 1,
      escalated: 1,
    });
  });

  it('reports a frozen diagnostics view', async () => {
    const { manager } = build();
    expectOk(await manager.register(grantInput('a')));
    const diagnostics = manager.diagnostics();
    expect(diagnostics.grantCount).toBe(1);
    expect(diagnostics.statistics.registrations).toBe(1);
    expect(Object.isFrozen(diagnostics)).toBe(true);
  });
});
