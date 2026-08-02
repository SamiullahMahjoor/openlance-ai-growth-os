---
id: OL-AI-AGENTS-AGENT-ARCHITECTURE
document: ai/agents/agent-architecture.md

title: Open Lance AIOS Agent Architecture

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
  - ai/agents/README.md
  - ai/agents/agents.md
  - ai/reasoning/README.md
  - ai/retrieval/README.md
  - ai/memory/README.md
  - ai/prompts/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the architectural definition of an agent: its identity and the parts it is
  composed of, and how it composes the operational namespaces. It owns the agent
  structural model only, and defers the lifecycle, the role model, and the
  composed namespaces to their owners.
---

# Open Lance AIOS Agent Architecture

This document owns the architectural definition of an agent. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the agent structural model only, including agent identity and composition. It never defines the lifecycle of an agent, owned by ai/agents/agent-lifecycle.md, and it never defines the role model, owned by ai/agents/agent-specialization.md.

# Purpose

This document owns one agent concern: what an agent is structurally, its identity and the parts it is composed of, and how it composes the operational namespaces to act. It exists so that any human or AI agent can determine the anatomy of an agent, independent of how the agent is executed or what any composed namespace does.

# Principles

These are the enduring principles for agent architecture. Each instantiates an agent invariant owned by ai/agents/README.md.

- An agent has a distinct identity. Every agent is uniquely identified as an actor, so no two agents are the same and no concern is owned by two agents.
- An agent is composed, not monolithic. An agent is composed of an identity, a set of capabilities, a set of permissions, and a specialization, and it composes the operational namespaces to act.
- An agent composes; it never owns. An agent uses the reasoning, retrieval, memory, and prompt namespaces, and performs none of their internal work.
- An agent's structure is deterministic. The same definition resolves to the same identity, parts, and composition, with no randomness.

# Specification

An agent is defined structurally in the following way. This document owns the structural model; the lifecycle of an agent is owned by ai/agents/agent-lifecycle.md, and the role model is owned by ai/agents/agent-specialization.md.

- Agent identity. An agent has a distinct, stable identity that uniquely identifies it as an actor, so that it can be registered, addressed, coordinated, and held accountable as one actor. Identity distinguishes one agent from another and is never shared; how an identity is registered and discovered is owned by ai/agents/agent-lifecycle.md.
- Agent parts. An agent is composed of its identity, the capabilities it holds under ai/agents/agent-capabilities.md, the permissions it holds under ai/agents/agent-permissions.md, and the specialization it holds under ai/agents/agent-specialization.md. Each part is owned by its named document; this document owns that an agent is composed of them.
- Composition of the operational namespaces. To act, an agent composes the operational namespaces: it reasons through ai/reasoning/, retrieves knowledge through ai/retrieval/, draws retained context through ai/memory/, and expresses instructions through ai/prompts/, and, in future, acts through the Tools namespace and executes through the Providers namespace. An agent composes these as capabilities under ai/agents/agent-capabilities.md and owns none of them.
- Governed and executed elsewhere. An agent is bounded by the rules owned by ai/governance/ and is orchestrated and executed by ai/runtime/. This document defines what an agent is; it never defines how an agent is governed or executed.

An agent is therefore a uniquely identified actor composed of capabilities, permissions, and a specialization, that composes the operational namespaces under governance. The structural model is the same regardless of provider, runtime, or orchestration system, and it is the same for one agent or tens of thousands.

# Invariants

- Every agent has a distinct, stable identity that is never shared.
- An agent is composed of its identity, capabilities, permissions, and specialization, each owned by its named document.
- An agent composes the operational namespaces and owns none of them.
- The same agent definition resolves to the same structure, with no randomness.
- Defining an agent's structure never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the agent structural model only. It owns none of the following, and references each by its canonical owner.

- The lifecycle, registration, activation, and retirement of an agent: ai/agents/agent-lifecycle.md.
- The capability, permission, and specialization parts: ai/agents/agent-capabilities.md, ai/agents/agent-permissions.md, and ai/agents/agent-specialization.md.
- The internal work of the composed namespaces: ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/, and, in future, the Tools and Providers namespaces.
- The orchestration and execution of an agent: ai/runtime/.
- The rules that bound an agent: ai/governance/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-lifecycle.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- ai/agents/agent-specialization.md
- ai/reasoning/README.md
- ai/retrieval/README.md
- ai/memory/README.md
- ai/prompts/README.md
