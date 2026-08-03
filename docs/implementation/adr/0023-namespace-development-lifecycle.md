---
id: ADR-0023
title: Namespace development lifecycle
status: Accepted
date: 2026-08-03
supersedes: []
superseded_by: null
---

# ADR-0023: Namespace development lifecycle

## Status

Accepted (architecture review decision P4, Phase 2B).

## Context

The substrate was built design-first (ADR-0007): approved design documents (`docs/implementation/00`
to `09`) preceded implementation. Phase 2B implements the AI namespaces, and the same discipline must
be permanent so no namespace is implemented by inventing architecture.

## Decision

Every namespace permanently follows this workflow:

1. **Constitution** - read the namespace's `ai/<namespace>/` documents completely.
2. **Implementation Design** - produce the design (ownership, responsibilities, public API,
   internal architecture, modules, layout, dependency usage, integration points, lifecycle, state,
   error, and event ownership, testing strategy), recorded as `docs/implementation/<NN>-<namespace>.md`.
3. **ADR Approval** - any architectural decision the constitution does not fix is a Proposed ADR,
   approved before implementation. Never invent architecture.
4. **Stage Plan** - small, independently testable, fully validated, constitutionally complete stages.
5. **Implementation** - one stage at a time.
6. **Independent Audit** - a read-only regression audit per stage.
7. **Freeze** - the namespace is frozen when complete and audited.

## Rationale

This makes the substrate's design-first cadence the permanent Phase 2B process, keeping every
namespace traceable to the constitution and preventing architectural drift.

## Consequences

The Governance design is recorded as `docs/implementation/10-governance.md`; each subsequent
namespace gets its own numbered design document. No stage begins until the prior stage passes
validation, audit, and explicit approval.

## Related constitutional references

`ai/CONTRIBUTING.md` (design-first, review, amendment). Engineering process; changes no
constitutional ownership.

## Related ADRs

Relates to ADR-0007 (design-first delivery cadence).
