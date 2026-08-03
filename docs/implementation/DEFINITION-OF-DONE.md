# Phase 2A, Rule 6: Definition of Done (DoD)

**Type:** Implementation governance. **Scope:** the implementation only.
The Definition of Done does not modify, reinterpret, extend, or replace any constitutional document under `ai/` or `knowledge/`. It exists solely to ensure that no implementation work is considered complete until it satisfies every required engineering quality gate. It is Rule 6 of the permanent engineering rules ([ENGINEERING-RULES.md](ENGINEERING-RULES.md)) and is binding on all Phase 2A work and every later phase.

## Principle

- Completion is determined by **objective validation only**. A subjective judgment that something is "done" is never sufficient.
- **Partial completion is never complete.** Every mandatory criterion must pass.
- **No implementation may bypass these requirements**, and no manual approval may override a failed gate.
- The DoD applies equally to **packages, subsystems, milestones, implementation phases, and all future engineering work**. A larger unit is complete only when every unit it contains is complete.

---

## Mandatory completion criteria

A package or subsystem is complete only when all twelve criteria below pass. Each states what is verified, how it is validated (the automated gate and the evidence), and the pass condition.

### 1. Constitutional Compliance
Implementation fully conforms to the frozen constitution: no ownership violation, no duplicated responsibility, no dependency violation, no architectural reinterpretation, no namespace boundary violation, and no constitutional document modification.
**Validation:** dependency-cruiser (namespace edges and layering), the review checklist, the package `aios.constitution` traceability field, and a CI **path guard** that fails any implementation change touching `ai/**` or `knowledge/**`.
**Pass:** graph green; traceability present; zero changes under `ai/` or `knowledge/`.

### 2. Architecture Compliance Review
Implementation matches the approved design (`docs/implementation/00`–`09`): package responsibilities, dependency direction, public API boundaries, interface contracts, folder structure, and implementation plan. No undocumented architectural deviation is permitted.
**Validation:** completion review against the subsystem design doc; any deviation requires either a design-doc amendment or a new ADR (Rule 3) before completion.
**Pass:** implementation matches the design, or every deviation is documented and approved.

### 3. Unit Testing
All unit tests pass; every public component has appropriate unit coverage; no failing or skipped tests remain.
**Validation:** `vitest run --coverage` under the repository coverage policy (ADR-0015): every runtime source file under `src` is measured, thresholds are 100, and only the public barrel and genuinely type-only modules are excluded; a focused/skipped-test check (`docs-check`).
**Pass:** all tests green; coverage at 100% under the policy; zero `.skip`/`.only`.

### 4. Integration Testing
Where applicable, integration tests verify correct interaction between packages: dependency injection, configuration, logging, events, plugin loading, and package interaction, via the test harness (`createHarness`). The `dev-harness` app is deferred to the start of the Runtime phase (ADR-0017); in Phase 2A the harness suite provides the integration coverage.
**Validation:** the `createHarness` integration suite in CI.
**Pass:** integration suite green for every applicable interaction.

### 5. Dependency Graph Validation
The graph passes automated validation: no cycles, no forbidden imports, no illegal package references, no deep imports, no constitutional dependency violation.
**Validation:** dependency-cruiser (Rule 2), a required, non-overridable CI check.
**Pass:** depcruise green with the frozen-map ruleset loaded.

### 6. Static Analysis
TypeScript compilation, type checking, linting, formatting, and dependency analysis all pass; no warning classified as an error remains.
**Validation:** per-package `tsc --noEmit` under Turborepo build ordering (the realized compilation strategy, ADR-0016), ESLint (errors), Prettier check, dependency-cruiser.
**Pass:** all static gates green; zero error-level findings.

### 7. Public API Verification
Every package exposes only its approved public API: exported interfaces, public contracts, single package entry point, and internal implementation isolation. No consumer depends on internal files.
**Validation:** `package.json` `exports` single `"."`; ESLint `no-restricted-imports` patterns; dependency-cruiser `not-to-deep-import` (Rule 1).
**Pass:** one barrel; no subpath export; no deep import anywhere.

### 8. Documentation
Implementation documentation is complete and accurate: package documentation, public API documentation, architectural documentation, usage documentation, and implementation notes, reflecting the implementation as built.
**Validation:** package `README.md` present; TypeDoc API docs generate cleanly; the subsystem design doc reflects reality; `docs-check`.
**Pass:** docs generate and accurately describe the shipped surface.

### 9. Acceptance Criteria
Every acceptance criterion defined in the subsystem design doc is explicitly verified. Nothing is marked complete without validation.
**Validation:** a per-package acceptance checklist mapping each design-doc criterion to its evidence (test id, gate, or artifact).
**Pass:** every listed acceptance criterion is checked off with evidence.

### 10. Performance Baseline
Recorded, observational performance baselines exist for at least: startup, initialization, dependency injection, configuration loading, logging overhead, event dispatch, plugin discovery, and test execution (per the package's applicable areas). Measurement never changes behavior.
**Validation:** the `bench` harness (Rule 5); baselines committed under `benchmarks/`.
**Pass:** applicable baselines recorded and reproducible under the determinism seams.

### 11. Architecture Decision Records
If completion introduced a new engineering decision not already documented, a new ADR exists before completion. The ADR documents implementation rationale only and never redefines constitutional ownership.
**Validation:** review checks that any new non-constitutional decision has an Accepted ADR (Rule 3); `docs-check` validates ADR references.
**Pass:** no undocumented engineering decision remains.

### 12. Continuous Integration
The complete CI pipeline passes, including all mandatory engineering gates. No package is merged while any required check is failing.
**Validation:** the full pipeline (`typecheck`, `lint`, `format:check`, `depcruise`, `graph:check` (Rule 2 snapshot), `docs-check`, `test`, `bench`, `docs`, `build`) as required status checks with branch protection.
**Pass:** every required check green; merge blocked otherwise.

---

## Consolidated DoD checklist (attached to every completion / pull request)

| # | Criterion | Automated gate | Evidence |
|---|---|---|---|
| 1 | Constitutional compliance | depcruise + path guard | graph green; no `ai/`,`knowledge/` diff |
| 2 | Architecture compliance | review vs design doc | deviations = ADR or design amendment |
| 3 | Unit testing | `vitest run --coverage` | all green; threshold met; no skips |
| 4 | Integration testing | harness suite | applicable interactions green |
| 5 | Dependency graph | dependency-cruiser | no cycle/forbidden/deep import |
| 6 | Static analysis | tsc + eslint + prettier | zero error-level findings |
| 7 | Public API | exports + lint + depcruise | one barrel; no deep import |
| 8 | Documentation | README + TypeDoc + docs-check | docs generate + accurate |
| 9 | Acceptance criteria | per-package checklist | each criterion evidenced |
| 10 | Performance baseline | bench harness | baselines committed |
| 11 | ADRs | docs-check + review | new decisions recorded |
| 12 | CI pipeline | required checks | all green; merge gated |

---

## Ownership

The DoD process and its automated gates are owned by Build & Dev Infrastructure (subsystem 09). Each package owns satisfying the DoD for its own scope. Milestone and phase completion is owned by the engineering owner (AI Systems Architect, engineering capacity), who confirms that every contained unit is complete.

## Responsibilities

- **Package author:** satisfies all twelve criteria and attaches the checklist with evidence.
- **Reviewer:** confirms criteria 2, 9, and 11 (the judgment-bearing gates) and that the automated gates are green.
- **Build & Dev Infra:** maintains the CI pipeline that mechanizes criteria 1, 3, 4, 5, 6, 7, 8, 10, 12.

## Enforcement

The DoD is mandatory. No manual approval overrides a failed validation. A package is not complete until every mandatory requirement passes; a subsystem is not complete until all its packages are; a milestone or phase is not complete until all its subsystems are. Branch protection makes the required checks non-overridable, including for administrators.

## Validation workflow

1. **During development:** the author runs `pnpm run validate` locally (typecheck, lint, format check, depcruise, graph snapshot check, docs-check, test, bench, docs, build).
2. **On pull request:** CI runs the full pipeline; the DoD checklist is attached with evidence; required checks must be green.
3. **Completion review:** the reviewer confirms the judgment-bearing criteria and that all gates are green.
4. **Mark complete:** the unit is marked complete only when the checklist is fully satisfied and evidenced. Any later change re-runs the DoD.

## CI integration

Every automated gate above is a required status check in the CI pipeline (subsystem 09). The path guard (criterion 1) fails any implementation change that modifies `ai/**` or `knowledge/**`. Merge is blocked while any required check fails.

## Review process

The completion review is a checklist review: the reviewer verifies the automated gates are green and personally confirms criteria 2 (architecture compliance), 9 (acceptance criteria evidenced), and 11 (ADRs for new decisions). A completion review cannot pass with any criterion unmet.

## Acceptance criteria (of Rule 6 itself)

- The DoD checklist exists and is applied to every package, subsystem, milestone, and phase completion.
- Every automated gate is a required, non-overridable CI check.
- No unit can be marked complete with any mandatory criterion unmet.
- The path guard prevents any implementation change from modifying a constitutional document.
- The DoD is documented once here, referenced from the index and the engineering governance, and applied uniformly to all future phases.

Rule 6 adds no AI concept, no business logic, and no runtime behavior. It is a permanent quality gate that keeps implementation objectively complete and constitutionally aligned.
