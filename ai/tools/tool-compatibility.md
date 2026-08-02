---
id: OL-AI-TOOLS-TOOL-COMPATIBILITY
document: ai/tools/tool-compatibility.md

title: Open Lance AIOS Tool Compatibility

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
  Owns the compatibility model: whether a tool is compatible with a need, and
  whether a tool version is compatible with a consumer. It owns the compatibility
  model only, and defers the evolution and version rules and the declaration of
  capabilities to their owners.
---

# Open Lance AIOS Tool Compatibility

This document owns the tool compatibility model. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the compatibility model only. It never defines the evolution and version rules, owned by ai/tools/tool-versioning.md, and it never defines the declaration of capabilities, owned by ai/tools/tool-capabilities.md.

# Purpose

This document owns one tool concern: what it means for a tool to be compatible, both whether a tool's capabilities satisfy a need and whether a tool version is compatible with what a consumer expects. It exists so that any human or AI agent can determine whether a tool fits, independent of how capabilities are declared or how a tool evolves.

# Principles

These are the enduring principles for tool compatibility. Each instantiates a tool invariant owned by ai/tools/README.md.

- Compatibility is a defined relation. A tool is compatible with a need, or a version with a consumer, by a defined relation, never by assumption.
- Compatibility rests on declared capabilities. A tool is compatible with a need when its declared capabilities, owned by ai/tools/tool-capabilities.md, satisfy the need's requirements.
- Compatibility is neutral. Compatibility is judged in technology-neutral terms, so any compatible tool is interchangeable with another for the need.
- Incompatibility is explicit. An incompatible tool or version is identified as such, so an unsuitable tool is never used and a broken version is never assumed compatible.

# Specification

Compatibility is determined in the following way. This document owns the compatibility relation; the evolution and version rules are owned by ai/tools/tool-versioning.md, and the declaration of capabilities is owned by ai/tools/tool-capabilities.md.

- Capability compatibility. A tool is compatible with a need when the capabilities it declares under ai/tools/tool-capabilities.md satisfy the need's requirements. Selection under ai/tools/tool-selection.md chooses only among compatible tools, and this document owns what compatible means; it never chooses.
- Version compatibility. A tool version is compatible with a consumer when the consumer's requirements still hold against that version. A change that keeps them holding is compatible; a change that breaks them is incompatible and is versioned and migrated under ai/tools/tool-versioning.md, which owns the evolution and this document owns the relation it preserves.
- Interchangeability. Because compatibility is judged in neutral terms, two tools compatible with the same need are interchangeable for it, which is what makes selection and composition able to substitute one compatible tool for another.
- Explicit incompatibility. An incompatible tool or version is identified as incompatible, so it is not selected under ai/tools/tool-selection.md and not chained under ai/tools/tool-composition.md, and no consumer relies on a version it is not compatible with.

Compatibility defines whether a tool fits a need and whether a version fits a consumer; the evolution that preserves it and the capabilities it rests on are owned elsewhere. Compatibility is deterministic and the same at any scale.

# Invariants

- A tool is compatible with a need only when its declared capabilities satisfy the need's requirements.
- A version is compatible with a consumer only when the consumer's requirements still hold against it.
- Tools compatible with the same need are interchangeable for it.
- An incompatible tool or version is identified as such and never used as if compatible.
- Determining compatibility never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the compatibility model only. It owns none of the following, and references each by its canonical owner.

- The evolution, version rules, migration, and deprecation a version undergoes: ai/tools/tool-versioning.md.
- The declaration of the capabilities compatibility rests on: ai/tools/tool-capabilities.md.
- The choice of a compatible tool: ai/tools/tool-selection.md.
- The composition among compatible tools: ai/tools/tool-composition.md.
- The compatibility of an agent or other consumer's own definition: that consumer's namespace.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-capabilities.md
- ai/tools/tool-versioning.md
- ai/tools/tool-selection.md
- ai/tools/tool-composition.md
