---
id: OL-AI-AGENTS-README
document: ai/agents/README.md

title: Open Lance AIOS Agents Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/governance/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Agents namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how agents are documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every agent document under
  ai/agents/ must follow, and it owns agent extensibility and provider
  neutrality. It owns how agent architecture is documented, and owns no
  business truth, no governance rule, no runtime execution, no reasoning, no
  retrieval, no prompt, and no implementation.
---

# Open Lance AIOS Agents Namespace Guide

This document is the guide for the Agents namespace at ai/agents/. The Agents namespace owns one thing: the architectural model of an AI agent. It defines what an agent is as an actor within the AI Operating System, how an agent is composed, identified, capable, permitted, specialized, coordinated, and evolved, so that work is performed by governed, bounded, deterministic actors. It owns no business truth, no governance rule, no runtime execution, no reasoning, no retrieval, no memory, no prompt, no provider, no model, no tool, and no implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. An agent sits at the Specification authority level defined in ai/README.md, composing the reasoning, retrieval, memory, and prompt namespaces to act, executed by the runtime that orchestrates it, and bounded by the rules governance sets. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how agent architecture is documented within the AI layer. It is the single guide for the Agents namespace, and every agent document follows it.

The Agents namespace exists so that an agent is a defined, governed, deterministic, technology-neutral actor, rather than an emergent or ad hoc process. It defines what an agent is and how agents relate; it never executes an agent, never reasons, never retrieves, never composes a prompt, and never owns the rules it obeys. An agent is a composition of the operational namespaces under governance, never an owner of any of them.

This guide owns no agent model itself, no business truth, and no governance rule. The agent model is owned by the member documents of this namespace; business truth is owned by the knowledge repository; the rules that govern agents are owned by ai/governance/.

# Scope

This guide governs the Agents namespace. It defines the standard structure an agent document uses, the rules for writing one, the invariants every agent document upholds, the boundaries an agent document must respect, and how the namespace grows. It owns agent extensibility, the additive way the agent model gains new concerns over time, and agent provider neutrality, the permanent independence of agent architecture from any provider, model, framework, runtime, orchestration system, or language.

The namespace owns the agent model of the AI layer: agent architecture and identity, lifecycle, capabilities, permissions, coordination, communication, delegation, specialization, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Agent Identity

An agent is an actor of the AI layer, and it is not any of the following.

- An agent is not the runtime. The runtime orchestrates, schedules, and executes the work an agent performs; the Agents namespace defines what the agent is. An agent never orchestrates, schedules, or executes; those are owned by ai/runtime/.
- An agent is not reasoning. Reasoning transforms retrieved knowledge into governed conclusions; an agent composes reasoning to act. An agent never reasons; that is owned by ai/reasoning/.
- An agent is not retrieval, memory, or prompts. Retrieval determines knowledge, memory retains context, and prompts express instructions; an agent composes them. An agent never retrieves, persists, or composes a prompt itself; those are owned by ai/retrieval/, ai/memory/, and ai/prompts/.
- An agent is not knowledge. Business truth is owned by the knowledge repository. An agent consumes truth by reference and never owns, restates, or becomes it.
- An agent is not governance. The rules that bound an agent, its permissions, autonomy, and change, are owned by ai/governance/. An agent operates within those rules; it never defines them.
- An agent is not a provider, a model, or a tool. Providers abstract models, and tools act externally; an agent composes them. An agent never abstracts a model or performs a tool action itself; those are owned by the Providers and Tools namespaces.
- An agent is not implementation. It defines the agent model, never an orchestration system, a framework, a protocol, a provider, a model, or code.

An agent document answers only how one aspect of agent architecture works. Its knowledge is durable, technology-neutral, and independent of any provider, model, framework, runtime, or orchestration system, so it remains valid as those change.

# Agent Invariants

These invariants are permanent. Every agent document upholds them, and no agent may violate them.

- An agent is a distinct, uniquely identified actor. No two agents share one identity, and no concern is owned by two agents.
- An agent acts only within its granted capabilities and permissions, and never beyond them. Capabilities and permissions follow least privilege and never exceed what is delegated.
- An agent composes the operational namespaces; it owns none of them. An agent uses reasoning, retrieval, memory, prompts, and, in future, tools and providers, and performs none of their internal work.
- An agent is governed and bounded. An agent acts within its autonomy bounds and escalates rather than act outside them, and it never escalates its own permissions.
- Agent coordination is acyclic and agent delegation is bounded. No circular coordination and no unbounded or infinite delegation are possible.
- An agent is a deterministic composition. The same agent definition, under the same governing rules and inputs, resolves and behaves the same way, with no randomness.
- An agent's fault is isolated. A failing agent never corrupts another agent, and its failure is bounded to it.
- Agent architecture is single-owned, provider-neutral, and scalable. Each agent concern has exactly one owning document, and the model holds for one agent or tens of thousands.

# Agent Document Standard

Every agent document under ai/agents/ uses the following standard structure. This section defines the template only. It defines no actual agent model. The inventory at ai/agents/agents.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The agent concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the agent invariants.
- Specification. The technology-neutral agent model itself: the architecture, lifecycle, capabilities, permissions, coordination, communication, delegation, specialization, boundaries, or versioning the document owns.
- Invariants. The agent invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

An agent document may add a section only when a genuine agent concern requires it, following ai/CONTRIBUTING.md, and never to move business truth, a governance rule, runtime execution, reasoning, retrieval, or a prompt into this namespace.

# Documentation Rules

An agent document records one aspect of the agent model, and nothing more.

- An agent document never restates business truth, a governance rule, a runtime behavior, a reasoning model, a retrieval model, a memory model, or a prompt. It references the knowledge repository, ai/governance/, ai/runtime/, ai/reasoning/, ai/retrieval/, ai/memory/, and ai/prompts/ by canonical path.
- An agent document never specifies an orchestration system, a framework, a protocol, a provider, a model, or code.
- An agent document defines the agent model, never how an agent is executed, scheduled, or implemented.
- Everything an agent document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Agents own actors. The runtime executes and orchestrates. Governance owns rules. Reasoning reasons. Retrieval determines knowledge. Memory retains context. Prompts express. Providers abstract models. Tools act externally. The knowledge repository owns truth. An agent document owns only its own aspect of the agent model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The rules that govern permissions, autonomy, delegation, escalation, and change: ai/governance/.
- Business truth: the knowledge repository.
- Execution, orchestration, scheduling, and the session and execution lifecycles: ai/runtime/.
- Reasoning, retrieval, memory, prompts, providers, models, and tools: their namespaces.
- The maps of the AI layer, including the mapping of agent categories to namespaces: ai/architecture/.

An agent document references all of the above and owns none of it. It records only the durable, technology-neutral agent model.

# Loading Guidance

Agents are loaded at the Required tier defined in ai/README.md for most acting tasks, because acting is performed by an agent, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, for navigation; the core definition documents, architecture, capabilities, permissions, lifecycle, and specialization, are loaded whenever an agent acts; and the multi-agent documents, coordination, communication, and delegation, together with boundaries and versioning, are loaded at the Contextual tier when the situation calls for them. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New agent knowledge is added by creating new agent documents under ai/agents/, each following the Agent Document Standard and owning a single concern. The namespace grows only when a genuinely new agent concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This agent extensibility lets the agent model gain new capability, coordination, or specialization concerns over decades, and scale to tens of thousands of cooperating agents and to future autonomous organizations, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Agents namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/agents/agents.md declares the Reference authority level. Every agent-model member document declares the Specification authority level.
- Agent documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. An agent document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- ai/architecture/agent-map.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Agent documents. The agent-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. An agent composes the reasoning, retrieval, memory, and prompt namespaces to act, is orchestrated and executed by the runtime, is bounded by governance, and, in future, composes the Tools and Providers namespaces. It owns the agent model only, and never the layers it composes.
- Future consumption. The Tools and Providers namespaces an agent will compose are named in the Folder Structure as forward architecture. References to them here are intentional forward references, and this namespace owns none of their behavior.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
