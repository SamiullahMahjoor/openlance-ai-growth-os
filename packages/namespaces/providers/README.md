# @openlance/aios-providers (reserved)

> **Implementation status: Reserved namespace — intentionally contains no runtime implementation.**

A name and dependency-graph reservation for the frozen `ai/providers/` constitutional namespace. It contains only `package.json` and this `README.md`: no source, no exports, no tests, no build or CI configuration, and zero executable code. Its behavior is owned exclusively by the frozen constitution and will be implemented in a future phase.

## Ownership and constitutional responsibility

This package reserves the `ai/providers/` namespace, whose constitutional responsibility is the foundational, technology-neutral provider abstraction other namespaces build on, isolating vendor and model churn behind stable contracts. It owns none of that behavior here; the frozen constitution (OL-AI-PROVIDERS-README) owns it, and this package only reserves the name and the dependency edges so the package map is explicit and future conflicts are prevented.

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, this namespace depends on the constitution, Governance. Dependencies flow only from the more operational namespaces toward the more foundational ones, never in reverse, so the graph has no cycles. These edges are pre-declared here and enforced by dependency-cruiser.

## Public API ownership (future)

When implemented in its future phase, this package will own the provider abstraction and registration contracts (provider-neutral; no vendor named). Until then it exports nothing.

## Explicit non-responsibilities

It names no concrete vendor or model, performs no reasoning, and owns no agent, runtime, or business logic. It is an architectural reservation only; it is not an implemented package.
