# Marketing Intelligence — Freeze Certificate

**Phase 5 · Stage 1 · AI Growth OS Features**
Package: `@openlance/aios-marketing-intelligence`
ADR: [0049 — Marketing Intelligence](adr/0049-marketing-intelligence.md)
Design: [46 — Marketing Intelligence](46-marketing-intelligence.md)
Baseline: additive over tag `platform-complete` (Platform Completion) and `phase-4-frozen` (Phase 4).
Date: 2026-08-06

---

## 1. Ownership

Marketing Intelligence owns the **marketing-intelligence behavior only** and no business truth (ADR-0049, Ambiguity Gate resolution "own the behavior, never the truth").

- **Owns (behavior):** a closed set of eleven marketing capabilities (`market-research`, `icp-discovery`, `competitor-analysis`, `positioning`, `messaging`, `offer-strategy`, `funnel-strategy`, `campaign-planning`, `gtm-planning`, `recommendation`, `evaluation`); the deterministic framing of a marketing request into a governed platform task; the immutable `MarketingBrief` artifact and its content-addressed identity; the marketing `EvaluationRequest`.
- **Does not own (truth):** marketing strategy, brand voice, positioning, messaging, ICP, customer, competitor, product, or company knowledge. Every such input is consumed by **canonical reference** into the `knowledge/` layer (e.g. `knowledge/marketing/positioning.md`) and is never restated, redefined, modified, or written back. The subsystem writes nothing into `ai/` or `knowledge/`.
- **Does not do:** it never executes, invokes a provider, selects a model, authorizes, mints a `GovernanceClearance`, or makes a governance/safety/runtime decision. It frames tasks that the frozen Agent, Governance, Safety, Runtime, and Evaluation engines run unchanged once the clearance-minter production path exists. It builds no new platform infrastructure.

Ownership drift is enforced by a permanent guard test (`tests/ownership-boundary.test.ts`): the public API produces a `MarketingBrief` (never a `ContentPlan`/content artifact), a `MarketingBrief` carries no `brandVoice`/content field, and no content capability (`blog`, `landing-page`, …) is recognized by `isMarketingCapability`.

## 2. Public API

Single supported entry point `src/index.ts` (Engineering Rule 1; deep imports fail CI):

| Export | Kind | Purpose |
| --- | --- | --- |
| `MarketingIntelligence` | class (facade) | `plan` / `agentDefinition` / `evaluationRequest` / `statistics` |
| `MarketingFramer` | class | deterministic request → `MarketingBrief` framing |
| `MarketingHash` | class | FNV-1a 32-bit content-address of the canonical form |
| `MarketingNormalizer` | class | whitespace normalization; non-string settles to `''` |
| `MarketingError` | class | fail-closed error with a stable `MARKETING.*` code |
| `MARKETING_CAPABILITIES` / `isMarketingCapability` | const / guard | the closed capability set + its type guard |
| `MARKETING_AGENT` | const | `AgentDefinitionInput` (retrieval, prompt, provider) |
| `marketingEvaluationRequest` | function | frame a marketing `EvaluationRequest` |
| `MARKETING_MANAGER` / `marketingIntelligenceModule` | token / module | composition-root seam (ADR-0026) |
| `MarketingCapability`, `MarketingRequest`, `MarketingBrief`, `MarketingStatistics` | types | public contract |

The `MarketingBrief` is deep-frozen at the top level and carries an immutable Agent Engine `AgentRequest` (`retrieval → prompt → provider`) plus its canonical id. No public surface changed under the hardening improvements.

## 3. Dependency graph

Runtime edges (from `dependency-graph.snapshot.json`, derived from `src/` import specifiers):

```
@openlance/aios-marketing-intelligence
  → @openlance/aios-agent-engine       (AgentRequest / AgentStep contract)
  → @openlance/aios-evaluation-engine   (EvaluationRequest contract)
  → @openlance/aios-di                  (module/token seam)
  → @openlance/aios-errors              (error base)
  → @openlance/aios-kernel              (Result / ok / err)
```

Five edges, all to frozen substrate/engine contracts. Retrieval/prompt/provider step payload types resolve transitively through the Agent Engine `AgentStep` union and are therefore **not** direct edges. The graph is acyclic. `graph:check` and `depcruise` pass.

## 4. Constitutional boundary

- **Behavior-not-truth (ADR-0049):** enforced structurally — `tests/no-vendor-knowledge.test.ts` proves no vendor/model/SDK identifier appears in the framed request; grounding is by canonical `knowledge/…md` reference only.
- **Concrete-reference invariant (improvement A):** `KNOWLEDGE_DOCUMENT` requires a concrete document under `knowledge/` and rejects a bare namespace (`knowledge/brand/`), a non-`.md` path, and — after the Stage-1-audit hardening — any path-traversal (`.` / `..`) or control-character segment. Ungrounded requests fail closed with `MARKETING.UNGROUNDED`.
- **Canonical identity (improvement B):** references are trimmed, de-duplicated, and sorted before hashing, so any ordering or duplication of the same reference set yields an identical `MarketingBrief.id`.
- **No orchestration duplication:** the subsystem emits an `AgentRequest`; it composes no `AgentExecutionPlan` and runs no pipeline.
- **Fail-closed / zero-trust:** a null, primitive, or structurally malformed request never throws; it settles to a fail-closed `MarketingError`.
- **Deterministic:** no wall clock, no randomness; identity derives only from injected inputs.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 45/45 tasks successful (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build). The hardened `KNOWLEDGE_DOCUMENT` regex was independently verified against the auditor's full accept/reject matrix: every legitimate concrete document accepts; every bare namespace, non-`.md`, whitespace, `//`, `.md`-only, uppercase-`.MD`, and `.`/`..`/NUL traversal input rejects; no catastrophic backtracking (20,000-segment non-match resolved in ~0.9 ms).

## 6. Coverage

100% on every metric (ADR-0015), no exclusions on behavior modules:

```
File          | % Stmts | % Branch | % Funcs | % Lines
All files     |   100   |   100    |   100   |   100
 framing.ts   |   100   |   100    |   100   |   100
```

Test Files: 5 passed · Tests: 21 passed (behavioral, non-vacuous), including the new traversal-rejection assertions.

## 7. Benchmarks

`vitest bench` (deterministic framing, no I/O):

| Case | Throughput | Mean |
| --- | --- | --- |
| `frame` | 233,742 hz | ~0.0043 ms |
| `plan` (full framing cycle) | 219,437 hz | ~0.0046 ms |

## 8. Audit summary

Four independent, read-only re-audits after improvements A/B/C:

1. **Marketing — architecture/constitution:** CLEAN. Zero Tier 1/2/3. Regex anchored, dedup+sort before hash confirmed, ownership guard non-vacuous, refinement-only, additive regression.
2. **Marketing — correctness/security:** one **Tier 2** — `KNOWLEDGE_DOCUMENT` accepted `.`/`..`/control-character segments (`knowledge/../secret.md`, `knowledge/./x.md`, NUL), failing open on the exact canonicalization surface under audit. **RESOLVED**: segment class tightened to a safe filename set with a per-segment negative lookahead rejecting `.`/`..`; traversal-rejection tests added; matrix + 100% coverage re-verified. One **Tier 3** (non-blocking): inner step-request payloads are shallow-frozen, consistent with the codebase-wide shallow-freeze convention.

## 9. Regression summary

`git diff platform-complete` for `ai/` and `knowledge/` is **empty** (byte-identical frozen constitution). All frozen engines and `packages/` are byte-identical to `platform-complete`/`phase-4-frozen`. The change set is additive only: this new package, ADR-0049, design doc 46, the ADR index row, and the mechanically-derived dependency snapshot and lockfile entries.

## 10. Freeze statement

Marketing Intelligence (Phase 5, Stage 1) satisfies the full engineering and constitutional discipline: design-first (ADR-0049 + design 46), `pnpm run validate` EXIT 0, 100% coverage, benchmarked, all Tier-1/Tier-2 audit findings resolved and re-verified, and byte-identical regression over the frozen platform. It owns behavior only, consumes knowledge-owned truth by reference, duplicates no orchestration, and executes nothing. **It is hereby frozen.** Its behavior, public API, and dependency graph are immutable under tag `phase5-stage1-frozen`; future change requires a new ADR superseding ADR-0049.
