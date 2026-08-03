# @openlance/aios-evaluation (reserved)

> **Implementation status: Reserved namespace — intentionally contains no runtime implementation.**

A name and dependency-graph reservation for the frozen `ai/evaluation/` constitutional namespace. It contains only `package.json` and this `README.md`: no source, no exports, no tests, no build or CI configuration, and zero executable code. Its behavior is owned exclusively by the frozen constitution and will be implemented in a future phase.

## Ownership and constitutional responsibility

This package reserves the `ai/evaluation/` namespace, whose constitutional responsibility is the measurement, scoring, benchmarking, and validation of the layer’s outputs. It observes the namespaces it evaluates without those namespaces depending on it. It owns none of that behavior here; the frozen constitution (OL-AI-EVALUATION-README) owns it, and this package only reserves the name and the dependency edges so the package map is explicit and future conflicts are prevented.

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, this namespace depends on the constitution, Governance, (observes evaluated namespaces as data, does not depend on them). Dependencies flow only from the more operational namespaces toward the more foundational ones, never in reverse, so the graph has no cycles. These edges are pre-declared here and enforced by dependency-cruiser.

## Public API ownership (future)

When implemented in its future phase, this package will own the evaluation contracts (metrics, scoring, benchmarking, comparison, validation). Until then it exports nothing.

## Explicit non-responsibilities

It executes nothing it measures; it owns no reasoning, agent, runtime, or business behavior, and is depended upon by none of the namespaces it evaluates. It is an architectural reservation only; it is not an implemented package.
