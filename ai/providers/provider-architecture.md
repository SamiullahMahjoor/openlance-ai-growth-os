---
id: OL-AI-PROVIDERS-PROVIDER-ARCHITECTURE
document: ai/providers/provider-architecture.md

title: Open Lance AIOS Provider Architecture

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
  Owns the architectural definition of a provider: its identity and the parts it
  is composed of. It owns the provider structural model only, and defers the
  lifecycle, the abstraction it presents, and the intelligence a source produces
  to their owners.
---

# Open Lance AIOS Provider Architecture

This document owns the architectural definition of a provider. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the provider structural model only, including provider identity. It never defines the lifecycle of a provider, owned by ai/providers/provider-lifecycle.md, and it never defines the abstraction a provider presents, owned by ai/providers/provider-abstraction.md.

# Purpose

This document owns one provider concern: what a provider is structurally, its identity and the parts it is composed of, as an architectural abstraction over a source of intelligence. It exists so that any human or AI agent can determine the anatomy of a provider, independent of how it is used or what intelligence its source produces.

# Principles

These are the enduring principles for provider architecture. Each instantiates a provider invariant owned by ai/providers/README.md.

- A provider is an abstraction, not a vendor. A provider is the architectural stand-in for a source of intelligence; it is never a named vendor, model, or implementation.
- A provider has a distinct identity. Every provider is uniquely identified, so it can be registered, described, selected, and routed to as one provider.
- A provider is composed of defined parts. A provider is composed of its identity, its declared capabilities, and the abstraction it presents, each owned by its named document.
- A provider's structure is deterministic. The same provider definition resolves to the same identity and parts, with no randomness.

# Specification

A provider is defined structurally in the following way. This document owns the structural model; the lifecycle of a provider is owned by ai/providers/provider-lifecycle.md, and the abstraction it presents is owned by ai/providers/provider-abstraction.md.

- Provider identity. A provider has a distinct, stable identity that uniquely identifies it as an abstraction over a source of intelligence, so that it can be registered, discovered, selected, routed to, and held to its declared capabilities as one provider. Identity distinguishes one provider from another and is never shared; how an identity is registered and discovered is owned by ai/providers/provider-lifecycle.md.
- Provider parts. A provider is composed of its identity, the capabilities it declares under ai/providers/provider-capabilities.md, and the neutral abstraction it presents under ai/providers/provider-abstraction.md. Each part is owned by its named document; this document owns that a provider is composed of them.
- Abstraction over a source. A provider stands for a source of intelligence and never is one. The source and the intelligence it produces are outside this architecture; this document defines the provider that abstracts it, never the source or its output.
- Governed and used elsewhere. A provider is selected, routed to, and used within the rules owned by ai/governance/ and the limits owned by ai/safety/, and is invoked by ai/runtime/. This document defines what a provider is; it never defines how a provider is governed, used, or executed.

A provider is therefore a uniquely identified abstraction composed of declared capabilities and a neutral presentation, standing for a source of intelligence. The structural model is the same regardless of any provider, model, or technology, and it is the same for one provider or many thousands.

# Invariants

- Every provider has a distinct, stable identity that is never shared.
- A provider is composed of its identity, capabilities, and abstraction, each owned by its named document.
- A provider stands for a source of intelligence and is never the source or its output.
- The same provider definition resolves to the same structure, with no randomness.
- Defining a provider's structure never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the provider structural model only. It owns none of the following, and references each by its canonical owner.

- The lifecycle, registration, activation, and retirement of a provider: ai/providers/provider-lifecycle.md.
- The capabilities and the abstraction that compose a provider: ai/providers/provider-capabilities.md and ai/providers/provider-abstraction.md.
- The intelligence a source produces: the source itself, outside every knowledge document.
- The invocation and execution of a provider: ai/runtime/.
- The rules and limits that bound a provider: ai/governance/ and ai/safety/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-lifecycle.md
- ai/providers/provider-capabilities.md
- ai/providers/provider-abstraction.md
