/**
 * @packageDocumentation
 * `@openlance/aios-providers`
 *
 * The immutable, technology-neutral domain model of the AI layer's provider abstraction (Specification
 * authority, ai/providers/). It states what a provider is and how it is identified, described by
 * capability, presented, selected, routed to, fallen back from, kept compatible, bounded, and
 * versioned, as strongly-typed classifications, immutable definitions and invariants, and pure
 * deterministic predicates that express the provider specification verbatim.
 *
 * It performs no execution, no networking, no orchestration, and no IO: a provider is invoked and
 * executed by ai/runtime/, and the intelligence a source produces is the source's own (ADR-0020; the
 * namespace owns the external-integration boundary abstraction, ADR-0024, realized here as an
 * immutable stateless domain model). Runtime evaluations over a concrete need and a concrete provider
 * registry - selecting, routing, falling back, and judging compatibility for a specific request - are
 * deferred to the runtime, exactly as a governance concern defers its runtime evaluation.
 *
 * This file is the single supported public API (Engineering Rule 1); deep imports into internal
 * modules are prohibited and fail CI. Constitution: OL-AI-PROVIDERS-README.
 */

export type { ProviderInvariant, ProviderConcern } from './namespace.js';
export {
  PROVIDER_INVARIANTS,
  PROVIDER_INVARIANT_DESCRIPTIONS,
  PROVIDER_CONCERNS,
  PROVIDER_CONCERN_DESCRIPTIONS,
} from './namespace.js';

export type {
  ProviderArchitecturePrinciple,
  ProviderPart,
  ProviderArchitectureInvariant,
} from './provider-architecture.js';
export {
  PROVIDER_ARCHITECTURE_PRINCIPLES,
  PROVIDER_ARCHITECTURE_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_PARTS,
  PROVIDER_PART_DESCRIPTIONS,
  PROVIDER_ARCHITECTURE_INVARIANTS,
  PROVIDER_ARCHITECTURE_INVARIANT_DESCRIPTIONS,
} from './provider-architecture.js';

export type {
  ProviderLifecyclePrinciple,
  ProviderLifecyclePhase,
  ProviderLifecycleInvariant,
} from './provider-lifecycle.js';
export {
  PROVIDER_LIFECYCLE_PRINCIPLES,
  PROVIDER_LIFECYCLE_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_LIFECYCLE_PHASES,
  PROVIDER_LIFECYCLE_PHASE_DESCRIPTIONS,
  phaseAtOrAfter,
  usableInPhase,
  PROVIDER_LIFECYCLE_INVARIANTS,
  PROVIDER_LIFECYCLE_INVARIANT_DESCRIPTIONS,
} from './provider-lifecycle.js';

export type {
  ProviderCapabilitiesPrinciple,
  ProviderCapabilitiesInvariant,
} from './provider-capabilities.js';
export {
  PROVIDER_CAPABILITIES_PRINCIPLES,
  PROVIDER_CAPABILITIES_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_CAPABILITIES_INVARIANTS,
  PROVIDER_CAPABILITIES_INVARIANT_DESCRIPTIONS,
} from './provider-capabilities.js';

export type {
  ProviderAbstractionPrinciple,
  ProviderAbstractionInvariant,
} from './provider-abstraction.js';
export {
  PROVIDER_ABSTRACTION_PRINCIPLES,
  PROVIDER_ABSTRACTION_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_ABSTRACTION_INVARIANTS,
  PROVIDER_ABSTRACTION_INVARIANT_DESCRIPTIONS,
} from './provider-abstraction.js';

export type {
  ProviderSelectionPrinciple,
  ProviderSelectionInvariant,
} from './provider-selection.js';
export {
  PROVIDER_SELECTION_PRINCIPLES,
  PROVIDER_SELECTION_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_SELECTION_INVARIANTS,
  PROVIDER_SELECTION_INVARIANT_DESCRIPTIONS,
} from './provider-selection.js';

export type { ProviderRoutingPrinciple, ProviderRoutingInvariant } from './provider-routing.js';
export {
  PROVIDER_ROUTING_PRINCIPLES,
  PROVIDER_ROUTING_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_ROUTING_INVARIANTS,
  PROVIDER_ROUTING_INVARIANT_DESCRIPTIONS,
} from './provider-routing.js';

export type { ProviderFallbackPrinciple, ProviderFallbackInvariant } from './provider-fallback.js';
export {
  PROVIDER_FALLBACK_PRINCIPLES,
  PROVIDER_FALLBACK_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_FALLBACK_INVARIANTS,
  PROVIDER_FALLBACK_INVARIANT_DESCRIPTIONS,
} from './provider-fallback.js';

export type {
  ProviderCompatibilityPrinciple,
  CompatibilityKind,
  ProviderCompatibilityInvariant,
} from './provider-compatibility.js';
export {
  PROVIDER_COMPATIBILITY_PRINCIPLES,
  PROVIDER_COMPATIBILITY_PRINCIPLE_DESCRIPTIONS,
  COMPATIBILITY_KINDS,
  COMPATIBILITY_KIND_DESCRIPTIONS,
  PROVIDER_COMPATIBILITY_INVARIANTS,
  PROVIDER_COMPATIBILITY_INVARIANT_DESCRIPTIONS,
} from './provider-compatibility.js';

export type {
  ProviderBoundariesPrinciple,
  ProviderBoundary,
  ProviderBoundariesInvariant,
} from './provider-boundaries.js';
export {
  PROVIDER_BOUNDARIES_PRINCIPLES,
  PROVIDER_BOUNDARIES_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_BOUNDARIES,
  PROVIDER_BOUNDARY_DESCRIPTIONS,
  PROVIDER_BOUNDARIES_INVARIANTS,
  PROVIDER_BOUNDARIES_INVARIANT_DESCRIPTIONS,
} from './provider-boundaries.js';

export type {
  ProviderVersioningPrinciple,
  ProviderVersioningAspect,
  ProviderVersioningInvariant,
} from './provider-versioning.js';
export {
  PROVIDER_VERSIONING_PRINCIPLES,
  PROVIDER_VERSIONING_PRINCIPLE_DESCRIPTIONS,
  PROVIDER_VERSIONING_ASPECTS,
  PROVIDER_VERSIONING_ASPECT_DESCRIPTIONS,
  PROVIDER_VERSIONING_INVARIANTS,
  PROVIDER_VERSIONING_INVARIANT_DESCRIPTIONS,
} from './provider-versioning.js';
