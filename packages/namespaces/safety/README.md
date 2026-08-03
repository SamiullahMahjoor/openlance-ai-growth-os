# @openlance/aios-safety (reserved)

> **Implementation status: Reserved namespace — intentionally contains no runtime implementation.**

A name and dependency-graph reservation for the frozen `ai/safety/` constitutional namespace. It contains only `package.json` and this `README.md`: no source, no exports, no tests, no build or CI configuration, and zero executable code. Its behavior is owned exclusively by the frozen constitution and will be implemented in a future phase.

## Ownership and constitutional responsibility

This package reserves the `ai/safety/` namespace, whose constitutional responsibility is the foundational safety services (refusal, degradation, safe-failure) that tools and the wider layer operate within, consuming the knowledge repository. It owns none of that behavior here; the frozen constitution (OL-AI-SAFETY-README) owns it, and this package only reserves the name and the dependency edges so the package map is explicit and future conflicts are prevented.

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, this namespace depends on the constitution, Governance, the knowledge repository (consumed, one-directional). Dependencies flow only from the more operational namespaces toward the more foundational ones, never in reverse, so the graph has no cycles. These edges are pre-declared here and enforced by dependency-cruiser.

## Public API ownership (future)

When implemented in its future phase, this package will own the safety contracts (refusal, degradation, safe-failure) that tools and other namespaces are bound by. Until then it exports nothing.

## Explicit non-responsibilities

It owns no tool execution, no reasoning, no runtime, and no business truth; it constrains, it does not execute. It is an architectural reservation only; it is not an implemented package.
