---
id: OL-AI-TOOLS-TOOL-SELECTION
document: ai/tools/tool-selection.md

title: Open Lance AIOS Tool Selection

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
  Owns the selection model: how a tool is chosen for a need, deterministically.
  It owns the tool selection model only, and defers the execution of the chosen
  tool and the compatibility a selection rests on to their owners.
---

# Open Lance AIOS Tool Selection

This document owns the tool selection model. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the selection model only. It never defines the execution of the chosen tool, owned by ai/tools/tool-execution.md, and it never defines the compatibility a selection rests on, owned by ai/tools/tool-compatibility.md.

# Purpose

This document owns one tool concern: how a tool is chosen for a need, from the available, compatible tools, deterministically. It exists so that any human or AI agent can determine which tool is chosen and why, independent of how the tool is then executed and of the reasoning that produced the need.

# Principles

These are the enduring principles for tool selection. Each instantiates a tool invariant owned by ai/tools/README.md.

- Selection is deterministic. The same need and the same available tools under the same rules yield the same choice, with no randomness.
- Selection chooses from the compatible. A tool is chosen only from those compatible with the need under ai/tools/tool-compatibility.md, so an unsuitable tool is never chosen.
- Selection is governed and bounded. A tool is chosen only where an agent is permitted to use it under ai/governance/ and within the limits owned by ai/safety/, and never one that would exceed them.
- Selection matches; it does not reason. Selection is a deterministic match of a need to a tool, not a judgment about the task; the reasoning that formed the need is owned by ai/reasoning/.

# Specification

A tool is chosen in the following way. This document owns the selection model; the execution of the chosen tool is owned by ai/tools/tool-execution.md, and whether a tool is compatible with the need is owned by ai/tools/tool-compatibility.md.

- The candidate set. Selection considers only tools that are active under ai/tools/tool-lifecycle.md and compatible with the need under ai/tools/tool-compatibility.md. A tool that is not active or not compatible is not a candidate.
- Deterministic choice. From the candidate set, a tool is chosen by a defined, deterministic ordering over the need and the tools' declared capabilities, so the same need and candidate set always yield the same tool. Where the ordering does not settle on one, a defined tiebreak resolves it, so selection is never ambiguous and never random.
- Governed and safe selection. The chosen tool must be one the acting agent is permitted to use, under the permissions owned by ai/agents/agent-permissions.md and the rules owned by ai/governance/, and usable within the limits owned by ai/safety/. A choice that would exceed permission, governance, or safety is not made; the next compatible tool is chosen, or the matter is refused under ai/safety/refusal-model.md.
- Selection, not execution or reasoning. Selection ends at the choice of a tool. Executing it is owned by ai/tools/tool-execution.md, and any reasoning about the task is owned by ai/reasoning/; selection makes no decision about the task itself.

Selection chooses a compatible, permitted, safe tool deterministically; the execution that follows and the compatibility it rests on are owned elsewhere. Selection is the same at any scale.

# Invariants

- The same need and the same available tools under the same rules yield the same choice.
- A tool is chosen only from those active and compatible with the need.
- A chosen tool is one the agent is permitted to use, under governance and within safety limits.
- Selection is settled by a defined tiebreak, so it is never ambiguous or random.
- Choosing a tool never reasons, decides the task, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the selection model only. It owns none of the following, and references each by its canonical owner.

- The execution of the chosen tool: ai/tools/tool-execution.md.
- Whether a tool is compatible with the need: ai/tools/tool-compatibility.md.
- The active tools selection chooses among: ai/tools/tool-lifecycle.md.
- The permission to use a tool, and the rules and limits a selection respects: ai/agents/agent-permissions.md, ai/governance/, and ai/safety/.
- The reasoning that produced the need: ai/reasoning/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-compatibility.md
- ai/tools/tool-execution.md
- ai/tools/tool-lifecycle.md
- ai/agents/agent-permissions.md
- ai/safety/refusal-model.md
- ai/reasoning/README.md
