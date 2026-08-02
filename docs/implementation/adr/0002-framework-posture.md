---
id: ADR-0002
title: "Framework posture: custom framework-neutral core"
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0002: Framework posture, custom framework-neutral core

## Status

Accepted

## Context

Phase 2A must supply DI, configuration, logging, events, and a plugin system. These could be adopted from an existing framework (for example NestJS) or built as framework-neutral packages. The constitution requires provider and framework neutrality and forbids encoding a framework into durable behavior (`ai/CONTRIBUTING.md` line 47, line 176).

## Decision

Build a custom, framework-neutral core. The substrate packages (`kernel`, `errors`, `di`, `config`, `logging`, `events`, `plugins`) contain no framework. Any framework, if ever used, is confined to an outer app/composition layer, never inside a package.

## Rationale

Neutrality keeps the constitution's technology-independence real in code and avoids coupling the substrate to a framework's lifecycle and idioms. A NestJS-based substrate was rejected because it embeds a framework into the core, conflicting with the neutrality mandate. The cost (we build and maintain a small core) is accepted and bounded by keeping the surfaces minimal and exhaustively tested.

## Consequences

We own a minimal DI/config/logging/events/plugin core. Surfaces are deliberately small. Adopting a framework inside a package later would require a superseding ADR.

## Related constitutional references

`ai/CONTRIBUTING.md` lines 47 and 176; `ai/providers/` (provider neutrality). References only.

## Related ADRs

Relates to ADR-0001, ADR-0005.
