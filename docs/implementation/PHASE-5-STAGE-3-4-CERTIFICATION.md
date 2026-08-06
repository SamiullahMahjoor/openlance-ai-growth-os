# Phase 5 · Stages 3 & 4 — Combined Certification

**AI Growth OS Features — SEO Intelligence + Social Intelligence**
Packages: `@openlance/aios-seo-intelligence`, `@openlance/aios-social-intelligence`
ADRs: [0051](adr/0051-seo-intelligence.md), [0052](adr/0052-social-intelligence.md)
Freeze certificates: [SEO-INTELLIGENCE-FREEZE](SEO-INTELLIGENCE-FREEZE.md), [SOCIAL-INTELLIGENCE-FREEZE](SOCIAL-INTELLIGENCE-FREEZE.md)
Baseline: additive over `platform-complete`, `phase5-stage1-frozen`, `phase5-stage2-frozen`.
Date: 2026-08-06

---

## 1. Architecture

Both stages are **deterministic domain subsystems** (the Stage 1/2 shape). Each owns a closed capability set and a framer; each frames a request into an immutable, content-addressed artifact carrying a frozen Agent Engine `AgentRequest` (`prompt → provider`, provider-neutral `text-generation`) plus an Evaluation Engine `EvaluationRequest`. Neither composes an execution plan, invokes a provider, selects a model, scores, or decides. Both consume the frozen platform through published contracts and build **no new infrastructure**.

## 2. Ownership

| Subsystem | Owns (behavior) | Consumes by reference (never owns) |
| --- | --- | --- |
| SEO Intelligence | 13 SEO capabilities → `SeoPlan` + SEO-quality `EvaluationRequest` | a `MarketingBrief.id`, a `ContentPlan.id`, `knowledge/…md` docs |
| Social Intelligence | 11 social capabilities → `SocialPlan` + social-quality `EvaluationRequest` | a `MarketingBrief.id`, a `ContentPlan.id`, a `SeoPlan.id`, `knowledge/…md` docs |

Neither writes to `ai/` or `knowledge/`. Capability sets are disjoint across all four Growth-OS subsystems (46 distinct strings). Social never authors content and never enacts a schedule; SEO never crawls, indexes, or scores.

## 3. Public contract

Each package exposes a single supported entry point (`src/index.ts`; deep imports fail CI) and registers through the frozen composition-root seam (`SEO_MANAGER` / `SOCIAL_MANAGER`, ADR-0026). Full export tables are in the two freeze certificates. `SeoRequest = { capability, objective, agent, marketing, content, knowledge? }`; `SocialRequest = { capability, objective, agent, marketing, content, seo, knowledge? }`.

## 4. Dependency graph — the ratified linear planner pipeline

```
Marketing ← Content ← SEO ← Social            (dependency edges; each depends only on its predecessor)

seo-intelligence    → agent-engine, evaluation-engine, content-intelligence, di, errors, kernel   (6 edges)
social-intelligence → agent-engine, evaluation-engine, seo-intelligence,     di, errors, kernel   (6 edges)
```

The **linear chain `Marketing -> Content -> SEO -> Social` is the officially ratified constitutional architecture**, recorded permanently in ADR-0051 and ADR-0052 (Consequences). **No fan-in edges** exist or may be introduced: SEO reaches marketing transitively through `ContentPlan.marketing`; Social reaches content and marketing transitively through `SeoPlan`. Every app-to-app edge is type-only, barrel-only, acyclic, no circular imports. Two permanent `pipeline-ownership.test.ts` guards (one per package) fail the build if any forbidden edge is added.

## 5. Validation

`pnpm run validate` → **EXIT 0**, 47/47 tasks (typecheck, lint, format:check, depcruise, arch:check, graph:check, docs-check, test, bench, docs, build).

## 6. Coverage

Both packages: **100%** statements / branches / functions / lines (ADR-0015). SEO 28 tests (6 files); Social 27 tests (6 files); all behavioral and non-vacuous, including the ownership-boundary and pipeline-ownership guards.

## 7. Benchmarks

| Subsystem | `frame` |
| --- | --- |
| SEO Intelligence | ≈ 181,997 hz (~0.0055 ms) |
| Social Intelligence | ≈ 201,094 hz (~0.0050 ms) |

## 8. Hardening applied

1. **Linear pipeline ratified** in ADR-0051 and ADR-0052 (fan-in forbidden; superseding ADR required to change).
2. **Permanent pipeline-ownership guard tests** added to both packages enforcing `Marketing → Content → SEO → Social`.
3. **Facade docstrings corrected** in both `manager.ts` files (SEO: "marketing direction, content plan, and knowledge"; Social: "marketing direction, content plan, and SEO plan" — resolving the prior Social Tier-2).
4. **Shared deep-freeze helper deferred** as an accepted Repository Evolution Note (using it consistently across all four framers would require modifying the frozen Marketing/Content packages, which the freeze policy forbids). Nothing frozen was touched; no new dependency was added.
5. **Three preserved Tier-3 decisions left unchanged and recorded** as accepted notes: non-array `knowledge → []` (fail-safe), dotfile filename acceptance (benign, not traversal), 32-bit FNV-1a id (reproducibility identifier).

## 9. Audit summary

**Four** independent, read-only final audits (two per stage) — **all CLEAN, zero Tier 1 / zero Tier 2:**

| Audit | Verdict |
| --- | --- |
| SEO — architecture/constitution | CLEAN |
| SEO — correctness/security | CLEAN |
| Social — architecture/constitution | CLEAN (prior Tier-2 docstring resolved) |
| Social — correctness/security | CLEAN |

All Tier-1/Tier-2 findings across the review and freeze cycles are resolved. The remaining Tier-3 items are accepted, non-blocking Repository Evolution Notes.

## 10. Regression

- `git diff phase5-stage2-frozen -- ai/ knowledge/` → **empty**.
- All frozen engines, `packages/`, Marketing (Stage 1), and Content (Stage 2) → **byte-identical**.
- Change set is **additive only**: 2 new packages, ADR-0051/0052, design docs 48/49, 2 freeze docs + this certification, 2 ADR-index rows, and the mechanically-derived dependency snapshot + lockfile.

## 11. Certification

- **Phase 4** (`phase-4-frozen`) — **unchanged**.
- **Platform Completion** (`platform-complete`) — **unchanged**.
- **Phase 5 Stage 1** (`phase5-stage1-frozen`, Marketing) — **unchanged**.
- **Phase 5 Stage 2** (`phase5-stage2-frozen`, Content) — **unchanged**.
- **Additive implementation only** — confirmed.
- **Zero Tier-1 / zero Tier-2** — confirmed.
- **Architecture certified** — deterministic behavior-only subsystems; consume the frozen platform by reference; execute nothing; build no infrastructure.
- **Linear planner pipeline officially ratified** — `Marketing -> Content -> SEO -> Social`, permanently recorded and guard-enforced.

**Both Stage 3 (SEO Intelligence) and Stage 4 (Social Intelligence) are certified and frozen** under tags `phase5-stage3-frozen` and `phase5-stage4-frozen`. Stage 5 is **not started** and awaits explicit approval.
