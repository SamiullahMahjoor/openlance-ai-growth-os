---
id: OL-AI-PROVIDERS-PROVIDER-VERSIONING
document: ai/providers/provider-versioning.md

title: Open Lance AIOS Provider Versioning

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
  - ai/governance/change-governance.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Providers namespace

provenance:
  - Derived from ai/README.md and the AI governance mandates

loading_priority: Contextual

summary: >
  Owns provider versioning, evolution, migration, deprecation, and change
  governance consumption. It owns provider versioning only, and defers the
  compatibility a version preserves and the document amendment workflow to their
  owners.
---

# Open Lance AIOS Provider Versioning

This document owns how a provider definition is versioned and evolves. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns provider versioning only. It never defines the compatibility a version preserves, owned by ai/providers/provider-compatibility.md, and it never defines the document amendment workflow, owned by ai/CONTRIBUTING.md.

# Purpose

This document owns one provider concern: how a provider definition is versioned, evolves, migrates, and is deprecated over time, so that provider and model churn is absorbed without breaking the consumers that depend on it. It exists so that any human or AI agent can determine how a provider changes safely, independent of what compatibility means.

# Principles

These are the enduring principles for provider versioning. Each instantiates a provider invariant owned by ai/providers/README.md.

- A provider definition is versioned. A provider, its capabilities, and its abstraction carry a version, so a change is identified and traceable.
- Change is governed. A provider definition evolves only under the change rules owned by ai/governance/, never arbitrarily.
- Compatibility is preserved or migrated. A change that preserves compatibility is absorbed; a change that breaks it is versioned and migrated, so no consumer is silently broken.
- Churn is absorbed here, not in the foundations. Provider and model change is absorbed by this abstraction, so no foundational document is amended by operational churn.

# Specification

A provider definition is versioned and evolves in the following way. This document owns provider versioning; the compatibility a version preserves is owned by ai/providers/provider-compatibility.md, and the amendment of a document in this namespace is owned by ai/CONTRIBUTING.md.

- Version rules. A provider definition, a capability declaration, or an abstraction carries a version that identifies it, so a change is explicit and traceable, and the consumers that depend on it can be determined through the compatibility owned by ai/providers/provider-compatibility.md.
- Provider evolution. A provider definition evolves by governed change under ai/governance/change-governance.md, additively where possible, so the provider model grows and new providers and models are absorbed without redesign. Evolution never rewrites business truth and never alters the intelligence a source produces, which is the source's own.
- Migration. A change that breaks compatibility, judged under ai/providers/provider-compatibility.md, is issued as a new version and migrated deliberately: consumers are moved to it in a controlled way, so there is never a window in which a consumer relies on an incompatible provider.
- Deprecation. A superseded provider definition or version is deprecated rather than abruptly removed, and it continues to serve compatible consumers until each is migrated, after which the provider is retired under ai/providers/provider-lifecycle.md. Deprecation never breaks a consumer that has not yet migrated.

Versioning keeps a provider definition identified, governed, and compatible as it evolves, absorbing provider and model churn; the compatibility relation and the amendment workflow are owned elsewhere. Versioning is deterministic in outcome and the same at any scale.

# Invariants

- A provider definition carries a version, so a change to it is explicit and traceable.
- A provider definition evolves only under the governed change rules.
- A change that breaks compatibility is versioned and migrated, never applied silently.
- A deprecated provider continues to serve compatible consumers until each is migrated.
- Versioning a provider never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns provider versioning only. It owns none of the following, and references each by its canonical owner.

- The compatibility relation a version preserves: ai/providers/provider-compatibility.md.
- The permission, review, and approval of a change: ai/governance/change-governance.md.
- The document amendment workflow: ai/CONTRIBUTING.md.
- The repository evolution map and namespace maturity: ai/architecture/repository-evolution.md.
- The retirement of a deprecated provider: ai/providers/provider-lifecycle.md.
- The versioning of business truth: the knowledge repository.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-compatibility.md
- ai/providers/provider-lifecycle.md
- ai/governance/change-governance.md
- ai/architecture/repository-evolution.md
