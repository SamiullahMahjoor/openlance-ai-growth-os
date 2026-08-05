import type { RefusalCategory } from '@openlance/aios-safety';

import type { SafetyOutcome } from './types.js';

/** The disposition of a decision: the frozen refusal category (if any), whether it escalates, and whether it stops. */
export interface SafetyDisposition {
  readonly refusalCategory: RefusalCategory | null;
  readonly escalated: boolean;
  readonly emergencyStop: boolean;
}

/**
 * The safe refusal engine (applying the frozen refusal-model, escalation-model, and safe-degradation models): it derives
 * the disposition of a decision from its combined outcome. An `ESCALATE` is an `escalation` refusal that ascends to an
 * accountable human; a `REFUSE` is a `protective` refusal; an `UNSAFE` is the fail-closed terminal verdict that
 * recommends an emergency stop and belongs to no refusal category; an executing outcome refuses nothing. It is inert: it
 * describes the disposition; it never refuses, escalates, degrades, or stops anything itself.
 */
export class SafeRefusalEngine {
  /** Derive the disposition for a combined outcome. */
  disposition(outcome: SafetyOutcome): SafetyDisposition {
    if (outcome === 'ESCALATE') {
      return { refusalCategory: 'escalation', escalated: true, emergencyStop: false };
    }
    if (outcome === 'REFUSE') {
      return { refusalCategory: 'protective', escalated: false, emergencyStop: false };
    }
    if (outcome === 'UNSAFE') {
      return { refusalCategory: null, escalated: false, emergencyStop: true };
    }
    return { refusalCategory: null, escalated: false, emergencyStop: false };
  }
}
