/**
 * Boundary enforcement (ai/safety/boundary-enforcement.md, OL-AI-SAFETY-BOUNDARY-ENFORCEMENT).
 *
 * How the boundaries the AI already owns are applied protectively, so that an action is contained within
 * them and a hazard does not spread across layers, as immutable definitions (ADR-0020). This concern
 * owns the boundary enforcement model only; it never defines the boundaries themselves (owned by
 * ai/governance/, ai/agents/, and ai/runtime/) nor performs run-time enforcement (owned by ai/runtime/).
 * Enforcing a concrete boundary is a runtime evaluation this concern does not own. This concern states
 * how a boundary is applied protectively and the invariants it always satisfies.
 */

/**
 * A boundary-enforcement principle (ai/safety/boundary-enforcement.md, "Principles"). Each instantiates a
 * safety invariant owned by ai/safety/README.md.
 */
export type BoundaryEnforcementPrinciple =
  | 'applies-boundaries-never-defines'
  | 'boundary-holds-by-default'
  | 'layered-and-cross-cutting'
  | 'containment-limits-spread';

/** The four boundary-enforcement principles, in constitutional order; frozen. */
export const BOUNDARY_ENFORCEMENT_PRINCIPLES: readonly BoundaryEnforcementPrinciple[] =
  Object.freeze([
    'applies-boundaries-never-defines',
    'boundary-holds-by-default',
    'layered-and-cross-cutting',
    'containment-limits-spread',
  ]);

/** The statement each boundary-enforcement principle makes (ai/safety/boundary-enforcement.md). */
export const BOUNDARY_ENFORCEMENT_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<BoundaryEnforcementPrinciple, string>
> = Object.freeze({
  'applies-boundaries-never-defines':
    'The boundaries are owned by governance, agents, and the runtime; this document applies them protectively and never defines them.',
  'boundary-holds-by-default':
    'An action proceeds only within its boundaries, and an attempt to cross one is contained, refused, or escalated, never allowed by default.',
  'layered-and-cross-cutting':
    'Boundaries are applied at every layer an action touches, so a hazard contained at one layer is not free at another.',
  'containment-limits-spread':
    'A hazard is isolated and contained so that its harm does not propagate beyond its boundary.',
});

/**
 * A boundary-enforcement invariant (ai/safety/boundary-enforcement.md, "Invariants"): a guarantee that
 * always holds for the enforcement model.
 */
export type BoundaryEnforcementInvariant =
  | 'applies-owned-boundaries-never-defines'
  | 'proceeds-only-within-boundaries'
  | 'applied-across-every-layer'
  | 'hazard-isolated-and-contained'
  | 'applying-is-inert';

/** The five boundary-enforcement invariants, in constitutional order; frozen. */
export const BOUNDARY_ENFORCEMENT_INVARIANTS: readonly BoundaryEnforcementInvariant[] =
  Object.freeze([
    'applies-owned-boundaries-never-defines',
    'proceeds-only-within-boundaries',
    'applied-across-every-layer',
    'hazard-isolated-and-contained',
    'applying-is-inert',
  ]);

/** The guarantee each boundary-enforcement invariant states (ai/safety/boundary-enforcement.md). */
export const BOUNDARY_ENFORCEMENT_INVARIANT_DESCRIPTIONS: Readonly<
  Record<BoundaryEnforcementInvariant, string>
> = Object.freeze({
  'applies-owned-boundaries-never-defines':
    'Enforcement applies the boundaries owned by governance, agents, and the runtime, and never defines them.',
  'proceeds-only-within-boundaries':
    'An action proceeds only within its boundaries; an attempt to cross one is contained, refused, or escalated.',
  'applied-across-every-layer':
    'Boundaries are applied across every layer an action touches, so a hazard cannot leak between namespaces.',
  'hazard-isolated-and-contained':
    'A hazard is isolated and contained so its harm does not propagate beyond its boundary.',
  'applying-is-inert':
    'Applying a boundary never executes, reasons, retrieves, persists, or changes ownership, authority, governance, or business truth.',
});
