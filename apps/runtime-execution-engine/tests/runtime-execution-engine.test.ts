import type { AgentExecutionPlan, AgentLink, AgentStep } from '@openlance/aios-agent-engine';
import { createEventBus } from '@openlance/aios-events';
import type { GovernanceDecision } from '@openlance/aios-governance-engine';
import { isErr, isOk } from '@openlance/aios-kernel';
import type { SafetyDecision } from '@openlance/aios-safety-engine';
import { describe, expect, it } from 'vitest';

import {
  CancellationManager,
  CheckpointManager,
  DependencyResolver,
  DEFAULT_SETTINGS,
  ExecutionConfiguration,
  ExecutionLifecycleManager,
  ExecutionMetrics,
  ExecutionPluginBridge,
  ExecutionPolicyFactory,
  ExecutionPolicyRegistry,
  ExecutionStateManager,
  ParallelExecutionCoordinator,
  RecoveryManager,
  ResultAggregator,
  RetryManager,
  RuntimeExecutionManager,
  Scheduler,
  TimeoutManager,
  runtimeExecutionEngineModule,
} from '../src/index';
import type {
  Delay,
  ExecutionContext,
  ExecutionRequest,
  ExecutionSettings,
  StepExecutor,
  StepResult,
} from '../src/index';

const clockAt = (t = 0) => ({ now: () => t });

const gov = (o: Partial<GovernanceDecision> = {}): GovernanceDecision => ({
  subject: 'a',
  decision: 'AUTHORIZE',
  reason: '',
  oversight: 'standing-rules',
  violations: [],
  permitted: [],
  trust: 'low',
  id: 'gov-1',
  validated: true,
  ...o,
});

const safety = (o: Partial<SafetyDecision> = {}): SafetyDecision => ({
  subject: 'a',
  outcome: 'SAFE',
  reason: '',
  hazards: [],
  directives: [],
  refusalCategory: null,
  escalated: false,
  emergencyStop: false,
  impact: [],
  oversight: 'standing-rules',
  trust: 'low',
  governance: 'gov-1',
  evaluated: true,
  id: 'saf-1',
  validated: true,
  ...o,
});

const context = (o: Partial<ExecutionContext> = {}): ExecutionContext => ({
  executionId: 'exec-1',
  correlationId: 'corr-1',
  deadline: null,
  cancellation: { isCancelled: () => false },
  traceId: 'trace-1',
  mode: 'standard',
  tenant: 'default',
  ...o,
});

const toolStep = (capability = 'search'): AgentStep => ({
  capability: 'tool',
  request: { capability },
});
const memoryStep = (scope = 'session:1'): AgentStep => ({
  capability: 'memory',
  request: { scope },
});
const retrievalStep = (scope = 'docs:public'): AgentStep => ({
  capability: 'retrieval',
  request: { scope },
});

const plan = (
  steps: readonly AgentStep[],
  coordination: readonly AgentLink[] = [],
): AgentExecutionPlan => ({
  agent: 'a',
  task: 't',
  steps,
  coordination,
  validated: true,
});

const request = (o: Partial<ExecutionRequest> = {}): ExecutionRequest => ({
  plan: plan([toolStep()]),
  governance: gov(),
  safety: safety(),
  context: context(),
  ...o,
});

type Action = 'succeeded' | 'failed' | 'throw' | 'throw-nonerror';

/** A step executor scripted per agent capability: the n-th call of a capability takes the n-th (or last) action. */
const scripted = (script: Record<string, readonly Action[]> = {}) => {
  const calls: Record<string, number> = {};
  const executor: StepExecutor = {
    execute: async (step) => {
      const key = step.capability;
      const n = calls[key] ?? 0;
      calls[key] = n + 1;
      const sequence = script[key] ?? ['succeeded'];
      const action = sequence[Math.min(n, sequence.length - 1)] ?? 'succeeded';
      if (action === 'throw') throw new Error('seam boom');
      if (action === 'throw-nonerror') throw 'plain';
      return { status: action, detail: action };
    },
  };
  return { executor, calls };
};

const engine = (opts: {
  executor: StepExecutor;
  settings?: Partial<ExecutionSettings>;
  clock?: { now: () => number };
  delay?: Delay;
}) =>
  new RuntimeExecutionManager({
    clock: opts.clock ?? clockAt(),
    bus: createEventBus(),
    executor: opts.executor,
    settings: opts.settings,
    delay: opts.delay,
  });

describe('ExecutionStateManager (frozen state model)', () => {
  it('records a legal path and refuses an illegal transition', () => {
    const state = new ExecutionStateManager();
    state.transition('initializing');
    state.transition('loading');
    expect(state.current).toBe('loading');
    expect(state.path).toEqual(['created', 'initializing', 'loading']);
    expect(() => state.transition('completed')).toThrow(/not permitted/);
  });
});

describe('ExecutionLifecycleManager (frozen lifecycle)', () => {
  it('maps states to frozen phases and orders them', () => {
    const lifecycle = new ExecutionLifecycleManager();
    expect(lifecycle.phases()).toEqual([
      'initialization',
      'loading',
      'validation',
      'execution',
      'finalization',
    ]);
    expect(lifecycle.phaseOf('executing')).toBe('execution');
    expect(lifecycle.phaseOf('validating')).toBe('validation');
    expect(lifecycle.atOrAfter('executing', 'validating')).toBe(true);
    expect(lifecycle.atOrAfter('validating', 'executing')).toBe(false);
  });
});

describe('DependencyResolver', () => {
  const resolver = new DependencyResolver();

  it('resolves steps in plan order and re-verifies acyclic coordination', () => {
    const resolved = resolver.resolve(
      plan(
        [toolStep('a'), toolStep('b')],
        [
          { supervisor: 's', worker: 'w' },
          { supervisor: 's', worker: 'x' },
          { supervisor: 'w', worker: 'y' },
        ],
      ),
    );
    expect(isOk(resolved)).toBe(true);
    if (isOk(resolved)) expect(resolved.value.map((r) => r.index)).toEqual([0, 1]);
  });

  it('fails closed on a coordination cycle', () => {
    const resolved = resolver.resolve(
      plan(
        [toolStep()],
        [
          { supervisor: 'a', worker: 'b' },
          { supervisor: 'b', worker: 'a' },
        ],
      ),
    );
    expect(isErr(resolved)).toBe(true);
    if (isErr(resolved)) expect(resolved.error.code).toBe('EXECUTION.COORDINATION_CYCLE');
  });
});

describe('Scheduler', () => {
  const scheduler = new Scheduler();
  const resolved = [0, 1, 2].map((index) => ({ index, step: toolStep(`t${index}`) }));

  it('is sequential at concurrency 1 and windows at higher concurrency', () => {
    expect(scheduler.schedule(resolved, 1, new Set()).map((s) => s.length)).toEqual([1, 1, 1]);
    expect(scheduler.schedule(resolved, 2, new Set()).map((s) => s.length)).toEqual([2, 1]);
  });

  it('breaks a stage at a barrier capability, even mid-window and as the first step', () => {
    const steps = [
      { index: 0, step: toolStep('x') },
      { index: 1, step: memoryStep('m') },
      { index: 2, step: toolStep('y') },
    ];
    const stages = scheduler.schedule(steps, 3, new Set(['memory']));
    expect(stages.map((s) => s.map((r) => r.index))).toEqual([[0], [1], [2]]);
  });
});

describe('reliability helpers', () => {
  it('RetryManager bounds retries and computes backoff', () => {
    const retry = new RetryManager();
    expect(retry.mayRetry(1, 2)).toBe(true);
    expect(retry.mayRetry(2, 2)).toBe(false);
    expect(retry.backoff(1, 10)).toBe(10);
    expect(retry.backoff(3, 10)).toBe(40);
  });

  it('TimeoutManager detects a passed deadline only', () => {
    const timeout = new TimeoutManager();
    expect(timeout.expired(null, 100)).toBe(false);
    expect(timeout.expired(50, 40)).toBe(false);
    expect(timeout.expired(50, 50)).toBe(true);
  });

  it('CancellationManager reads the signal', () => {
    const cancellation = new CancellationManager();
    expect(cancellation.requested(context())).toBe(false);
    expect(cancellation.requested(context({ cancellation: { isCancelled: () => true } }))).toBe(
      true,
    );
  });

  it('RecoveryManager bounds recovery', () => {
    const recovery = new RecoveryManager();
    expect(recovery.decide(0, 1)).toBe('continue');
    expect(recovery.decide(1, 1)).toBe('terminate');
  });
});

describe('CheckpointManager', () => {
  const result: StepResult = {
    index: 0,
    capability: 'tool',
    status: 'succeeded',
    attempts: 1,
    detail: '',
  };
  it('records and restores when enabled and is inert when disabled', () => {
    const on = new CheckpointManager(true);
    on.record(result);
    expect(on.restore(0)).toEqual(result);
    expect(on.count).toBe(1);
    const off = new CheckpointManager(false);
    off.record(result);
    expect(off.restore(0)).toBeUndefined();
    expect(off.count).toBe(0);
  });
});

describe('ParallelExecutionCoordinator', () => {
  it('collects stage results in resolved order regardless of completion order', async () => {
    const stage = [
      { index: 0, step: toolStep('a') },
      { index: 1, step: toolStep('b') },
    ];
    const results = await new ParallelExecutionCoordinator().run(stage, async (r) => ({
      index: r.index,
      capability: r.step.capability,
      status: 'succeeded',
      attempts: 1,
      detail: '',
    }));
    expect(results.map((r) => r.index)).toEqual([0, 1]);
  });
});

describe('ResultAggregator', () => {
  it('orders steps by index and deep-freezes the record', () => {
    const record = new ResultAggregator().aggregate({
      executionId: 'e',
      terminal: 'completed',
      terminalEvent: 'execution-completed',
      steps: [
        { index: 1, capability: 'tool', status: 'succeeded', attempts: 1, detail: '' },
        { index: 0, capability: 'memory', status: 'succeeded', attempts: 1, detail: '' },
      ],
      path: ['created', 'closed'],
      startedAt: 0,
      finishedAt: 1,
      governance: 'g',
      safety: 's',
      reason: 'r',
    });
    expect(record.steps.map((s) => s.index)).toEqual([0, 1]);
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.steps[0])).toBe(true);
  });
});

describe('ExecutionConfiguration', () => {
  it('defaults and clamps every bound to its safe minimum', () => {
    expect(new ExecutionConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    const clamped = new ExecutionConfiguration({
      maxAttempts: 0,
      maxRecoveries: -3,
      maxConcurrency: 0,
      backoffBaseMillis: -1,
    }).settings;
    expect(clamped).toMatchObject({
      maxAttempts: 1,
      maxRecoveries: 0,
      maxConcurrency: 1,
      backoffBaseMillis: 0,
    });
  });

  it('clamps non-finite and over-cap bounds so execution always terminates', () => {
    const nonFinite = new ExecutionConfiguration({
      maxAttempts: Number.POSITIVE_INFINITY,
      maxRecoveries: Number.POSITIVE_INFINITY,
      maxConcurrency: Number.NaN,
    }).settings;
    expect(nonFinite).toMatchObject({ maxAttempts: 1, maxRecoveries: 0, maxConcurrency: 1 });
    const overCap = new ExecutionConfiguration({
      maxAttempts: 1e9,
      maxRecoveries: 1e9,
      maxConcurrency: 1e9,
      backoffBaseMillis: 1e12,
    }).settings;
    expect(overCap).toMatchObject({
      maxAttempts: 10_000,
      maxRecoveries: 10_000,
      maxConcurrency: 1_024,
      backoffBaseMillis: 3_600_000,
    });
  });
});

describe('ExecutionMetrics', () => {
  it('counts executions, terminals, steps, and retries', () => {
    const metrics = new ExecutionMetrics();
    metrics.recordExecution();
    metrics.recordTerminal('completed');
    metrics.recordTerminal('failed');
    metrics.recordTerminal('cancelled');
    metrics.recordStep();
    metrics.recordRetry();
    expect(metrics.statistics()).toEqual({
      executions: 1,
      completed: 1,
      failed: 1,
      cancelled: 1,
      stepsRun: 1,
      retries: 1,
    });
  });
});

describe('ExecutionPolicyFactory and registry', () => {
  const factory = new ExecutionPolicyFactory();

  it('builds a normalized policy and fails closed on blanks', () => {
    const ok = factory.create({ name: 'No Parallel Tools', barrierCapabilities: ['Tool'] });
    expect(isOk(ok)).toBe(true);
    if (isOk(ok))
      expect(ok.value).toEqual({ name: 'no parallel tools', barrierCapabilities: ['tool'] });
    expect(isErr(factory.create({ name: '  ' }))).toBe(true);
    const blank = factory.create({ name: 'p', barrierCapabilities: ['ok', ' '] });
    expect(isErr(blank)).toBe(true);
    if (isErr(blank)) expect(blank.error.code).toBe('EXECUTION.BLANK_POLICY_ENTRY');
  });

  it('registers, resolves barriers, and rejects duplicates', () => {
    const registry = new ExecutionPolicyRegistry();
    const built = factory.create({ name: 'p', barrierCapabilities: ['tool'] });
    if (isOk(built)) registry.register(built.value);
    expect(registry.has('p')).toBe(true);
    expect([...registry.barriers()]).toEqual(['tool']);
    expect(registry.list()).toHaveLength(1);
    if (isOk(built)) expect(isErr(registry.register(built.value))).toBe(true);
    expect(registry.unregister('p')).toBe(true);
    expect(registry.unregister('p')).toBe(false);
  });
});

describe('ExecutionPluginBridge', () => {
  const manifest = { name: 'src', version: '1.0.0', apiVersion: '1.0.0' };
  it('adopts atomically and rejects invalid or duplicate policies', () => {
    const registry = new ExecutionPolicyRegistry();
    const bridge = new ExecutionPluginBridge(registry);
    expect(
      isOk(
        bridge.adopt([
          { manifest, policy: { name: 'a' } },
          { manifest, policy: { name: 'b' } },
        ]),
      ),
    ).toBe(true);
    expect(registry.list()).toHaveLength(2);
    const registry2 = new ExecutionPolicyRegistry();
    const bridge2 = new ExecutionPluginBridge(registry2);
    expect(isErr(bridge2.adopt([{ manifest, policy: { name: '  ' } }]))).toBe(true);
    expect(
      isErr(
        bridge2.adopt([
          { manifest, policy: { name: 'x' } },
          { manifest, policy: { name: 'x' } },
        ]),
      ),
    ).toBe(true);
    expect(registry2.list()).toHaveLength(0);
    expect(isOk(bridge2.adopt([{ manifest, policy: { name: 'x' } }]))).toBe(true);
    expect(isErr(bridge2.adopt([{ manifest, policy: { name: 'x' } }]))).toBe(true);
  });
});

describe('RuntimeExecutionManager.execute', () => {
  it('completes an authorized, safe plan and drives the frozen path', async () => {
    const { executor } = scripted();
    const record = await engine({ executor }).execute(
      request({ plan: plan([toolStep(), memoryStep()]) }),
    );
    expect(record.terminal).toBe('completed');
    expect(record.terminalEvent).toBe('execution-completed');
    expect(record.steps.map((s) => s.status)).toEqual(['succeeded', 'succeeded']);
    expect(record.path).toEqual([
      'created',
      'initializing',
      'loading',
      'validating',
      'ready',
      'executing',
      'completed',
      'closed',
    ]);
    expect(record.validated).toBe(true);
  });

  it('fails closed when governance did not authorize (no step runs)', async () => {
    const { executor, calls } = scripted();
    const record = await engine({ executor }).execute(
      request({ governance: gov({ decision: 'DENY' }) }),
    );
    expect(record.terminal).toBe('failed');
    expect(record.steps).toEqual([]);
    expect(calls.tool).toBeUndefined();
    expect(record.path).toEqual([
      'created',
      'initializing',
      'loading',
      'validating',
      'failed',
      'closed',
    ]);
  });

  it('fails closed when safety is not an executing outcome', async () => {
    for (const outcome of ['REFUSE', 'UNSAFE', 'ESCALATE'] as const) {
      const record = await engine({ executor: scripted().executor }).execute(
        request({ safety: safety({ outcome }) }),
      );
      expect(record.terminal).toBe('failed');
      expect(record.reason).toContain(outcome);
    }
  });

  it('executes under each executing safety outcome', async () => {
    for (const outcome of ['SAFE', 'SANITIZE', 'RESTRICT', 'DEGRADE'] as const) {
      const record = await engine({ executor: scripted().executor }).execute(
        request({ safety: safety({ outcome }) }),
      );
      expect(record.terminal).toBe('completed');
    }
  });

  it('cancels at the governed gate before running', async () => {
    const { executor, calls } = scripted();
    const record = await engine({ executor }).execute(
      request({ context: context({ cancellation: { isCancelled: () => true } }) }),
    );
    expect(record.terminal).toBe('cancelled');
    expect(record.terminalEvent).toBe('execution-cancelled');
    expect(calls.tool).toBeUndefined();
    expect(record.path).toEqual([
      'created',
      'initializing',
      'loading',
      'validating',
      'cancelled',
      'closed',
    ]);
  });

  it('fails closed on a coordination cycle', async () => {
    const record = await engine({ executor: scripted().executor }).execute(
      request({
        plan: plan(
          [toolStep()],
          [
            { supervisor: 'a', worker: 'b' },
            { supervisor: 'b', worker: 'a' },
          ],
        ),
      }),
    );
    expect(record.terminal).toBe('failed');
    expect(record.path).toContain('recovering');
    expect(record.reason).toContain('cycle');
  });

  it('retries a transient step failure within the bound and then completes', async () => {
    const { executor, calls } = scripted({ tool: ['failed', 'succeeded'] });
    const record = await engine({ executor, settings: { maxAttempts: 2 } }).execute(request());
    expect(record.terminal).toBe('completed');
    expect(record.steps[0]?.attempts).toBe(2);
    expect(calls.tool).toBe(2);
  });

  it('never breaks when an injected delay throws; the retry proceeds', async () => {
    const throwingDelay: Delay = {
      wait: async () => {
        throw new Error('delay boom');
      },
    };
    const { executor } = scripted({ tool: ['failed', 'succeeded'] });
    const record = await engine({
      executor,
      settings: { maxAttempts: 2 },
      delay: throwingDelay,
    }).execute(request());
    expect(record.terminal).toBe('completed');
  });

  it('fails after exhausting the retry bound', async () => {
    const { executor } = scripted({ tool: ['failed'] });
    const record = await engine({ executor, settings: { maxAttempts: 2 } }).execute(request());
    expect(record.terminal).toBe('failed');
    expect(record.steps[0]?.attempts).toBe(2);
  });

  it('recovers at the execution level and then completes', async () => {
    const { executor, calls } = scripted({ tool: ['failed', 'succeeded'] });
    const record = await engine({
      executor,
      settings: { maxAttempts: 1, maxRecoveries: 1 },
    }).execute(request());
    expect(record.terminal).toBe('completed');
    expect(record.path.filter((s) => s === 'recovering')).toHaveLength(1);
    expect(calls.tool).toBe(2);
  });

  it('recovers up to the bound and then terminates', async () => {
    const { executor } = scripted({ tool: ['failed'] });
    const record = await engine({
      executor,
      settings: { maxAttempts: 1, maxRecoveries: 1 },
    }).execute(request());
    expect(record.terminal).toBe('failed');
    expect(record.path.filter((s) => s === 'recovering')).toHaveLength(2);
  });

  it('fails a step whose deadline has passed', async () => {
    const record = await engine({ executor: scripted().executor, clock: clockAt(100) }).execute(
      request({ context: context({ deadline: 50 }) }),
    );
    expect(record.terminal).toBe('failed');
    expect(record.steps[0]?.detail).toBe('deadline exceeded');
  });

  it('never throws when the seam throws (Error and non-Error)', async () => {
    const boom = await engine({ executor: scripted({ tool: ['throw'] }).executor }).execute(
      request(),
    );
    expect(boom.terminal).toBe('failed');
    expect(boom.steps[0]?.detail).toBe('seam boom');
    const plain = await engine({
      executor: scripted({ tool: ['throw-nonerror'] }).executor,
    }).execute(request());
    expect(plain.terminal).toBe('failed');
    expect(plain.steps[0]?.detail).toContain('threw');
  });

  it('stops at the first failed stage and never runs a later stage', async () => {
    const { executor, calls } = scripted({ tool: ['failed'] });
    const record = await engine({ executor }).execute(
      request({ plan: plan([toolStep(), memoryStep()]) }),
    );
    expect(record.terminal).toBe('failed');
    expect(calls.memory).toBeUndefined();
  });

  it('runs a stage in parallel and aggregates deterministically by index', async () => {
    const { executor } = scripted();
    const record = await engine({ executor, settings: { maxConcurrency: 3 } }).execute(
      request({ plan: plan([toolStep(), memoryStep(), retrievalStep()]) }),
    );
    expect(record.terminal).toBe('completed');
    expect(record.steps.map((s) => s.index)).toEqual([0, 1, 2]);
  });

  it('does not re-execute a checkpointed step on recovery (idempotency)', async () => {
    const { executor, calls } = scripted({ tool: ['succeeded'], memory: ['failed', 'succeeded'] });
    const record = await engine({
      executor,
      settings: { maxConcurrency: 2, maxAttempts: 1, maxRecoveries: 1 },
    }).execute(request({ plan: plan([toolStep(), memoryStep()]) }));
    expect(record.terminal).toBe('completed');
    expect(calls.tool).toBe(1); // succeeded once, restored from checkpoint on the recovery re-run
    expect(calls.memory).toBe(2);
  });

  it('re-executes an uncheckpointed step on recovery when checkpointing is off', async () => {
    const { executor, calls } = scripted({ tool: ['succeeded'], memory: ['failed', 'succeeded'] });
    await engine({
      executor,
      settings: { maxConcurrency: 2, maxAttempts: 1, maxRecoveries: 1, checkpointing: false },
    }).execute(request({ plan: plan([toolStep(), memoryStep()]) }));
    expect(calls.tool).toBe(2); // re-run because it was not checkpointed
  });

  it('is deterministic across identical runs', async () => {
    const build = () =>
      engine({ executor: scripted().executor, clock: clockAt(7) }).execute(request());
    const first = await build();
    const second = await build();
    expect(second).toEqual(first);
  });

  it('registers a barrier policy, reports statistics and diagnostics, and removes a policy', async () => {
    const { executor } = scripted();
    const manager = engine({ executor, settings: { maxConcurrency: 3 } });
    expect(isOk(manager.register({ name: 'serial-tools', barrierCapabilities: ['tool'] }))).toBe(
      true,
    );
    expect(isErr(manager.register({ name: '  ' }))).toBe(true);
    const record = await manager.execute(
      request({ plan: plan([toolStep(), toolStep(), memoryStep()]) }),
    );
    expect(record.terminal).toBe('completed');
    expect(manager.statistics().executions).toBe(1);
    expect(manager.diagnostics().policyCount).toBe(1);
    expect(manager.remove('serial-tools')).toBe(true);
    expect(manager.remove('serial-tools')).toBe(false);
  });

  it('handles a large sequential plan (stress)', async () => {
    const steps = Array.from({ length: 40 }, (_, i) => toolStep(`t${i}`));
    const record = await engine({ executor: scripted().executor }).execute(
      request({ plan: plan(steps) }),
    );
    expect(record.terminal).toBe('completed');
    expect(record.steps).toHaveLength(40);
  });

  it('defaults the step detail when the seam omits it, and rejects a duplicate policy', async () => {
    const succeed: StepExecutor = { execute: async () => ({ status: 'succeeded' }) };
    const okRecord = await engine({ executor: succeed }).execute(request());
    expect(okRecord.steps[0]?.detail).toBe('');
    const failNoDetail: StepExecutor = { execute: async () => ({ status: 'failed' }) };
    const failRecord = await engine({ executor: failNoDetail }).execute(request());
    expect(failRecord.terminal).toBe('failed');
    expect(failRecord.steps[0]?.detail).toBe('step failed');
    const manager = engine({ executor: succeed });
    expect(isOk(manager.register({ name: 'dup' }))).toBe(true);
    const duplicate = manager.register({ name: 'dup' });
    expect(isErr(duplicate)).toBe(true);
    if (isErr(duplicate)) expect(duplicate.error.code).toBe('EXECUTION.DUPLICATE_POLICY');
  });
});

describe('module seam', () => {
  it('produces a registrable DI module', () => {
    const manager = engine({ executor: scripted().executor });
    const module = runtimeExecutionEngineModule(manager);
    expect(module.name).toBe('runtime-execution-engine');
    const tokens: unknown[] = [];
    module.register({ register: (token: unknown) => tokens.push(token) } as never);
    expect(tokens).toHaveLength(1);
  });
});
