---
id: OL-AI-AGENTS-AGENT-LIFECYCLE
document: ai/agents/agent-lifecycle.md

title: Open Lance AIOS Agent Lifecycle

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

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Required

summary: >
  Owns the phases of an agent, including registration, activation, operation, and
  retirement, and agent discovery. It owns the agent lifecycle only, and defers
  the execution the agent serves and the versioning of a definition to their
  owners.
---

# Open Lance AIOS Agent Lifecycle

This document owns the phases of an agent. It is an agent document at the Specification authority level defined in ai/README.md, and it follows the Agent Document Standard in ai/agents/README.md. It instantiates the agent invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the agent lifecycle only. It defers the ordered execution the agent serves to ai/runtime/, and the versioning of an agent definition to ai/agents/agent-versioning.md.

# Purpose

This document owns one agent concern: the phases an agent passes through, from being registered to being retired, and how a registered agent is discovered. It exists so that any human or AI agent can determine the shape of an agent's life, independent of how the agent is executed.

# Principles

These are the enduring principles for the agent lifecycle. Each instantiates an agent invariant owned by ai/agents/README.md.

- An agent has a defined beginning and end. It begins when it is registered and ends when it is retired; an agent never acts before activation or after retirement.
- Registration precedes activation. An agent exists and is discoverable before it is activated to act.
- Discovery follows registration. A registered agent is discoverable by its identity; an unregistered agent is not.
- Retirement is clean. A retired agent releases its identity and holdings and acts no more, and its retirement never corrupts another agent.

# Specification

An agent passes through the following ordered phases. This document owns the phases; the execution an active agent serves is owned by ai/runtime/, and the change of an agent definition over time is owned by ai/agents/agent-versioning.md.

- Registration. An agent is registered with its distinct identity under ai/agents/agent-architecture.md, so that it exists as an actor and is discoverable. Registration records that the agent exists; it never activates or executes it.
- Discovery. A registered agent is discoverable by its identity and specialization, so that the runtime and other agents can find it to orchestrate or coordinate with it. Discovery finds a registered agent; it never grants it capability or permission, which are owned by ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md.
- Activation. A registered agent is activated, becoming able to act within its capabilities and permissions. An agent acts only while active, and activation never widens its capabilities or permissions.
- Operation. An active agent performs work by composing the operational namespaces, orchestrated and executed by ai/runtime/. This document owns that the agent is in operation; the execution itself is owned by ai/runtime/.
- Retirement. An agent is retired: it is deactivated, releases its identity and holdings, and acts no more. Retirement is bounded to the agent and never corrupts another, upholding the fault isolation owned by ai/agents/agent-boundaries.md.

Each phase precedes the next, and an agent never acts outside Activation and Operation. The lifecycle is the same regardless of provider, runtime, or orchestration system, and it is the same for one agent or tens of thousands.

# Invariants

- An agent is registered before it is discoverable, and discoverable before it is activated.
- An agent acts only while active, and activation never widens its capabilities or permissions.
- A retired agent releases its identity and holdings and acts no more.
- An agent's retirement is bounded to it and never corrupts another agent.
- A lifecycle transition never executes, orchestrates, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the agent lifecycle only. It owns none of the following, and references each by its canonical owner.

- The identity registered and the parts composed: ai/agents/agent-architecture.md.
- The capabilities and permissions an active agent holds: ai/agents/agent-capabilities.md and ai/agents/agent-permissions.md.
- The orchestration, scheduling, and execution an active agent serves: ai/runtime/.
- The fault isolation a retirement upholds: ai/agents/agent-boundaries.md.
- The versioning of an agent definition over time: ai/agents/agent-versioning.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/agents/README.md
- ai/agents/agents.md
- ai/agents/agent-architecture.md
- ai/agents/agent-capabilities.md
- ai/agents/agent-permissions.md
- ai/agents/agent-boundaries.md
- ai/agents/agent-versioning.md
- ai/runtime/session-lifecycle.md
