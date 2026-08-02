---
id: ADR-0001
title: Implementation language and runtime
status: Accepted
date: 2026-08-02
supersedes: []
superseded_by: null
---

# ADR-0001: Implementation language and runtime

## Status

Accepted

## Context

The constitution is technology-neutral and names no language or runtime. Implementation requires a concrete choice. The OpenLance ecosystem is TypeScript/Node (NestJS API, Next web), and the AI Operating System will eventually integrate with it. Strong static typing supports the determinism and one-owner disciplines the constitution requires.

## Decision

Implement the AI Operating System in strict TypeScript (ESM) on Node.js LTS.

## Rationale

Ecosystem alignment enables later integration and shared talent; first-class typing and interfaces make constitutional contracts and boundaries expressible and enforceable. Alternatives (Go, Rust, Python) were rejected: Go and Rust diverge from the ecosystem and weaken decorator/DI ergonomics; Rust adds high cost and slow iteration; Python weakens static guarantees and determinism enforcement.

## Consequences

TypeScript strict mode, ESM, and Node LTS are pinned. Type-level enforcement of boundaries and Result-based error handling become available. Changing the language would require a superseding ADR and a repository generation bump.

## Related constitutional references

`ai/README.md` (technology neutrality; the runtime points to the layer, not the reverse). References only.

## Related ADRs

Relates to ADR-0002, ADR-0003.
