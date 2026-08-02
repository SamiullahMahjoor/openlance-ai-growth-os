---
id: OL-AI-TOOLS-TOOL-CAPABILITIES
document: ai/tools/tool-capabilities.md

title: Open Lance AIOS Tool Capabilities

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
  Owns the capability model: capability declaration and capability inheritance.
  It owns the tool capability model only, and defers whether a capability matches
  a need and the agent capability that composes a tool to their owners.
---

# Open Lance AIOS Tool Capabilities

This document owns the tool capability model. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the tool capability model only. It never defines whether a capability matches a need, owned by ai/tools/tool-compatibility.md, and it never defines the agent capability that composes a tool, owned by ai/agents/agent-capabilities.md.

# Purpose

This document owns one tool concern: how a tool's abilities are declared, and how a capability is inherited, so that what a tool can do is explicit. It exists so that any human or AI agent can determine what a tool offers, independent of whether it matches a given need and of how any interaction is carried out.

# Principles

These are the enduring principles for tool capabilities. Each instantiates a tool invariant owned by ai/tools/README.md.

- A capability is a declared ability. A tool declares what it can do, so its abilities are explicit and never assumed.
- A capability describes; it does not act. A capability names an ability of the tool; the interaction it carries out is performed only on execution, under ai/tools/tool-execution.md.
- Capabilities are neutral. A capability is described in technology-neutral terms, so it is comparable across tools without naming any provider, technology, or outside system.
- Capability inheritance is single and acyclic. A capability inherited from a base tool resolves through a single, acyclic inheritance, so capabilities never conflict or cycle.

# Specification

A tool's capabilities are modelled in the following way. This document owns the capability model; whether a capability matches a need is owned by ai/tools/tool-compatibility.md, and the interaction a capability carries out is owned by ai/tools/tool-execution.md.

- Capability declaration. A tool declares its capabilities as part of its registration under ai/tools/tool-lifecycle.md, describing what it can do in technology-neutral terms. A capability a tool does not declare is not available from it, and a tool is never selected for an undeclared capability.
- Capability inheritance. A tool may inherit capabilities from a base tool through a single, acyclic inheritance. Where inherited capabilities overlap, they resolve by the higher-authority declaration, then the single owner, then the more specific, so capabilities never conflict; an unresolvable capability conflict is escalated under ai/governance/escalation.md rather than guessed.
- Neutral description. Capabilities are described independently of any provider, technology, or outside system, so a capability means the same thing across tools and the tool model stays technology-neutral.
- Capabilities against need. A declared capability is what selection and compatibility draw on: whether a capability satisfies a need is owned by ai/tools/tool-compatibility.md, and the choice of a tool that offers it is owned by ai/tools/tool-selection.md. This document owns only how the capability is declared and inherited.

Capabilities declare what a tool can do; whether that matches a need and which tool is chosen are owned elsewhere, and the interaction itself is performed on execution. The capability model is deterministic and the same at any scale.

# Invariants

- A tool offers only its declared capabilities, and is never selected for an undeclared one.
- A capability names an ability of the tool and never performs the interaction, which occurs on execution.
- Capability inheritance is single and acyclic, and overlapping capabilities resolve by authority, then owner, then specificity.
- Capabilities are described in technology-neutral terms.
- Declaring capabilities never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the tool capability model only. It owns none of the following, and references each by its canonical owner.

- Whether a capability matches a need, and version compatibility: ai/tools/tool-compatibility.md.
- The choice of a tool that offers a capability: ai/tools/tool-selection.md.
- The interaction a capability carries out on execution: ai/tools/tool-execution.md.
- The agent capability that composes a tool: ai/agents/agent-capabilities.md.
- The escalation of an unresolvable capability conflict: ai/governance/escalation.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-compatibility.md
- ai/tools/tool-selection.md
- ai/tools/tool-execution.md
- ai/tools/tool-lifecycle.md
- ai/agents/agent-capabilities.md
- ai/governance/escalation.md
