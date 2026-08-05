import type { OperationsHash } from './hash.js';
import type { OperationalAlert, OperationalSeverity } from './types.js';

/** The route each severity is directed to (operational routing; the engine names no alerting platform). */
const ROUTE: Readonly<Record<OperationalSeverity, string>> = Object.freeze({
  info: 'digest',
  warning: 'operations',
  critical: 'on-call',
});

/**
 * The alert router: it directs an alert to a route by its severity. It routes only; it generates and suppresses nothing,
 * and it names no alerting platform or delivery mechanism.
 */
export class AlertRouter {
  /** The route for a severity. */
  route(severity: OperationalSeverity): string {
    return ROUTE[severity];
  }
}

/**
 * The alert suppressor: it tracks which alert keys are currently active and which are operator-muted, so a duplicate
 * alert is suppressed while an equivalent one is active (idempotency) and a muted alert is never raised. It suppresses
 * only; it generates and routes nothing.
 */
export class AlertSuppressor {
  readonly #active = new Set<string>();

  /** Whether an alert for `key` is suppressed: already active, or muted by policy. */
  suppressed(key: string, muted: ReadonlySet<string>): boolean {
    return this.#active.has(key) || muted.has(key);
  }

  /** Mark an alert key active. */
  activate(key: string): void {
    this.#active.add(key);
  }

  /** Clear an alert key (its condition no longer holds). */
  clear(key: string): void {
    this.#active.delete(key);
  }
}

interface ActiveAlert {
  readonly key: string;
  readonly severity: OperationalSeverity;
  readonly route: string;
  readonly reason: string;
}

/**
 * The alert manager: it monitors the failure ratio against the alert threshold and, on a breach, generates an alert
 * (routed by severity), suppressing a duplicate while an equivalent alert is active or muted by policy. When the
 * condition clears, the alert is cleared. It generates and reports operational alerts; it never protects, escalates as
 * protection, or decides (an operational alert is not a safety escalation, deferred to `ai/safety/`), and it executes
 * nothing.
 */
export class AlertManager {
  readonly #router = new AlertRouter();
  readonly #suppressor = new AlertSuppressor();
  readonly #active = new Map<string, ActiveAlert>();

  /** Evaluate the failure ratio against the threshold; returns whether a new alert was raised. */
  evaluate(
    failureRatio: number,
    alertThreshold: number,
    severity: OperationalSeverity,
    muted: ReadonlySet<string>,
  ): boolean {
    const key = 'high-failure-ratio';
    if (failureRatio <= alertThreshold) {
      this.#suppressor.clear(key);
      this.#active.delete(key);
      return false;
    }
    if (this.#suppressor.suppressed(key, muted)) {
      return false;
    }
    this.#suppressor.activate(key);
    this.#active.set(key, {
      key,
      severity,
      route: this.#router.route(severity),
      reason: `The failure ratio ${failureRatio} exceeds the alert threshold ${alertThreshold}.`,
    });
    return true;
  }

  /** The number of active alerts. */
  get activeCount(): number {
    return this.#active.size;
  }

  /** The immutable active alerts, in registration order. */
  alerts(hash: OperationsHash): readonly OperationalAlert[] {
    const alerts: OperationalAlert[] = [];
    for (const alert of this.#active.values()) {
      const canonical = JSON.stringify([alert.key, alert.severity, alert.route, alert.reason]);
      alerts.push(Object.freeze({ ...alert, id: hash.hash(canonical) }));
    }
    return Object.freeze(alerts);
  }
}
