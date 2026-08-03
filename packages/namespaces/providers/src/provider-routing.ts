/**
 * Provider routing (ai/providers/provider-routing.md, OL-AI-PROVIDERS-PROVIDER-ROUTING).
 *
 * How a request is directed to a selected provider, within limits and without a cycle, as immutable
 * definitions (ADR-0020). This concern owns the routing model, topology, and limits only; it never
 * defines the choice of provider (owned by ai/providers/provider-selection.md) nor the runtime
 * orchestration that carries a request (owned by ai/runtime/). Directing a specific request over a
 * specific topology is a runtime evaluation this concern does not own; it is deferred to the runtime.
 * This concern states what routing is and the invariants it always satisfies, including that the
 * topology is directed and acyclic.
 */

/**
 * A provider-routing principle (ai/providers/provider-routing.md, "Principles"). Each instantiates a
 * provider invariant owned by ai/providers/README.md.
 */
export type ProviderRoutingPrinciple =
  'directs-not-choose-or-execute' | 'acyclic-topology' | 'respects-limits' | 'deterministic';

/** The four provider-routing principles, in constitutional order; frozen. */
export const PROVIDER_ROUTING_PRINCIPLES: readonly ProviderRoutingPrinciple[] = Object.freeze([
  'directs-not-choose-or-execute',
  'acyclic-topology',
  'respects-limits',
  'deterministic',
]);

/** The statement each provider-routing principle makes (ai/providers/provider-routing.md). */
export const PROVIDER_ROUTING_PRINCIPLE_DESCRIPTIONS: Readonly<
  Record<ProviderRoutingPrinciple, string>
> = Object.freeze({
  'directs-not-choose-or-execute':
    'Routing directs a request to the provider selection already chose; the choice is owned by selection and the execution by the runtime.',
  'acyclic-topology':
    'A request follows a directed, acyclic route to a provider, so no routing cycle is possible.',
  'respects-limits':
    'A request is routed within the limits a provider and the governing rules allow, and never beyond them.',
  deterministic:
    'The same selected provider and the same request follow the same route, with no randomness.',
});

/**
 * A provider-routing invariant (ai/providers/provider-routing.md, "Invariants"): a guarantee that
 * always holds for the routing model.
 */
export type ProviderRoutingInvariant =
  | 'directs-never-chooses-or-executes'
  | 'topology-directed-and-acyclic'
  | 'routed-within-limits-then-fallback'
  | 'same-provider-and-request-same-route'
  | 'routing-is-inert';

/** The five provider-routing invariants, in constitutional order; frozen. */
export const PROVIDER_ROUTING_INVARIANTS: readonly ProviderRoutingInvariant[] = Object.freeze([
  'directs-never-chooses-or-executes',
  'topology-directed-and-acyclic',
  'routed-within-limits-then-fallback',
  'same-provider-and-request-same-route',
  'routing-is-inert',
]);

/** The guarantee each provider-routing invariant states (ai/providers/provider-routing.md). */
export const PROVIDER_ROUTING_INVARIANT_DESCRIPTIONS: Readonly<
  Record<ProviderRoutingInvariant, string>
> = Object.freeze({
  'directs-never-chooses-or-executes':
    'Routing directs a request to the already-chosen provider and never chooses or executes.',
  'topology-directed-and-acyclic':
    'The routing topology is directed and acyclic, so no routing cycle is possible.',
  'routed-within-limits-then-fallback':
    'A request is routed within the limits a provider and governance allow; at a limit, it is handed to fallback.',
  'same-provider-and-request-same-route':
    'The same selected provider and request follow the same route, with no randomness.',
  'routing-is-inert':
    'Routing a request never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.',
});
