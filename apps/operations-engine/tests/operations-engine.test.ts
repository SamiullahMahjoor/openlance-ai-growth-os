import { createEventBus } from '@openlance/aios-events';
import { isErr, isOk } from '@openlance/aios-kernel';
import type {
  ExecutionRecord,
  ExecutionStatistics,
  StepResult,
} from '@openlance/aios-runtime-execution-engine';
import type { RuntimeEvent } from '@openlance/aios-runtime';
import { describe, expect, it } from 'vitest';

import {
  AlertManager,
  AlertRouter,
  AlertSuppressor,
  CapacityManager,
  DashboardBuilder,
  DEFAULT_SETTINGS,
  DiagnosticsManager,
  HealthAggregator,
  HealthManager,
  IncidentCorrelationEngine,
  IncidentManager,
  MaintenanceManager,
  MetricsAggregator,
  MetricsCollector,
  OperationalAuditManager,
  OperationsConfiguration,
  OperationsHash,
  OperationsManager,
  OperationsMetrics,
  OperationsNormalizer,
  OperationsPluginBridge,
  OperationsPolicyFactory,
  OperationsPolicyRegistry,
  TelemetryAggregator,
  TelemetryCollector,
  TrendAnalyzer,
  operationsEngineModule,
} from '../src/index';
import type {
  Observation,
  OperationalFacts,
  OperationalMetrics,
  OperationsSettings,
} from '../src/index';

const clock = { now: () => 0 };
const engine = (settings?: Partial<OperationsSettings>) =>
  new OperationsManager({ clock, bus: createEventBus(), settings });

const step = (o: Partial<StepResult> = {}): StepResult => ({
  index: 0,
  capability: 'tool',
  status: 'succeeded',
  attempts: 1,
  detail: '',
  ...o,
});

const record = (o: Partial<ExecutionRecord> = {}): ExecutionRecord => ({
  executionId: 'exec-1',
  terminal: 'completed',
  terminalEvent: 'execution-completed',
  steps: [step()],
  path: ['created', 'closed'],
  startedAt: 0,
  finishedAt: 1,
  governance: 'gov-1',
  safety: 'saf-1',
  reason: 'ok',
  validated: true,
  ...o,
});

let seq = 0;
const recordObs = (o: Partial<ExecutionRecord> = {}, id?: string): Observation => ({
  kind: 'record',
  id: id ?? `obs-${(seq += 1)}`,
  record: record(o),
});
const eventObs = (event: RuntimeEvent, id?: string): Observation => ({
  kind: 'event',
  id: id ?? `obs-${(seq += 1)}`,
  executionId: 'exec-1',
  event,
  at: 0,
});
const statsObs = (o: Partial<ExecutionStatistics> = {}, id?: string): Observation => ({
  kind: 'statistics',
  id: id ?? `obs-${(seq += 1)}`,
  statistics: {
    executions: 1,
    completed: 1,
    failed: 0,
    cancelled: 0,
    stepsRun: 1,
    retries: 0,
    ...o,
  },
  at: 0,
});

const metricsOf = (o: Partial<OperationalMetrics> = {}): OperationalMetrics => ({
  executions: 0,
  completed: 0,
  failed: 0,
  cancelled: 0,
  stepsRun: 0,
  retries: 0,
  recoveries: 0,
  timeouts: 0,
  unknown: 0,
  failureRatio: 0,
  id: 'm',
  ...o,
});

describe('OperationsHash / OperationsNormalizer', () => {
  it('hashes deterministically and normalizes structurally', () => {
    const hash = new OperationsHash();
    expect(hash.hash('abc')).toBe(hash.hash('abc'));
    expect(hash.hash('abc')).not.toBe(hash.hash('abd'));
    expect(new OperationsNormalizer().normalize('  Foo  BAR ')).toBe('foo bar');
  });
});

describe('OperationsConfiguration', () => {
  it('defaults and clamps thresholds and bounds', () => {
    expect(new OperationsConfiguration().settings).toEqual(DEFAULT_SETTINGS);
    expect(
      new OperationsConfiguration({ failedThreshold: 2, alertThreshold: -1, historyLimit: 0 })
        .settings,
    ).toMatchObject({ failedThreshold: 1, alertThreshold: 0, historyLimit: 1 });
    expect(
      new OperationsConfiguration({
        failedThreshold: Number.NaN,
        historyLimit: Number.POSITIVE_INFINITY,
      }).settings,
    ).toMatchObject({
      failedThreshold: DEFAULT_SETTINGS.failedThreshold,
      historyLimit: DEFAULT_SETTINGS.historyLimit,
    });
    expect(new OperationsConfiguration({ historyLimit: 1e9 }).settings.historyLimit).toBe(4096);
  });
});

describe('telemetry', () => {
  const collector = new TelemetryCollector();
  it('extracts facts from a record, an unknown event, a known event, and a statistics snapshot', () => {
    const facts = collector.collect(
      recordObs({
        terminal: 'failed',
        steps: [step({ attempts: 3 }), step({ index: 1, detail: 'deadline exceeded' })],
        path: ['created', 'executing', 'recovering', 'failed', 'closed'],
      }),
    );
    expect(facts).toMatchObject({
      executions: 1,
      failed: 1,
      stepsRun: 2,
      retries: 2,
      recoveries: 1,
      timeouts: 1,
    });
    expect(collector.collect(eventObs('not-real' as RuntimeEvent)).unknown).toBe(1);
    expect(collector.collect(eventObs('execution-started')).unknown).toBe(0);
    expect(collector.collect(statsObs()).executions).toBe(0);
  });

  it('aggregates facts into running totals', () => {
    const aggregator = new TelemetryAggregator();
    const facts: OperationalFacts = {
      executions: 1,
      completed: 1,
      failed: 0,
      cancelled: 0,
      stepsRun: 2,
      retries: 1,
      recoveries: 0,
      timeouts: 0,
      unknown: 0,
    };
    aggregator.record(facts);
    aggregator.record(facts);
    expect(aggregator.totals()).toMatchObject({ executions: 2, stepsRun: 4, retries: 2 });
  });
});

describe('metrics', () => {
  it('computes the failure ratio and builds immutable metrics', () => {
    const collector = new MetricsCollector();
    expect(
      collector.failureRatio({ completed: 0, failed: 0, cancelled: 0 } as OperationalFacts),
    ).toBe(0);
    expect(
      collector.failureRatio({ completed: 1, failed: 1, cancelled: 0 } as OperationalFacts),
    ).toBe(0.5);
    const built = new MetricsAggregator(collector, new OperationsHash()).build({
      executions: 2,
      completed: 1,
      failed: 1,
      cancelled: 0,
      stepsRun: 2,
      retries: 0,
      recoveries: 0,
      timeouts: 0,
      unknown: 0,
    });
    expect(built.failureRatio).toBe(0.5);
    expect(built.id).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('health', () => {
  const manager = new HealthManager();
  it('applies the frozen states, fail-closed', () => {
    expect(manager.assess(metricsOf({ completed: 0 }), 0.5).state).toBe('degraded');
    expect(manager.assess(metricsOf({ completed: 1, failureRatio: 0 }), 0.5).state).toBe('healthy');
    expect(
      manager.assess(metricsOf({ completed: 2, failed: 1, failureRatio: 0.6 }), 0.5).state,
    ).toBe('failed');
    expect(manager.assess(metricsOf({ completed: 1, unknown: 1 }), 0.5).state).toBe('degraded');
    expect(
      manager.assess(metricsOf({ completed: 3, failed: 1, failureRatio: 0.25 }), 0.5).state,
    ).toBe('degraded');
  });

  it('aggregates the worst component health and reports history', () => {
    const aggregator = new HealthAggregator();
    expect(aggregator.worst([])).toBe('degraded');
    expect(aggregator.worst(['healthy', 'failed', 'degraded'])).toBe('failed');
    aggregator.record('healthy', 2);
    aggregator.record('degraded', 2);
    aggregator.record('failed', 2);
    const report = aggregator.report({ state: 'failed', reason: 'r' }, new OperationsHash());
    expect(report.history).toEqual(['degraded', 'failed']);
    expect(report.state).toBe('failed');
  });
});

describe('incident', () => {
  it('correlates, opens, and transitions with validation', () => {
    const incidents = new IncidentManager();
    expect(incidents.recognize('k', 'critical', 'boom')).toBe(true);
    expect(incidents.recognize('k', 'critical', 'boom')).toBe(false); // correlated
    expect(incidents.openCount).toBe(1);
    expect(incidents.report(new OperationsHash()).incidents[0]?.occurrences).toBe(2);
    expect(isErr(incidents.transition('missing', 'closed'))).toBe(true);
    expect(isErr(incidents.transition('k', 'resolved'))).toBe(true); // illegal from open
    expect(isOk(incidents.transition('k', 'acknowledged'))).toBe(true);
    expect(isOk(incidents.transition('k', 'closed'))).toBe(true);
    expect(incidents.openCount).toBe(0);
    // a new disruption on a closed key opens a fresh incident
    expect(incidents.recognize('k', 'warning', 'again')).toBe(true);
  });

  it('correlation engine finds only active incidents', () => {
    const correlation = new IncidentCorrelationEngine();
    const map = new Map([
      [
        'k',
        {
          key: 'k',
          state: 'open' as const,
          severity: 'info' as const,
          occurrences: 1,
          reason: 'r',
        },
      ],
    ]);
    expect(correlation.correlate('k', map)).toBeDefined();
    expect(correlation.correlate('missing', map)).toBeUndefined();
    map.set('c', {
      key: 'c',
      state: 'closed' as const,
      severity: 'info' as const,
      occurrences: 1,
      reason: 'r',
    });
    expect(correlation.correlate('c', map)).toBeUndefined();
  });
});

describe('alert', () => {
  it('routes, suppresses, raises, and clears', () => {
    const router = new AlertRouter();
    expect([router.route('info'), router.route('warning'), router.route('critical')]).toEqual([
      'digest',
      'operations',
      'on-call',
    ]);
    const suppressor = new AlertSuppressor();
    expect(suppressor.suppressed('k', new Set())).toBe(false);
    expect(suppressor.suppressed('k', new Set(['k']))).toBe(true);
    suppressor.activate('k');
    expect(suppressor.suppressed('k', new Set())).toBe(true);
    suppressor.clear('k');
    expect(suppressor.suppressed('k', new Set())).toBe(false);

    const alerts = new AlertManager();
    expect(alerts.evaluate(0.5, 0.2, 'critical', new Set())).toBe(true);
    expect(alerts.evaluate(0.5, 0.2, 'critical', new Set())).toBe(false); // suppressed while active
    expect(alerts.activeCount).toBe(1);
    expect(alerts.alerts(new OperationsHash())[0]?.route).toBe('on-call');
    expect(alerts.evaluate(0.1, 0.2, 'warning', new Set())).toBe(false); // condition cleared
    expect(alerts.activeCount).toBe(0);
    expect(alerts.evaluate(0.9, 0.2, 'critical', new Set(['high-failure-ratio']))).toBe(false); // muted
  });
});

describe('capacity / trend / diagnostics', () => {
  it('reports capacity bottlenecks', () => {
    const capacity = new CapacityManager();
    const hash = new OperationsHash();
    expect(capacity.report(metricsOf({ failureRatio: 0.6 }), hash).bottleneck).toBe('failures');
    expect(capacity.report(metricsOf({ executions: 1, retries: 3 }), hash).bottleneck).toBe(
      'retries',
    );
    expect(capacity.report(metricsOf({ executions: 1 }), hash).bottleneck).toBe('none');
  });

  it('reports metric trends', () => {
    const trend = new TrendAnalyzer();
    expect(trend.trend()).toBe('stable');
    trend.record(0.1);
    trend.record(0.5);
    expect(trend.trend()).toBe('rising');
    const falling = new TrendAnalyzer();
    falling.record(0.5);
    falling.record(0.1);
    expect(falling.trend()).toBe('falling');
    const stable = new TrendAnalyzer();
    stable.record(0.2);
    stable.record(0.2);
    expect(stable.trend()).toBe('stable');
  });

  it('builds operational diagnostics', () => {
    const diagnostics = new DiagnosticsManager().diagnose(
      'degraded',
      metricsOf({ retries: 2 }),
      new OperationsHash(),
    );
    expect(diagnostics).toMatchObject({ health: 'degraded', retries: 2 });
  });
});

describe('maintenance', () => {
  it('plans over frozen categories and transitions with validation', () => {
    const maintenance = new MaintenanceManager();
    expect(isErr(maintenance.plan('  ', 'corrective', 's'))).toBe(true);
    expect(isErr(maintenance.plan('m', 'bogus' as never, 's'))).toBe(true);
    expect(isOk(maintenance.plan('m', 'preventive', 's'))).toBe(true);
    expect(isErr(maintenance.plan('m', 'preventive', 's'))).toBe(true); // duplicate
    expect(isErr(maintenance.transition('missing', 'approved'))).toBe(true);
    expect(isErr(maintenance.transition('m', 'running'))).toBe(true); // illegal from planned
    expect(isOk(maintenance.transition('m', 'approved'))).toBe(true);
    expect(isOk(maintenance.transition('m', 'cancelled'))).toBe(true);
    expect(maintenance.plans(new OperationsHash()).activities[0]?.category).toBe('preventive');
  });
});

describe('audit / ops-metrics', () => {
  it('deduplicates observations and counts', () => {
    const audit = new OperationalAuditManager();
    expect(audit.record(recordObs({}, 'a'))).toBe(true);
    expect(audit.record(recordObs({}, 'a'))).toBe(false);
    expect(audit.record(eventObs('execution-started', 'b'))).toBe(true);
    expect(audit.count).toBe(2);
    expect(audit.audit(new OperationsHash()).entries).toHaveLength(2);
  });

  it('counts engine work', () => {
    const metrics = new OperationsMetrics();
    metrics.recordObservation();
    metrics.recordDuplicate();
    metrics.recordIncidentOpened();
    metrics.recordAlertRaised();
    expect(metrics.statistics()).toEqual({
      observations: 1,
      duplicates: 1,
      incidentsOpened: 1,
      alertsRaised: 1,
    });
  });
});

describe('policy factory / registry / plugin bridge', () => {
  const factory = new OperationsPolicyFactory();
  it('builds, registers, and adopts policies; fails closed', () => {
    expect(isErr(factory.create({ name: '  ' }))).toBe(true);
    expect(isErr(factory.create({ name: 'p', mutedAlerts: [' '] }))).toBe(true);
    const built = factory.create({ name: 'Mute It', mutedAlerts: ['High-Failure-Ratio'] });
    expect(isOk(built)).toBe(true);
    const registry = new OperationsPolicyRegistry();
    if (isOk(built)) registry.register(built.value);
    expect(registry.has('mute it')).toBe(true);
    expect([...registry.mutedAlerts()]).toEqual(['high-failure-ratio']);
    if (isOk(built)) expect(isErr(registry.register(built.value))).toBe(true);
    expect(registry.list()).toHaveLength(1);
    expect(registry.unregister('mute it')).toBe(true);

    const manifest = { name: 's', version: '1.0.0', apiVersion: '1.0.0' };
    const registry2 = new OperationsPolicyRegistry();
    const bridge = new OperationsPluginBridge(registry2);
    expect(
      isOk(
        bridge.adopt([
          { manifest, policy: { name: 'a' } },
          { manifest, policy: { name: 'b' } },
        ]),
      ),
    ).toBe(true);
    expect(isErr(bridge.adopt([{ manifest, policy: { name: '  ' } }]))).toBe(true);
    expect(
      isErr(
        bridge.adopt([
          { manifest, policy: { name: 'x' } },
          { manifest, policy: { name: 'x' } },
        ]),
      ),
    ).toBe(true);
    expect(isErr(bridge.adopt([{ manifest, policy: { name: 'a' } }]))).toBe(true);
    expect(registry2.list()).toHaveLength(2);
  });
});

describe('DashboardBuilder', () => {
  it('composes an immutable dashboard', () => {
    const status = {
      health: 'healthy' as const,
      openIncidents: 0,
      activeAlerts: 0,
      executions: 1,
      failureRatio: 0,
      id: 's',
    };
    const capacity = {
      executions: 1,
      stepsRun: 1,
      retries: 0,
      failureRatio: 0,
      bottleneck: 'none' as const,
      id: 'c',
    };
    const dashboard = new DashboardBuilder().build(
      {
        status,
        health: 'healthy',
        metrics: metricsOf({ executions: 1 }),
        incidents: 0,
        alerts: 0,
        capacity,
        trend: 'stable',
      },
      new OperationsHash(),
    );
    expect(dashboard.health).toBe('healthy');
    expect(Object.isFrozen(dashboard)).toBe(true);
  });
});

describe('OperationsManager (observation pipeline)', () => {
  it('is fail-closed before any observation and healthy after a clean run', async () => {
    const ops = engine();
    expect(ops.status().health).toBe('degraded');
    await ops.observe(recordObs({}, 'r1'));
    expect(ops.status().health).toBe('healthy');
    expect(ops.metrics().executions).toBe(1);
  });

  it('opens an incident, raises an alert, and degrades on a failed run', async () => {
    const ops = engine();
    await ops.observe(recordObs({ terminal: 'failed', reason: 'blew up' }, 'f1'));
    expect(ops.status().health).toBe('failed');
    expect(ops.incidents().open).toBe(1);
    expect(ops.alerts()).toHaveLength(1);
    expect(ops.statistics()).toMatchObject({
      observations: 1,
      incidentsOpened: 1,
      alertsRaised: 1,
    });
  });

  it('is idempotent: a duplicate observation changes nothing', async () => {
    const ops = engine();
    await ops.observe(recordObs({ terminal: 'failed' }, 'dup'));
    await ops.observe(recordObs({ terminal: 'failed' }, 'dup'));
    expect(ops.metrics().executions).toBe(1);
    expect(ops.incidents().open).toBe(1);
    expect(ops.statistics().duplicates).toBe(1);
  });

  it('fails closed on unknown telemetry (never healthy)', async () => {
    const ops = engine();
    await ops.observe(recordObs({}, 'ok'));
    await ops.observe(eventObs('not-real' as RuntimeEvent, 'bad'));
    expect(ops.status().health).toBe('degraded');
  });

  it('correlates failures sharing a governance id and separates distinct ones', async () => {
    const ops = engine();
    await ops.observe(recordObs({ terminal: 'failed', governance: 'g-a' }, 'a1'));
    await ops.observe(recordObs({ terminal: 'cancelled', governance: 'g-a' }, 'a2'));
    await ops.observe(recordObs({ terminal: 'failed', governance: 'g-b' }, 'b1'));
    expect(ops.incidents().open).toBe(2);
  });

  it('suppresses a duplicate alert while active and mutes via policy', async () => {
    const ops = engine();
    await ops.observe(recordObs({ terminal: 'failed' }, 'x1'));
    await ops.observe(recordObs({ terminal: 'failed', governance: 'g2' }, 'x2'));
    expect(ops.statistics().alertsRaised).toBe(1); // suppressed the second
    const muted = engine();
    expect(isOk(muted.register({ name: 'mute', mutedAlerts: ['high-failure-ratio'] }))).toBe(true);
    await muted.observe(recordObs({ terminal: 'failed' }, 'm1'));
    expect(muted.alerts()).toHaveLength(0);
  });

  it('exposes capacity, dashboard, diagnostics, maintenance, audit, and a statistics observation', async () => {
    const ops = engine();
    await ops.observe(recordObs({ steps: [step({ attempts: 4 })] }, 's1'));
    await ops.observe(statsObs({}, 'st1'));
    expect(ops.capacity().retries).toBe(3);
    expect(ops.dashboard().health).toBe('healthy');
    expect(ops.operationalDiagnostics().retries).toBe(3);
    expect(ops.audit().entries).toHaveLength(2);
    expect(isOk(ops.planMaintenance('win', 'preventive', 'patch'))).toBe(true);
    expect(isOk(ops.transitionMaintenance('win', 'approved'))).toBe(true);
    expect(ops.maintenance().activities[0]?.state).toBe('approved');
    const badTransition = ops.transitionIncident('missing', 'closed');
    expect(isErr(badTransition)).toBe(true);
    if (isErr(badTransition)) expect(badTransition.error.code).toBe('OPERATIONS.UNKNOWN_INCIDENT');
    expect(ops.diagnostics().policyCount).toBe(0);
    expect(ops.remove('nope')).toBe(false);
  });

  it('does not let a metric-inert statistics or event observation flatten the trend (F1)', async () => {
    const ops = engine();
    await ops.observe(recordObs({}, 'tr1')); // completed -> failure ratio 0
    await ops.observe(recordObs({ terminal: 'failed' }, 'tr2')); // failed -> failure ratio rises
    expect(ops.dashboard().trend).toBe('rising');
    await ops.observe(statsObs({}, 'trs')); // heartbeat: must not flatten
    await ops.observe(eventObs('execution-started', 'tre')); // liveness: must not flatten
    expect(ops.dashboard().trend).toBe('rising');
  });

  it('never throws on a structurally-malformed record (zero trust, F2)', async () => {
    const ops = engine();
    const malformed = {
      kind: 'record',
      id: 'bad',
      record: {
        executionId: 'e',
        terminal: 'failed',
        terminalEvent: 'execution-failed',
        startedAt: 0,
        finishedAt: 1,
        governance: 'g',
        safety: 's',
        reason: 'r',
        validated: true,
      },
    } as unknown as Observation;
    await expect(ops.observe(malformed)).resolves.toBeUndefined();
    expect(ops.metrics().failed).toBe(1);
    expect(ops.metrics().stepsRun).toBe(0);
  });

  it('registers policies and fails closed on an invalid or duplicate policy', () => {
    const ops = engine();
    expect(isErr(ops.register({ name: '  ' }))).toBe(true);
    expect(isOk(ops.register({ name: 'p', mutedAlerts: ['high-failure-ratio'] }))).toBe(true);
    const duplicate = ops.register({ name: 'p' });
    expect(isErr(duplicate)).toBe(true);
    if (isErr(duplicate)) expect(duplicate.error.code).toBe('OPERATIONS.DUPLICATE_POLICY');
    expect(ops.diagnostics().policyCount).toBe(1);
    expect(ops.remove('p')).toBe(true);
  });

  it('is deterministic across two engines with the same observation sequence', async () => {
    const build = async () => {
      const ops = engine();
      await ops.observe(recordObs({ terminal: 'failed' }, 'd1'));
      await ops.observe(recordObs({}, 'd2'));
      return ops;
    };
    const a = await build();
    const b = await build();
    expect(a.status().id).toBe(b.status().id);
    expect(a.dashboard().id).toBe(b.dashboard().id);
    expect(a.health().id).toBe(b.health().id);
  });

  it('handles a large observation stream (stress)', async () => {
    const ops = engine();
    for (let i = 0; i < 60; i += 1) {
      await ops.observe(recordObs({ terminal: i % 5 === 0 ? 'failed' : 'completed' }, `s-${i}`));
    }
    expect(ops.metrics().executions).toBe(60);
    expect(ops.status().health).toBe('degraded');
  });

  it('processes concurrent observations consistently and isolates engine instances (concurrency)', async () => {
    const ops = engine();
    await Promise.all([
      ops.observe(recordObs({}, 'c1')),
      ops.observe(recordObs({}, 'c2')),
      ops.observe(recordObs({}, 'c1')), // a concurrent duplicate is still deduplicated
    ]);
    expect(ops.metrics().executions).toBe(2);
    expect(ops.statistics().duplicates).toBe(1);
    const other = engine();
    await other.observe(recordObs({ terminal: 'failed' }, 'x'));
    expect(ops.metrics().failed).toBe(0); // instances share no state
    expect(other.metrics().failed).toBe(1);
  });
});

describe('module seam', () => {
  it('produces a registrable DI module', () => {
    const module = operationsEngineModule(engine());
    expect(module.name).toBe('operations-engine');
    const tokens: unknown[] = [];
    module.register({ register: (token: unknown) => tokens.push(token) } as never);
    expect(tokens).toHaveLength(1);
  });
});
