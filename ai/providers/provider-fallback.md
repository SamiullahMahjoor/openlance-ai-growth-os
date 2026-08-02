---
id: OL-AI-PROVIDERS-PROVIDER-FALLBACK
document: ai/providers/provider-fallback.md

title: Open Lance AIOS Provider Fallback

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
  Owns the fallback model: how the layer falls back to an alternate provider,
  through a bounded, acyclic fallback chain. It owns the fallback model only, and
  defers the selection criteria a fallback reapplies and the safe degradation of
  the AI to their owners.
---

# Open Lance AIOS Provider Fallback

This document owns the provider fallback model. It is a provider document at the Specification authority level defined in ai/README.md, and it follows the Provider Document Standard in ai/providers/README.md. It instantiates the provider invariants and operates under the governance mandates at ai/governance/. Where this document and a higher-authority document differ, the higher-authority document governs. On any matter of business truth, the knowledge repository governs.

This document owns the fallback model only. It never defines the selection criteria a fallback reapplies, owned by ai/providers/provider-selection.md, and it never defines the safe degradation of the AI, owned by ai/safety/safe-degradation.md.

# Purpose

This document owns one provider concern: how the layer falls back to an alternate provider when a chosen provider is unavailable, and how that fallback is bounded so it always terminates. It exists so that any human or AI agent can determine how a request is recovered when a provider cannot serve it, without infinite fallback, independent of the criteria that choose the alternate.

# Principles

These are the enduring principles for provider fallback. Each instantiates a provider invariant owned by ai/providers/README.md.

- Fallback recovers; it never lowers protection. Fallback finds an alternate provider for a request, and never one that governance or safety would not allow.
- The fallback chain is bounded and acyclic. Fallback follows a finite, acyclic chain of alternates, so no infinite fallback and no fallback cycle are possible.
- Fallback reapplies the selection rules. An alternate is chosen by the same selection and compatibility rules as the original, so a fallback provider is always compatible and governed.
- Fallback terminates safely. When no alternate can serve a request, the layer stops falling back and hands the matter to safe degradation, never looping.

# Specification

The layer falls back in the following way. This document owns the fallback model; the selection criteria a fallback reapplies are owned by ai/providers/provider-selection.md, and the safe degradation of the AI when no provider can serve is owned by ai/safety/safe-degradation.md.

- The fallback model. When a chosen provider is unavailable, retired under ai/providers/provider-lifecycle.md, or at a limit under ai/providers/provider-routing.md, the layer falls back to an alternate provider so the request can still be served. Fallback finds an alternate; it never executes the request.
- The fallback chain. Alternates form an ordered fallback chain, tried in turn. The chain is finite and acyclic: a provider already tried in a chain is not tried again in it, and the chain has a bounded length, so infinite fallback and fallback cycles are impossible.
- Reapplied selection. Each alternate is chosen by the same selection and compatibility rules as the original, under ai/providers/provider-selection.md and ai/providers/provider-compatibility.md, so a fallback provider is always compatible, permitted under ai/governance/, and within the limits of ai/safety/. Fallback never relaxes these rules to find an alternate.
- Safe termination. When the fallback chain is exhausted and no alternate can serve the request, the layer stops falling back and hands the matter to ai/safety/safe-degradation.md, so the AI degrades safely rather than loops or proceeds unserved.

Fallback recovers a request through a bounded chain of compatible, governed alternates, and terminates safely when none remain; the selection criteria and the safe degradation are owned elsewhere. Fallback is deterministic and the same at any scale.

# Invariants

- Fallback chooses an alternate only from compatible, governed, safe providers.
- The fallback chain is finite and acyclic, so infinite fallback and fallback cycles are impossible.
- A provider already tried in a chain is not tried again in it.
- When no alternate can serve, the layer hands the matter to safe degradation rather than looping.
- Falling back never executes, reasons, retrieves, expresses, persists, or changes ownership, authority, governance, or business truth.

# Boundaries

This document owns the fallback model only. It owns none of the following, and references each by its canonical owner.

- The selection and compatibility rules a fallback reapplies: ai/providers/provider-selection.md and ai/providers/provider-compatibility.md.
- The limits and availability that prompt a fallback: ai/providers/provider-routing.md and ai/providers/provider-lifecycle.md.
- The safe degradation when no provider can serve: ai/safety/safe-degradation.md.
- The rules and limits a fallback respects: ai/governance/ and ai/safety/.
- The runtime that carries a retried request: ai/runtime/.

# Related Knowledge

- ai/README.md
- ai/CONTRIBUTING.md
- ai/providers/README.md
- ai/providers/providers.md
- ai/providers/provider-selection.md
- ai/providers/provider-compatibility.md
- ai/providers/provider-routing.md
- ai/providers/provider-lifecycle.md
- ai/safety/safe-degradation.md
