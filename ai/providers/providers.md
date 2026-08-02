---
id: OL-AI-PROVIDERS-PROVIDERS
document: ai/providers/providers.md

title: Open Lance AIOS Providers Inventory

version: 1.0
status: Frozen

document_type: reference
authority: Reference

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/providers/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Providers namespace

provenance:
  - Derived from ai/providers/README.md and the AI providers namespace

loading_priority: Required

summary: >
  The canonical inventory of the AI layer's provider concerns. It owns the
  identity and existence of each provider concern, and the provider determinism
  and scalability properties. It owns no provider model, no governance rule, and
  no business truth.
---

# Open Lance AIOS Providers Inventory

This document is the canonical inventory of the AI layer's provider concerns. It owns the identity of the Providers namespace and the list of provider concerns the namespace owns, so that any human or AI agent can determine, from one place, which provider concerns exist and which document owns each. It also owns the namespace-wide properties of determinism and scalability. It is a reference document and follows the inventory pattern, not the Provider Document Standard.

This inventory owns only identity, existence, and those namespace-wide properties. It states no provider model, no governance rule, and no business truth, and it names no provider or model. How the provider abstraction is documented is owned by ai/providers/README.md. Each provider concern is owned by its own document. On any matter of business truth, the knowledge repository governs.

# Purpose

This document exists so that the set of the AI layer's provider concerns has a single canonical list, and so that the provider properties that hold across the whole namespace have one owner. It answers which provider concerns the namespace owns, which document owns each, and why the provider abstraction is deterministic and scalable.

# Scope

This inventory lists every provider concern the namespace owns, and states the determinism and scalability of the provider abstraction. Each concern is represented exactly once and has exactly one canonical entry, and the model of each concern is owned by that concern's own document.

# Provider Role

A provider is the intelligence abstraction of the AI Operating System. It is a foundational service at the Specification authority level, below the constitution and the governance mandates, that other namespaces build on: it applies the rules governance sets and is consumed by the agents and the runtime that use a provider to act. A provider presents a provider- and model-neutral abstraction of a source of intelligence, and owns none of the reasoning, expression, retention, retrieval, execution, or truth that flows through it, nor the intelligence a source produces.

# Determinism

The provider abstraction is deterministic: the same need, the same registered providers, the same declared capabilities, and the same governing rules produce the same selection, the same routing, and the same fallback outcome, with no randomness and no hidden step. This holds because the abstraction's decisions are a function of fixed inputs alone, the need, the registered providers and their capabilities, and the rules owned by ai/governance/, applied through defined selection, routing, and fallback, so two identical situations resolve to the same provider the same way. The intelligence a chosen provider produces is the source's own, outside this architecture, and this namespace makes no determinism claim about it; it claims determinism only for the abstraction that chooses, routes to, and falls back from a provider.

# Scalability

The provider abstraction scales without redesign. The model describes, selects, routes to, and falls back from a bounded provider drawn from a registered set, so it applies the same way whether the layer uses one provider or many thousands of providers and models. Because the abstraction is provider- and model-neutral, adding, replacing, or retiring a provider or model changes no behavior of the layer, and the churn of providers and models is absorbed by this abstraction rather than by any foundational document. Growth in the number of providers, models, capabilities, or routes is absorbed additively, without changing the provider model.

# Repository Ownership

The Providers namespace owns the provider- and model-neutral abstraction of the AI layer and nothing else. It owns the provider concerns listed below, each in exactly one document. It owns no governance rule, which is owned by ai/governance/; no business truth, which is owned by the knowledge repository; no execution, which is owned by ai/runtime/; and no intelligence a source produces, which is the source's own. Every acting namespace consumes providers; providers consume only the constitution and the governance mandates.

# The Provider Concerns

The Providers namespace owns the following concerns. Each is owned by exactly one document. This list owns the identity of each concern; the model is owned by the named document.

## Provider Architecture

- Document. ai/providers/provider-architecture.md.
- Owns. The architectural definition of a provider: its identity and the parts it is composed of.
- Out of scope. The lifecycle of a provider, owned by ai/providers/provider-lifecycle.md; the abstraction it presents, owned by ai/providers/provider-abstraction.md.

## Provider Lifecycle

- Document. ai/providers/provider-lifecycle.md.
- Owns. The phases of a provider, including registration, activation, operation, and retirement, and provider discovery.
- Out of scope. The selection of a provider, owned by ai/providers/provider-selection.md; the versioning of a provider definition, owned by ai/providers/provider-versioning.md.

## Provider Capabilities

- Document. ai/providers/provider-capabilities.md.
- Owns. The capability model: how a provider's abilities are described, and capability declaration.
- Out of scope. Whether a capability matches a need, owned by ai/providers/provider-compatibility.md; the agent capability that composes a provider, owned by ai/agents/agent-capabilities.md.

## Provider Abstraction

- Document. ai/providers/provider-abstraction.md.
- Owns. The provider- and model-neutral abstraction: how a provider is presented uniformly so the layer uses intelligence without binding to a vendor or model.
- Out of scope. The intelligence a provider produces, owned by the source itself; the runtime that invokes a provider, owned by ai/runtime/.

## Provider Selection

- Document. ai/providers/provider-selection.md.
- Owns. The selection model: how a provider is chosen for a need, deterministically.
- Out of scope. The routing of a request to the chosen provider, owned by ai/providers/provider-routing.md; the compatibility a selection rests on, owned by ai/providers/provider-compatibility.md.

## Provider Routing

- Document. ai/providers/provider-routing.md.
- Owns. The routing model: how a request is directed to a selected provider, the routing topology, and provider limits.
- Out of scope. The choice of provider, owned by ai/providers/provider-selection.md; the runtime orchestration that carries a request, owned by ai/runtime/.

## Provider Fallback

- Document. ai/providers/provider-fallback.md.
- Owns. The fallback model: how the layer falls back to an alternate provider, through a bounded, acyclic fallback chain.
- Out of scope. The selection criteria a fallback reapplies, owned by ai/providers/provider-selection.md; the safe degradation of the AI, owned by ai/safety/safe-degradation.md.

## Provider Compatibility

- Document. ai/providers/provider-compatibility.md.
- Owns. The compatibility model: whether a provider is compatible with a need, and whether a provider version is compatible with a consumer.
- Out of scope. The evolution and version rules, owned by ai/providers/provider-versioning.md; the declaration of capabilities, owned by ai/providers/provider-capabilities.md.

## Provider Boundaries

- Document. ai/providers/provider-boundaries.md.
- Owns. What providers never own, and where a provider stops.
- Out of scope. The governance rules that bound providers, owned by ai/governance/; the runtime boundaries, owned by ai/runtime/execution-boundaries.md.

## Provider Versioning

- Document. ai/providers/provider-versioning.md.
- Owns. Provider versioning, evolution, migration, deprecation, and change governance consumption.
- Out of scope. The compatibility a version preserves, owned by ai/providers/provider-compatibility.md; the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Boundaries

This inventory owns the identity and existence of the provider concerns, and the determinism and scalability of the provider abstraction, only. It owns none of the following.

- How the provider abstraction is documented: ai/providers/README.md.
- The model of any provider concern: that concern's own document.
- The rules that govern the AI: ai/governance/.
- Business truth: the knowledge repository.
- The execution, reasoning, retrieval, expression, and persistence that flow through a provider: ai/runtime/, ai/reasoning/, ai/retrieval/, ai/prompts/, and ai/memory/.
- The intelligence a provider produces: the source itself.
- The maps of the AI layer: ai/architecture/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/architecture/ownership-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Growth of the inventory. As the AI layer comes to own a genuinely new and distinct provider concern, a new document is added under ai/providers/ following ai/providers/README.md, and this inventory gains an entry for it. The inventory grows additively and its structure does not change.
- Absorbing providers and models. New providers, models, capabilities, and routes are absorbed additively under the member documents, without redesign, and this inventory records only that the concern exists.
