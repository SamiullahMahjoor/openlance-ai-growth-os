---
id: OL-AI-PROVIDERS-PROVIDER-SELECTION
document: ai/providers/provider-selection.md

title: Open Lance AIOS Provider Selection

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
  Owns the selection model: how a provider is chosen for a need, deterministically.
  It owns the selection model only, and defers the routing of a request and the
  compatibility a selection rests on to their owners.
---

# Open Lance AIOS Provider Selection

This document owns the provider selection model. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the selection model only. It never defines the routing of a request to the chosen provider, owned by ai/providers/provider-routing.md, and it never defines the compatibility a selection rests on, owned by ai/providers/provider-compatibility.md.

# Purpose

This document owns one provider concern: how a provider is chosen for a need, from the available, compatible providers, deterministically. It exists so that any human or AI agent can determine which provider is chosen and why, independent of how a request is then routed to it.

# Principles

These are the enduring principles for provider selection. Each instantiates a provider invariant owned by ai/providers/README.md.

- Selection is deterministic. The same need and the same available providers under the same rules yield the same choice, with no randomness.
- Selection chooses from the compatible. A provider is chosen only from those compatible with the need under ai/providers/provider-compatibility.md, so an unsuitable provider is never chosen.
- Selection is governed and bounded. A provider is chosen only within the rules governance sets and the limits safety allows, and never one that would exceed them.
- Selection is neutral. A provider is chosen by its declared capabilities and compatibility, not by any vendor or model preference, so the choice stays provider- and model-neutral.

# Specification

A provider is chosen in the following way. This document owns the selection model; the routing of a request to the chosen provider is owned by ai/providers/provider-routing.md, and whether a provider is compatible with the need is owned by ai/providers/provider-compatibility.md.

- The candidate set. Selection considers only providers that are active under ai/providers/provider-lifecycle.md and compatible with the need under ai/providers/provider-compatibility.md. A provider that is not active or not compatible is not a candidate.
- Deterministic choice. From the candidate set, a provider is chosen by a defined, deterministic ordering over the need and the providers' declared capabilities, so the same need and candidate set always yield the same provider. Where the ordering does not settle on one, a defined tiebreak resolves it, so selection is never ambiguous and never random.
- Governed selection. The chosen provider must be permitted under the rules owned by ai/governance/ and usable within the limits owned by ai/safety/. A choice that would exceed governance or safety is not made; the next compatible provider is chosen, or the matter is handled by ai/providers/provider-fallback.md.
- Selection, not routing or reasoning. Selection ends at the choice of a provider. Directing a request to it is owned by ai/providers/provider-routing.md, and any reasoning about the task is owned by ai/reasoning/; selection is a deterministic match of need to provider, not a judgment about the task.

Selection chooses a compatible, governed provider deterministically; the routing that follows and the compatibility it rests on are owned elsewhere. Selection is the same at any scale.

# Invariants

- The same need and the same available providers under the same rules yield the same choice.
- A provider is chosen only from those active and compatible with the need.
- A chosen provider is permitted under governance and usable within safety limits.
- Selection is settled by a defined tiebreak, so it is never ambiguous or random.
- Choosing a provider never executes, routes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the selection model only. It owns none of the following, and references each by its canonical owner.

- The routing of a request to the chosen provider: ai/providers/provider-routing.md.
- Whether a provider is compatible with the need: ai/providers/provider-compatibility.md.
- The active providers selection chooses among: ai/providers/provider-lifecycle.md.
- The fallback when no compatible provider can be chosen: ai/providers/provider-fallback.md.
- The rules and limits a selection respects: ai/governance/ and ai/safety/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-compatibility.md
- ai/providers/provider-routing.md
- ai/providers/provider-lifecycle.md
- ai/providers/provider-fallback.md
- ai/reasoning/README.md
