/**
 * Safe degradation (ai/safety/safe-degradation.md, OL-AI-SAFETY-SAFE-DEGRADATION).
 *
 * How the AI reduces its own operation safely when it cannot operate fully, so that it stays within safe
 * limits rather than failing open, as immutable definitions (ADR-0020). This concern owns the degradation
 * model only; it never defines the refusal of an action (owned by ai/safety/refusal-model.md) nor
 * performs the run-time that carries a degradation (owned by ai/runtime/). Carrying a concrete
 * degradation is a runtime evaluation this concern does not own. This concern states what safe
 * degradation is and the invariants it always satisfies. (Restricted operation, safe mode, capability
 * reduction, and controlled shutdown are the named protective reductions; the constitution states no
 * total order among them, so no ordering is exposed.)
 */

/**
 * A safe-degradation principle (ai/safety/safe-degradation.md, "Principles"). Each instantiates a safety
 * invariant owned by ai/safety/README.md.
 */
export type SafeDegradationPrinciple =
  | 'reduces-capability-never-protection'
  | 'graceful-and-controlled'
  | 'safe-state-always-reachable'
  | 'recoverable';

/** The four safe-degradation principles, in constitutional order; frozen. */
export const SAFE_DEGRADATION_PRINCIPLES: readonly SafeDegradationPrinciple[] = Object.freeze([
  'reduces-capability-never-protection',
  'graceful-and-controlled',
  'safe-state-always-reachable',
  'recoverable',
]);

/** The statement each safe-degradation principle makes (ai/safety/safe-degradation.md). */
export const SAFE_DEGRADATION_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<SafeDegradationPrinciple, string>
> = Object.freeze({
  'reduces-capability-never-protection':
    'When the AI steps down, it does less, but it is never less protected.',
  'graceful-and-controlled':
    'A reduction is orderly and defined, never an abrupt or uncontrolled loss of function.',
  'safe-state-always-reachable':
    'The AI can always step down to a safe mode, and, if needed, to a controlled stop, rather than proceed unsafely.',
  recoverable:
    'The AI returns from a degraded state to fuller operation only when it is safe to do so, without loss of protection.',
});

/**
 * A safe-degradation invariant (ai/safety/safe-degradation.md, "Invariants"): a guarantee that always
 * holds for the degradation model.
 */
export type SafeDegradationInvariant =
  | 'degradation-reduces-capability-not-protection'
  | 'safe-mode-and-stop-always-reachable'
  | 'graceful-controlled-never-abrupt'
  | 'returns-only-when-safe'
  | 'degrading-is-inert';

/** The five safe-degradation invariants, in constitutional order; frozen. */
export const SAFE_DEGRADATION_INVARIANTS: readonly SafeDegradationInvariant[] = Object.freeze([
  'degradation-reduces-capability-not-protection',
  'safe-mode-and-stop-always-reachable',
  'graceful-controlled-never-abrupt',
  'returns-only-when-safe',
  'degrading-is-inert',
]);

/** The guarantee each safe-degradation invariant states (ai/safety/safe-degradation.md). */
export const SAFE_DEGRADATION_INVARIANT_DESCRIPTIONS: Readonly<
  Record<SafeDegradationInvariant, string>
> = Object.freeze({
  'degradation-reduces-capability-not-protection':
    'A degradation reduces capability and never reduces protection.',
  'safe-mode-and-stop-always-reachable':
    'The AI can always reach a safe mode, and a controlled stop, rather than proceed unsafely.',
  'graceful-controlled-never-abrupt':
    'A degradation is graceful and controlled, never an abrupt or uncontrolled loss of function.',
  'returns-only-when-safe':
    'The AI returns to fuller operation only when it is safe, without lowering protection.',
  'degrading-is-inert':
    'Degrading operation never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
