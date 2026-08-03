---
id: ADR-0025
title: Constitutional dimension independence
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0025: Constitutional dimension independence

## Status

Accepted (architecture review decision, Phase 2B).

## Context

The governance constitution defines several dimensions independently, each in its own document:
Trust and risk (`ai/governance/risk-management.md`), Autonomy (`autonomy-boundaries.md`), Permissions
(`permission-governance.md`), Escalation (`escalation.md`), Human Oversight (`human-oversight.md`),
Policy (`policy-enforcement.md`), Constitutional Validation (`constitutional-validation.md`), and
Change Governance (`change-governance.md`). These dimensions reference one another (for example a
trust level informs the oversight an action needs, and an autonomy level bounds what an action may
do), but the constitution generally states each dimension's rules in its own terms and defers the
combination of dimensions to the runtime's constitutional validation. A domain-model implementation
could be tempted to derive cross-dimensional matrices (trust x autonomy, permission x trust, and so
on) that the constitution does not itself define. That temptation is exactly where invention would
enter.

## Decision

Governance MUST NOT derive relationships between independently-defined constitutional dimensions
unless the constitution explicitly defines that relationship. Trust, Autonomy, Permissions,
Escalation, Human Oversight, Policy, Validation, and Change Governance remain **independent domain
models**. The runtime later combines them during constitutional validation. Governance never invents
cross-dimensional decision matrices.

Concretely: a predicate or table that maps one dimension onto another (for example
"the maximum autonomy a trust level permits", or "the permission a trust level grants") is
implemented only if the mapping is stated verbatim in the constitution. Where the constitution does
not state the mapping, no such API is exposed; the combination is the runtime's to perform at
enforcement time.

## Rationale

Each governance dimension is authored to stand alone and to be combined by the enforcing runtime,
not by the truth layer. Deriving cross-dimensional relationships the constitution does not state
would be inventing governance behavior, which the never-invent gate and ADR-0020 forbid. Keeping the
dimensions independent also keeps each domain model minimal, faithful, and reviewable.

## Consequences

Each dimension's module exposes only that dimension's own classifications, definitions, and verbatim
predicates. A cross-dimensional predicate is added only when the constitution explicitly defines the
relationship, and its addition is traceable to the constitutional wording. This is why, for example,
the autonomy-to-trust "permitted autonomy" mapping is deferred where the constitution underspecifies
it (Governance Stage 2).

## Related constitutional references

`ai/governance/` (the independent dimension documents) and `ai/governance/constitutional-validation.md`
(the runtime combines the dimensions at validation time). Engineering discipline; changes no
constitutional ownership.

## Related ADRs

Builds on ADR-0020 (namespace implementation model). Governs Phase 2B governance stages.
