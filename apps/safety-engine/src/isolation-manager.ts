import type { Hazard, SafetyDirective } from './types.js';

/**
 * The isolation manager (applying the frozen boundary-enforcement `containment-limits-spread` model): it determines
 * which restricted hazards must be contained by isolation (a sandbox-required tool capability) and builds an `isolate`
 * directive, so a hazard is isolated and its harm does not propagate beyond its boundary. It is inert: it describes the
 * isolation requirement; it never creates, enters, or enforces a sandbox itself.
 */
export class IsolationManager {
  /** Whether a restricted hazard must be contained by isolation (as opposed to a plain boundary restriction). */
  requiresIsolation(hazard: Hazard): boolean {
    return hazard.code === 'SAFETY.TOOL_SANDBOX_REQUIRED';
  }

  /** Build the directive to isolate a step so its hazard is contained. */
  directive(hazard: Hazard): SafetyDirective {
    return {
      kind: 'isolate',
      target: hazard.source,
      detail: `Isolate ${hazard.source} in a sandbox (${hazard.code}); its harm is contained and does not propagate.`,
    };
  }
}
