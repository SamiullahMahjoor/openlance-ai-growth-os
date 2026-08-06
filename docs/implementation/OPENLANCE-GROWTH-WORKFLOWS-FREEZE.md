# OpenLance Growth Workflows — Freeze Certificate

**Phase 5 · Stage 7 · AI Growth OS Features**
Package: `@openlance/aios-openlance-growth-workflows`
ADR: [0055 — OpenLance Growth Workflows](adr/0055-openlance-growth-workflows.md)
Design: [52 — OpenLance Growth Workflows](52-openlance-growth-workflows.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, and `phase5-stage1-frozen` … `phase5-stage6-frozen`.
Date: 2026-08-06

---

## 1. Ownership

OpenLance Growth Workflows owns the **growth-workflow behavior only** and no business truth (ADR-0055). It is the terminal `Campaign -> Growth Workflows` step of the ratified linear chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign -> Growth Workflows**.

- **Owns (behavior):** workflow definitions, framing, sequencing, dependency mapping, validation, and statistics — a closed catalogue of fifteen marketplace growth workflows, each defined by a structural category and an ordered subsequence of the six planners it composes; the deterministic framing of a workflow request into a governed platform task; the immutable `GrowthWorkflow` and its content-addressed identity; the workflow-quality `EvaluationRequest`.
- **Does not own (truth):** any planner behavior (marketing/content/SEO/social/analytics/campaign) or any `knowledge/` truth. It consumes the six planner outputs (by reference, via a `CampaignPlan`) and canonical `knowledge/…md` documents by reference and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, schedules, automates, or orchestrates a workflow, invokes a provider, selects a model, or decides. It owns no orchestration engine, provider, prompts, retrieval, governance, or evaluation. Composing planners into a workflow is a **declarative framing** (a definition + an `AgentRequest`), never runtime orchestration — the four audits confirmed the only value imports in `src/` are `kernel`/`di`/`errors`, and every engine and the campaign contract are `import type`, never invoked. It builds no new platform infrastructure.

Ownership drift is enforced by four permanent guard tests: `tests/ownership-boundary.test.ts` (produces a `GrowthWorkflow`, never a planner artifact; re-exports no planner contract; `WORKFLOW_TYPES` disjoint from all 68 planner capabilities), `tests/pipeline-ownership.test.ts` (the full 7-node chain; Growth Workflows never imports another planner at runtime), `tests/sequencing.test.ts`, and `tests/catalogue-integrity.test.ts` (the constitutional catalogue guard).

## 2. Architecture

A deterministic domain subsystem: it validates a request and frames an immutable, content-hashed `GrowthWorkflow` recording the workflow type, the ordered planner `sequence`, the `plannerReferences`, the full `upstream` ids, immutable `metadata` (category + planner count), and a frozen Agent Engine `AgentRequest` (`prompt → provider`, provider-neutral `text-generation`) grounded in the composed planner references and knowledge. It composes no `AgentExecutionPlan` and runs nothing. It registers through the frozen composition-root seam (ADR-0026).

## 3. Workflow Catalogue

Fifteen workflows across seven categories, each composing an ordered subsequence of the canonical chain (`marketing → content → seo → social → analytics → campaign`), always from the root planner to the terminal planner:

| Workflow | Category | Composed planners |
| --- | --- | --- |
| freelancer-acquisition, employer-acquisition | acquisition | all six |
| marketplace-liquidity, referral-growth | growth | m→c→(seo)→so→an→cp |
| founder-campaign, seasonal-promotion | campaign | founder skips seo; seasonal all six |
| freelancer-activation, employer-activation, user-onboarding | activation | activation skips seo; onboarding = m→c→an→cp |
| reactivation, email-nurture, retention | retention | m→c→an→cp |
| product-launch, feature-announcement | launch | launch skips analytics; announcement = m→c→so→cp |
| conversion-optimization | optimization | all six |

## 4. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `OpenLanceGrowthWorkflows` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `GrowthWorkflowFramer` | class | deterministic request → `GrowthWorkflow` framing |
| `GrowthWorkflowHash` | class | FNV-1a 32-bit content-address |
| `GrowthWorkflowNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `GrowthWorkflowError` | class | fail-closed error with a stable `WORKFLOW.*` code |
| `WORKFLOW_TYPES` / `WORKFLOW_DEFINITIONS` / `CANONICAL_CHAIN` / `isWorkflowType` | consts / guard | the closed catalogue + type guard |
| `WORKFLOW_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `workflowEvaluationRequest` | function | frame a workflow-quality `EvaluationRequest` |
| `workflowFromCampaign` / `WorkflowFraming` | function / type | by-reference Campaign → Growth Workflows integration |
| `WORKFLOW_MANAGER` / `workflowModule` | token / module | composition-root seam (ADR-0026) |
| `WorkflowType`, `WorkflowCategory`, `PlannerStage`, `WorkflowMetadata`, `GrowthWorkflowRequest`, `GrowthWorkflow`, `WorkflowStatistics` | types | public contract |

`GrowthWorkflowRequest = { type, objective, agent, marketing, content, seo, social, analytics, campaign, knowledge? }`.

## 5. Dependency graph

```
@openlance/aios-openlance-growth-workflows
  → @openlance/aios-agent-engine          (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine      (EvaluationRequest contract)
  → @openlance/aios-campaign-intelligence  (CampaignPlan output contract — immediate predecessor)
  → @openlance/aios-di                     (module/token seam)
  → @openlance/aios-errors                 (error base)
  → @openlance/aios-kernel                 (Result / ok / err)
```

Six **runtime** edges. All app-to-app edges are **type-only, barrel-only**; the five earlier planner references are reached transitively through `CampaignPlan` (no fan-in edge). The five earlier planner packages imported by the ownership-boundary disjointness guard are **test-only `devDependencies`** and add **no runtime edge** (the snapshot derives from `src/` imports only; the pipeline-ownership guard checks `dependencies` only). The graph is acyclic and terminal; `graph:check`, `depcruise` (58 modules, no violations), and `arch:check` pass.

## 6. Planner integration

`workflowFromCampaign(campaignPlan, framing)` derives `marketing/content/seo/social/analytics` from the `CampaignPlan` and `campaign = campaignPlan.id` — a pure by-reference translation (type-only `CampaignPlan` import). Each workflow grounds its framed task on exactly the planner references in its type's sequence (plus knowledge), while recording the full six-planner provenance in `upstream`.

## 7. Constitutional boundaries

- **Behavior-not-truth (ADR-0055):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier; grounding is by reference only.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal or control-character segment (audited matrix, no ReDoS).
- **Canonical identity:** knowledge references are trimmed, de-duplicated, and sorted before hashing; the workflow id is invariant under order/duplication and changes on the type or any of the six planner references. Fifteen pinned golden ids are enforced by `tests/catalogue-integrity.test.ts`.
- **Catalogue integrity (constitutional):** `tests/catalogue-integrity.test.ts` asserts fifteen unique types, a type↔definition bijection, valid categories, every sequence a valid canonical-order subsequence (no duplicate planner, no backward skip, valid planners only, root→terminal), the catalogue size, and deterministic golden ids — failing CI on any drift.
- **Ratified linear chain:** Growth Workflows consumes only its immediate predecessor (Campaign); no fan-in edge may be added without a superseding ADR; enforced by `tests/pipeline-ownership.test.ts`.
- **No execution / no orchestration / deterministic / fail-closed:** emits an `AgentRequest` (no `AgentExecutionPlan`); never runs/schedules/automates/orchestrates; a null/primitive/malformed request never throws; no wall clock or randomness.

## 8. Validation

`pnpm run validate` → **EXIT 0**, 50/50 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build).

## 9. Coverage

100% on every metric (ADR-0015):

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
```

Test Files: 8 passed · Tests: 43 passed (behavioral, non-vacuous), including the ownership-boundary, full 7-node pipeline-ownership, sequencing, and catalogue-integrity guards.

## 10. Benchmarks

`vitest bench` (deterministic framing, no I/O): `frame` ≈ 137,168 hz (~0.0073 ms); `plan` (full cycle) ≈ 120,088 hz.

## 11. Audit summary

Four independent, read-only final audits — **all CLEAN, zero Tier 1/2:**

1. **Architecture/Constitution:** CLEAN. Declarative composition (owned) vs orchestration (forbidden) confirmed; both hardening changes correct; all 15 golden ids independently reproduced; 68 capabilities disjoint; exact 6-edge terminal graph; no frozen package modified.
2. **Correctness/Security:** CLEAN. ~140 empirical assertions; the prior Tier-2 (sequence aliasing) confirmed **fully resolved**; regex/ReDoS, exhaustive ordered fail-closed codes, canonicalize-before-hash, zero-trust never-throws, never-executes, honest 100%.
3. **Dependency/Ownership:** CLEAN. Runtime deps = the six; five planners test-only devDeps adding no edge; depcruise clean; acyclic terminal; disjointness enforced.
4. **Regression:** CLEAN. Purely additive; all frozen guards unbroken.

A single Tier-2 (a shallow-frozen `sequence` aliasing the shared catalogue array) was found during the review cycle, fixed (deep-froze the catalogue + copy-froze the sequence in the framer, with a regression test), and independently re-audited as resolved before this freeze.

## 12. Regression verification

`git diff` for `ai/` and `knowledge/` is **empty against all eight frozen tags**; all fourteen frozen packages, `packages/`, `tools/`, and Stages 1–6 are **byte-identical**. The change set is additive only: this new package, ADR-0055, design doc 52, the ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 13. Freeze statement

OpenLance Growth Workflows (Phase 5, Stage 7) satisfies the full engineering and constitutional discipline: design-first (ADR-0055 + design 52), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved and re-verified, and byte-identical regression over the frozen platform. It owns workflow behavior only, composes the six planners by reference along the ratified linear chain (a 7th node), duplicates no orchestration, and executes nothing. **It is hereby frozen** under tag `phase5-stage7-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0055.

## Accepted Repository Evolution Notes (non-blocking)

- **Shared deep-freeze helper — deferred:** inner `AgentStep` payloads are shallow-frozen (per-instance, no shared/global state; the re-audit confirmed cross-instance isolation); byte-identical to all six frozen siblings. A shared helper would harden all seven uniformly but adopting it consistently would require modifying the frozen packages, so it stays deferred.
- **32-bit FNV-1a id** and **non-array `knowledge` → `[]`** — reproducibility identifier and intended zero-trust fail-safe respectively; identical to the siblings.
- **Adversarial throwing getter** on a request property is outside the plain-DTO threat model (real untrusted input arrives JSON-parsed) and consistent with the frozen upstream planners.
