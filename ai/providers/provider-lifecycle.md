---
id: OL-AI-PROVIDERS-PROVIDER-LIFECYCLE
document: ai/providers/provider-lifecycle.md

title: Open Lance AIOS Provider Lifecycle

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
  Owns the phases of a provider, including registration, activation, operation,
  and retirement, and provider discovery. It owns the provider lifecycle only,
  and defers the selection of a provider and the versioning of a definition to
  their owners.
---

# Open Lance AIOS Provider Lifecycle

This document owns the phases of a provider. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the provider lifecycle only. It never defines the selection of a provider, owned by ai/providers/provider-selection.md, and it never defines the versioning of a provider definition, owned by ai/providers/provider-versioning.md.

# Purpose

This document owns one provider concern: the phases a provider passes through, from being registered to being retired, and how a registered provider is discovered. It exists so that any human or AI agent can determine the shape of a provider's life, independent of how it is selected or used.

# Principles

These are the enduring principles for the provider lifecycle. Each instantiates a provider invariant owned by ai/providers/README.md.

- A provider has a defined beginning and end. It begins when it is registered and ends when it is retired; a provider is never used before activation or after retirement.
- Registration precedes availability. A provider exists and is discoverable before it is available to be selected.
- Discovery follows registration. A registered provider is discoverable by its identity and declared capabilities; an unregistered provider is not.
- Retirement is clean. A retired provider is no longer selected or routed to, and its retirement never disrupts a provider that remains.

# Specification

A provider passes through the following ordered phases. This document owns the phases; the selection of an available provider is owned by ai/providers/provider-selection.md, and the change of a provider definition over time is owned by ai/providers/provider-versioning.md.

- Registration. A provider is registered with its distinct identity under ai/providers/provider-architecture.md and its declared capabilities under ai/providers/provider-capabilities.md, so that it exists as an abstraction and is discoverable. Registration records that the provider exists; it never activates or uses it.
- Discovery. A registered provider is discoverable by its identity and declared capabilities, so that selection can find it. Discovery finds a registered provider; it never chooses one, which is owned by ai/providers/provider-selection.md.
- Activation. A registered provider is activated, becoming available to be selected and routed to. A provider is used only while active, and activation never widens its declared capabilities.
- Operation. An active provider is available for selection, routing, and use, invoked by ai/runtime/. This document owns that the provider is in operation; the invocation and execution are owned by ai/runtime/, and the intelligence produced is the source's own.
- Retirement. A provider is retired: it is deactivated, is no longer selected or routed to, and is superseded or removed. Retirement is orderly and never disrupts a provider that remains, and a request that would have used a retired provider is handled by ai/providers/provider-fallback.md.

Each phase precedes the next, and a provider is never used outside Activation and Operation. The lifecycle is the same regardless of any provider, model, or technology, and it is the same for one provider or many thousands.

# Invariants

- A provider is registered before it is discoverable, and discoverable before it is activated.
- A provider is used only while active, and activation never widens its declared capabilities.
- A retired provider is no longer selected or routed to.
- A provider's retirement is orderly and never disrupts a provider that remains.
- A lifecycle transition never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the provider lifecycle only. It owns none of the following, and references each by its canonical owner.

- The identity registered and the capabilities declared: ai/providers/provider-architecture.md and ai/providers/provider-capabilities.md.
- The selection of an available provider: ai/providers/provider-selection.md.
- The fallback when a provider is retired or unavailable: ai/providers/provider-fallback.md.
- The invocation and execution of an active provider: ai/runtime/.
- The versioning of a provider definition over time: ai/providers/provider-versioning.md.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-architecture.md
- ai/providers/provider-capabilities.md
- ai/providers/provider-selection.md
- ai/providers/provider-fallback.md
- ai/providers/provider-versioning.md
