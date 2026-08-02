---
id: OL-AI-PROVIDERS-PROVIDER-CAPABILITIES
document: ai/providers/provider-capabilities.md

title: Open Lance AIOS Provider Capabilities

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
  Owns the capability model: how a provider's abilities are described, and
  capability declaration. It owns the provider capability model only, and defers
  whether a capability matches a need and the agent capability that composes a
  provider to their owners.
---

# Open Lance AIOS Provider Capabilities

This document owns the provider capability model. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the provider capability model only. It never defines whether a capability matches a need, owned by ai/providers/provider-compatibility.md, and it never defines the agent capability that composes a provider, owned by ai/agents/agent-capabilities.md.

# Purpose

This document owns one provider concern: how a provider's abilities are described, so that what a provider can do is explicit and declared. It exists so that any human or AI agent can determine what a provider offers, independent of whether it matches a given need and of how any ability is carried out.

# Principles

These are the enduring principles for provider capabilities. Each instantiates a provider invariant owned by ai/providers/README.md.

- A capability is a declared ability. A provider declares what it can do, so its abilities are explicit and never assumed.
- A capability describes; it does not perform. A capability names an ability of the abstraction; the intelligence that carries it out is the source's own.
- Capabilities are neutral. A capability is described in provider- and model-neutral terms, so it is comparable across providers without binding to a vendor or model.
- Capabilities are bounded. A provider offers only its declared capabilities, and it is never selected for an ability it does not declare.

# Specification

A provider's capabilities are described in the following way. This document owns the capability model; whether a capability matches a need is owned by ai/providers/provider-compatibility.md, and the intelligence that carries out a capability is the source's own.

- The capability model. A capability is a provider's declared ability, described in neutral terms so that providers can be compared by what they offer. A capability names an ability of the provider abstraction; it never defines the intelligence a source produces, which is outside this architecture.
- Capability declaration. A provider declares its capabilities as part of its registration under ai/providers/provider-lifecycle.md, so that its abilities are explicit and discoverable. A capability a provider does not declare is not available from it.
- Neutral description. Capabilities are described independently of any provider, model, or technology, so that a capability means the same thing across providers and the layer stays provider- and model-neutral through ai/providers/provider-abstraction.md.
- Capabilities against need. A declared capability is what selection and compatibility draw on: whether a capability satisfies a need is owned by ai/providers/provider-compatibility.md, and the choice of a provider that offers it is owned by ai/providers/provider-selection.md. This document owns only how the capability is described.

Capabilities describe what a provider can do; whether that matches a need and which provider is chosen are owned elsewhere, and the intelligence itself is the source's own. The capability model is deterministic and the same at any scale.

# Invariants

- A provider offers only its declared capabilities, and is never selected for an undeclared one.
- A capability names an ability of the abstraction and never defines the intelligence a source produces.
- Capabilities are described in provider- and model-neutral terms.
- The same provider declares the same capabilities, with no randomness.
- Describing capabilities never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the provider capability model only. It owns none of the following, and references each by its canonical owner.

- Whether a capability matches a need, and version compatibility: ai/providers/provider-compatibility.md.
- The choice of a provider that offers a capability: ai/providers/provider-selection.md.
- The neutral presentation the capabilities are described through: ai/providers/provider-abstraction.md.
- The agent capability that composes a provider: ai/agents/agent-capabilities.md.
- The intelligence that carries out a capability: the source itself, outside every knowledge document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-compatibility.md
- ai/providers/provider-selection.md
- ai/providers/provider-abstraction.md
- ai/providers/provider-lifecycle.md
- ai/agents/agent-capabilities.md
