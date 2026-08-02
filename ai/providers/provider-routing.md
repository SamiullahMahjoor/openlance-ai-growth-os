---
id: OL-AI-PROVIDERS-PROVIDER-ROUTING
document: ai/providers/provider-routing.md

title: Open Lance AIOS Provider Routing

version: 1.0
status: Frozen

document_type: normative
authority: Specification

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/providers/README.md
  - ai/providers/providers.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Providers namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the routing model: how a request is directed to a selected provider, the
  routing topology, and provider limits. It owns the routing model only, and
  defers the choice of provider and the runtime orchestration to their owners.
---

# Open Lance AIOS Provider Routing

This document owns the provider routing model. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the routing model only. It never defines the choice of provider, owned by ai/providers/provider-selection.md, and it never defines the runtime orchestration that carries a request, owned by ai/runtime/.

# Purpose

This document owns one provider concern: how a request is directed to a selected provider, the topology that directing forms, and the limits it respects. It exists so that any human or AI agent can determine how a request reaches a provider, without a routing cycle, independent of how the provider was chosen or how execution is scheduled.

# Principles

These are the enduring principles for provider routing. Each instantiates a provider invariant owned by ai/providers/README.md.

- Routing directs; it does not choose or execute. Routing directs a request to the provider selection already chose; the choice is owned by selection and the execution by the runtime.
- The routing topology is acyclic. A request follows a directed, acyclic route to a provider, so no routing cycle is possible.
- Routing respects limits. A request is routed within the limits a provider and the governing rules allow, and never beyond them.
- Routing is deterministic. The same selected provider and the same request follow the same route, with no randomness.

# Specification

A request is routed in the following way. This document owns the routing model, topology, and limits; the choice of provider is owned by ai/providers/provider-selection.md, and the orchestration that carries the request is owned by ai/runtime/.

- The routing model. Routing directs a request to the provider chosen under ai/providers/provider-selection.md, so the request reaches the intended provider through its neutral abstraction under ai/providers/provider-abstraction.md. Routing determines the path to a provider; it never chooses the provider and never executes the request.
- Routing topology. A request follows a defined, directed, acyclic topology from the point of need to a provider, so that routing never loops and a request always reaches a provider or is handed to fallback. The topology directs requests; it never contradicts the coordination of agents, which is owned by ai/agents/agent-coordination.md.
- Provider limits. A request is routed within the limits a provider declares and the rules governance sets, so that a provider is not routed beyond its declared or permitted use. When a limit is reached, the request is handed to ai/providers/provider-fallback.md rather than exceeding the limit.
- Routing, not orchestration. Routing ends at directing a request to a provider. The scheduling, invocation, and execution of the request are owned by ai/runtime/; routing is a provider-layer concern, not an execution one.

Routing directs a request to a selected provider within limits and without a cycle; the choice of provider and the execution are owned elsewhere. Routing is deterministic and the same at any scale.

# Invariants

- Routing directs a request to the already-chosen provider and never chooses or executes.
- The routing topology is directed and acyclic, so no routing cycle is possible.
- A request is routed within the limits a provider and governance allow; at a limit, it is handed to fallback.
- The same selected provider and request follow the same route, with no randomness.
- Routing a request never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the routing model only. It owns none of the following, and references each by its canonical owner.

- The choice of provider a request is routed to: ai/providers/provider-selection.md.
- The fallback when a provider is unavailable or a limit is reached: ai/providers/provider-fallback.md.
- The neutral abstraction a request is routed through: ai/providers/provider-abstraction.md.
- The runtime orchestration, scheduling, and execution of a request: ai/runtime/.
- The coordination of agents: ai/agents/agent-coordination.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-selection.md
- ai/providers/provider-fallback.md
- ai/providers/provider-abstraction.md
- ai/runtime/README.md
- ai/agents/agent-coordination.md
