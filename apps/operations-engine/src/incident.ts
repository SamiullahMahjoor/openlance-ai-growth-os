import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { OperationsError } from './errors.js';
import type { OperationsHash } from './hash.js';
import type { Incident, IncidentReport, IncidentState, OperationalSeverity } from './types.js';

/** The realized incident lifecycle transitions (grounded in the frozen "from recognition to closure" lifecycle). */
const INCIDENT_TRANSITIONS: Readonly<Record<IncidentState, readonly IncidentState[]>> =
  Object.freeze({
    open: ['acknowledged', 'closed'],
    acknowledged: ['investigating', 'closed'],
    investigating: ['mitigated', 'closed'],
    mitigated: ['resolved', 'closed'],
    resolved: ['closed'],
    closed: [],
  });

interface MutableIncident {
  readonly key: string;
  state: IncidentState;
  severity: OperationalSeverity;
  occurrences: number;
  reason: string;
}

/**
 * The incident correlation engine: given a disruption key, it finds the existing active (not closed) incident that key
 * correlates to, so repeated failures sharing an upstream key become one incident rather than many. It correlates only;
 * it opens and transitions nothing.
 */
export class IncidentCorrelationEngine {
  /** The active incident an occurrence of `key` correlates to, or `undefined` for a new disruption. */
  correlate(
    key: string,
    incidents: ReadonlyMap<string, MutableIncident>,
  ): MutableIncident | undefined {
    const existing = incidents.get(key);
    return existing !== undefined && existing.state !== 'closed' ? existing : undefined;
  }
}

/**
 * The incident manager: it recognizes an operational incident from a disruption, correlates repeated disruptions into one
 * incident, and drives the realized incident lifecycle (`open` to `closed`) with validated transitions. An incident is a
 * discrete operational disruption, classified by severity; managing it is inert - it reports and, where safety is
 * implied, defers the protective response to `ai/safety/` and any governed decision to `ai/governance/`, and never itself
 * protects, degrades, or decides (the frozen incident-management invariants). It opens and transitions only; it executes
 * nothing.
 */
export class IncidentManager {
  readonly #byKey = new Map<string, MutableIncident>();
  readonly #correlation = new IncidentCorrelationEngine();

  /** Recognize a disruption: correlate it into the active incident or open a new one; returns whether one was opened. */
  recognize(key: string, severity: OperationalSeverity, reason: string): boolean {
    const existing = this.#correlation.correlate(key, this.#byKey);
    if (existing !== undefined) {
      existing.occurrences += 1;
      return false;
    }
    this.#byKey.set(key, { key, state: 'open', severity, occurrences: 1, reason });
    return true;
  }

  /** Transition an incident along its realized lifecycle; fails closed on an unknown incident or an illegal move. */
  transition(key: string, to: IncidentState): Result<void, OperationsError> {
    const incident = this.#byKey.get(key);
    if (incident === undefined) {
      return err(
        new OperationsError(
          'OPERATIONS.UNKNOWN_INCIDENT',
          `No incident is tracked for key '${key}'.`,
          {
            key,
          },
        ),
      );
    }
    if (!INCIDENT_TRANSITIONS[incident.state].includes(to)) {
      return err(
        new OperationsError(
          'OPERATIONS.ILLEGAL_INCIDENT_TRANSITION',
          `An incident transition from '${incident.state}' to '${to}' is not permitted.`,
          { from: incident.state, to },
        ),
      );
    }
    incident.state = to;
    return ok(undefined);
  }

  /** The number of active (not closed) incidents. */
  get openCount(): number {
    let open = 0;
    for (const incident of this.#byKey.values()) {
      if (incident.state !== 'closed') {
        open += 1;
      }
    }
    return open;
  }

  /** Build the immutable incident report, in registration order. */
  report(hash: OperationsHash): IncidentReport {
    const incidents: Incident[] = [];
    for (const incident of this.#byKey.values()) {
      const canonical = JSON.stringify([
        incident.key,
        incident.state,
        incident.severity,
        incident.occurrences,
        incident.reason,
      ]);
      incidents.push(
        Object.freeze({
          key: incident.key,
          state: incident.state,
          severity: incident.severity,
          occurrences: incident.occurrences,
          reason: incident.reason,
          id: hash.hash(canonical),
        }),
      );
    }
    return Object.freeze({
      incidents: Object.freeze(incidents),
      open: this.openCount,
      id: hash.hash(JSON.stringify(incidents.map((incident) => incident.id))),
    });
  }
}
