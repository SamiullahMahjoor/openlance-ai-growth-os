---
id: OL-AI-TOOLS-TOOL-COMPOSITION
document: ai/tools/tool-composition.md

title: Open Lance AIOS Tool Composition

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
  Owns the composition model: chaining of tools and reusable compositions. It
  owns the composition model only, and defers the execution ordering within a
  single tool interaction and the coordination of agents to their owners.
---

# Open Lance AIOS Tool Composition

This document owns the tool composition model. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the composition model only. It never defines the execution ordering within a single tool interaction, owned by ai/tools/tool-execution.md, and it never defines the coordination of agents, owned by ai/agents/agent-coordination.md.

# Purpose

This document owns one tool concern: how several tools are chained into a composition, and how a composition is made reusable, so that a sequence of tool interactions is defined, bounded, and deterministic. It exists so that any human or AI agent can determine how tools combine, without an unbounded or circular chain, independent of how a single tool executes.

# Principles

These are the enduring principles for tool composition. Each instantiates a tool invariant owned by ai/tools/README.md.

- Composition chains tools; it does not execute one. Composition orders several tools into a sequence; how a single tool executes is owned by ai/tools/tool-execution.md.
- A composition is bounded and acyclic. A chain of tools is finite and acyclic, so no unbounded chain and no composition cycle are possible.
- A composition is governed and validated throughout. Every tool in a composition is selected, validated, and executed under the same rules as a single tool, so a composition never bypasses protection.
- A composition is reusable and deterministic. A defined composition can be reused, and the same composition over the same inputs orders the same tools the same way.

# Specification

Tools are composed in the following way. This document owns the composition model; the execution of each tool in a composition is owned by ai/tools/tool-execution.md, and the coordination of agents is owned by ai/agents/agent-coordination.md.

- The composition model. A composition is an ordered chain of tools, in which several tool interactions are sequenced toward a combined outcome. Each tool in the chain is selected under ai/tools/tool-selection.md, validated under ai/tools/tool-validation.md, and executed under ai/tools/tool-execution.md; this document owns how they are ordered into a chain, not how any one executes.
- Chaining. Tools are chained in a defined order, so the outcome of one tool may lead into the next. The chain is finite and acyclic: a tool already in a chain is not re-entered so as to form a cycle, and the chain has a bounded length, so no unbounded or circular composition is possible. A composition that would exceed the bound or close a cycle is refused under ai/safety/refusal-model.md.
- Reusable compositions. A composition may be defined once and reused, so a common chain of tools is defined in one place and applied again. Reuse is architectural, the reuse of a defined chain, and never the reuse of business truth or of an outside effect.
- Governed throughout. Every tool in a composition is permitted, validated, and bounded exactly as a single tool, so a composition never escalates authority, bypasses validation, or exceeds the limits owned by ai/safety/. A composition is no more permitted than the tools it chains.

Composition chains and reuses tools within bounds; the execution of each tool and the coordination of agents are owned elsewhere. Composition is deterministic and the same at any scale.

# Invariants

- A composition is a finite, acyclic chain of tools, so no unbounded or circular composition is possible.
- Every tool in a composition is selected, validated, and executed under the same rules as a single tool.
- A composition never escalates authority or bypasses validation or safety limits.
- The same composition over the same inputs orders the same tools the same way.
- Composing tools never executes a tool, reasons, decides, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the composition model only. It owns none of the following, and references each by its canonical owner.

- The execution ordering within a single tool interaction: ai/tools/tool-execution.md.
- The selection and validation of each tool in a chain: ai/tools/tool-selection.md and ai/tools/tool-validation.md.
- The coordination of agents that a composition may serve: ai/agents/agent-coordination.md.
- The refusal of an out-of-bound or cyclic composition: ai/safety/refusal-model.md.
- The limits a composition stays within: ai/safety/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-execution.md
- ai/tools/tool-selection.md
- ai/tools/tool-validation.md
- ai/agents/agent-coordination.md
- ai/safety/refusal-model.md
