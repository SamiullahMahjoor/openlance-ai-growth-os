# @openlance/aios-retrieval (reserved)

> **Implementation status: Reserved namespace — intentionally contains no runtime implementation.**

A name and dependency-graph reservation for the frozen `ai/retrieval/` constitutional namespace. It contains only `package.json` and this `README.md`: no source, no exports, no tests, no build or CI configuration, and zero executable code. Its behavior is owned exclusively by the frozen constitution and will be implemented in a future phase.

## Ownership and constitutional responsibility

This package reserves the `ai/retrieval/` namespace, whose constitutional responsibility is the foundational retrieval services that fetch grounding for reasoning and prompts, consuming the knowledge repository as the single source of business truth. It owns none of that behavior here; the frozen constitution (OL-AI-RETRIEVAL-README) owns it, and this package only reserves the name and the dependency edges so the package map is explicit and future conflicts are prevented.

## Dependency direction

Per the frozen `ai/architecture/dependency-map.md`, this namespace depends on the constitution, Governance, the knowledge repository (consumed, one-directional). Dependencies flow only from the more operational namespaces toward the more foundational ones, never in reverse, so the graph has no cycles. These edges are pre-declared here and enforced by dependency-cruiser.

## Public API ownership (future)

When implemented in its future phase, this package will own the retrieval contracts (grounding, sourcing) reasoning and prompts depend on. Until then it exports nothing.

## Explicit non-responsibilities

It owns no reasoning, no prompt construction, and no business truth; it retrieves, it never amends knowledge. It is an architectural reservation only; it is not an implemented package.
