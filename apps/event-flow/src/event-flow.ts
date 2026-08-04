import type { ErrorPropagationPlan } from '@openlance/aios-error-propagation';
import { createEvent } from '@openlance/aios-events';
import type { FrameworkEvent } from '@openlance/aios-events';
import { err, map, ok } from '@openlance/aios-kernel';
import type { Clock, Result } from '@openlance/aios-kernel';

import { EventFlowError } from './errors.js';

/**
 * One declared event-flow node: a framework event type that flows on the bus. It is metadata only; no event is
 * published, subscribed to, or dispatched here.
 */
export interface EventFlowNode {
  readonly type: string;
}

/** A read-only report over the event flow plan. */
export interface EventFlowDiagnostics {
  readonly eventCount: number;
  readonly types: readonly string[];
}

/**
 * The immutable event flow plan, attached to the runtime integration chain. Descriptive planning metadata only: it
 * declares which framework events flow through the chain (each realized as a canonical immutable `FrameworkEvent`
 * through the frozen constructor) and holds no runtime state. It publishes, subscribes, dispatches, and handles
 * nothing; it is never an event bus, and it executes nothing. A Phase 4 event stage consumes it.
 */
export interface EventFlowPlan {
  readonly chain: ErrorPropagationPlan;
  readonly events: readonly FrameworkEvent[];
  readonly diagnostics: EventFlowDiagnostics;
  readonly validated: true;
}

/** Internal: the shared, frozen empty payload for a canonical event realized from a declared type. */
const EMPTY_PAYLOAD: Readonly<Record<string, never>> = Object.freeze({});

/**
 * Validate the declared event flow topology and realize each event, failing closed. Pure: it rejects a blank event
 * type (`EVENT_FLOW.BLANK_TYPE`) and a duplicate event type (`EVENT_FLOW.DUPLICATE_TYPE`), and for each valid node
 * delegates to the frozen `createEvent` to realize a canonical immutable `FrameworkEvent` (the injected `Clock` is
 * the determinism seam; the event is never dispatched). It re-declares no event or bus, calls no bus operation, and
 * holds no state. On any problem it returns the aggregated errors and no realized events; otherwise it returns the
 * frozen events. Pure; no IO.
 */
export function validateEventFlow(
  clock: Clock,
  nodes: readonly EventFlowNode[],
): Result<readonly FrameworkEvent[], EventFlowError[]> {
  const errors: EventFlowError[] = [];
  const seen = new Set<string>();
  const events: FrameworkEvent[] = [];
  for (const node of nodes) {
    if (node.type.trim() === '') {
      errors.push(
        new EventFlowError(
          'EVENT_FLOW.BLANK_TYPE',
          'An event flow node declares a blank event type.',
          {},
        ),
      );
      continue;
    }
    if (seen.has(node.type)) {
      errors.push(
        new EventFlowError(
          'EVENT_FLOW.DUPLICATE_TYPE',
          `The event flow topology declares event type '${node.type}' more than once.`,
          { type: node.type },
        ),
      );
    }
    seen.add(node.type);
    events.push(createEvent(clock, node.type, EMPTY_PAYLOAD));
  }
  return errors.length > 0 ? err(errors) : ok(Object.freeze(events));
}

/**
 * Build the immutable event flow plan from a declared topology, attaching it to the Stage 7 runtime integration
 * chain handle, failing closed. It validates the topology through {@link validateEventFlow} (delegating event
 * realization to the frozen `createEvent`) and, on success, returns an immutable {@link EventFlowPlan} whose
 * `events` are the realized envelopes and whose `diagnostics` report the count and types. It consumes the frozen
 * `ErrorPropagationPlan` and the frozen event subsystem, recreates neither, and executes nothing: it publishes,
 * subscribes, dispatches, and handles no event. On an invalid topology it returns `EventFlowError[]` and builds no
 * partial plan. Pure; no IO.
 */
export function buildEventFlowPlan(
  chain: ErrorPropagationPlan,
  clock: Clock,
  nodes: readonly EventFlowNode[],
): Result<EventFlowPlan, EventFlowError[]> {
  return map(validateEventFlow(clock, nodes), (events) =>
    Object.freeze({
      chain,
      events,
      diagnostics: Object.freeze({
        eventCount: events.length,
        types: Object.freeze(events.map((event) => event.type)),
      }),
      validated: true,
    }),
  );
}
