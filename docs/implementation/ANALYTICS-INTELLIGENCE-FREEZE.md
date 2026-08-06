# Analytics Intelligence — Freeze Certificate

**Phase 5 · Stage 5 · AI Growth OS Features**
Package: `@openlance/aios-analytics-intelligence`
ADR: [0053 — Analytics Intelligence](adr/0053-analytics-intelligence.md)
Design: [50 — Analytics Intelligence](50-analytics-intelligence.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, `phase5-stage1-frozen` … `phase5-stage4-frozen`.
Date: 2026-08-06

---

## 1. Ownership

Analytics Intelligence owns the **analytics behavior only** and no business truth (ADR-0053). It is the `Social -> Analytics` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**.

- **Owns (behavior):** a closed set of twelve analytics capabilities (`kpi-planning`, `funnel-analysis`, `attribution-planning`, `conversion-analysis`, `event-planning`, `dashboard-framing`, `metric-recommendation`, `performance-interpretation`, `cohort-analysis`, `retention-planning`, `experiment-recommendation`, `analytics-evaluation`); the deterministic framing of an analytics request into a governed platform task; the immutable `AnalyticsPlan` and its content-addressed identity; the analytics-quality `EvaluationRequest`.
- **Does not own (truth):** marketing strategy, content, SEO, social, or any `knowledge/` truth. It consumes a `MarketingBrief` id, a `ContentPlan` id, a `SeoPlan` id, a `SocialPlan` id, and canonical `knowledge/…md` documents by **reference** and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, invokes a provider, selects a model, evaluates (it frames an `EvaluationRequest`; it never computes a score), decides, orchestrates, or schedules. It builds no new platform infrastructure.

Ownership drift is enforced by two permanent guard tests: `tests/ownership-boundary.test.ts` (produces an `AnalyticsPlan`, never an upstream planner artifact; re-exports no sibling contract; rejects foreign capabilities) and `tests/pipeline-ownership.test.ts` (the full 6-stage chain; Analytics never imports Marketing, Content, or SEO directly).

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `AnalyticsIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `AnalyticsFramer` | class | deterministic request → `AnalyticsPlan` framing |
| `AnalyticsHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `AnalyticsNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `AnalyticsError` | class | fail-closed error with a stable `ANALYTICS.*` code |
| `ANALYTICS_CAPABILITIES` / `isAnalyticsCapability` | const / guard | the closed capability set + its type guard |
| `ANALYTICS_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `analyticsEvaluationRequest` | function | frame an analytics-quality `EvaluationRequest` |
| `analyticsRequestFromSocial` / `AnalyticsFraming` | function / type | by-reference Social → Analytics integration |
| `ANALYTICS_MANAGER` / `analyticsIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `AnalyticsCapability`, `AnalyticsRequest`, `AnalyticsPlan`, `AnalyticsStatistics` | types | public contract |

`AnalyticsRequest = { capability, objective, agent, marketing, content, seo, social, knowledge? }`. `AnalyticsPlan` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`prompt → provider`) whose prompt step is grounded in `[marketing, content, seo, social, …sorted-knowledge]`.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-analytics-intelligence
  → @openlance/aios-agent-engine        (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine    (EvaluationRequest contract)
  → @openlance/aios-social-intelligence  (SocialPlan output contract — immediate predecessor)
  → @openlance/aios-di                   (module/token seam)
  → @openlance/aios-errors               (error base)
  → @openlance/aios-kernel               (Result / ok / err)
```

Six edges. All app-to-app edges are **type-only, barrel-only**; the SEO, content, and marketing references are reached transitively through `SocialPlan` (no direct fan-in edge). The graph is acyclic; `graph:check`, `depcruise`, and `arch:check` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0053):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears; grounding is by reference only.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal (`.` / `..`) or control-character segment (audited by a full accept/reject matrix, no ReDoS).
- **Canonical identity:** knowledge references are trimmed, de-duplicated, and sorted before hashing; the plan id is invariant under order/duplication, and each of the four upstream references (marketing, content, seo, social) is load-bearing in the id (no positional aliasing).
- **Frames evaluation, never scores:** `analyticsEvaluationRequest` produces an `EvaluationRequest` for the frozen Evaluation Engine and computes no score.
- **Ratified linear chain:** Analytics consumes only its immediate predecessor (Social); no fan-in edge may be added without a superseding ADR; enforced by `tests/pipeline-ownership.test.ts`.
- **No orchestration duplication / fail-closed / deterministic:** emits an `AgentRequest` (no `AgentExecutionPlan`); a null/primitive/malformed request never throws; no wall clock or randomness.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 49/49 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build).

## 6. Coverage

100% on every metric (ADR-0015):

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
 framing.ts   |   100   |   100    |   100   |   100
```

Test Files: 6 passed · Tests: 29 passed (behavioral, non-vacuous), including the ownership-boundary and full 6-stage pipeline-ownership guards.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O): `frame` ≈ 173,434 hz (~0.0058 ms); `plan` (full cycle) comparable.

## 8. Audit summary

Two independent, read-only final audits — both CLEAN, zero Tier 1/2:

1. **Architecture/constitution:** CLEAN. Verified behavior-only ownership, 68/68 globally-unique capabilities, the exact 6-edge acyclic linear-chain graph, type-only/barrel-only imports, frames-evaluation-never-scores, no new infrastructure, ADR/design fidelity, non-vacuous guards, and that no frozen package was modified.
2. **Correctness/security:** CLEAN. Verified (against the built code) the regex accept/reject matrix and no ReDoS, exhaustive fail-closed codes, `[marketing, content, seo, social, …knowledge]` ordering, canonicalize-before-hash with all four refs load-bearing, zero-trust never-throws across malformed inputs, correct integration, and honest 100% coverage.

## 9. Regression summary

`git diff` for `ai/` and `knowledge/` is **empty against all six frozen tags**; all frozen engines, `packages/`, and Stages 1–4 (Marketing, Content, SEO, Social) are **byte-identical**. The change set is additive only: this new package, ADR-0053, design doc 50, the ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 10. Freeze statement

Analytics Intelligence (Phase 5, Stage 5) satisfies the full engineering and constitutional discipline: design-first (ADR-0053 + design 50), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved, and byte-identical regression over the frozen platform. It owns analytics behavior only, consumes the four upstream plans and knowledge by reference along the ratified linear chain, duplicates no orchestration, evaluates nothing, and executes nothing. **It is hereby frozen** under tag `phase5-stage5-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0053.

## Accepted Repository Evolution Notes (non-blocking)

- **Shared deep-freeze helper — deferred:** inner `AgentStep` payloads are shallow-frozen (byte-identical to all frozen siblings); a shared helper used consistently across all six framers would require modifying the frozen Marketing/Content packages, which the freeze policy forbids.
- **Non-array `knowledge` coerces to `[]`** — intended zero-trust for an optional field; no non-canonical reference can enter (each element is validated); byte-identical to the siblings.
- **32-bit FNV-1a id** — a dependency-free reproducibility identifier, not a security primitive; identical across the chain.
