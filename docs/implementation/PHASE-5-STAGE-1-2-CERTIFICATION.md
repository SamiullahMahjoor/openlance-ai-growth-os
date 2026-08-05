# Phase 5 · Stages 1 & 2 — Combined Certification

**AI Growth OS Features — Marketing Intelligence + Content Intelligence**
Packages: `@openlance/aios-marketing-intelligence`, `@openlance/aios-content-intelligence`
ADRs: [0049](adr/0049-marketing-intelligence.md), [0050](adr/0050-content-intelligence.md)
Freeze certificates: [MARKETING-INTELLIGENCE-FREEZE](MARKETING-INTELLIGENCE-FREEZE.md), [CONTENT-INTELLIGENCE-FREEZE](CONTENT-INTELLIGENCE-FREEZE.md)
Baseline: additive over `platform-complete` and `phase-4-frozen`.
Date: 2026-08-06

---

## 1. Architecture

Both stages are **deterministic domain subsystems** (the Ambiguity-Gate-approved shape). Each owns a closed capability set and a framer; each frames a request into an immutable, content-addressed artifact carrying a frozen Agent Engine `AgentRequest` plus an Evaluation Engine `EvaluationRequest`. Neither composes an execution plan, runs a pipeline, invokes a provider, selects a model, authorizes, or decides. Both consume the frozen platform through its published contracts and build **no new infrastructure** — the Phase 5 mandate. They are ready to run unchanged once the `GovernanceClearance` production minter exists.

Stage 2 consumes Stage 1 **by reference only**: a `ContentRequest` carries a `MarketingBrief.id`, never the brief's strategy contents. The relationship is acyclic.

## 2. Ownership

| Subsystem | Owns (behavior) | Consumes by reference (truth it never owns) |
| --- | --- | --- |
| Marketing Intelligence | 11 marketing capabilities; request→`MarketingBrief` framing; marketing `EvaluationRequest` | `knowledge/marketing`, `knowledge/brand`, `knowledge/customers`, `knowledge/competitors`, `knowledge/product`, `knowledge/company` documents |
| Content Intelligence | 11 content capabilities; request→`ContentPlan` framing; content-quality `EvaluationRequest` | a `MarketingBrief.id`, a `knowledge/brand/…md` voice, and any `knowledge/…md` document |

Neither writes to `ai/` or `knowledge/`. Each ships a permanent ownership-boundary guard test that fails the build on drift (Marketing must never produce a content artifact; Content must never produce a marketing artifact or re-export the marketing contract).

## 3. Public contract

Each package exposes a single supported entry point (`src/index.ts`; deep imports fail CI) and registers through the frozen composition-root seam (`MARKETING_MANAGER` / `CONTENT_MANAGER`, ADR-0026). Full export tables are in the two freeze certificates. The hardening improvements (A: concrete references; B: canonical identity; C: ownership guards; plus the Tier-2 traversal fix) changed **no** public type, signature, token, or module — they are refinement-only.

## 4. Dependency graph

```
marketing-intelligence → agent-engine, evaluation-engine, di, errors, kernel            (5 edges)
content-intelligence   → agent-engine, evaluation-engine, marketing-intelligence,
                         di, errors, kernel                                             (6 edges)
```

All edges target frozen substrate/engine contracts or the just-frozen Stage-1 sibling. Both subgraphs are acyclic; `graph:check` and `depcruise` pass; `dependency-graph.snapshot.json` is updated additively.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 45/45 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build). The hardened reference validators were additionally verified out-of-band against the auditor's full accept/reject matrix with a catastrophic-backtracking (ReDoS) check (~0.9 ms for a 20,000-segment non-match).

## 6. Coverage

Both packages: **100%** statements / branches / functions / lines (ADR-0015), no behavior-module exclusions. Marketing 21 tests (5 files); Content 23 tests (5 files); all behavioral and non-vacuous, including the new traversal-rejection assertions.

## 7. Benchmarks

| Subsystem | `frame` | `plan` (full cycle) |
| --- | --- | --- |
| Marketing | 233,742 hz (~0.0043 ms) | 219,437 hz (~0.0046 ms) |
| Content | 208,292 hz (~0.0048 ms) | 205,912 hz (~0.0049 ms) |

Framing is pure and I/O-free; throughput is on the order of 200k operations/second per subsystem.

## 8. Audit summary

**Four** independent, read-only re-audits after the approved improvements — two per stage (architecture/constitution and correctness/security):

| Audit | Verdict | Findings |
| --- | --- | --- |
| Marketing — architecture/constitution | CLEAN | 0 Tier 1/2/3 |
| Marketing — correctness/security | RESOLVED | 1 **Tier 2** (reference validator failed open on `.`/`..`/control-character segments) → fixed by tightening both regexes, adding traversal-rejection tests, and re-verifying the matrix at 100% coverage; 1 Tier-3 (shallow inner-payload freeze, codebase convention) |
| Content — architecture/constitution + integration | CLEAN | 0 Tier 1/2/3 |
| Content — correctness/security | CLEAN | 0 Tier 1/2; the traversal note is resolved by the same fix; 2 Tier-3 recorded (brand-voice not deduped against extra knowledge; non-array knowledge coerces to `[]`) |

All Tier-1/Tier-2 findings are resolved and re-verified. The remaining Tier-3 items are recorded as accepted, non-blocking Repository Evolution Notes (intended zero-trust posture and codebase-wide shallow-freeze convention); per review discipline they do not block a freeze.

## 9. Regression summary

- `git diff platform-complete -- ai/ knowledge/` → **empty** (frozen constitution byte-identical).
- All frozen engines and `packages/` → byte-identical to `platform-complete` / `phase-4-frozen`.
- Change set is **additive only**: 2 new packages, ADR-0049/0050, design docs 46/47, 2 ADR-index rows, and the mechanically-derived dependency snapshot and lockfile.

## 10. Confirmation & recommendation

- **Phase 4** (`phase-4-frozen`) and **Platform Completion** (`platform-complete`) are confirmed **byte-identical**; nothing frozen was modified.
- **No new infrastructure** was introduced; both stages consume the frozen platform only.
- Both stages meet the full engineering and constitutional discipline: design-first, validate EXIT 0, 100% coverage, benchmarked, all Tier-1/2 resolved, additive regression.

**Recommendation: both Stage 1 (Marketing Intelligence) and Stage 2 (Content Intelligence) are constitutionally sound and are certified for freeze** under tags `phase5-stage1-frozen` and `phase5-stage2-frozen`. Stage 3 (SEO Intelligence) and Stage 4 (Social Intelligence) remain **not started**, pending explicit approval.
