---
id: OL-AI-PROVIDERS-README
document: ai/providers/README.md

title: Open Lance AIOS Providers Namespace Guide

version: 1.0
status: Frozen

document_type: normative
authority: Process

owner: AI Systems Architect
reviewed_by: Independent AI Architecture Reviewer

last_updated: 2026-08-02

depends_on:
  - ai/README.md
  - ai/CONTRIBUTING.md
  - ai/governance/README.md

used_by:
  - AI Systems Architect
  - Every AI agent
  - Any AI agent that executes a task
  - Any contributor to the Providers namespace

provenance:
  - Derived from ai/README.md and ai/CONTRIBUTING.md

loading_priority: Required

summary: >
  Defines how providers are documented. It establishes the standard structure,
  derivation rules, invariants, and boundaries every provider document under
  ai/providers/ must follow, and it owns provider extensibility and provider
  neutrality. It owns how the provider abstraction is documented, and owns no
  governance rule, no runtime execution, no reasoning, no prompt, no model
  behavior, and no implementation.
---

# Open Lance AIOS Providers Namespace Guide

This document is the guide for the Providers namespace at ai/providers/. The Providers namespace owns one thing: the provider- and model-neutral abstraction of the AI Operating System. It defines what a provider is as an architectural abstraction over a source of intelligence, how a provider is identified, described by capability, selected, routed to, fallen back from, and evolved, so that the rest of the AI layer uses intelligence without binding to any vendor, model, or technology. It owns no governance rule, no runtime execution, no reasoning, no retrieval, no memory, no prompt, no agent, no safety rule, no tool, no evaluation, no operations, and no business truth. A provider here is an architectural abstraction; it is never a real vendor, a model, or an implementation.

This guide derives its authority from the AI constitution at ai/README.md and the contribution process at ai/CONTRIBUTING.md, and it operates under the governance mandates at ai/governance/. Providers is a foundational service of the AI layer that other namespaces build on: it sits at the Specification authority level defined in ai/README.md, applying the rules governance sets, and consumed by the agents and the runtime that use a provider to act. Where this guide and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

# Purpose

This document owns exactly one thing: how the provider abstraction is documented within the AI layer. It is the single guide for the Providers namespace, and every provider document follows it.

The Providers namespace exists so that the AI layer uses intelligence through a defined, governed, deterministic, technology-neutral abstraction, rather than binding to a specific vendor, model, or implementation. It defines what a provider is and how a provider is chosen, routed to, and evolved; it never executes a provider, never networks, never defines a protocol or an interface, and never defines the intelligence a provider produces. The abstraction is what endures; the providers and models behind it are transient and replaceable.

This guide owns no provider model itself, no governance rule, and no business truth. The provider model is owned by the member documents of this namespace; the rules that govern the AI are owned by ai/governance/; business truth is owned by the knowledge repository.

# Scope

This guide governs the Providers namespace. It defines the standard structure a provider document uses, the rules for writing one, the invariants every provider document upholds, the boundaries a provider document must respect, and how the namespace grows. It owns provider extensibility, the additive way the provider model gains new concerns over time, and provider neutrality, the permanent independence of the provider abstraction from any provider, model, framework, runtime, protocol, or language.

The namespace owns the provider model of the AI layer: the provider architecture and identity, lifecycle, capabilities, abstraction, selection, routing, fallback, compatibility, boundaries, and versioning. Each concern is owned by its own document, created under this guide.

# Provider Identity

A provider is the intelligence abstraction of the AI layer, and it is not any of the following.

- A provider is not a vendor, a model, or an implementation. The namespace defines the architectural abstraction over a source of intelligence, never a real provider, a real model, a network, a protocol, an interface, or code.
- A provider is not the runtime. The runtime orchestrates and executes; a provider is the abstraction the runtime invokes to use intelligence. A provider never orchestrates, schedules, or executes; those are owned by ai/runtime/.
- A provider is not reasoning, prompts, memory, or retrieval. Those namespaces reason, express, retain, and determine knowledge; a provider is the abstraction through which such work reaches a source of intelligence. A provider performs none of their work, and it never defines the intelligence a source produces.
- A provider is not an agent. An agent composes a provider as a capability; a provider is composed, never an actor. Agents are owned by ai/agents/.
- A provider is not governance or safety. Governance owns the rules and safety owns protection; a provider is selected, routed, and used within them, and defines neither.
- A provider is not knowledge. Business truth is owned by the knowledge repository. A provider carries no truth and never owns, restates, or becomes it.

A provider document answers only how one aspect of the provider abstraction works. Its knowledge is durable, technology-neutral, and independent of any provider, model, framework, runtime, or protocol, so it remains valid as those change.

# Provider Invariants

These invariants are permanent. Every provider document upholds them, and no provider may violate them.

- A provider is an architectural abstraction, never a vendor, a model, or an implementation. This namespace names none and defines the abstraction alone.
- A provider is uniquely identified and presents a neutral abstraction, so the rest of the layer uses intelligence without binding to a vendor or model.
- Provider selection, routing, and fallback are deterministic. The same need, the same registered providers, and the same governing rules yield the same selection, routing, and fallback outcome, with no randomness.
- A provider is governed and bounded. A provider is selected and used only within the rules governance sets and the limits safety allows, and never beyond them.
- Provider fallback and routing are bounded and acyclic. No infinite fallback and no routing cycle are possible.
- A provider serves; it owns none of the behavior it serves. Reasoning, prompts, memory, retrieval, execution, and truth are owned by their namespaces, and the intelligence a provider produces is the source's own, outside this architecture.
- A provider is single-owned, technology-neutral, and scalable. Each provider concern has exactly one owning document, and the abstraction holds for one provider or many thousands.

# Provider Document Standard

Every provider document under ai/providers/ uses the following standard structure. This section defines the template only. It defines no actual provider model. The inventory at ai/providers/providers.md is a reference document and follows the inventory pattern rather than this template.

- Purpose. The provider concern the document owns.
- Principles. The enduring principles for the concern, instantiating ai/README.md and the provider invariants.
- Specification. The technology-neutral provider model itself: the architecture, lifecycle, capabilities, abstraction, selection, routing, fallback, compatibility, boundaries, or versioning the document owns.
- Invariants. The provider invariants that always hold for the concern.
- Boundaries. What the document does not own, with each excluded concern referenced to its canonical owner.
- Related Knowledge. Canonical repository paths the document references, within ai/ and, for consumption, into knowledge/.

A provider document may add a section only when a genuine provider concern requires it, following ai/CONTRIBUTING.md, and never to move a governance rule, business truth, runtime execution, reasoning, a prompt, or the intelligence of a source into this namespace.

# Documentation Rules

A provider document records one aspect of the provider abstraction, and nothing more.

- A provider document never restates a governance rule, business truth, a runtime behavior, a reasoning model, a retrieval model, a memory model, or a prompt. It references ai/governance/, the knowledge repository, ai/runtime/, ai/reasoning/, ai/retrieval/, ai/memory/, and ai/prompts/ by canonical path.
- A provider document never names a provider, a model, a vendor, a framework, a language, a runtime, a protocol, or an interface, and never contains code.
- A provider document defines the provider abstraction, never how a provider is implemented, networked, or executed, and never the intelligence a provider produces.
- Everything a provider document depends on is referenced. Nothing is duplicated.
- References use canonical repository paths only. Consumption of the knowledge repository is one-directional. Relative links are never used.

# Boundaries

Each concern has exactly one owner. Providers own the intelligence abstraction. Governance owns rules. The runtime executes. Reasoning reasons. Retrieval determines knowledge. Memory retains context. Prompts express. Agents act. Safety protects. Tools act externally. Evaluation judges output. Operations runs the layer. The knowledge repository owns truth. A provider document owns only its own aspect of the provider model. It owns none of the following.

- The Authority Hierarchy, boundary, principles, and lifecycle rules: ai/README.md.
- The contribution, amendment, and certification process: ai/CONTRIBUTING.md.
- The mandates, risk governance, permissions, and change governance: ai/governance/.
- Business truth: the knowledge repository.
- Execution, orchestration, and run-time invocation of a provider: ai/runtime/.
- Reasoning, retrieval, memory, prompts, agents, safety, tools, evaluation, and operations: their namespaces.
- The intelligence a provider produces: the source itself, outside every knowledge document.
- The maps of the AI layer: ai/architecture/.

A provider document references all of the above and owns none of it. It records only the durable, technology-neutral provider abstraction.

# Loading Guidance

Providers are loaded at the Required tier defined in ai/README.md for most acting tasks, because acting uses a provider for the model in use, as recorded in ai/architecture/loading-map.md. This guide and the inventory are loaded first, and carry the provider and model abstraction most acting tasks need; the member documents that model selection, routing, fallback, and the rest are loaded at the Contextual tier when a task actually selects, routes to, or falls back from a provider. The applied, task-level loading guidance is owned by ai/architecture/loading-map.md; this section states intent only and defines no runtime loading behavior.

# Repository Growth

New provider knowledge is added by creating new provider documents under ai/providers/, each following the Provider Document Standard and owning a single concern. The namespace grows only when a genuinely new provider concern arises. The structure defined by this guide never changes as the namespace grows, existing documents never change identity, and growth is always additive. This provider extensibility lets the provider abstraction gain new capability, routing, or compatibility concerns over decades, and scale across many thousands of providers and models, without redesign, and it is owned here.

# Document Governance

- This is a normative document, at the Process authority level defined in ai/README.md, and it governs the Providers namespace only.
- It does not create constitutional authority. It derives its authority from ai/README.md and ai/CONTRIBUTING.md and operates under the mandates at ai/governance/. Where this guide and a higher-authority document differ, the higher-authority document governs.
- The inventory at ai/providers/providers.md declares the Reference authority level. Every provider-model member document declares the Specification authority level.
- Provider documents follow the standard and rules defined here, conform to the governance mandates, and consume business truth by reference. A provider document that conflicts with any of these is corrected to conform.
- Changes to this guide require approval and must follow the amendment process defined in ai/CONTRIBUTING.md. Provider and model churn is absorbed by this abstraction and never amends a foundational document.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/governance/README.md
- ai/runtime/README.md
- ai/agents/README.md

# Repository Evolution Notes

These notes record worthwhile architectural observations only. They require no action now.

- Provider documents. The provider-model member documents of this namespace are created together with this guide, following it and ai/CONTRIBUTING.md.
- Position in the layer. Providers is a foundational service that other namespaces build on: it applies governance rules and is consumed by the agents and the runtime that use a provider to act. It owns the intelligence abstraction only, and never the layers that use it, nor the intelligence a source produces.
- Absorbing churn. Provider, model, and technology change is absorbed by this abstraction, so the foundations of the AI layer stay steady as those change, consistent with ai/CONTRIBUTING.md.
- Maturity. When this namespace is complete and frozen, its maturity in ai/architecture/repository-evolution.md advances from Planned to Complete, recorded there through the amendment process.
