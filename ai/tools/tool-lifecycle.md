---
id: OL-AI-TOOLS-TOOL-LIFECYCLE
document: ai/tools/tool-lifecycle.md

title: Open Lance AIOS Tool Lifecycle

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
  Owns the phases of a tool, including registration, discovery, activation, the
  execution lifecycle, and retirement. It owns the tool lifecycle only, and defers
  the execution model within the operation phase and the versioning of a
  definition to their owners.
---

# Open Lance AIOS Tool Lifecycle

This document owns the phases of a tool. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the tool lifecycle only. It never defines the execution model within the operation phase, owned by ai/tools/tool-execution.md, and it never defines the versioning of a tool definition, owned by ai/tools/tool-versioning.md.

# Purpose

This document owns one tool concern: the phases a tool passes through, from being registered to being retired, including how a registered tool is discovered and the lifecycle of a single tool execution. It exists so that any human or AI agent can determine the shape of a tool's life, independent of how a tool execution is modeled.

# Principles

These are the enduring principles for the tool lifecycle. Each instantiates a tool invariant owned by ai/tools/README.md.

- A tool has a defined beginning and end. It begins when it is registered and ends when it is retired; a tool is never used before activation or after retirement.
- Registration precedes availability. A tool exists and is discoverable before it is available to be selected and executed.
- Every execution is bounded. A single tool execution has a defined beginning and end within the operation phase, so no tool execution runs unbounded.
- Retirement is clean. A retired tool is no longer selected or executed, and its retirement never disrupts a tool that remains.

# Specification

A tool passes through the following phases. This document owns the phases; the execution model within the operation phase is owned by ai/tools/tool-execution.md, and the change of a tool definition over time is owned by ai/tools/tool-versioning.md.

- Registration. A tool is registered with its distinct identity under ai/tools/tool-architecture.md and its declared capabilities under ai/tools/tool-capabilities.md, so that it exists as a capability and is discoverable. Registration records that the tool exists; it never activates or executes it.
- Discovery. A registered tool is discoverable by its identity and declared capabilities, so that selection can find it. Discovery finds a registered tool; it never chooses one, which is owned by ai/tools/tool-selection.md.
- Activation. A registered tool is activated, becoming available to be selected and executed. A tool is used only while active, and activation never widens its declared capabilities.
- Execution lifecycle. While a tool is in operation, each use of it is a single tool execution with a defined beginning and end: it is validated under ai/tools/tool-validation.md, then executed under ai/tools/tool-execution.md and carried out by ai/runtime/, then completed. The execution lifecycle owns that each execution begins, runs, and ends within the operation phase; how the execution is modelled is owned by ai/tools/tool-execution.md.
- Retirement. A tool is retired: it is deactivated, is no longer selected or executed, and is superseded or removed. Retirement is orderly and never disrupts a tool that remains, and a composition that would have used a retired tool is corrected under ai/tools/tool-composition.md.

Each phase precedes the next, and a tool is never used outside Activation and Operation. The lifecycle is the same regardless of any tool or technology, and it is the same for one tool or many thousands.

# Invariants

- A tool is registered before it is discoverable, and discoverable before it is activated.
- A tool is used only while active, and activation never widens its declared capabilities.
- Each tool execution has a defined beginning and end within the operation phase.
- A retired tool is no longer selected or executed, and its retirement never disrupts a tool that remains.
- A lifecycle transition never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the tool lifecycle only. It owns none of the following, and references each by its canonical owner.

- The identity registered and the capabilities declared: ai/tools/tool-architecture.md and ai/tools/tool-capabilities.md.
- The selection of an available tool: ai/tools/tool-selection.md.
- The validation and execution model of a tool execution: ai/tools/tool-validation.md and ai/tools/tool-execution.md.
- The scheduling and orchestration that carry an execution: ai/runtime/.
- The versioning of a tool definition over time: ai/tools/tool-versioning.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-architecture.md
- ai/tools/tool-capabilities.md
- ai/tools/tool-selection.md
- ai/tools/tool-validation.md
- ai/tools/tool-execution.md
- ai/tools/tool-versioning.md
