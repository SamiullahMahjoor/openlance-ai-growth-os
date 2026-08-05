# Content Intelligence — Freeze Certificate

**Phase 5 · Stage 2 · AI Growth OS Features**
Package: `@openlance/aios-content-intelligence`
ADR: [0050 — Content Intelligence](adr/0050-content-intelligence.md)
Design: [47 — Content Intelligence](47-content-intelligence.md)
Baseline: additive over tag `platform-complete` (Platform Completion) and `phase-4-frozen` (Phase 4).
Date: 2026-08-06

---

## 1. Ownership

Content Intelligence owns the **content-creation behavior only** and no marketing strategy or brand truth (ADR-0050, "own the behavior, never the truth").

- **Owns (behavior):** a closed set of eleven content capabilities (`blog`, `landing-page`, `website-copy`, `product-copy`, `email-campaign`, `newsletter`, `case-study`, `documentation`, `knowledge-article`, `rewrite`, `tone-adaptation`); the deterministic framing of a content request into a governed content-generation task; the immutable `ContentPlan` artifact and its content-addressed identity; the content-quality `EvaluationRequest`.
- **Does not own (truth):** marketing strategy (consumed as a Marketing Intelligence output **by reference** — `ContentRequest.marketing` carries a `MarketingBrief.id`, never its contents), brand voice (consumed as a `knowledge/brand/…md` reference), and any product/customer/company knowledge (consumed as `knowledge/…md` references). It restates, redefines, or writes none of them and writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, invokes a provider, selects a model, authorizes, mints a `GovernanceClearance`, or makes a governance/safety/runtime decision. It builds no new platform infrastructure.

The Marketing → Content relationship is a **by-reference, acyclic** integration (`contentRequestFromMarketing` maps a `MarketingBrief` to a `ContentRequest` carrying `marketing: brief.id`). Ownership drift is enforced by a permanent guard test (`tests/ownership-boundary.test.ts`): the public API re-exports no marketing artifact (`MarketingBrief`, `MARKETING_CAPABILITIES`, `MarketingIntelligence`), it produces a `ContentPlan` (never a `MarketingBrief`), and no marketing capability (`positioning`, `messaging`, `funnel-strategy`, `gtm-planning`) is recognized by `isContentCapability`.

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `ContentIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `ContentFramer` | class | deterministic request → `ContentPlan` framing |
| `ContentHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `ContentNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `ContentError` | class | fail-closed error with a stable `CONTENT.*` code |
| `CONTENT_CAPABILITIES` / `isContentCapability` | const / guard | the closed capability set + its type guard |
| `CONTENT_AGENT` | const | `AgentDefinitionInput` (prompt, provider) |
| `contentEvaluationRequest` | function | frame a content-quality `EvaluationRequest` |
| `contentRequestFromMarketing` / `ContentFraming` | function / type | by-reference Marketing → Content integration |
| `CONTENT_MANAGER` / `contentIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `ContentCapability`, `ContentRequest`, `ContentPlan`, `ContentStatistics` | types | public contract |

The `ContentPlan` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`prompt → provider`) whose prompt step is grounded in `[marketing, brandVoice, …sorted-knowledge]`. No public surface changed under the hardening improvements.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-content-intelligence
  → @openlance/aios-agent-engine          (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine      (EvaluationRequest contract)
  → @openlance/aios-marketing-intelligence (MarketingBrief type — consumed by reference)
  → @openlance/aios-di                     (module/token seam)
  → @openlance/aios-errors                 (error base)
  → @openlance/aios-kernel                 (Result / ok / err)
```

Six edges, all to frozen substrate/engine contracts or the just-frozen Stage-1 sibling. The Marketing edge is type-only and by-reference (the id, never the strategy contents); the graph is acyclic. `graph:check` and `depcruise` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0050):** `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears in the framed request; grounding is by reference only.
- **Concrete-reference invariant (improvement A):** `BRAND_DOCUMENT` requires a concrete `knowledge/brand/…md` document and `KNOWLEDGE_DOCUMENT` a concrete `knowledge/…md` document; both reject a bare namespace, a non-`.md` path, and — after the Stage-1-audit hardening applied to both regexes — any path-traversal (`.` / `..`) or control-character segment. Violations fail closed with `CONTENT.INVALID_BRAND_VOICE` / `CONTENT.INVALID_REFERENCE`; a missing marketing reference fails closed with `CONTENT.MISSING_MARKETING`.
- **Canonical identity (improvement B):** extra knowledge references are trimmed, de-duplicated, and sorted before hashing, so any ordering or duplication of the same set yields an identical `ContentPlan.id`.
- **No orchestration duplication:** the subsystem emits an `AgentRequest`; it composes no `AgentExecutionPlan` and runs no pipeline.
- **Fail-closed / zero-trust:** a null, primitive, or structurally malformed request never throws; a non-array `knowledge` settles to `[]` and a still-valid plan is grounded in the marketing and brand references.
- **Deterministic:** no wall clock, no randomness; identity derives only from injected inputs.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 45/45 tasks successful (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build). The hardened `BRAND_DOCUMENT`/`KNOWLEDGE_DOCUMENT` regexes were independently verified against the auditor's accept/reject matrix (concrete accepts, and `knowledge/brand/../secret.md` / `knowledge/../secret.md` / `.`/NUL rejects), with no catastrophic backtracking.

## 6. Coverage

100% on every metric (ADR-0015), no exclusions on behavior modules:

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
 framing.ts   |   100   |   100    |   100   |   100
```

Test Files: 5 passed · Tests: 23 passed (behavioral, non-vacuous), including the new traversal-rejection assertions for both the brand-voice and extra-knowledge references.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O):

| Case | Throughput | Mean |
| --- | --- | --- |
| `frame` | 208,292 hz | ~0.0048 ms |
| `plan` (full framing cycle) | 205,912 hz | ~0.0049 ms |

## 8. Audit summary

Four independent, read-only re-audits after improvements A/B/C (two per stage). For Content specifically:

1. **Content — architecture/constitution + integration:** CLEAN. Zero Tier 1/2/3. Both regexes anchored, ownership guard asserts a `ContentPlan` and no marketing re-export, the Marketing → Content integration is acyclic and by-reference, and the 6-edge graph is unchanged.
2. **Content — correctness/security:** CLEAN. Zero Tier 1/2. Verified accept/reject matrices, canonicalize-before-hash, `contextReferences = [marketing, brandVoice, …sorted-knowledge]`, exhaustive fail-closed codes, and 100% coverage. The path-traversal note it raised (shared with the Marketing sibling) is **resolved** by the same regex hardening applied here. Remaining Tier-3 (non-blocking): `brandVoice` is not de-duplicated against the extra-knowledge set (harmless, deterministic redundancy), and a non-array `knowledge` coerces to `[]` (the intended zero-trust never-throw posture).

## 9. Regression summary

`git diff platform-complete` for `ai/` and `knowledge/` is **empty** (byte-identical frozen constitution). All frozen engines and `packages/` are byte-identical to `platform-complete`/`phase-4-frozen`. The change set is additive only: this new package, ADR-0050, design doc 47, the ADR index row, and the mechanically-derived dependency snapshot and lockfile entries.

## 10. Freeze statement

Content Intelligence (Phase 5, Stage 2) satisfies the full engineering and constitutional discipline: design-first (ADR-0050 + design 47), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved and re-verified, and byte-identical regression over the frozen platform. It owns content-creation behavior only, consumes marketing strategy and brand truth by reference, duplicates no orchestration, and executes nothing. **It is hereby frozen.** Its behavior, public API, and dependency graph are immutable under tag `phase5-stage2-frozen`; future change requires a new ADR superseding ADR-0050.
