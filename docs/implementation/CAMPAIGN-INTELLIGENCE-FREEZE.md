# Campaign Intelligence — Freeze Certificate

**Phase 5 · Stage 6 · AI Growth OS Features**
Package: `@openlance/aios-campaign-intelligence`
ADR: [0054 — Campaign Intelligence](adr/0054-campaign-intelligence.md)
Design: [51 — Campaign Intelligence](51-campaign-intelligence.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, `phase5-stage1-frozen` … `phase5-stage4-frozen`.
Date: 2026-08-06

---

## 1. Ownership

Campaign Intelligence owns the **campaign planning behavior only** and no business truth (ADR-0054). It is the final `Analytics -> Campaign` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social -> Analytics -> Campaign**.

- **Owns (behavior):** a closed set of ten campaign planning capabilities (`campaign-orchestration-planning`, `launch-planning`, `multi-channel-planning`, `funnel-planning`, `audience-sequencing`, `lifecycle-planning`, `budget-recommendations`, `experiment-planning`, `optimization-planning`, `campaign-plan-evaluation`); the deterministic framing of a campaign request into a governed platform task; the immutable `CampaignPlan` and its content-addressed identity; the campaign-quality `EvaluationRequest`.
- **Does not own (truth):** marketing strategy, content, SEO, social, analytics, or any `knowledge/` truth. It consumes a `MarketingBrief` id, a `ContentPlan` id, a `SeoPlan` id, a `SocialPlan` id, an `AnalyticsPlan` id, and canonical `knowledge/…md` documents by **reference** and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never creates marketing, content, SEO, social, or analytics; it never executes, schedules, invokes a provider, selects a model, orchestrates at runtime, or decides. It builds no new platform infrastructure.
- **Resolved identifier collision (Architecture Ambiguity Gate):** two suggested capabilities collided with frozen identifiers (Marketing owns `campaign-planning`; Social owns `campaign-evaluation`). Campaign uses the distinct identifiers **`campaign-orchestration-planning`** and **`campaign-plan-evaluation`**; Marketing and Social keep theirs unchanged.

Ownership drift is enforced by three permanent guard tests: `tests/ownership-boundary.test.ts` (produces a `CampaignPlan`, never an upstream planner artifact; re-exports no sibling contract; rejects foreign capabilities including the frozen `campaign-planning`/`campaign-evaluation`), `tests/pipeline-ownership.test.ts` (the full 6-stage chain; Campaign never imports Marketing, Content, SEO, or Social directly), and `tests/capability-disjointness.test.ts` (the repository-wide constitutional guard — all 68 capabilities across the six subsystems are globally unique).

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `CampaignIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `CampaignFramer` | class | deterministic request → `CampaignPlan` framing |
| `CampaignHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `CampaignNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `CampaignError` | class | fail-closed error with a stable `CAMPAIGN.*` code |
| `CAMPAIGN_CAPABILITIES` / `isCampaignCapability` | const / guard | the closed capability set + its type guard |
| `CAMPAIGN_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `campaignEvaluationRequest` | function | frame a campaign-quality `EvaluationRequest` |
| `campaignRequestFromAnalytics` / `CampaignFraming` | function / type | by-reference Analytics → Campaign integration |
| `CAMPAIGN_MANAGER` / `campaignIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `CampaignCapability`, `CampaignRequest`, `CampaignPlan`, `CampaignStatistics` | types | public contract |

`CampaignRequest = { capability, objective, agent, marketing, content, seo, social, analytics, knowledge? }`. `CampaignPlan` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`prompt → provider`) whose prompt step is grounded in `[marketing, content, seo, social, analytics, …sorted-knowledge]`.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-campaign-intelligence
  → @openlance/aios-agent-engine          (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine      (EvaluationRequest contract)
  → @openlance/aios-analytics-intelligence (AnalyticsPlan output contract — immediate predecessor)
  → @openlance/aios-di                     (module/token seam)
  → @openlance/aios-errors                 (error base)
  → @openlance/aios-kernel                 (Result / ok / err)
```

Six **runtime** edges. Social, SEO, content, and marketing are reached transitively through `AnalyticsPlan` (no direct fan-in edge). The four sibling planners imported by the repository-wide disjointness guard are **test-only `devDependencies`** and create **no runtime edge** (the snapshot derives from `src/` imports only; the pipeline-ownership guard checks `dependencies` only). The graph is acyclic and terminal; `graph:check`, `depcruise`, and `arch:check` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0054):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears; grounding is by reference only.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal or control-character segment (audited by a 31-case matrix, no ReDoS).
- **Canonical identity:** knowledge references are trimmed, de-duplicated, and sorted before hashing; the plan id is invariant under order/duplication, and each of the five upstream references is load-bearing (no positional aliasing).
- **Disjointness (constitutional):** `tests/capability-disjointness.test.ts` asserts the per-subsystem counts (11/11/13/11/12/10), a total of 68, and that every identifier is globally unique — failing CI on any future collision.
- **Ratified linear chain:** Campaign consumes only its immediate predecessor (Analytics); no fan-in edge may be added without a superseding ADR; enforced by `tests/pipeline-ownership.test.ts`.
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

Test Files: 7 passed · Tests: 32 passed (behavioral, non-vacuous), including the ownership-boundary, full 6-stage pipeline-ownership, and repository-wide capability-disjointness guards.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O): `frame` ≈ 177,844 hz (~0.0056 ms); `plan` (full cycle) comparable.

## 8. Audit summary

Two independent, read-only final audits — both CLEAN, zero Tier 1/2:

1. **Architecture/constitution:** CLEAN. Verified behavior-only ownership, the capability-collision resolution (renamed identifiers present, frozen `campaign-planning`/`campaign-evaluation` absent, frozen Marketing/Social unmodified), 68/68 unique capabilities, and — critically — that the new disjointness guard **introduced no runtime fan-in edge** (four planners in `devDependencies`, runtime deps unchanged, snapshot unchanged, pipeline guard still enforcing the chain). No frozen package modified.
2. **Correctness/security:** CLEAN. Verified (against the built code) the 31-case regex matrix and no ReDoS, nine exhaustive fail-closed codes each with its own gate, `[marketing, content, seo, social, analytics, …knowledge]` ordering, canonicalize-before-hash with all five refs load-bearing, zero-trust never-throws, never-creates/executes/schedules, the disjointness guard's non-vacuity (a duplicate injection fires the collision filter), and honest 100% coverage.

## 9. Regression summary

`git diff` for `ai/` and `knowledge/` is **empty against all six frozen tags**; all frozen engines, `packages/`, and Stages 1–4 are **byte-identical** (the arch audit independently confirmed frozen Marketing still owns `campaign-planning` and Social still owns `campaign-evaluation`, unmodified). The change set is additive only: this new package, ADR-0054, design doc 51, the ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 10. Freeze statement

Campaign Intelligence (Phase 5, Stage 6) satisfies the full engineering and constitutional discipline: design-first (ADR-0054 + design 51), an ownership Ambiguity Gate raised and resolved, `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved, and byte-identical regression over the frozen platform. It owns campaign planning behavior only, consumes the five upstream plans and knowledge by reference along the ratified linear chain, duplicates no orchestration, creates none of its inputs, and executes nothing. **It is hereby frozen** under tag `phase5-stage6-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0054.

## Accepted Repository Evolution Notes (non-blocking)

- **Shared deep-freeze helper — deferred** (same as the siblings): would require modifying the frozen packages.
- **Non-array `knowledge` coerces to `[]`** — intended zero-trust; byte-identical to the siblings.
- **32-bit FNV-1a id** — reproducibility identifier, not a security primitive; identical across the chain.
- **Disjointness guard has a single home** (the terminal Campaign package) — intentional; Campaign is the only package that legitimately dev-depends on all five siblings.
