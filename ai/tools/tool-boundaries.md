---
id: OL-AI-TOOLS-TOOL-BOUNDARIES
document: ai/tools/tool-boundaries.md

title: Open Lance AIOS Tool Boundaries

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
  - ai/tools/README.md
  - ai/tools/tools.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns what tools never own, and where a tool stops. It owns the boundaries of
  tools only, and defers the governance and safety rules that bound them and the
  concerns of the surrounding namespaces to their owners.
---

# Open Lance AIOS Tool Boundaries

This document owns the architectural boundaries of tools. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the boundaries of tools only. It never defines the governance and safety rules that bound tools, owned by ai/governance/ and ai/safety/, and it never defines the concerns of the surrounding namespaces, owned by them.

# Purpose

This document owns one tool concern: what a tool never owns, and where a tool stops. It exists so that any human or AI agent can determine the limits of a tool, independent of how those limits are enforced.

# Principles

These are the enduring principles for tool boundaries. Each instantiates a tool invariant owned by ai/tools/README.md.

- A tool interacts; it does not reason, decide, or execute itself. A tool reaches outside the agent's reasoning and stops there; reasoning, decision, and execution belong to other namespaces.
- A tool holds no authority of its own. A tool owns no permission and no policy; it is used only where an agent is permitted, under governance and within safety.
- A tool carries no truth and no intelligence. A tool carries no business truth and produces no intelligence of its own; the outside effect is the outside system's own.
- A tool stays within governance and safety. A tool is selected, validated, executed, and composed only within the rules governance sets and the limits safety allows.

# Specification

A tool operates within the following architectural boundaries. This document owns the boundaries; the rules that set them are owned by ai/governance/ and ai/safety/, and the concerns beyond them by their namespaces.

- Reasoning and decision boundary. A tool performs no reasoning and makes no decision. Reasoning is owned by ai/reasoning/, and the decision to use a tool, and the reasoning behind it, are formed outside the tool. A tool is invoked; it never chooses to act.
- Authority boundary. A tool holds no permission and no policy. Whether a tool may be used is owned by the permissions at ai/agents/agent-permissions.md and the rules at ai/governance/; a tool never grants, holds, or escalates authority.
- Execution boundary. A tool is executed by ai/runtime/, and its execution is bounded by ai/safety/ and ai/runtime/execution-boundaries.md. A tool never orchestrates, schedules, or executes itself, and it never networks or defines a protocol or interface, which are implementation.
- Provider and intelligence boundary. A tool is not a provider and produces no intelligence. The abstraction over a source of intelligence is owned by ai/providers/; a tool abstracts an external interaction, and an agent composes both. The intelligence and the outside effect are outside this namespace.
- Truth boundary. A tool carries no business truth and never owns, restates, amends, or becomes it, which is owned by the knowledge repository. The outside system a tool interacts with is that system's own, and its output is judged by the Evaluation namespace, not owned here.
- Implementation boundary. A tool is an architectural capability, never a provider, a model, a framework, a protocol, an interface, a network, or code, and this namespace names none.

A use that would cross any of these boundaries does not proceed; it is refused under ai/safety/refusal-model.md or escalated under ai/governance/escalation.md. The boundaries are architectural; how they are enforced is the runtime's execution, outside every knowledge document.

# Invariants

- A tool performs no reasoning and makes no decision.
- A tool holds no permission and no policy, and never grants or escalates authority.
- A tool never orchestrates, schedules, or executes itself, and carries no truth and no intelligence.
- A tool is used only within the rules governance sets and the limits safety allows.
- Enforcing a boundary never changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the boundaries of tools only. It owns none of the following, and references each by its canonical owner.

- The governance and safety rules and limits that bound tools: ai/governance/ and ai/safety/.
- The runtime boundaries of an execution: ai/runtime/execution-boundaries.md.
- The reasoning, prompts, memory, retrieval, and provider abstraction around a tool: ai/reasoning/, ai/prompts/, ai/memory/, ai/retrieval/, and ai/providers/.
- The agent that composes a tool and the permission to use it: ai/agents/ and ai/agents/agent-permissions.md.
- The outside system a tool interacts with and the evaluation of its output: that system itself and the Evaluation namespace.
- Any mechanism that enforces a boundary: implementation, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/runtime/execution-boundaries.md
- ai/agents/agent-permissions.md
- ai/providers/README.md
- ai/safety/refusal-model.md
- ai/governance/escalation.md
