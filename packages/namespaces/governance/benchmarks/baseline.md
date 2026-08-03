# @openlance/aios-governance performance baselines

Observational only (Engineering Rule 5, ADR-0022). Phase 2B records baselines; it does not gate on
them. Measurement runs outside `src`, never on a runtime path, and never changes behavior.
Micro-benchmarks are defined in `governance.bench.ts` and reproduced with
`pnpm --filter @openlance/aios-governance run bench`. Benchmarks apply to executable predicates only.

- **Recorded:** 2026-08-03 (Stage 1, risk and trust).
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.x, single local developer machine (Windows).
  Absolute numbers are machine-specific and indicative; the committed harness is the reproducible
  artifact, not these values.

## Predicate micro-baselines (throughput)

The governance predicates are pure, allocation-free table lookups and comparisons; throughput is
dominated by the harness, not the predicate.

| Operation | Throughput (ops/s, indicative) |
|---|---|
| `requiredOversight` | ~100M |
| `higherTrust` | ~100M |

## Not applicable to the governance package

Governance is a Pure Domain Model (ADR-0024 category 1): it owns no runtime, so the Rule 5 startup,
DI, configuration, logging, event-dispatch, and plugin areas do not apply. They are measured where
that concern lives.
