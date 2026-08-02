---
id: OL-AI-PROVIDERS-PROVIDER-COMPATIBILITY
document: ai/providers/provider-compatibility.md

title: Open Lance AIOS Provider Compatibility

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
  - ai/providers/README.md
  - ai/providers/providers.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Providers namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns the compatibility model: whether a provider is compatible with a need, and
  whether a provider version is compatible with a consumer. It owns the
  compatibility model only, and defers the evolution and version rules and the
  declaration of capabilities to their owners.
---

# Open Lance AIOS Provider Compatibility

This document owns the provider compatibility model. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the compatibility model only. It never defines the evolution and version rules, owned by ai/providers/provider-versioning.md, and it never defines the declaration of capabilities, owned by ai/providers/provider-capabilities.md.

# Purpose

This document owns one provider concern: what it means for a provider to be compatible, both whether a provider's capabilities satisfy a need and whether a provider version is compatible with what a consumer expects. It exists so that any human or AI agent can determine whether a provider fits, independent of how capabilities are declared or how a provider evolves.

# Principles

These are the enduring principles for provider compatibility. Each instantiates a provider invariant owned by ai/providers/README.md.

- Compatibility is a defined relation. A provider is compatible with a need, or a version with a consumer, by a defined relation, never by assumption.
- Compatibility rests on declared capabilities. A provider is compatible with a need when its declared capabilities, owned by ai/providers/provider-capabilities.md, satisfy the need's requirements.
- Compatibility is neutral. Compatibility is judged in provider- and model-neutral terms, so any compatible provider is interchangeable with another for the need.
- Incompatibility is explicit. An incompatible provider or version is identified as such, so an unsuitable provider is never used and a broken version is never assumed compatible.

# Specification

Compatibility is determined in the following way. This document owns the compatibility relation; the evolution and version rules are owned by ai/providers/provider-versioning.md, and the declaration of capabilities is owned by ai/providers/provider-capabilities.md.

- Capability compatibility. A provider is compatible with a need when the capabilities it declares under ai/providers/provider-capabilities.md satisfy the need's requirements. Selection under ai/providers/provider-selection.md chooses only among compatible providers, and this document owns what compatible means; it never chooses.
- Version compatibility. A provider version is compatible with a consumer when the consumer's requirements still hold against that version. A change that keeps them holding is compatible; a change that breaks them is incompatible and is versioned and migrated under ai/providers/provider-versioning.md, which owns the evolution and this document owns the relation it preserves.
- Interchangeability. Because compatibility is judged in neutral terms, two providers compatible with the same need are interchangeable for it, which is what makes selection, routing, and fallback able to substitute one compatible provider for another.
- Explicit incompatibility. An incompatible provider or version is identified as incompatible, so it is not selected under ai/providers/provider-selection.md and not fallen back to under ai/providers/provider-fallback.md, and no consumer relies on a version it is not compatible with.

Compatibility defines whether a provider fits a need and whether a version fits a consumer; the evolution that preserves it and the capabilities it rests on are owned elsewhere. Compatibility is deterministic and the same at any scale.

# Invariants

- A provider is compatible with a need only when its declared capabilities satisfy the need's requirements.
- A version is compatible with a consumer only when the consumer's requirements still hold against it.
- Providers compatible with the same need are interchangeable for it.
- An incompatible provider or version is identified as such and never used as if compatible.
- Determining compatibility never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the compatibility model only. It owns none of the following, and references each by its canonical owner.

- The evolution, version rules, migration, and deprecation a version undergoes: ai/providers/provider-versioning.md.
- The declaration of the capabilities compatibility rests on: ai/providers/provider-capabilities.md.
- The choice of a compatible provider: ai/providers/provider-selection.md.
- The fallback among compatible providers: ai/providers/provider-fallback.md.
- The compatibility of an agent or other consumer's own definition: that consumer's namespace.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-capabilities.md
- ai/providers/provider-versioning.md
- ai/providers/provider-selection.md
- ai/providers/provider-fallback.md
