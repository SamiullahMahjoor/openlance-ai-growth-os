---
id: OL-AI-OPERATIONS-OPERATIONS-BOUNDARIES
document: ai/operations/operations-boundaries.md

title: Open Lance AIOS Operations Boundaries

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
  - ai/operations/README.md
  - ai/operations/operations.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that operates the layer
  - Any contributor to the Operations namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns what operations never owns, and where operating stops. It owns the
  boundaries of operations only, and defers the governance and safety rules that
  bound it and the concerns of the surrounding namespaces to their owners.
---

# Open Lance AIOS Operations Boundaries

This document owns the architectural boundaries of operations. It is an operations document at the Specification authority level defined in ai/README.md, and it follows the Operations Document Standard in ai/operations/README.md. It instantiates the operational invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of operations only. It never defines the governance and safety rules that bound operations, owned by ai/governance/ and ai/safety/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one operational concern: what operations never owns, and where operating stops. It exists so that any human or AI agent can determine the limits of operating the layer, independent of how those limits are enforced.

# Principles

These are the enduring principles for operations boundaries. Each instantiates an operational invariant owned by ai/operations/README.md.

- Operations operates; it does not reason, execute, or change behavior. Operating observes and maintains the running of the layer and stops there; reasoning, execution, and behavior belong to other namespaces.
- Operations changes no rule and no behavior. Operating runs the layer within governance and never amends a rule or alters what a namespace does.
- Operations owns no protection or judgment. A protective response is owned by ai/safety/, and output judgment by ai/evaluation/; operations observes their signals and defers.
- Operations carries no truth and no tool. Operating carries no business truth, and it owns no monitoring tool, log, dashboard, infrastructure, or deployment system.

# Specification

Operations operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/, and the concerns beyond them by their namespaces.

- Behavior boundary. Operating observes and maintains the running of the layer and never produces or changes its behavior. Reasoning, retrieval, memory, prompts, agents, providers, and tools own the behavior; operations keeps their running well and performs none of it.
- Runtime boundary. Operations operates the runtime it runs and never orchestrates, schedules, or executes. The execution and its lifecycles are owned by ai/runtime/; operations observes their running without changing them.
- Governance boundary. Operating runs the layer within the rules owned by ai/governance/ and never defines, changes, or overrides a rule, and never makes a governed decision. A matter reserved to governance is deferred to it.
- Safety and evaluation boundary. Operations observes safety and evaluation signals and defers to them: a protective response, a refusal, and safe degradation are owned by ai/safety/, and the judgment of output quality is owned by ai/evaluation/. Operations never protects or judges.
- Evolution boundary. Operations keeps the running layer aligned as it evolves, but the evolution of the layer is owned by the Evolution namespace; operations never grows or migrates the layer's structure itself.
- Implementation boundary. Operations is a model of running the layer, never a monitoring tool, a log, a dashboard, an alerting platform, a deployment system, an infrastructure product, a provider, a framework, or code, and this namespace names none.

An operating action that would cross any of these boundaries does not proceed; a matter reserved to another namespace is deferred to it, and a protective matter is referred to ai/safety/. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- Operating observes and maintains the running of the layer and never produces or changes its behavior.
- Operations never orchestrates, schedules, or executes, and never defines or changes a governance rule.
- Operations observes safety and evaluation signals and defers protection and judgment to them.
- Operations carries no business truth and owns no monitoring tool, dashboard, infrastructure, or deployment system.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of operations only. It owns none of the following, and references each by its canonical owner.

- The governance and safety rules that bound operations: ai/governance/ and ai/safety/.
- The runtime execution and its boundaries: ai/runtime/ and ai/runtime/execution-boundaries.md.
- The behavior operated: the subject namespaces, including ai/reasoning/, ai/retrieval/, ai/memory/, ai/prompts/, ai/agents/, ai/providers/, and ai/tools/.
- The judgment of output and the evolution of the layer: ai/evaluation/ and the Evolution namespace.
- Any monitoring tool, dashboard, infrastructure, or deployment system: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/operations/README.md
- ai/operations/operations.md
- ai/runtime/execution-boundaries.md
- ai/safety/README.md
- ai/evaluation/README.md
- ai/governance/README.md
