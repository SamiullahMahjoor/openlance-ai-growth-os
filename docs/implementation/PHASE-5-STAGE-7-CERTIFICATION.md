# Phase 5 · Stage 7 — Certification

**AI Growth OS Features — OpenLance Growth Workflows**
Package: `@openlance/aios-openlance-growth-workflows`
ADR: [0055](adr/0055-openlance-growth-workflows.md) · Design: [52](52-openlance-growth-workflows.md)
Freeze certificate: [OPENLANCE-GROWTH-WORKFLOWS-FREEZE](OPENLANCE-GROWTH-WORKFLOWS-FREEZE.md)
Baseline: additive over `platform-complete` and `phase5-stage1-frozen` … `phase5-stage6-frozen`.
Date: 2026-08-06

---

## 1. Architecture

A deterministic domain subsystem that **composes the six frozen planners** into fifteen reusable OpenLance growth workflows. It validates a request and frames an immutable, content-addressed `GrowthWorkflow` carrying the ordered planner sequence, planner references, upstream provenance, metadata, and a frozen Agent Engine `AgentRequest` (`prompt → provider`), plus a workflow-quality `EvaluationRequest`. Composition is declarative (a definition + an `AgentRequest`); it never executes, schedules, automates, or orchestrates, and builds no new infrastructure. **No Architecture Ambiguity Gate was required** — source grounding confirmed no `ai/workflows`/`knowledge/workflows` namespace, `CampaignPlan` carries all five earlier refs, the 15 workflow types are disjoint from the 68 planner capabilities, and the declarative-composition-vs-orchestration boundary is clear.

## 2. Ownership

Owns workflow definitions, framing, sequencing, dependency mapping, validation, and statistics. Consumes (by reference) the six planner outputs (via a `CampaignPlan`) and `knowledge/…md` documents. Owns none of: any planner behavior, execution, scheduling, automation, an orchestration engine, provider, prompts, retrieval, governance, evaluation, knowledge, or business truth.

## 3. Workflow catalogue

Fifteen workflows / seven categories (acquisition, activation, retention, growth, launch, campaign, optimization); each composes a canonical-order subsequence of `marketing → content → seo → social → analytics → campaign` from the root to the terminal planner. Full table in the freeze certificate.

## 4. Dependency graph — the seventh (terminal) chain node

```
Marketing ← Content ← SEO ← Social ← Analytics ← Campaign ← Growth Workflows

openlance-growth-workflows → agent-engine, evaluation-engine, campaign-intelligence, di, errors, kernel   (6 runtime edges)
```

Terminal, acyclic; each node depends only on its immediate predecessor. The five earlier planners are reached transitively through `CampaignPlan` (no fan-in). The five sibling planners imported by the disjointness guard are **test-only devDependencies** and add no runtime edge (verified: snapshot 6 edges, unchanged; pipeline-ownership guard checks `dependencies` only; depcruise clean).

## 5. Constitutional boundaries

Behavior-not-truth; concrete `knowledge/…md` references only (traversal/control rejected, no ReDoS); canonical identity (order/duplication-invariant id; 15 pinned golden ids); the ratified linear chain (no fan-in without a superseding ADR); no execution/orchestration; deterministic; fail-closed; zero-trust never-throws. Enforced by permanent guards: ownership-boundary, pipeline-ownership (7 nodes), sequencing, and the constitutional catalogue-integrity guard.

## 6. Hardening applied

1. **Workflow catalogue integrity guard** (`tests/catalogue-integrity.test.ts`) — validates the entire `WORKFLOW_DEFINITIONS` catalogue as a permanent CI invariant: every type unique; every definition exists exactly once (type↔definition bijection); every sequence a valid ordered subsequence of the canonical chain (no duplicate planner, no backward skip, only valid planners); every category valid; count = 15; and every workflow id deterministic via fifteen pinned golden values. A future violation fails CI immediately.

**Deliberately not implemented** (recorded as Repository Evolution Notes, per instruction): the shared deep-freeze helper, the FNV-1a identifier width, the shallow-freeze behavior, non-array `knowledge → []`, and any frozen-package change.

## 7. Validation

`pnpm run validate` → **EXIT 0**, 50/50 tasks.

## 8. Coverage

**100%** statements / branches / functions / lines (ADR-0015). 43 tests across 8 files.

## 9. Benchmarks

`frame` ≈ 137,168 hz; `plan` (full cycle) ≈ 120,088 hz.

## 10. Audit summary

Four independent read-only audits — **all CLEAN, zero Tier 1 / zero Tier 2:** Architecture/Constitution, Correctness/Security, Dependency/Ownership, Regression. During the review cycle one Tier-2 (a `sequence` aliasing the shared catalogue array) was found, fixed, and independently re-audited as resolved. Remaining Tier-3 items are accepted, non-blocking Repository Evolution Notes.

## 11. Regression verification

- `git diff` for `ai/` and `knowledge/` → **empty against all eight frozen tags**.
- All fourteen frozen packages, `packages/`, `tools/`, and Stages 1–6 → **byte-identical**.
- Change set is **additive only**: 1 new package, ADR-0055, design doc 52, 1 freeze doc + this certification, 1 ADR-index row, dependency snapshot, lockfile.

## 12. Certification

- **Phase 4** (`phase-4-frozen`), **Platform Completion** (`platform-complete`), and **Phase 5 Stages 1–6** (`phase5-stage1..6-frozen`) — **byte-identical / unchanged**.
- **Additive implementation only** — confirmed.
- **Zero Tier-1 / zero Tier-2** — confirmed (the one review-cycle Tier-2 resolved and re-verified).
- **Architecture certified** — a deterministic behavior-only subsystem that composes the frozen planners by reference; executes nothing; builds no infrastructure.
- **Linear chain extended to its seventh node and enforced** — `Marketing → Content → SEO → Social → Analytics → Campaign → Growth Workflows`, guard-enforced, with a constitutional catalogue-integrity guard.

**OpenLance Growth Workflows (Phase 5, Stage 7) is certified and frozen** under tag `phase5-stage7-frozen`. Stage 8 (Automation Intelligence) is **not started** and awaits explicit approval.
