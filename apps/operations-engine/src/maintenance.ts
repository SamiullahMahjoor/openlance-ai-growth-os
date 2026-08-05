import { MAINTENANCE_CATEGORIES } from '@openlance/aios-operations';
import type { MaintenanceCategory } from '@openlance/aios-operations';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { OperationsError } from './errors.js';
import type { OperationsHash } from './hash.js';
import type { MaintenanceActivity, MaintenancePlan, MaintenanceState } from './types.js';

/** The realized maintenance-activity lifecycle transitions (grounded in the frozen "from plan to completion" lifecycle). */
const MAINTENANCE_TRANSITIONS: Readonly<Record<MaintenanceState, readonly MaintenanceState[]>> =
  Object.freeze({
    planned: ['approved', 'cancelled'],
    approved: ['scheduled', 'cancelled'],
    scheduled: ['running', 'cancelled'],
    running: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  });

interface MutableMaintenance {
  readonly key: string;
  readonly category: MaintenanceCategory;
  readonly summary: string;
  state: MaintenanceState;
}

/**
 * The maintenance manager: it plans a maintenance activity in one of the frozen `MAINTENANCE_CATEGORIES` (`corrective`,
 * `preventive`, `adaptive`) and drives its realized lifecycle (`planned` to `completed`, or `cancelled`) with validated
 * transitions. A maintenance activity keeps operation in good order and never changes the behavior of a namespace;
 * maintaining is inert. It plans and transitions only; it carries out no maintenance and executes nothing.
 */
export class MaintenanceManager {
  readonly #byKey = new Map<string, MutableMaintenance>();

  /** Plan a maintenance activity; fails closed on a blank key, an unknown category, or a duplicate key. */
  plan(key: string, category: MaintenanceCategory, summary: string): Result<void, OperationsError> {
    if (key.trim() === '') {
      return err(
        new OperationsError(
          'OPERATIONS.BLANK_MAINTENANCE_KEY',
          'A maintenance activity has a blank key.',
          {},
        ),
      );
    }
    if (!MAINTENANCE_CATEGORIES.includes(category)) {
      return err(
        new OperationsError(
          'OPERATIONS.UNKNOWN_MAINTENANCE_CATEGORY',
          `Maintenance category '${category}' is not a frozen category.`,
          { category },
        ),
      );
    }
    if (this.#byKey.has(key)) {
      return err(
        new OperationsError(
          'OPERATIONS.DUPLICATE_MAINTENANCE',
          `A maintenance activity for key '${key}' already exists.`,
          { key },
        ),
      );
    }
    this.#byKey.set(key, { key, category, summary, state: 'planned' });
    return ok(undefined);
  }

  /** Transition a maintenance activity along its realized lifecycle; fails closed on an unknown key or illegal move. */
  transition(key: string, to: MaintenanceState): Result<void, OperationsError> {
    const activity = this.#byKey.get(key);
    if (activity === undefined) {
      return err(
        new OperationsError(
          'OPERATIONS.UNKNOWN_MAINTENANCE',
          `No maintenance activity is tracked for key '${key}'.`,
          { key },
        ),
      );
    }
    if (!MAINTENANCE_TRANSITIONS[activity.state].includes(to)) {
      return err(
        new OperationsError(
          'OPERATIONS.ILLEGAL_MAINTENANCE_TRANSITION',
          `A maintenance transition from '${activity.state}' to '${to}' is not permitted.`,
          { from: activity.state, to },
        ),
      );
    }
    activity.state = to;
    return ok(undefined);
  }

  /** Build the immutable maintenance plan, in registration order. */
  plans(hash: OperationsHash): MaintenancePlan {
    const activities: MaintenanceActivity[] = [];
    for (const activity of this.#byKey.values()) {
      const canonical = JSON.stringify([
        activity.key,
        activity.category,
        activity.state,
        activity.summary,
      ]);
      activities.push(Object.freeze({ ...activity, id: hash.hash(canonical) }));
    }
    return Object.freeze({
      activities: Object.freeze(activities),
      id: hash.hash(JSON.stringify(activities.map((activity) => activity.id))),
    });
  }
}
