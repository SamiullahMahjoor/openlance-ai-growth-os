# Phase 3 (Runtime Integration), Stages 1 to 5 Record

**Status: SUPERSEDED by [ADR-0032](adr/0032-plugin-loading-integration.md) (Phase 3 reopened).** This document
originally recorded Phase 3 complete at Stage 5 (ADR-0031). Per the canonical roadmap, ADR-0032 reopened Phase 3 to
continue through Stage 9 (Stage 6 Plugin Loading, Stage 7 Error Propagation, Stage 8 Event Flow, Stage 9 a single
consolidated Runtime Freeze). This record of Stages 1 to 5 below remains accurate; the Phase 3 freeze is now the
consolidated Stage 9 Runtime Freeze rather than a close at Stage 5.

Phase 3 built the runtime-integration layer as a chain of immutable, descriptive, non-executing `apps/`-layer
packages, each consuming the prior and each binding a genuinely new frozen model into the object graph, over the
frozen Phase 2A substrate and the 13 frozen Phase 2B namespaces. It executes nothing: every stage plans, validates
by delegation to frozen predicates, and fails closed, leaving all carrying-out to a future operational layer.

## The five frozen stages

| Stage | Package | Owns (new frozen model bound into the chain) | Decision | Freeze |
|---|---|---|---|---|
| 1 | `@openlance/aios-composition-root` | the DI object graph (`bootstrap` -> immutable `Application`) | ADR-0026 | COMPOSITION-ROOT-FREEZE.md |
| 2 | `@openlance/aios-namespace-wiring` | the namespace manifest (`WiredApplication`) | ADR-0027 | NAMESPACE-WIRING-FREEZE.md |
| 3 | `@openlance/aios-di-integration` | the injectable substrate surface (`IntegratedApplication`) | ADR-0028 | DI-INTEGRATION-FREEZE.md |
| 4 | `@openlance/aios-runtime-lifecycle` | the lifecycle states and admission path (`RuntimeLifecyclePlan`) | ADR-0029 | RUNTIME-LIFECYCLE-FREEZE.md |
| 5 | `@openlance/aios-execution-pipeline` | the workflow order, validation stages, context inputs, events (`ExecutionPipelinePlan`) | ADR-0030 | EXECUTION-PIPELINE-FREEZE.md |

Each stage: single explicit barrel, immutable and deep-frozen, `Result`-based and fail-closed, 100% coverage,
benchmark recorded, two independent source audits CLEAN, its own design doc (23 to 27) and freeze doc. Each
consumes the frozen substrate, namespaces, and prior stages, and recreates none of them; the constitutional models
are referenced, never duplicated.

## Why Phase 3 is complete at Stage 5 (the Stage 6 boundary decision)

Stage 6 was to be Governance Enforcement. A full constitutional review from source (all `ai/governance/`,
`ai/runtime/`, `ai/operations/`, `ai/safety/`, `ai/evolution/` documents, the Accepted ADRs, and the Stage 1 to 5
docs) established that "governance enforcement" decomposes exhaustively into three already-owned parts:

- **the rules** (what is validated, which policy prevails, what oversight a trust level needs): owned by
  `ai/governance/`, frozen in `@openlance/aios-governance`;
- **the order** (constitutional before permission before policy; validation before execute): a runtime-model
  concern, frozen in `@openlance/aios-runtime` (`VALIDATION_STAGES`, the validate workflow steps), and already
  referenced by the Stage 5 `ExecutionPipelinePlan`;
- **carrying it out** (performing the validation, checking the permission, applying the policy against a live
  execution's context): runtime execution, assigned by every governance document to "the operational namespaces and
  the runtime," and governed by ADR-0020's absolute boundary "Governance provides truth. Runtime performs
  enforcement."

There is no fourth, residual "governance enforcement" concern for a new descriptive package to own. Unlike Stages 1
to 5, which each bound a new frozen model into the chain, Stage 6 would bind nothing new: a descriptive version
would duplicate Governance, Runtime, and Execution Pipeline ownership (violating the governance invariants "one
owner per concern" and "nothing is duplicated"), and an executing version would invent enforcement logic and
execute the runtime (violating ADR-0020). Per ADR-0031, the Phase 3 descriptive chain is therefore complete at
Stage 5.

## What is not built, and what comes next (Phase 4)

Not built in Phase 3: any execution of a task; any governance enforcement engine; any evaluation of permissions,
policies, risk, autonomy, or escalation against a live context; any orchestration, scheduling, event emission, or
namespace activation. Those are the runtime's operational enforcement and execution, dependent on the operational
namespace services (each namespace's own operational implementation) and a governance evaluator, none of which
exist.

Real Governance Enforcement, and real execution, are **operational implementations** that begin **Phase 4**. Phase 4
is a separate, design-first phase: each stage produces a design document approved before implementation and, where
it needs a concept the constitution does not already define, its own ADR. It is not begun here.

### Post-Stage-5 roadmap (revised by ADR-0032)

Each further integration concern was assessed from source. Its underlying **mechanism** is a frozen substrate
package, and *executing* it (loading, propagating, flowing at run time) is Phase 4. The **application-level
integration** of each mechanism into the runtime chain is, however, a thin descriptive stage (parallel to Namespace
Wiring), and per ADR-0032 Phase 3 continues through Stage 9 to express those and then freeze the layer together:

- **Governance Enforcement** (ADR-0031, `28-governance-enforcement.md`): decomposes into the frozen governance rules
  + the frozen runtime validation order (already in the Stage 5 plan) + runtime execution; no distinct integration
  package. Remains **Phase 4**.
- **Stage 6, Plugin Loading** (ADR-0032, `29-plugin-loading.md`): the app-level plugin declaration (available /
  enabled / compatible / ready) attached to the chain, delegating compatibility to the frozen
  `@openlance/aios-plugins` host. Built. Actually loading/activating plugins remains Phase 4.
- **Stage 7, Error Propagation** (ADR-0033, `30-error-propagation.md`): the app-level description of the chain's
  coded error topology, validating code uniqueness against the frozen `@openlance/aios-errors` registry (the
  `BaseError` taxonomy and the `Result` channel, ADR-0006). Built. Catching / retrying / recovering errors at run
  time remains Phase 4.
- **Stage 8, Event Flow** (ADR-0034, `31-event-flow.md`): the app-level description of the chain's framework event
  topology, realizing each declared event type via the frozen `@openlance/aios-events` `createEvent` (never calling
  the bus). Built. Publishing / subscribing / dispatching events at run time remains Phase 4.
- **Stage 9, Runtime Freeze** (planned): a single consolidated freeze of the Phase 3 integration layer.

## Immutability of Phase 3

The five frozen Phase 3 packages are settled. Each may change only for compiler compatibility, security
vulnerabilities, dependency updates, or critical bug fixes, each still running the full validation pipeline; any
change to a public API, a describe-never-own or executes-nothing boundary, a fail-closed contract, an immutable
handle shape, or a consume-not-recreate boundary is an architectural modification requiring a new or superseding
ADR, an architecture review, an independent audit, and full validation. `ai/` and `knowledge/` remain immutable.
