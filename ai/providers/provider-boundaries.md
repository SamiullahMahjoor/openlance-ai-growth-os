---
id: OL-AI-PROVIDERS-PROVIDER-BOUNDARIES
document: ai/providers/provider-boundaries.md

title: Open Lance AIOS Provider Boundaries

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
  Owns what providers never own, and where a provider stops. It owns the
  boundaries of providers only, and defers the governance rules that bound them
  and the concerns of the surrounding namespaces to their owners.
---

# Open Lance AIOS Provider Boundaries

This document owns the architectural boundaries of providers. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of providers only. It never defines the governance rules that bound providers, owned by ai/governance/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one provider concern: what a provider never owns, and where a provider stops. It exists so that any human or AI agent can determine the limits of a provider, independent of how those limits are enforced.

# Principles

These are the enduring principles for provider boundaries. Each instantiates a provider invariant owned by ai/providers/README.md.

- A provider abstracts; it does not reason, express, retain, retrieve, or execute. A provider presents a source of intelligence and stops there; those concerns belong to other namespaces.
- A provider carries no truth. A provider carries no business truth and never owns, restates, or becomes it.
- A provider produces no intelligence of its own. The intelligence a source produces is the source's own, outside this architecture; the abstraction never claims it.
- A provider stays within governance and safety. A provider is selected, routed to, and used only within the rules governance sets and the limits safety allows.

# Specification

A provider operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/, and the concerns beyond them by their namespaces.

- Behavior boundary. A provider abstracts a source of intelligence and never reasons, expresses, retains, or retrieves. Reasoning is owned by ai/reasoning/, expression by ai/prompts/, retention by ai/memory/, and knowledge determination by ai/retrieval/. A provider is the abstraction those behaviors reach intelligence through, and performs none of them.
- Execution boundary. A provider is invoked and executed by ai/runtime/. A provider never orchestrates, schedules, or executes, and it never networks or defines a protocol or an interface, which are implementation.
- Truth boundary. A provider carries no business truth and never owns, restates, amends, or becomes it, which is owned by the knowledge repository. The intelligence a source produces is the source's own, and its quality is judged by the Evaluation namespace, not claimed here.
- Actor boundary. A provider is composed by an agent as a capability and is never an actor. Agents are owned by ai/agents/; a provider is used, not an agent.
- Governance and safety boundary. A provider is selected and used only within the rules owned by ai/governance/ and the limits owned by ai/safety/, and never defines them. A use that would exceed them is refused or handed to fallback and safe degradation.
- Implementation boundary. A provider is an architectural abstraction, never a vendor, a model, a network, a protocol, an interface, a framework, a runtime, or code, and this namespace names none.

A use that would cross any of these boundaries does not proceed; it is refused or escalated under ai/governance/escalation.md, or handed to ai/providers/provider-fallback.md and ai/safety/safe-degradation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- A provider abstracts a source of intelligence and never reasons, expresses, retains, retrieves, or executes.
- A provider carries no business truth and produces no intelligence of its own.
- A provider is composed as a capability and is never an actor.
- A provider is used only within the rules governance sets and the limits safety allows.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of providers only. It owns none of the following, and references each by its canonical owner.

- The governance rules and limits that bound providers: ai/governance/ and ai/safety/.
- The runtime boundaries of an execution: ai/runtime/execution-boundaries.md.
- The reasoning, prompts, memory, and retrieval a provider serves: ai/reasoning/, ai/prompts/, ai/memory/, and ai/retrieval/.
- The agent that composes a provider: ai/agents/.
- The intelligence a source produces and its evaluation: the source itself and the Evaluation namespace.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-fallback.md
- ai/runtime/execution-boundaries.md
- ai/agents/agent-boundaries.md
- ai/safety/safe-degradation.md
- ai/governance/escalation.md
