---
id: OL-AI-TOOLS-TOOL-VERSIONING
document: ai/tools/tool-versioning.md

title: Open Lance AIOS Tool Versioning

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
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Tools namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns tool versioning, evolution, migration, and deprecation. It owns tool
  versioning only, and defers the compatibility a version preserves and the
  document amendment workflow to their owners.
---

# Open Lance AIOS Tool Versioning

This document owns how a tool definition is versioned and evolves. It is a tool document at the Specification authority level defined in ai/README.md, and it follows the Tool Document Standard in ai/tools/README.md. It instantiates the tool invariants and operates under the governance mandates at ai/governance/ and the safety architecture at ai/safety/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns tool versioning only. It never defines the compatibility a version preserves, owned by ai/tools/tool-compatibility.md, and it never defines the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Purpose

This document owns one tool concern: how a tool definition is versioned, evolves, migrates, and is deprecated over time, so that tool churn is absorbed without breaking the consumers that depend on it. It exists so that any human or AI agent can determine how a tool changes safely, independent of what compatibility means.

# Principles

These are the enduring principles for tool versioning. Each instantiates a tool invariant owned by ai/tools/README.md.

- A tool definition is versioned. A tool and its declared capabilities carry a version, so a change is identified and traceable.
- Change is governed. A tool definition evolves only under the change rules owned by ai/governance/, never arbitrarily.
- Compatibility is preserved or migrated. A change that preserves compatibility is absorbed; a change that breaks it is versioned and migrated, so no consumer is silently broken.
- Churn is absorbed here, not in the foundations. Tool change is absorbed by the tool model, so no foundational document is amended by operational churn.

# Specification

A tool definition is versioned and evolves in the following way. This document owns tool versioning; the compatibility a version preserves is owned by ai/tools/tool-compatibility.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Version rules. A tool definition or a capability declaration carries a version that identifies it, so a change is explicit and traceable, and the consumers that depend on it can be determined through the compatibility owned by ai/tools/tool-compatibility.md.
- Tool evolution. A tool definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the tool model grows and new tools are absorbed without redesign. Evolution never rewrites business truth and never alters the outside system a tool interacts with.
- Migration. A change that breaks compatibility, judged under ai/tools/tool-compatibility.md, is issued as a new version and migrated deliberately: consumers and compositions are moved to it in a controlled way, so there is never a window in which a consumer relies on an incompatible tool.
- Deprecation. A superseded tool definition or version is deprecated rather than abruptly removed, and it continues to serve compatible consumers until each is migrated, after which the tool is retired under ai/tools/tool-lifecycle.md. Deprecation never breaks a consumer or a composition that has not yet migrated.

Versioning keeps a tool definition identified, governed, and compatible as it evolves, absorbing tool churn; the compatibility relation and the amendment workflow are owned elsewhere. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- A tool definition carries a version, so a change to it is explicit and traceable.
- A tool definition evolves only under the governed change rules.
- A change that breaks compatibility is versioned and migrated, never applied silently.
- A deprecated tool continues to serve compatible consumers until each is migrated.
- Versioning a tool never reasons, decides, executes, expresses, retrieves, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns tool versioning only. It owns none of the following, and references each by its canonical owner.

- The compatibility relation a version preserves: ai/tools/tool-compatibility.md.
- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The document amendment workflow: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The retirement of a deprecated tool: ai/tools/tool-lifecycle.md.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/tools/README.md
- ai/tools/tools.md
- ai/tools/tool-compatibility.md
- ai/tools/tool-lifecycle.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
