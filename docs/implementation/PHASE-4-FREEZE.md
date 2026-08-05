# PHASE 4 FREEZE

**Status:** COMPLETE - VALIDATED - AUDITED - CERTIFIED - FROZEN
**Completion date:** 2026-08-05
**Commit range:** `fa7dc63` .. `6ba96c9` (7 commits, one per stage)
**ADR range:** ADR-0039 .. ADR-0045
**Git tag:** `phase-4-frozen`

This document is the canonical constitutional reference for Phase 4. It supersedes no earlier freeze document and is superseded by none. Future phases build on the boundaries recorded here; they may not modify Phase 4 ownership, contracts, or dependency boundaries except through a formal constitutional amendment (a new ADR that explicitly supersedes the affected decision).

---

## 1. Phase Summary

### Purpose

Phase 4 builds the Runtime's operational layer: the set of `apps/*` engines that operationalize the frozen `ai/*` constitution and the frozen `packages/namespaces/*` models into a complete, governed, safe, observable runtime pipeline. Every engine consumes frozen models and the substrate; none redefines a frozen model, and none carries vendor knowledge.

### Architecture

Phase 4 realizes the operational-layer pattern established in Phase 3 (ADR-0035): each engine is an `apps/*` package registered through the composition-root `modules` seam, consuming frozen namespace models plus the substrate (`di`, `errors`, `events`, `kernel`, `plugins`), and composing sibling engines only through legal, type-only app-to-app edges. The result is a single frozen runtime pipeline whose stages each own exactly one constitutional domain.

### Completion criteria (all satisfied)

- Operations owns only operational supervision.
- Runtime Execution remains the exclusive execution owner.
- Governance, Safety, and Runtime Execution are unchanged by later stages.
- The dependency graph is acyclic.
- All ten audits are CLEAN (zero Tier 1, zero Tier 2 findings).
- Full `pnpm run validate` passes (exit 0).
- The public API is stable and every cross-boundary contract is immutable.

---

## 2. Runtime Pipeline

The frozen Phase 4 runtime pipeline, contract by contract:

```
                 six foundational engines
   (tool, reasoning, memory, prompt, provider, retrieval)
                          |
                          v  composed by
                    Agent Engine  (S7)
                          |
                          v  produces
                  AgentExecutionPlan
                          |
                          v  consumed by
          Governance Enforcement Engine  (S8)
                          |
                          v  produces
                  GovernanceDecision
                          |
                          v  consumed by
                    Safety Engine  (S9)
                          |
                          v  produces
                   SafetyDecision
                          |
                          v  bundled into
   ExecutionRequest { AgentExecutionPlan, GovernanceDecision,
                      SafetyDecision, ExecutionContext }
                          |
                          v  consumed by
             Runtime Execution Engine  (S10)
        executes over an injected StepExecutor seam
        (wired at composition root to the provider runtime,
         reachable only through an unforgeable GovernanceClearance)
                          |
                          v  produces / emits (immutable)
   ExecutionRecord + RuntimeEvent + ExecutionStatistics + ExecutionDiagnostics
                          |
                          v  observed by (immutable outputs only)
                 Operations Engine  (S11)
        observes and supervises; never executes, orchestrates,
        schedules, or extends a runtime contract
```

Gate: no `ExecutionRequest` can exist without a `GovernanceDecision` and a `SafetyDecision` (both fields are required and readonly), and the Runtime Execution coordinator fails closed to a `failed` record unless `governance.decision === 'AUTHORIZE'` and `safety.outcome` is one of `SAFE`, `SANITIZE`, `RESTRICT`, `DEGRADE`. There is no path to execution that bypasses governance or safety.

---

## 3. Engine Inventory

| Stage | Engine (package) | Namespace realized | Responsibility (single domain) | Edges | Key outputs |
|---|---|---|---|---|---|
| S5 | `@openlance/aios-tool-engine` | `tools` | Prepare and stop a validated, governed tool execution; never performs the interaction | 6 | prepared, governed tool execution (no outside effect) |
| S6 | `@openlance/aios-reasoning-engine` | `reasoning` | Deterministic structural reasoning over provided knowledge | 6 | governed reasoning plan |
| S7 | `@openlance/aios-agent-engine` | `agents` | Compose the six foundational engines' contracts into an immutable plan | 12 | `AgentExecutionPlan` |
| S8 | `@openlance/aios-governance-engine` | `governance` | Authorize an agent execution plan | 7 | `GovernanceDecision` |
| S9 | `@openlance/aios-safety-engine` | `safety` | Protect: evaluate an authorized plan; never authorizes | 13 | `SafetyDecision` |
| S10 | `@openlance/aios-runtime-execution-engine` | `runtime` | Execute an authorized and safe plan; sole executor | 9 | `ExecutionRecord`, `RuntimeEvent`, `ExecutionStatistics`, `ExecutionDiagnostics` |
| S11 | `@openlance/aios-operations-engine` | `operations` | Observe and supervise the running runtime; never executes | 8 | `OperationalStatus`, `HealthReport`, `IncidentReport`, `OperationalAlert`, `OperationalMetrics`, `OperationalDashboard`, `CapacityReport`, `MaintenancePlan`, `OperationalDiagnostics`, `OperationalAudit` |

Every engine additionally depends on the five substrate packages (`di`, `errors`, `events`, `kernel`, `plugins`). Public API for each engine is its `src/index.ts` barrel plus `package.json` "exports"; every exported data contract is fully `readonly`.

---

## 4. Ownership Matrix

Each engine owns exactly one constitutional domain, realizes exactly one frozen namespace, and leaks into no other domain. The two cross-namespace value edges are the only constitutionally sanctioned consumption edges.

| Engine | Constitutional domain | Frozen namespace | Non-leak proof (frozen identity) |
|---|---|---|---|
| Tool | External-interaction capability | `tools` | "performs no reasoning, makes no decision, holds no permission" (ai/tools) |
| Reasoning | Cognition | `reasoning` | "owns none of the truth, rules, retrieval, execution, or expression around it" (ai/reasoning) |
| Agent | Actor / composition | `agents` | "owns none of the reasoning, retrieval, execution, expression, or persistence it composes" (ai/agents) |
| Governance | Rule / authorization | `governance` | "No operational namespace, agent, or runtime reaches execution without conforming to the rules owned here" (ai/governance) |
| Safety | Protection | `safety` (consumes `governance`) | "is the protective layer ... owns none of the rules, truth, execution, or behavior it protects"; never overrides governance (ai/safety) |
| Runtime Execution | Execution | `runtime` | "is the execution kernel ... owns none of the rules, truth, or behavior it sequences"; sole executor (ai/runtime) |
| Operations | Running discipline | `operations` (consumes `runtime`) | "is the running discipline ... owns none of the behavior it operates ... none of the decisions its signals inform"; never executes (ai/operations) |

Sanctioned consumption edges: `safety -> governance` ("safety consumes the governance mandates") and `operations -> runtime` ("Operations depends on the runtime it operates"). No other engine value-imports a second namespace.

---

## 5. Public Contracts

Every cross-boundary contract is immutable (constructed with `Object.freeze`, all fields `readonly`), minimal, and singly owned.

| Contract | Owner (single) | Consumers | Nature |
|---|---|---|---|
| `AgentExecutionPlan` | agent-engine | governance, safety, runtime-execution | Immutable composed plan; `validated:true` only after capability + permission + acyclic-coordination checks |
| `GovernanceDecision` | governance-engine | safety, runtime-execution | Immutable authorization decision (`AUTHORIZE` / `DENY` / `ESCALATE` / `REQUIRE_APPROVAL`) |
| `SafetyDecision` | safety-engine | runtime-execution | Immutable protection decision; carries governance `oversight`/`trust` as documented provenance, never redefined |
| `ExecutionRequest` | runtime-execution-engine | runtime-execution (self) | Immutable envelope `{ plan, governance, safety, context }`; all fields required |
| `ExecutionRecord` | runtime-execution-engine | operations | Immutable terminal record of an execution (state path, steps, terminal) |
| `ExecutionStatistics` | runtime-execution-engine | operations | Immutable aggregate statistics snapshot |
| `ExecutionDiagnostics` | runtime-execution-engine | (runtime-execution output) | Immutable diagnostics snapshot |
| `RuntimeEvent` | `ai/runtime` namespace (frozen) | runtime-execution (emits), operations (observes) | Frozen closed 8-event set; consumed, never introduced or extended |
| `OperationalStatus`, `HealthReport`, `IncidentReport`, `OperationalAlert`, `OperationalMetrics`, `OperationalDashboard`, `CapacityReport`, `MaintenancePlan`, `OperationalDiagnostics`, `OperationalAudit` | operations-engine | operators / callers | Immutable operations-owned outputs; each carries a deterministic content-hash id |

`RuntimeEvent` is defined exactly once, in `packages/namespaces/runtime`. No engine re-declares any frozen model or constant set.

---

## 6. Dependency Graph

Complete outbound edge set (from `dependency-graph.snapshot.json`, triangulated against each `package.json` and the resolved `src/` imports; no phantom, hidden, or undeclared edge):

```
tool-engine              (6)  -> di, errors, events, kernel, plugins | tools
reasoning-engine         (6)  -> di, errors, events, kernel, plugins | reasoning
agent-engine             (12) -> di, errors, events, kernel, plugins | agents
                                 | memory-engine, prompt-engine, provider-engine,
                                   reasoning-engine, retrieval-engine, tool-engine  (type-only)
governance-engine        (7)  -> di, errors, events, kernel, plugins | governance
                                 | agent-engine  (type-only)
safety-engine            (13) -> di, errors, events, kernel, plugins | safety, governance
                                 | agent-engine, governance-engine, memory-engine,
                                   prompt-engine, retrieval-engine, tool-engine  (type-only)
runtime-execution-engine (9)  -> di, errors, events, kernel, plugins | runtime
                                 | agent-engine, governance-engine, safety-engine  (type-only)
operations-engine        (8)  -> di, errors, events, kernel, plugins | operations, runtime
                                 | runtime-execution-engine  (type-only)
```

Properties (certified):

- **Acyclic.** Valid topological order: provider < prompt < {memory, reasoning, retrieval, tool} < agent < governance < safety < runtime-execution < operations. Nothing depends on `operations-engine` (terminal observer leaf); only `operations-engine` depends on `runtime-execution-engine`.
- **Barrel-only imports.** Zero deep-path (`.../src/`, `.../dist/`) imports, zero relative cross-package reaches, zero `node:`/npm/vendor imports in any engine's production `src/`.
- **Every app-to-app edge is `import type` (type-only).** No app-to-app value edge exists.
- **Legal app-to-namespace edges only.** Each engine value-imports only its own namespace, except the two sanctioned edges (safety -> governance, operations -> runtime). Enforced by `.dependency-cruiser.cjs` (`NAMESPACE_DEPS`, `not-to-deep-import`, `no-circular`) and by `scripts/graph-snapshot.mjs --check`, both wired into `pnpm run validate`.

---

## 7. Constitutional Invariants (frozen)

1. One namespace equals one owner; each engine owns exactly one constitutional domain.
2. No execution occurs outside the Runtime Execution Engine; it is the sole executor.
3. Governance authorizes and never executes.
4. Safety protects, never authorizes, and never overrides a governance decision.
5. Operations observes and supervises; it never executes, orchestrates, schedules, or extends a runtime contract.
6. No stage bypasses governance or safety before execution (envelope requires both decisions; coordinator fails closed).
7. Fail closed everywhere: unknown or malformed input yields the most restrictive result (DENY / REFUSE / UNSAFE / degraded), never a silent approval.
8. Zero trust: no engine's public API throws on out-of-contract input at a trust boundary.
9. Deterministic decisions: identical input yields identical output; no `Date.now`/`Math.random`/wall-clock in any decision or output path (time enters only via an injected `Clock` DI seam, excluded from every content-hash id).
10. Immutable contracts: every cross-boundary object is deep-frozen with readonly fields.
11. Barrel-only imports; no deep-path or relative cross-package imports.
12. No vendor knowledge in any engine (enforced by twelve `no-vendor-knowledge` guard suites).
13. No circular dependencies; the application graph is acyclic.
14. No engine redefines a frozen model; frozen models are consumed, never re-declared.

---

## 8. ADR Summary (0039 - 0045)

- **ADR-0039 (Tool Engine, S5):** operational tool subsystem; consumes only the frozen tools model and substrate; prepares a validated, governed tool execution; never executes or composes tools with providers.
- **ADR-0040 (Reasoning Engine, S6):** operational reasoning subsystem; performs deterministic structural reasoning over provided knowledge; produces a governed reasoning plan without invoking any provider.
- **ADR-0041 (Agent Engine, S7):** operational agent subsystem and first orchestration engine; composes the six foundational engines' contracts into an immutable plan through legal app-to-app edges; never executes, orchestrates, or selects a provider.
- **ADR-0042 (Governance Enforcement Engine, S8):** operational authorization subsystem; authorizes an agent execution plan and produces an immutable `GovernanceDecision`.
- **ADR-0043 (Safety Engine, S9):** operational protection subsystem; evaluates an authorized plan and produces an immutable `SafetyDecision`; never authorizes, executes, or selects a provider.
- **ADR-0044 (Runtime Execution Engine, S10):** operational execution subsystem; executes an authorized and safe plan over an injected step-execution seam; consumes the immutable `ExecutionRequest`; never authorizes, evaluates safety, or overrides an upstream decision. Refines the "Operations" label used in ADR-0042/0043 to "Runtime Execution Engine" and moves Operations to a distinct Stage 11; supersedes neither ADR.
- **ADR-0045 (Operations Engine, S11):** operational supervision subsystem; consumes only immutable runtime outputs (`RuntimeEvent`, `ExecutionRecord`, `ExecutionStatistics`), derives its operational state internally, produces only operations-owned outputs, and never executes, orchestrates, or extends a runtime contract.

Consistency: all seven carry `supersedes: []` / `superseded_by: null`. ADR-0044's label refinement is a documented refinement, not a silent redefinition. RuntimeEvent ownership is stated consistently across ADR-0044 (emits the frozen set) and ADR-0045 (consumes, never extends).

---

## 9. Security Guarantees

- **Authorization.** Governance defaults to DENY on unknown trust / unvalidated plan / unknown subject / ungranted capability; `approved !== true` (including undefined) never silently authorizes.
- **Safety.** A non-AUTHORIZE governance decision short-circuits to REFUSE without evaluation; unknown governed trust fails closed to UNSAFE with emergency stop; protection rank never lowers under composition.
- **Execution.** Only `SAFE`/`SANITIZE`/`RESTRICT`/`DEGRADE` may execute; every path returns a record; success requires every step to have succeeded; a seam throw is caught and surfaced as `failed`; the engine never throws.
- **Provider.** A provider is reachable only through `ProviderExecutor.execute`, which refuses any invocation lacking a non-forgeable `GovernanceClearance`; the clearance minter is module-private and never re-exported. No provider bypass.
- **Operations.** Reports `healthy` only on positive evidence (at least one terminal execution, zero unknowns, zero failure ratio); malformed records are guarded (`Array.isArray`) and never crash the API.
- **Isolation.** Each engine holds no shared static state; per-instance accumulators; frozen `EventBus.publish` returns a `Result` and never throws.
- **Immutability.** All cross-boundary contracts are deep-frozen with readonly fields.
- **Auditability.** Every operations output carries a deterministic FNV-1a content-hash id over a canonical, sorted encoding; the operations audit is the idempotency authority (dedup before mutation).
- **Determinism.** No non-deterministic source in any decision or output path; time enters only via an injected `Clock`, excluded from all ids.

---

## 10. Extension Points

- **Provider extensibility:** the injected `StepExecutor` port, wired at the composition root; a provider executes only through `ProviderExecutor.execute` gated by an unforgeable `GovernanceClearance`. An extension cannot execute ungoverned or outside the runtime.
- **Governance extensibility:** `GovernancePluginBridge.adopt` adopts declarative `GovernanceGrant` data (subject / permissions / autonomy), validated and frozen into the registry; grants no execution capability.
- **Safety extensibility:** `SafetyPluginBridge.adopt` adopts declarative `SafetyRule` data (restricted / sandboxed capabilities, tokens, scopes), validated and frozen into the rule registry; constraint data only.
- **Operations extensibility:** `OperationsPolicy` (named alert-mute sets) built by `OperationsPolicyFactory`, held in `OperationsPolicyRegistry`, optionally shipped via `OperationsPluginBridge`; can only suppress alert keys, never executes.
- **Plugin / composition architecture:** the `di` + `plugins` seam and the composition-root `modules` registration seam; a module composed at the root can only register a resolvable service, never invoke a provider or execute outside the runtime (no discovery, no scanning, no lifecycle).

---

## 11. Certification Result

| Check | Result |
|---|---|
| `pnpm run validate` (typecheck, lint, format, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build) | exit 0 (40/40 tasks) |
| Test coverage | 100% (ADR-0015) |
| Per-stage regression (each commit touched only its own engine + docs + snapshot + lockfile) | CLEAN |
| `ai/` and `knowledge/` modified by any Phase 4 commit | none (0 files) |
| Architecture / Dependency / Public API audit | CLEAN |
| Constitution / Ownership / Namespace audit | CLEAN |
| Pipeline / Contracts / State / Reliability audit | CLEAN |
| Security / Determinism audit | CLEAN |
| Observability / Extension Points audit | CLEAN |
| ADR / Documentation / Cross-stage audit | CLEAN |

Zero Tier 1 and zero Tier 2 findings across all audits.

### Repository Evolution Notes (Tier 3, non-blocking, deferred)

These are future-enhancement observations. None is a constitutional defect; none blocks certification. They are recorded here rather than applied, to preserve the frozen tree.

1. Engine barrels (`apps/*/src/index.ts`) expose the full internal component set alongside the Manager/module and data contracts; a future generation could narrow the public surface. Intentional and uniform across all stages.
2. `runtime-execution-engine/src/retry.ts` backoff (`base * 2**(attempts-1)`) could overflow to `Infinity` at an extreme configured `maxAttempts`; harmless (no-op default delay, `try/catch`-wrapped wait, Node clamps non-finite timers, retries stay bounded by `maxAttempts`).
3. `SafetyDecision` echoes `oversight`/`trust` from `GovernanceDecision` as documented provenance carry-forward; governance remains the sole determiner (not duplicate ownership).
4. Governance and Safety read upstream-validated plan fields without the `Array.isArray` guards Operations applies at its untrusted boundary; defensible intra-pipeline trust boundary and still fail-safe (a TypeError stops without authorizing or executing).
5. The operations `no-execution` guard could add `stepexecutor` / `scheduler` / `dependencyresolver` to its literal token list as defense-in-depth; harmless today (those symbols are absent and the call-shaped tokens already fire).
6. A single non-normative "Related ADRs" sentence in `docs/implementation/adr/0045-operations-engine.md:131` loosely lists `ExecutionDiagnostics` among Operations' observed outputs; every normative Decision in that ADR, the design doc, the FREEZE, the README, and the code correctly consume only `RuntimeEvent` + `ExecutionRecord` + `ExecutionStatistics`. ADRs are immutable, so this stands as a recorded erratum, not an in-place edit.

---

## 12. Freeze Statement

Phase 4 is constitutionally frozen as of 2026-08-05 at commit `6ba96c9`, tag `phase-4-frozen`.

No future phase may modify Phase 4 ownership, contracts, or dependency boundaries except through a formal constitutional amendment: a new ADR that explicitly names and supersedes the affected decision. The frozen runtime pipeline (Agent -> Governance -> Safety -> Runtime Execution -> Provider Runtime, observed by Operations), the seven engines' single-domain ownership, the immutable public contracts, and the acyclic dependency graph recorded here are the canonical reference for all subsequent work.

---

## 13. Phase 5 Entry Criteria

- [x] Runtime pipeline certified (end-to-end, no bypass, no skipped stage, no circular flow).
- [x] Ownership certified (one domain per engine, no duplication, no leakage, no hidden ownership).
- [x] Dependency graph certified (acyclic, barrel-only, legal edges, no vendor knowledge).
- [x] Public contracts certified (minimal, single-owner, immutable, no accidental exposure).
- [x] ADR consistency certified (no contradictions, no ownership conflicts, no terminology drift).
- [x] Security certified (fail closed, zero trust, no authorization / safety / execution / provider bypass, no privilege escalation).
- [x] Documentation certified (all docs describe the same architecture; one recorded ADR erratum, non-blocking).
- [x] Extension points certified (no extension mechanism can violate ownership or bypass governance).
- [x] No constitutional defects remain (zero Tier 1, zero Tier 2).

All entry criteria are met. Phase 5 may proceed on top of the frozen Phase 4 baseline.
