import type { Hazard, SafetyDirective } from './types.js';

/**
 * The sanitization engine (applying the frozen boundary-enforcement and least-harm models): it builds a `sanitize`
 * directive describing the unsafe element Operations is to neutralize before execution, so the safe remainder of the
 * action can proceed. It is inert: it describes the sanitization; it never reads, transforms, rewrites, or removes any
 * content itself.
 */
export class SanitizationEngine {
  /** Build the directive to neutralize the unsafe element a hazard identifies. */
  directive(hazard: Hazard): SafetyDirective {
    return {
      kind: 'sanitize',
      target: hazard.source,
      detail: `Neutralize the unsafe element in ${hazard.source} (${hazard.code}) before execution; the safe remainder may proceed.`,
    };
  }
}
