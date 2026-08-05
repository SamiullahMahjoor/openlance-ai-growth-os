import { createEventBus } from '@openlance/aios-events';
import { isErr, isOk } from '@openlance/aios-kernel';
import {
  EVALUATION_LIFECYCLE_PHASES,
  EVALUATION_VALIDATION_CHECKS,
} from '@openlance/aios-evaluation';
import { describe, expect, it } from 'vitest';

import {
  BenchmarkFactory,
  BenchmarkRegistry,
  Comparator,
  DEFAULT_SETTINGS,
  EvaluationAuditManager,
  EvaluationConfiguration,
  EvaluationHash,
  EvaluationManager,
  EvaluationMetrics,
  EvaluationNormalizer,
  EvaluationPluginBridge,
  Evaluator,
  Measurer,
  Scorer,
  Validator,
  isSubjectKind,
  SUBJECT_KINDS,
  evaluationEngineModule,
} from '../src/index';
import type { EvaluationPlugin, EvaluationRequest } from '../src/index';

const clock = { now: () => 0 };
const manager = (): EvaluationManager => new EvaluationManager({ clock, bus: createEventBus() });

const request = (over: Partial<EvaluationRequest> = {}): EvaluationRequest => ({
  evaluation: 'eval-1',
  subject: { kind: 'reasoning', reference: 'output-1' },
  metrics: [
    { metric: 'accuracy', value: 0.9, grounded: true },
    { metric: 'grounding', value: 0.8, grounded: true },
  ],
  ...over,
});

const plugin = (name: string): EvaluationPlugin => ({
  manifest: { name, version: '1.0.0', apiVersion: '1.0.0' },
  benchmark: { name, version: '1', values: [{ metric: 'accuracy', value: 0.7 }] },
});

describe('EvaluationManager.evaluate', () => {
  it('accepts a well-formed, grounded, scored, identified evaluation', async () => {
    const result = await manager().evaluate(request());
    expect(result.verdict).toBe('accepted');
    expect(result.subject).toBe('reasoning');
    expect(result.score?.value).toBeCloseTo(0.85);
    expect(result.score?.method).toBe('mean');
    expect(result.validation.accepted).toBe(true);
    expect(result.validation.failedCheck).toBeNull();
    expect(result.comparison).toBeNull();
    expect(result.benchmarkVersion).toBeNull();
    expect(result.id).toMatch(/^[0-9a-f]{8}$/);
  });

  it('is deterministic: the same request yields the same id', () => {
    const engine = new Evaluator(new EvaluationHash());
    const registry = new BenchmarkRegistry();
    const a = engine.evaluate(request(), registry);
    const b = engine.evaluate(request(), registry);
    expect(a.id).toBe(b.id);
  });

  it('compares against a registered benchmark and records the benchmark version', async () => {
    const engine = manager();
    expect(
      isOk(
        engine.registerBenchmark({
          name: 'gold',
          version: '2',
          values: [{ metric: 'accuracy', value: 0.7 }],
        }),
      ),
    ).toBe(true);
    const result = await engine.evaluate(request({ benchmark: 'gold' }));
    expect(result.verdict).toBe('accepted');
    expect(result.comparison?.benchmark).toBe('gold');
    expect(result.comparison?.version).toBe('2');
    expect(result.comparison?.standing).toBe('above');
    expect(result.benchmarkVersion).toBe('2');
  });

  it('withholds when the subject kind is unknown (well-formedness)', async () => {
    const result = await manager().evaluate(
      request({ subject: { kind: 'bogus' as never, reference: 'r' } }),
    );
    expect(result.verdict).toBe('withheld');
    expect(result.subject).toBe('unknown');
    expect(result.validation.failedCheck).toBe('well-formedness-validation');
    expect(result.score).toBeNull();
  });

  it('withholds when the subject reference is blank (well-formedness)', async () => {
    const result = await manager().evaluate(
      request({ subject: { kind: 'tool', reference: '  ' } }),
    );
    expect(result.validation.failedCheck).toBe('well-formedness-validation');
  });

  it('withholds when there are no metrics (well-formedness)', async () => {
    const result = await manager().evaluate(request({ metrics: [] }));
    expect(result.validation.failedCheck).toBe('well-formedness-validation');
  });

  it('withholds when a requested benchmark is not registered (well-formedness)', async () => {
    const result = await manager().evaluate(request({ benchmark: 'missing' }));
    expect(result.validation.failedCheck).toBe('well-formedness-validation');
    expect(result.comparison).toBeNull();
  });

  it('withholds when a measurement is ungrounded (grounding)', async () => {
    const result = await manager().evaluate(
      request({ metrics: [{ metric: 'accuracy', value: 0.9, grounded: false }] }),
    );
    expect(result.validation.failedCheck).toBe('grounding-validation');
  });

  it('withholds when a value is out of range so no score is derivable (scoring)', async () => {
    const result = await manager().evaluate(
      request({ metrics: [{ metric: 'accuracy', value: 1.5, grounded: true }] }),
    );
    expect(result.validation.failedCheck).toBe('scoring-validation');
    expect(result.score).toBeNull();
  });

  it('withholds when the evaluation identity is blank (constitutional)', async () => {
    const result = await manager().evaluate(request({ evaluation: '   ' }));
    expect(result.validation.failedCheck).toBe('constitutional-validation');
  });

  it('withholds a non-string evaluation identity and records it blank (zero trust, constitutional)', async () => {
    const result = await manager().evaluate(request({ evaluation: 123 as never }));
    expect(result.verdict).toBe('withheld');
    expect(result.validation.failedCheck).toBe('constitutional-validation');
    expect(result.evaluation).toBe('');
  });

  it('never throws on a structurally malformed request and withholds it (zero trust)', async () => {
    const malformed = {
      evaluation: 'z',
      subject: undefined,
      metrics: undefined,
    } as unknown as EvaluationRequest;
    const result = await manager().evaluate(malformed);
    expect(result.verdict).toBe('withheld');
    expect(result.measured).toEqual([]);
  });

  it('never throws on a null request and withholds it (zero trust)', async () => {
    const result = await manager().evaluate(null as unknown as EvaluationRequest);
    expect(result.verdict).toBe('withheld');
    expect(result.measured).toEqual([]);
    expect(result.evaluation).toBe('');
  });

  it('withholds duplicate metric names (well-formedness)', async () => {
    const result = await manager().evaluate(
      request({
        metrics: [
          { metric: 'accuracy', value: 0.9, grounded: true },
          { metric: 'accuracy', value: 0.8, grounded: true },
        ],
      }),
    );
    expect(result.validation.failedCheck).toBe('well-formedness-validation');
  });

  it('counts a re-evaluated identity as a duplicate and does not double-count', async () => {
    const engine = manager();
    await engine.evaluate(request());
    await engine.evaluate(request());
    const stats = engine.statistics();
    expect(stats.evaluations).toBe(1);
    expect(stats.duplicates).toBe(1);
    expect(stats.accepted).toBe(1);
  });

  it('counts a withheld evaluation under withheld', async () => {
    const engine = manager();
    await engine.evaluate(request({ evaluation: 'w', metrics: [] }));
    expect(engine.statistics().withheld).toBe(1);
  });
});

describe('EvaluationManager benchmark extension', () => {
  it('registers, lists, and removes a benchmark', () => {
    const engine = manager();
    expect(isOk(engine.registerBenchmark({ name: 'B one', version: '1', values: [] }))).toBe(true);
    expect(engine.benchmarks().map((benchmark) => benchmark.name)).toEqual(['b one']);
    expect(engine.diagnostics().benchmarkCount).toBe(1);
    expect(engine.removeBenchmark('B one')).toBe(true);
    expect(engine.removeBenchmark('B one')).toBe(false);
    expect(engine.benchmarks()).toEqual([]);
  });

  it('fails closed on a blank benchmark name (factory error)', () => {
    const registered = manager().registerBenchmark({ name: '  ', version: '1' });
    expect(isErr(registered)).toBe(true);
  });

  it('fails closed on a duplicate benchmark (registry error)', () => {
    const engine = manager();
    engine.registerBenchmark({ name: 'dup', version: '1' });
    expect(isErr(engine.registerBenchmark({ name: 'dup', version: '2' }))).toBe(true);
  });

  it('adopts benchmark-carrying plugins atomically', () => {
    const engine = manager();
    const adopted = engine.adopt([plugin('p-one'), plugin('p-two')]);
    expect(isOk(adopted)).toBe(true);
    if (isOk(adopted)) expect(adopted.value).toEqual(['p-one', 'p-two']);
    expect(engine.benchmarks()).toHaveLength(2);
  });

  it('reports an immutable audit trail', async () => {
    const engine = manager();
    await engine.evaluate(request());
    const audit = engine.audit();
    expect(audit.entries).toHaveLength(1);
    expect(audit.entries[0]?.verdict).toBe('accepted');
    expect(audit.id).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('Measurer', () => {
  it('normalizes names and settles metrics into a deterministic sorted order', () => {
    const measured = new Measurer().measure([
      { metric: 'Charlie', value: 0.3, grounded: true },
      { metric: 'alpha', value: 0.1, grounded: true },
      { metric: 'Bravo', value: 0.2, grounded: true },
    ]);
    expect(measured.map((metric) => metric.metric)).toEqual(['alpha', 'bravo', 'charlie']);
  });

  it('is zero-trust: a non-array yields no metrics, and a malformed metric settles safely', () => {
    expect(new Measurer().measure(undefined as never)).toEqual([]);
    const measured = new Measurer().measure([
      null as never,
      { metric: 123 as never, value: 'x' as never, grounded: 'yes' as never },
    ]);
    expect(measured).toHaveLength(2);
    for (const metric of measured) {
      expect(metric.metric).toBe('');
      expect(Number.isNaN(metric.value)).toBe(true);
      expect(metric.grounded).toBe(false);
    }
  });
});

describe('Scorer', () => {
  it('derives the mean of the measured values, traceable to the metrics', () => {
    const score = new Scorer().derive([
      { metric: 'a', value: 0.4, grounded: true },
      { metric: 'b', value: 0.6, grounded: true },
    ]);
    expect(score?.value).toBeCloseTo(0.5);
    expect(score?.metrics).toEqual(['a', 'b']);
  });

  it('returns null when no metrics, a non-finite value, a negative value, or an over-range value', () => {
    expect(new Scorer().derive([])).toBeNull();
    expect(new Scorer().derive([{ metric: 'a', value: Number.NaN, grounded: true }])).toBeNull();
    expect(new Scorer().derive([{ metric: 'a', value: -0.1, grounded: true }])).toBeNull();
    expect(new Scorer().derive([{ metric: 'a', value: 1.1, grounded: true }])).toBeNull();
  });
});

describe('Comparator', () => {
  const measured = [
    { metric: 'a', value: 0.5, grounded: true },
    { metric: 'b', value: 0.5, grounded: true },
  ];

  it('reports per-metric and overall standing, like for like', () => {
    const comparison = new Comparator().compare(measured, {
      name: 'bench',
      version: '1',
      values: [
        { metric: 'a', value: 0.4 },
        { metric: 'b', value: 0.9 },
      ],
    });
    expect(comparison.entries.map((entry) => entry.standing)).toEqual(['above', 'below']);
    expect(comparison.standing).toBe('below');
  });

  it('reports equal when measured and benchmark match', () => {
    const comparison = new Comparator().compare(measured, {
      name: 'bench',
      version: '1',
      values: [
        { metric: 'a', value: 0.5 },
        { metric: 'b', value: 0.5 },
      ],
    });
    expect(comparison.standing).toBe('equal');
  });

  it('reports equal with no entries when no metric is shared', () => {
    const comparison = new Comparator().compare(measured, {
      name: 'bench',
      version: '1',
      values: [{ metric: 'z', value: 0.5 }],
    });
    expect(comparison.entries).toEqual([]);
    expect(comparison.standing).toBe('equal');
  });
});

describe('Validator applies the frozen checks in order', () => {
  it('records every check in the frozen order when accepted', () => {
    const measured = [{ metric: 'a', value: 0.5, grounded: true }];
    const outcome = new Validator().validate({
      request: request({ metrics: measured }),
      measured,
      score: new Scorer().derive(measured),
      benchmark: null,
      benchmarkRequested: false,
    });
    expect(outcome.accepted).toBe(true);
    expect(outcome.checks.map((check) => check.check)).toEqual([...EVALUATION_VALIDATION_CHECKS]);
  });
});

describe('BenchmarkFactory zero-trust', () => {
  const factory = new BenchmarkFactory();
  it('accepts a valid benchmark with values', () => {
    const created = factory.create({
      name: 'ok',
      version: '1',
      values: [{ metric: 'a', value: 0.5 }],
    });
    expect(isOk(created)).toBe(true);
    if (isOk(created)) expect(created.value.values).toHaveLength(1);
  });
  it('accepts a valid benchmark with no values (inert) and a non-array values field', () => {
    expect(isOk(factory.create({ name: 'ok2', version: '1' }))).toBe(true);
    expect(isOk(factory.create({ name: 'ok3', version: '1', values: undefined as never }))).toBe(
      true,
    );
  });
  it('fails closed on a blank version', () => {
    expect(isErr(factory.create({ name: 'x', version: '  ' }))).toBe(true);
  });
  it('fails closed on a blank metric entry', () => {
    expect(
      isErr(factory.create({ name: 'x', version: '1', values: [{ metric: ' ', value: 0.5 }] })),
    ).toBe(true);
  });
  it('fails closed on a non-finite value', () => {
    expect(
      isErr(
        factory.create({
          name: 'x',
          version: '1',
          values: [{ metric: 'a', value: Number.POSITIVE_INFINITY }],
        }),
      ),
    ).toBe(true);
  });
  it('is zero-trust: a non-string name, version, or metric settles blank and fails closed', () => {
    expect(isErr(factory.create({ name: 123 as never, version: '1' }))).toBe(true);
    expect(isErr(factory.create({ name: 'ok', version: 5 as never }))).toBe(true);
    expect(
      isErr(
        factory.create({ name: 'ok', version: '1', values: [{ metric: 7 as never, value: 0.5 }] }),
      ),
    ).toBe(true);
  });
});

describe('BenchmarkRegistry', () => {
  it('registers, checks, resolves, lists, and removes', () => {
    const registry = new BenchmarkRegistry();
    const benchmark = { name: 'b', version: '1', values: [] };
    expect(isOk(registry.register(benchmark))).toBe(true);
    expect(registry.has('b')).toBe(true);
    expect(registry.get('b')).toBe(benchmark);
    expect(registry.get('nope')).toBeUndefined();
    expect(registry.list()).toEqual([benchmark]);
    expect(isErr(registry.register(benchmark))).toBe(true);
    expect(registry.unregister('b')).toBe(true);
  });
});

describe('EvaluationPluginBridge', () => {
  it('fails closed on an invalid plugin benchmark', () => {
    const bridge = new EvaluationPluginBridge(new BenchmarkRegistry());
    const bad: EvaluationPlugin = {
      manifest: { name: 'p', version: '1', apiVersion: '1' },
      benchmark: { name: '', version: '1' },
    };
    expect(isErr(bridge.adopt([bad]))).toBe(true);
  });
  it('fails closed on a duplicate name within a batch', () => {
    const bridge = new EvaluationPluginBridge(new BenchmarkRegistry());
    expect(isErr(bridge.adopt([plugin('same'), plugin('same')]))).toBe(true);
  });
  it('fails closed on a name already registered', () => {
    const registry = new BenchmarkRegistry();
    registry.register({ name: 'taken', version: '1', values: [] });
    expect(isErr(new EvaluationPluginBridge(registry).adopt([plugin('taken')]))).toBe(true);
  });
});

describe('EvaluationAuditManager', () => {
  it('deduplicates by identity and bounds the returned trail', () => {
    const audit = new EvaluationAuditManager();
    const hash = new EvaluationHash();
    expect(audit.record('a', 'accepted', 0)).toBe(true);
    expect(audit.record('a', 'accepted', 0)).toBe(false);
    expect(audit.record('b', 'withheld', 1)).toBe(true);
    expect(audit.count).toBe(2);
    expect(audit.audit(hash, 256).entries).toHaveLength(2);
    expect(audit.audit(hash, 1).entries).toHaveLength(1);
  });
});

describe('EvaluationMetrics', () => {
  it('counts evaluations by verdict and duplicates', () => {
    const metrics = new EvaluationMetrics();
    metrics.recordEvaluation('accepted');
    metrics.recordEvaluation('withheld');
    metrics.recordDuplicate();
    expect(metrics.statistics()).toEqual({
      evaluations: 2,
      accepted: 1,
      withheld: 1,
      duplicates: 1,
    });
  });
});

describe('EvaluationConfiguration', () => {
  it('applies defaults, clamps a non-finite override, and clamps an over-max override', () => {
    expect(new EvaluationConfiguration().settings.historyLimit).toBe(DEFAULT_SETTINGS.historyLimit);
    expect(new EvaluationConfiguration({ historyLimit: Number.NaN }).settings.historyLimit).toBe(
      DEFAULT_SETTINGS.historyLimit,
    );
    expect(new EvaluationConfiguration({ historyLimit: 1e9 }).settings.historyLimit).toBe(4096);
  });
});

describe('helpers', () => {
  it('normalizes names', () => {
    expect(new EvaluationNormalizer().normalize('  A  B  ')).toBe('a b');
  });
  it('recognizes known subject kinds only', () => {
    expect(isSubjectKind('reasoning')).toBe(true);
    expect(isSubjectKind('bogus')).toBe(false);
    expect(SUBJECT_KINDS).toContain('agent');
  });
  it('exposes the frozen lifecycle phases through the model', () => {
    expect(EVALUATION_LIFECYCLE_PHASES[0]).toBe('framing');
  });
  it('builds a DI module that registers under the token', () => {
    const module = evaluationEngineModule(manager());
    expect(module.name).toBe('evaluation-engine');
  });
});
