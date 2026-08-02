---
id: OL-AI-TOOLS-TOOL-EXECUTION
document: ai/tools/tool-execution.md

title: Open Lance AIOS Tool Execution

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
  - ai/safety/boundary-enforcement.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the execution model: how a tool interaction is structured, execution
  ordering within a tool interaction, and execution boundaries. It owns the
  execution model only, and defers the scheduling and orchestration and the
  chaining of tools to their owners.
---

# Open Lance AIOS Tool Execution

This document owns the tool execution model. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the execution model only. It never defines the scheduling and orchestration of a tool interaction, owned by ai/runtime/, and it never defines the chaining of tools, owned by ai/tools/tool-composition.md.

# Purpose

This document owns one tool concern: how a single tool interaction is structured, the order of the steps within it, and the boundaries it stays within. It exists so that any human or AI agent can determine what it means to execute a tool, without an execution cycle and within bounds, independent of how the execution is scheduled or how tools are chained.

# Principles

These are the enduring principles for tool execution. Each instantiates a tool invariant owned by ai/tools/README.md.

- Execution is a model, not a schedule. This document defines what a tool execution is and how it is ordered; the scheduling, orchestration, and carrying out are owned by ai/runtime/.
- Validation precedes execution. A tool is validated under ai/tools/tool-validation.md before it executes, and it never executes when validation fails.
- Execution is bounded. A tool execution stays within its declared capabilities and the limits owned by ai/safety/, and never exceeds them.
- Execution ordering is acyclic. The steps within a tool execution follow a defined, acyclic order, so no execution cycle is possible.

# Specification

A tool interaction is executed in the following way. This document owns the execution model, its ordering, and its boundaries; the scheduling and orchestration are owned by ai/runtime/, and the chaining of tools is owned by ai/tools/tool-composition.md.

- The execution model. A tool execution is a single, bounded interaction with something outside the agent's reasoning, carried out through the tool chosen under ai/tools/tool-selection.md. This document owns what such an execution is as a model; the runtime carries it out, and the effect on the outside system is that system's own.
- Execution ordering. The steps within a single tool execution follow a defined, acyclic order, so that an execution proceeds deterministically from validated start to completion and never loops. This ordering is within one tool execution; the ordering of several tools is a composition, owned by ai/tools/tool-composition.md.
- Execution boundaries. A tool execution stays within the tool's declared capabilities under ai/tools/tool-capabilities.md, the execution boundaries owned by ai/runtime/execution-boundaries.md, and the protective boundaries applied by ai/safety/boundary-enforcement.md. An execution that would cross a boundary does not proceed; it is refused under ai/safety/refusal-model.md or handed to safe degradation under ai/safety/safe-degradation.md.
- Validated and governed. A tool executes only after it passes validation under ai/tools/tool-validation.md and only where the acting agent is permitted under ai/agents/agent-permissions.md. This document owns the execution model that follows a passed validation; the validation itself is owned by ai/tools/tool-validation.md.

Tool execution structures and bounds a single tool interaction; the scheduling that carries it and the chaining of tools are owned elsewhere, and the effect on the outside system is that system's own. The execution model is deterministic in its ordering and the same at any scale.

# Invariants

- A tool is validated before it executes and never executes when validation fails.
- A tool execution stays within the tool's declared capabilities and the limits owned by ai/safety/ and ai/runtime/.
- The steps within a tool execution follow a defined, acyclic order, so no execution cycle is possible.
- An execution that would cross a boundary is refused or degraded, never forced.
- Modelling an execution never schedules, orchestrates, reasons, decides, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the execution model only. It owns none of the following, and references each by its canonical owner.

- The scheduling, orchestration, and carrying out of a tool interaction: ai/runtime/.
- The execution boundaries and the safety boundaries an execution stays within: ai/runtime/execution-boundaries.md and ai/safety/boundary-enforcement.md.
- The validation that gates execution: ai/tools/tool-validation.md.
- The chaining and composition of several tools: ai/tools/tool-composition.md.
- The permission to execute a tool: ai/agents/agent-permissions.md.
- The effect on the outside system: that system itself, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-selection.md
- ai/tools/tool-validation.md
- ai/tools/tool-composition.md
- ai/tools/tool-capabilities.md
- ai/runtime/execution-boundaries.md
- ai/safety/boundary-enforcement.md
- ai/safety/refusal-model.md
- ai/safety/safe-degradation.md
- ai/agents/agent-permissions.md
