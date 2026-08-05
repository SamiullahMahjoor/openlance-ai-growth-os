import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';
import type { EventBus } from '@openlance/aios-events';

import { AutonomyEvaluator } from './autonomy-evaluator.js';
import { GovernanceConfiguration } from './configuration.js';
import type { GovernanceEngineSettings } from './configuration.js';
import { ConstitutionalValidator } from './constitutional-validator.js';
import type { GovernanceError } from './errors.js';
import { GovernanceEvaluator } from './evaluator.js';
import { GovernanceEvents } from './events.js';
import { GovernanceFactory } from './factory.js';
import { GovernanceHash } from './hash.js';
import { GovernanceMetrics } from './metrics.js';
import { OversightEvaluator } from './oversight-evaluator.js';
import { PermissionEvaluator } from './permission-evaluator.js';
import { GovernanceRegistry } from './registry.js';
import type {
  GovernanceDecision,
  GovernanceDiagnostics,
  GovernanceGrantInput,
  GovernanceId,
  GovernanceRequest,
  GovernanceStatistics,
} from './types.js';

/** The options a {@link GovernanceManager} is constructed from. */
export interface GovernanceManagerOptions {
  readonly clock: Clock;
  readonly bus: EventBus;
  readonly settings?: Partial<GovernanceEngineSettings>;
}

/**
 * The Governance Enforcement Engine facade and DI entry. It composes the registry, factory, evaluator (permission,
 * constitutional, autonomy, oversight, hash), metrics, events, and configuration into one operational subsystem, and
 * exposes the engine's operations: register a grant, decide a request into an immutable governance decision, remove a
 * grant, and read statistics and diagnostics. It applies the frozen governance model, authorizes and stops, and executes
 * nothing.
 */
export class GovernanceManager {
  readonly #registry: GovernanceRegistry;
  readonly #factory: GovernanceFactory;
  readonly #evaluator: GovernanceEvaluator;
  readonly #metrics: GovernanceMetrics;
  readonly #events: GovernanceEvents;
  readonly #configuration: GovernanceConfiguration;

  constructor(options: GovernanceManagerOptions) {
    this.#registry = new GovernanceRegistry();
    this.#factory = new GovernanceFactory();
    this.#evaluator = new GovernanceEvaluator(
      new PermissionEvaluator(),
      new ConstitutionalValidator(),
      new AutonomyEvaluator(),
      new OversightEvaluator(),
      new GovernanceHash(),
    );
    this.#metrics = new GovernanceMetrics();
    this.#events = new GovernanceEvents(options.bus, options.clock);
    this.#configuration = new GovernanceConfiguration(options.settings);
  }

  /** Register a governance grant; emits a `registered` event, fail closed. */
  async register(input: GovernanceGrantInput): Promise<Result<GovernanceId, GovernanceError>> {
    const created = this.#factory.create(input);
    if (isErr(created)) {
      return err(created.error);
    }
    const registered = this.#registry.register(created.value);
    if (isErr(registered)) {
      return err(registered.error);
    }
    this.#metrics.recordRegistration();
    await this.#events.registered(created.value.subject);
    return ok(created.value.subject);
  }

  /** Remove a registered grant; returns whether one was removed. */
  remove(subject: GovernanceId): boolean {
    return this.#registry.unregister(subject);
  }

  /**
   * Decide a request into an immutable governance decision; emits a `decided` event. It authorizes and stops; it invokes
   * no engine and executes nothing. It never throws: an unauthorized request is a governed `DENY`, `REQUIRE_APPROVAL`, or
   * `ESCALATE` decision.
   */
  async decide(request: GovernanceRequest): Promise<GovernanceDecision> {
    this.#metrics.recordEvaluation();
    const decision = this.#evaluator.evaluate(
      request,
      this.#registry,
      this.#configuration.settings.requireExplicitApproval,
    );
    if (decision.decision === 'AUTHORIZE') {
      this.#metrics.recordAuthorized();
    } else if (decision.decision === 'DENY') {
      this.#metrics.recordDenied();
    } else if (decision.decision === 'REQUIRE_APPROVAL') {
      this.#metrics.recordApprovalRequired();
    } else {
      this.#metrics.recordEscalated();
    }
    await this.#events.decided(decision.subject, decision.decision);
    return decision;
  }

  /** A frozen operational statistics snapshot. */
  statistics(): GovernanceStatistics {
    return this.#metrics.statistics();
  }

  /** A frozen operational diagnostics view. */
  diagnostics(): GovernanceDiagnostics {
    const diagnostics: GovernanceDiagnostics = {
      grantCount: this.#registry.list().length,
      statistics: this.#metrics.statistics(),
    };
    return Object.freeze(diagnostics);
  }
}
