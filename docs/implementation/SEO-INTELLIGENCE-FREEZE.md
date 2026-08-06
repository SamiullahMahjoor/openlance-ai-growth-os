# SEO Intelligence — Freeze Certificate

**Phase 5 · Stage 3 · AI Growth OS Features**
Package: `@openlance/aios-seo-intelligence`
ADR: [0051 — SEO Intelligence](adr/0051-seo-intelligence.md)
Design: [48 — SEO Intelligence](48-seo-intelligence.md)
Baseline: additive over `platform-complete`, `phase-4-frozen`, `phase5-stage1-frozen`, `phase5-stage2-frozen`.
Date: 2026-08-06

---

## 1. Ownership

SEO Intelligence owns the **SEO behavior only** and no business truth (ADR-0051). It is the `Content -> SEO` step of the ratified linear growth chain **Marketing -> Content -> SEO -> Social**.

- **Owns (behavior):** a closed set of thirteen SEO capabilities (`keyword-research`, `search-intent-analysis`, `topical-clustering`, `semantic-clustering`, `content-gap-analysis`, `technical-seo-planning`, `on-page-optimization-planning`, `internal-linking-strategy`, `schema-recommendations`, `serp-opportunity-analysis`, `backlink-opportunity-recommendations`, `seo-roadmap-planning`, `seo-evaluation`); the deterministic framing of an SEO request into a governed platform task; the immutable `SeoPlan` and its content-addressed identity; the SEO-quality `EvaluationRequest`.
- **Does not own (truth):** marketing strategy, content, or any `knowledge/` truth. It consumes a `MarketingBrief` id, a `ContentPlan` id, and canonical `knowledge/…md` documents by **reference** and never restates, redefines, or writes them. It writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, invokes a provider, selects a model, retrieves, crawls, indexes, collects analytics, scores, authorizes, or decides. It builds no new platform infrastructure.

Ownership drift is enforced by two permanent guard tests: `tests/ownership-boundary.test.ts` (produces a `SeoPlan`, never a marketing/content/social artifact; re-exports no sibling contract; rejects foreign capabilities) and `tests/pipeline-ownership.test.ts` (the ratified chain; SEO never imports Marketing directly or Social).

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `SeoIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `SeoFramer` | class | deterministic request → `SeoPlan` framing |
| `SeoHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `SeoNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `SeoError` | class | fail-closed error with a stable `SEO.*` code |
| `SEO_CAPABILITIES` / `isSeoCapability` | const / guard | the closed capability set + its type guard |
| `SEO_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `seoEvaluationRequest` | function | frame an SEO-quality `EvaluationRequest` |
| `seoRequestFromContent` / `SeoFraming` | function / type | by-reference Content → SEO integration |
| `SEO_MANAGER` / `seoIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `SeoCapability`, `SeoRequest`, `SeoPlan`, `SeoStatistics` | types | public contract |

`SeoRequest = { capability, objective, agent, marketing: string, content: string, knowledge?: string[] }`. `SeoPlan` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`prompt → provider`) plus its canonical id.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-seo-intelligence
  → @openlance/aios-agent-engine       (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine   (EvaluationRequest contract)
  → @openlance/aios-content-intelligence (ContentPlan output contract — immediate predecessor)
  → @openlance/aios-di                  (module/token seam)
  → @openlance/aios-errors              (error base)
  → @openlance/aios-kernel              (Result / ok / err)
```

Six edges. All app-to-app edges are **type-only, barrel-only**; the marketing reference is reached transitively through `ContentPlan.marketing` (no direct SEO→marketing edge — the ratified no-fan-in property). The graph is acyclic; `graph:check`, `depcruise`, and `arch:check` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0051):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears; grounding is by reference only.
- **Concrete-reference invariant:** `KNOWLEDGE_DOCUMENT` requires a concrete `knowledge/…md` document and rejects a bare namespace, a non-`.md` path, and any path-traversal (`.` / `..`) or control-character segment (audited by a 40+ case accept/reject matrix, no ReDoS).
- **Canonical identity:** knowledge references are trimmed, de-duplicated, and sorted before hashing; the plan id is invariant under reference order and duplication, and distinct `marketing` or `content` references yield distinct ids.
- **Ratified linear chain:** SEO consumes only its immediate predecessor (Content); no fan-in edge may be added without a superseding ADR (ADR-0051 Consequences); enforced by `tests/pipeline-ownership.test.ts`.
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

Test Files: 6 passed · Tests: 28 passed (behavioral, non-vacuous), including the ownership-boundary and pipeline-ownership guards.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O): `frame` ≈ 181,997 hz (~0.0055 ms); `plan` (full cycle) comparable. Framing is pure and I/O-free.

## 8. Audit summary

Two independent, read-only final audits:

1. **Architecture/constitution:** CLEAN. Zero Tier 1/2. Verified behavior-only ownership, disjoint capabilities, the exact 6-edge acyclic linear-chain graph, type-only/barrel-only imports, no new infrastructure, ADR/design fidelity, non-vacuous guards, the ADR ratification wording, the corrected facade docstring, and that no frozen package was modified.
2. **Correctness/security:** CLEAN. Zero Tier 1/2. Verified (against the built code) the regex accept/reject matrix and no ReDoS, exhaustive fail-closed codes, `[marketing, content, …sorted-knowledge]` ordering, canonicalize-before-hash with both refs in the id, zero-trust never-throws, correct integration, and honest 100% coverage.

## 9. Regression summary

`git diff phase5-stage2-frozen` for `ai/` and `knowledge/` is **empty**; all frozen engines, `packages/`, Marketing (Stage 1), and Content (Stage 2) are **byte-identical**. The change set is additive only: this new package, ADR-0051, design doc 48, the ADR index row, and the mechanically-derived dependency snapshot and lockfile.

## 10. Freeze statement

SEO Intelligence (Phase 5, Stage 3) satisfies the full engineering and constitutional discipline: design-first (ADR-0051 + design 48), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved, and byte-identical regression over the frozen platform. It owns SEO behavior only, consumes marketing/content/knowledge by reference along the ratified linear chain, duplicates no orchestration, and executes nothing. **It is hereby frozen** under tag `phase5-stage3-frozen`; its behavior, public API, and dependency graph are immutable, and future change requires a new ADR superseding ADR-0051.

## Accepted Repository Evolution Notes (non-blocking)

- **Shared deep-freeze helper — deferred.** A helper that deep-freezes framer outputs used *consistently by all four* Growth-OS framers would require modifying the frozen Marketing and Content packages to adopt it, which the freeze policy forbids. The current shallow inner-payload freeze is byte-identical across all four subsystems and behavior-correct. Deferred to a future coordinated change that re-freezes all four together.
- **Non-array `knowledge` coerces to `[]`** — intended zero-trust, fail-safe (a malformed non-array cannot inject a reference); byte-identical to the frozen siblings.
- **Dotfile-style filenames accepted** by the reference regex (e.g. `knowledge/.hidden.md`) — benign filenames inside `knowledge/`, never a traversal.
- **32-bit FNV-1a id** — a dependency-free reproducibility identifier, not a security primitive; identical across the chain; widening is a platform-wide future hardening.
