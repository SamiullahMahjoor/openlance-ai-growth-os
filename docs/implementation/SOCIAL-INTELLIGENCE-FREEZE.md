# Social Intelligence — Freeze Certificate

**Phase 5 · Stage 4 · AI Growth OS Features**
Package: `@openlance/aios-social-intelligence`
ADR: [0052 — Social Intelligence](adr/0052-social-intelligence.md)
Design: [49 — Social Intelligence](49-social-intelligence.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, `phase5-stage1-frozen`, `phase5-stage2-frozen`.
Date: 2026-08-06

---

## 1. Ownership

Social Intelligence owns the **social-media behavior only** and no business truth (ADR-0052). It is the `SEO -> Social` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social**.

- **Owns (behavior):** a closed set of eleven social capabilities (`platform-strategy`, `post-planning`, `campaign-framing`, `content-calendar`, `audience-engagement-recommendations`, `hashtag-planning`, `posting-schedule-recommendations`, `community-growth-recommendations`, `influencer-collaboration-planning`, `platform-specific-adaptation`, `campaign-evaluation`); the deterministic framing of a social request into a governed platform task; the immutable `SocialPlan` and its content-addressed identity; the social-quality `EvaluationRequest`.
- **Does not own (truth):** marketing strategy, content, brand voice, or any `knowledge/` truth. It consumes a `MarketingBrief` id, a `ContentPlan` id, a `SeoPlan` id, and canonical `knowledge/…md` documents by **reference** and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, publishes, schedules, posts, calls an API, invokes a provider, selects a model, authorizes, or decides, and it never authors content (a schedule or calendar is framed as a **recommendation**, never enacted; content is referenced by id). `platform-strategy` is social-platform strategy, never marketing strategy. It builds no new platform infrastructure.

Ownership drift is enforced by two permanent guard tests: `tests/ownership-boundary.test.ts` (produces a `SocialPlan`, never a marketing/content/SEO artifact; re-exports no sibling contract; rejects foreign capabilities) and `tests/pipeline-ownership.test.ts` (the ratified chain; Social never imports Marketing or Content directly).

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `SocialIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `SocialFramer` | class | deterministic request → `SocialPlan` framing |
| `SocialHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `SocialNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `SocialError` | class | fail-closed error with a stable `SOCIAL.*` code |
| `SOCIAL_CAPABILITIES` / `isSocialCapability` | const / guard | the closed capability set + its type guard |
| `SOCIAL_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `socialEvaluationRequest` | function | frame a social-quality `EvaluationRequest` |
| `socialRequestFromSeo` / `SocialFraming` | function / type | by-reference SEO → Social integration |
| `SOCIAL_MANAGER` / `socialIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `SocialCapability`, `SocialRequest`, `SocialPlan`, `SocialStatistics` | types | public contract |

`SocialRequest = { capability, objective, agent, marketing: string, content: string, seo: string, knowledge?: string[] }`. `SocialPlan` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`prompt → provider`) whose prompt step is grounded in `[marketing, content, seo, …sorted-knowledge]`.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-social-intelligence
  → @openlance/aios-agent-engine       (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine   (EvaluationRequest contract)
  → @openlance/aios-seo-intelligence    (SeoPlan output contract — immediate predecessor)
  → @openlance/aios-di                  (module/token seam)
  → @openlance/aios-errors              (error base)
  → @openlance/aios-kernel              (Result / ok / err)
```

Six edges. All app-to-app edges are **type-only, barrel-only**; content and marketing are reached transitively through `SeoPlan.content` / `SeoPlan.marketing` (no direct Social→content or Social→marketing edge — the ratified no-fan-in property). The graph is acyclic; `graph:check`, `depcruise`, and `arch:check` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0052):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears; grounding is by reference only.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal or control-character segment (audited by a full accept/reject matrix, no ReDoS at 1M characters).
- **Canonical identity:** extra knowledge references are trimmed, de-duplicated, and sorted before hashing; the plan id is invariant under order/duplication, and distinct `marketing`, `content`, or `seo` references each yield distinct ids.
- **Never authors / never schedules:** the provider step frames a provider-neutral `text-generation` need (a planning output); `tests/no-execution.test.ts` proves no scheduler/timer/publish/execute token in source.
- **Ratified linear chain:** Social consumes only its immediate predecessor (SEO); no fan-in edge may be added without a superseding ADR (ADR-0052 Consequences); enforced by `tests/pipeline-ownership.test.ts`.
- **No orchestration duplication / fail-closed / deterministic:** emits an `AgentRequest` (no `AgentExecutionPlan`); a null/primitive/malformed request never throws; no wall clock or randomness.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 47/47 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build).

## 6. Coverage

100% on every metric (ADR-0015), no exclusions on behavior modules:

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
 framing.ts   |   100   |   100    |   100   |   100
```

Test Files: 6 passed · Tests: 27 passed (behavioral, non-vacuous), including the ownership-boundary and pipeline-ownership guards.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O): `frame` ≈ 201,094 hz (~0.0050 ms); `plan` (full cycle) comparable. Framing is pure and I/O-free.

## 8. Audit summary

Two independent, read-only final audits:

1. **Architecture/constitution:** CLEAN. Zero Tier 1/2. Verified behavior-only ownership (never authors content, never enacts a schedule), disjoint capabilities, the exact 6-edge acyclic linear-chain graph, type-only/barrel-only imports, no new infrastructure, ADR/design fidelity, non-vacuous guards, the ADR ratification wording, and — confirming the prior Tier-2 is resolved — the corrected facade docstring (a `src/` grep for "brand voice"/"optional content" returns zero matches).
2. **Correctness/security:** CLEAN. Zero Tier 1/2. Verified (against the built code) the regex matrix and no ReDoS, seven exhaustive fail-closed codes each with its own gate, `[marketing, content, seo, …knowledge]` ordering, canonicalize-before-hash with all three refs in the id, zero-trust never-throws across malformed inputs, correct integration, never-authors/never-schedules, and honest 100% coverage.

## 9. Regression summary

`git diff phase5-stage2-frozen` for `ai/` and `knowledge/` is **empty**; all frozen engines, `packages/`, Marketing (Stage 1), Content (Stage 2), and SEO (Stage 3) are unmodified. The change set is additive only: this new package, ADR-0052, design doc 49, the ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 10. Freeze statement

Social Intelligence (Phase 5, Stage 4) satisfies the full engineering and constitutional discipline: design-first (ADR-0052 + design 49), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved (including the corrected facade docstring), and byte-identical regression over the frozen platform. It owns social-media behavior only, consumes marketing/content/SEO/knowledge by reference along the ratified linear chain, duplicates no orchestration, authors no content, and executes nothing. **It is hereby frozen** under tag `phase5-stage4-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0052.

## Accepted Repository Evolution Notes (non-blocking)

- **Shared deep-freeze helper — deferred** (same as Stage 3): a helper used consistently by all four framers would require modifying the frozen Marketing and Content packages; deferred to a future coordinated re-freeze.
- **Non-array `knowledge` coerces to `[]`** — intended zero-trust, fail-safe; byte-identical to the frozen siblings.
- **32-bit FNV-1a id** — a dependency-free reproducibility identifier, not a security primitive; identical across the chain.
