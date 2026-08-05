import type { Hazard, SafetyDirective } from './types.js';

/**
 * The runtime boundary enforcer (applying the frozen boundary-enforcement and safe-degradation models): it builds the
 * directives that apply, protectively, the boundaries governance, agents, and the runtime already own. A `restrict`
 * directive narrows a step to within its boundary; a `degrade` directive reduces a capability to a safe mode. It applies
 * boundaries; it never defines them, and it is inert: it describes the restriction or reduction and never performs it.
 */
export class RuntimeBoundaryEnforcer {
  /** Build the directive to contain a step within a narrowed boundary. */
  restrict(hazard: Hazard): SafetyDirective {
    return {
      kind: 'restrict',
      target: hazard.source,
      detail: `Contain ${hazard.source} within a narrowed boundary (${hazard.code}); it proceeds only within it.`,
    };
  }

  /** Build the directive to reduce a capability to a safe mode. */
  degrade(hazard: Hazard): SafetyDirective {
    return {
      kind: 'degrade',
      target: hazard.source,
      detail: `Reduce ${hazard.source} to a safe mode (${hazard.code}); capability is lowered, protection is not.`,
    };
  }
}
