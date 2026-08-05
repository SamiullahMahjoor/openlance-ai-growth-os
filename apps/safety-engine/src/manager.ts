import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { SafetyConfiguration } from './configuration.js';
import type { SafetyPolicy } from './configuration.js';
import type { SafetyError } from './errors.js';
import { SafetyEvaluator } from './evaluator.js';
import { SafetyEvents } from './events.js';
import { SafetyFactory } from './factory.js';
import { HazardAnalyzer } from './hazard-analyzer.js';
import { SafetyHash } from './hash.js';
import { IsolationManager } from './isolation-manager.js';
import { SafetyMetrics } from './metrics.js';
import { resolveEffectivePolicy } from './policy.js';
import { SafetyRuleRegistry } from './registry.js';
import { RiskAnalyzer } from './risk-analyzer.js';
import { RuntimeBoundaryEnforcer } from './runtime-boundary-enforcer.js';
import { SafeRefusalEngine } from './safe-refusal-engine.js';
import { SanitizationEngine } from './sanitization-engine.js';
import type {
  SafetyDecision,
  SafetyDiagnostics,
  SafetyRuleInput,
  SafetyRequest,
  SafetyStatistics,
} from './types.js';

/** The options a {@link SafetyManager} is constructed from. */
export interface SafetyManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly policy?: Partial<SafetyPolicy>;
}

/**
 * The Safety Engine facade and DI entry. It composes the rule registry, factory, evaluator (hazard analysis, risk
 * classification, the protective responders, and the content hash), metrics, events, and configuration into one
 * operational subsystem, and exposes the engine's operations: register a policy rule, decide a request into an immutable
 * safety decision, remove a rule, and read statistics and diagnostics. It applies the frozen safety model, protects and
 * stops, and executes nothing.
 */
export class SafetyManager {
  readonly #registry: SafetyRuleRegistry;
  readonly #factory: SafetyFactory;
  readonly #evaluator: SafetyEvaluator;
  readonly #metrics: SafetyMetrics;
  readonly #events: SafetyEvents;
  readonly #configuration: SafetyConfiguration;

  constructor(options: SafetyManagerOptions) {
    this.#registry = new SafetyRuleRegistry();
    this.#factory = new SafetyFactory();
    this.#evaluator = new SafetyEvaluator(
      new HazardAnalyzer(),
      new RiskAnalyzer(),
      new SanitizationEngine(),
      new RuntimeBoundaryEnforcer(),
      new IsolationManager(),
      new SafeRefusalEngine(),
      new SafetyHash(),
    );
    this.#metrics = new SafetyMetrics();
    this.#events = new SafetyEvents(options.bus, options.clock);
    this.#configuration = new SafetyConfiguration(options.policy);
  }

  /** Register a safety policy rule; emits a `registered` event, fail closed. */
  async register(input: SafetyRuleInput): Promise<Result<string, SafetyError>> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    await this.#events.registered(created.value.name);
    return ok(created.value.name);
  }

  /** Remove a registered rule; returns whether one was removed. */
  remove(name: string): boolean {
    return this.#registry.unregister(name);
  }

  /**
   * Decide a request into an immutable safety decision; emits a `decided` event. It protects and stops; it invokes no
   * engine, selects no provider, and executes nothing. It never throws: an unsafe plan is a governed decision.
   */
  async decide(request: SafetyRequest): Promise<SafetyDecision> {
    this.#metrics.recordEvaluation();
    const policy = resolveEffectivePolicy(this.#configuration.policy, this.#registry.list());
    const decision = this.#evaluator.evaluate(request, policy);
    this.#metrics.recordOutcome(decision.outcome);
    await this.#events.decided(decision.subject, decision.outcome);
    return decision;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): SafetyStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): SafetyDiagnostics {
    const diagnostics: SafetyDiagnostics = {
      ruleCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
