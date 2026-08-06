# Automation Intelligence — Freeze Certificate

**Phase 5 · Stage 8 · AI Growth OS Features (the eighth and final Phase 5 behavior subsystem)**
Package: `@openlance/aios-automation-intelligence`
ADR: [0056 — Automation Intelligence](adr/0056-automation-intelligence.md)
Design: [53 — Automation Intelligence](53-automation-intelligence.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, and `phase5-stage1-frozen` … `phase5-stage7-frozen`.
Date: 2026-08-06

---

## 1. Ownership

Automation Intelligence owns the **automation-planning behavior only** and no business truth (ADR-0056). It is the terminal `Growth Workflows -> Automation` step of the ratified linear chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows -> Automation**.

- **Owns (behavior):** the automation capability catalogue, framing, dependency mapping, validation, and statistics — a closed set of eleven governed-automation-opportunity planning behaviors; the deterministic framing of an automation request into a governed platform task; the immutable `AutomationPlan` and its content-addressed identity; the automation-quality `EvaluationRequest`.
- **Does not own (truth):** any Growth Workflows behavior, any planner behavior (marketing/content/SEO/social/analytics/campaign), or any `knowledge/` truth. It consumes the growth workflow output (by reference, via a `GrowthWorkflow` id) and canonical `knowledge/…md` documents by reference and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, schedules, enqueues, or orchestrates automation, invokes a provider, selects a model, mints or bypasses a `GovernanceClearance`, produces or consumes a Runtime `ExecutionRequest`/`ExecutionRecord`, or decides. It owns no orchestration engine, execution engine, scheduler, runtime, provider, prompts, retrieval, governance, or evaluation mechanism. Preparing a governed automation opportunity is a **declarative framing** (a capability + a framed `AgentRequest`), never runtime orchestration — the four audits confirmed the only value imports in `src/` are `kernel`/`di`/`errors`, and every engine and the predecessor contract are `import type`, never invoked. It builds no new platform infrastructure.

Ownership drift is enforced by eight permanent guard tests: `tests/ownership-boundary.test.ts` (produces an `AutomationPlan`, never a planner artifact or `GrowthWorkflow`; re-exports no planner/workflow contract; `AUTOMATION_CAPABILITIES` disjoint from all 68 planner capabilities and 15 Growth Workflows types), `tests/pipeline-ownership.test.ts` (the full 8-node chain; Automation never imports another planner at runtime), `tests/runtime-dependency-boundaries.test.ts` (the closed 6-dependency set; no execution/governance/provider/operations/safety-engine edge), `tests/no-execution.test.ts`, `tests/no-orchestration.test.ts`, `tests/no-provider-knowledge.test.ts`, `tests/composition-root.test.ts`, and `tests/type-only-imports.test.ts` (the erasure guard).

## 2. Architecture

A deterministic domain subsystem: it validates an automation request and frames an immutable, content-hashed `AutomationPlan` recording the automation capability, objective, agent, the `workflow` it consumes by reference, any knowledge references, a plain-language deliverable, and a frozen Agent Engine `AgentRequest` (`prompt → provider`, provider-neutral `text-generation`) grounded in the workflow reference and knowledge, plus a content-addressed id. It composes no `AgentExecutionPlan` and runs nothing. It registers through the frozen composition-root seam (ADR-0026). It is structurally a byte-faithful mirror of the frozen Campaign Intelligence planner, re-pointed one node down the chain, with a single upstream reference (the growth workflow) rather than five.

## 3. Capability catalogue

Eleven closed automation capabilities, each a governed-automation-opportunity planning behavior (never an execution): `automation-opportunity-analysis`, `workflow-automation-planning`, `task-automation-planning`, `trigger-recommendation`, `handoff-planning`, `guardrail-recommendation`, `escalation-recommendation`, `monitoring-recommendation`, `rollout-planning`, `automation-roadmap-planning`, `automation-evaluation`. Each is a plan or recommendation the platform later acts on through its governed runtime; none schedules, triggers, executes, or governs anything (`trigger-recommendation` recommends a triggering condition and is deferred to the runtime, never an executable trigger). Internally unique and globally disjoint from the 68 planner capabilities and 15 Growth Workflows types (83 foreign identifiers; zero collisions).

## 4. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `AutomationIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `AutomationFramer` | class | deterministic request → `AutomationPlan` framing |
| `AutomationHash` | class | FNV-1a 32-bit content-address |
| `AutomationNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `AutomationError` | class | fail-closed error with a stable `AUTOMATION.*` code |
| `AUTOMATION_CAPABILITIES` / `isAutomationCapability` | const / guard | the closed catalogue + type guard |
| `AUTOMATION_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `automationEvaluationRequest` | function | frame an automation-quality `EvaluationRequest` |
| `automationRequestFromWorkflow` / `AutomationFraming` | function / type | by-reference Growth Workflows → Automation integration |
| `AUTOMATION_MANAGER` / `automationIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `AutomationCapability`, `AutomationRequest`, `AutomationPlan`, `AutomationStatistics` | types | public contract |

`AutomationRequest = { capability, objective, agent, workflow, knowledge? }`.

## 5. Dependency graph

```
@openlance/aios-automation-intelligence
  → @openlance/aios-agent-engine                 (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine            (EvaluationRequest contract)
  → @openlance/aios-openlance-growth-workflows   (GrowthWorkflow output contract — immediate predecessor)
  → @openlance/aios-di                           (module/token seam)
  → @openlance/aios-errors                       (error base)
  → @openlance/aios-kernel                       (Result / ok / err)
```

Six **runtime** edges. All app-to-app edges are **type-only, barrel-only** (pinned by `tests/type-only-imports.test.ts`); the five earlier planner references are reached transitively through the growth workflow (no fan-in edge). The six planner packages imported by the ownership-boundary disjointness guard are **test-only `devDependencies`** and add **no runtime edge** (the snapshot derives from `src/` imports only; the pipeline-ownership and runtime-dependency-boundaries guards check `dependencies` only). It takes no dependency on `runtime-execution-engine`, `governance-engine`, `provider-engine`, `operations-engine`, or `safety-engine`. The graph is acyclic and terminal; `graph:check`, `depcruise`, and `arch:check` pass.

## 6. Growth Workflows integration

`automationRequestFromWorkflow(workflow, framing)` derives `workflow = workflow.id` from the `GrowthWorkflow` — a pure by-reference translation (type-only `GrowthWorkflow` import), reading only the workflow id (stricter than Campaign's translator, which reads five predecessor fields). Each automation grounds its framed task on the workflow reference plus knowledge, while the growth workflow itself carries the six planner references transitively.

## 7. Constitutional boundaries

- **Behavior-not-truth (ADR-0056):** `tests/no-vendor-knowledge` semantics via `tests/no-provider-knowledge.test.ts` prove no vendor/model/SDK identifier; grounding is by reference only. There is no `ai/automation/` or `knowledge/automation/` namespace.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal or control-character segment (audited, no ReDoS).
- **Canonical identity:** knowledge references are trimmed, de-duplicated, and sorted before hashing; the automation id is invariant under order/duplication and changes on the capability, objective, agent, or workflow reference.
- **No execution / no orchestration / no runtime duplication / no governance bypass:** emits an `AgentRequest` (no `AgentExecutionPlan`); never runs/schedules/enqueues/orchestrates; never mints, forges, references, or bypasses a `GovernanceClearance`; never produces a Runtime `ExecutionRequest`/`ExecutionRecord`. Enforced by `tests/no-execution.test.ts`, `tests/no-orchestration.test.ts`, and `tests/runtime-dependency-boundaries.test.ts`.
- **Ratified linear chain:** Automation consumes only its immediate predecessor (Growth Workflows); no fan-in edge may be added without a superseding ADR; enforced by `tests/pipeline-ownership.test.ts`.
- **Deterministic / fail-closed / zero-trust:** the plan and its FNV-1a id are a pure function of the request; no wall clock, randomness, or environment; a null/primitive/malformed request never throws and fails closed with a precise `AUTOMATION.*` code.

## 8. Hardening applied

**Type-only import (erasure) guard** (`tests/type-only-imports.test.ts`) — a permanent CI invariant proving that each of the three framed app-to-app contracts (`agent-engine`, `evaluation-engine`, `openlance-growth-workflows`) is imported only as `import type` (so it erases and adds no runtime edge), and that the only `@openlance/aios-*` value imports are the runtime substrate (`kernel`, `di`, `errors`). This closes the one gap the dependency-set guard cannot catch — a silent `import type` → value-import flip on an already-permitted runtime dependency. Non-vacuous (asserts each framed contract is actually imported and type-only, and that a value import actually exists and is substrate).

**Deliberately not implemented** (recorded as Repository Evolution Notes, per the refinement-only scope): broadening the erasure guard to also match `export … from`/side-effect/dynamic import forms; a chain-wide `try/catch` for adversarial throwing getters; deep-freezing inner `AgentStep` payloads; rejecting a non-array `knowledge` rather than coercing to `[]`; and any frozen-package change.

## 9. Validation

`pnpm run validate` → **EXIT 0**, 51/51 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build).

## 10. Coverage

100% on every metric (ADR-0015):

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
```

Test Files: 9 passed · Tests: 41 passed (behavioral, non-vacuous), including the ownership-boundary, 8-node pipeline-ownership, runtime-dependency-boundaries, no-execution, no-orchestration, no-provider-knowledge, composition-root, and type-only-imports guards.

## 11. Benchmarks

`vitest bench` (deterministic framing, no I/O), observational baselines (Engineering Rule 5): `plan` (full framing cycle) ≈ 205,726 hz; `frame` ≈ 181,238 hz.

## 12. Audit summary

Eight independent, read-only audits across two rounds (review + freeze) — **all CLEAN, zero Tier-1 / zero Tier-2:**

1. **Architecture/Constitution:** CLEAN. Automation-planning behavior only; declarative composition (value imports only kernel/di/errors); never mints/bypasses clearance nor duplicates runtime execution; no `ai/automation` namespace; ADR/design conform and every `ADR-XXXX` reference resolves; single-field predecessor-only integration (zero fan-in); the type-only guard is genuine and non-vacuous.
2. **Correctness/Security:** CLEAN. Regex correct, no ReDoS; all five fail-closed codes reachable and ordered; zero-trust for all plain/primitive/malformed inputs; pure FNV-1a determinism (no wall clock/randomness/env); **no module-global aliasing** (the Stage-7 bug class is absent); honest 100% coverage; no injection vector.
3. **Dependency/Ownership:** CLEAN. Runtime deps exactly the six; snapshot matches src imports with no drift; all three framed edges `import type`; 94-identifier disjointness independently recomputed (68/15/11, zero collisions); acyclic terminal; barrel-only; guards non-vacuous.
4. **Regression:** CLEAN. Purely additive; all nine frozen tags byte-identical; zero deletions/renames; no stray files; no reverse edge into any frozen package.

Remaining findings are accepted, non-blocking Repository Evolution Notes; every one shared with the frozen chain or purely theoretical.

## 13. Regression verification

`git diff` for `ai/` and `knowledge/` is **empty against all nine frozen tags**; all frozen substrate, tooling, and the seven chain apps (Stages 1–7) are **byte-identical** to `phase5-stage7-frozen`. The change set is additive only: this new package (27 tracked files), ADR-0056, design doc 53, the +1 ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 14. Freeze statement

Automation Intelligence (Phase 5, Stage 8) satisfies the full engineering and constitutional discipline: design-first (ADR-0056 + design 53), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved (none were found; the one approved architectural hardening was applied), and byte-identical regression over the frozen platform. It owns automation-planning behavior only, composes the certified platform by reference along the ratified linear chain (its 8th and terminal node), duplicates no orchestration or runtime execution, bypasses no governance clearance, and executes nothing. **It is hereby frozen** under tag `phase5-stage8-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0056. This completes the eight AI Growth OS Feature subsystems of Phase 5.

## Accepted Repository Evolution Notes (non-blocking)

- **Erasure-guard scope — deferred:** `tests/type-only-imports.test.ts` matches static `import … from` statements; it does not match `export … from`, bare side-effect, or dynamic `import()`/`require()` forms. None exist in `src` today (ESM, `sideEffects: false`, barrel-only), and a new edge to a non-permitted package is still caught by the dependency-set and pipeline-ownership guards; broadening the regex would harden further but is optional.
- **Adversarial throwing getter** on a request property throws rather than failing closed — outside the plain-DTO threat model (real untrusted input arrives JSON-parsed), reads fewer fields than the frozen Campaign framer, and any fix must be applied chain-wide; identical to the frozen upstream planners.
- **Non-array `knowledge` → `[]`** (coerced rather than rejected) — a fail-safe that can only drop context, never inject it; `knowledge` is optional; identical to the frozen siblings.
- **Shallow inner freeze** of `AgentStep` payloads (`steps[i]`, `.request`, `.variables`, `.contextReferences`, evaluation `metrics`) — per-instance, non-aliased, cannot corrupt determinism or shared state; byte-identical to all six frozen planner siblings.
- **Package metadata** carries scaffold defaults (`version 0.0.0`, `stability "Experimental"`, `constitution []`) — identical to every frozen sibling; a conscious freeze-time classification.
