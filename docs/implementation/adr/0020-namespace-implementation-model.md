---
id: ADR-0020
title: Namespace implementation model - immutable stateless domain model
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0020: Namespace implementation model - immutable stateless domain model

## Status

Accepted (architecture review decision P1, Phase 2B).

## Context

The AI-layer namespaces under `ai/` are frozen, technology-neutral specifications that state rules
and models but explicitly own no implementation, mechanism, or code (for example
`ai/governance/README.md` line 70: governance "states rules and principles, never a provider,
model, framework, language, runtime, protocol, interface, or code"; line 120: "never defines an
algorithm, a score, a workflow, or any executable procedure. It states the rule, never the
mechanism"). Enforcement, scoring, validation, and orchestration are assigned to the operational
namespaces and the runtime. Implementing a namespace package therefore requires deciding what a
technology-neutral, rules-not-mechanism namespace becomes in code, and the constitution
deliberately leaves that open.

## Decision

Every technology-neutral constitutional namespace is implemented as an **immutable, stateless
domain model**. It owns:

- immutable classifications,
- immutable rule definitions,
- immutable domain models,
- pure, deterministic predicates that express constitutional truth verbatim.

It must never own: runtime, orchestration, execution, validation engines, scoring, workflows, IO,
persistence, logging, configuration, dependency injection, events, services, or mutable state.

Predicates may only express constitutional truth; they may never evaluate runtime context.
Permitted shapes are total functions over the domain model, for example `requiredOversight(level)`,
`maximumAutonomy(level)`, `trustAllows(level)`, `higherAuthorityWins(a, b)`. Forbidden shapes are
runtime-context evaluators, for example `validate(request)`, `evaluate(action)`,
`authorize(user)`, `checkPermission(runtimeContext)`, `executePolicy(...)`.

**Governance provides truth. Runtime performs enforcement. This boundary is absolute.**

## Rationale

This keeps the constitutional boundary intact (the namespace owns the rule, the runtime owns the
check) while yielding an executable, deterministic, fully coverable surface. It prevents a
namespace package from drifting into an engine or service, which would move ownership the
constitution assigns elsewhere.

## Consequences

Each namespace package is a set of types, frozen data, and pure predicates. It has no lifecycle,
no state, no events, and no IO. The public API is exactly the constitutional truth it expresses.
The category a namespace belongs to is fixed by ADR-0024; its quality gates by ADR-0022; its
permitted dependencies by ADR-0021.

## Related constitutional references

`ai/governance/README.md` (rules-not-mechanism), `ai/runtime/README.md` (runtime owns execution).
This ADR realizes no constitutional concept and changes no constitutional ownership; it records how
a technology-neutral namespace maps to code.

## Related ADRs

Foundational for ADR-0021, ADR-0022, ADR-0023, ADR-0024.
