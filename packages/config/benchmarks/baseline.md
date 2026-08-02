# Configuration performance baselines

Observational only (Engineering Rule 5). Phase 2A records baselines; it does not
gate on them. Measurement runs outside `src`, never on a runtime path, and never
changes behavior. Micro-benchmarks are defined in `config.bench.ts` and reproduced
with `pnpm --filter @openlance/aios-config run bench`.

- **Recorded:** 2026-08-03
- **Environment:** Node.js 22.x, pnpm 11.5, Vitest 2.1.9, single local developer machine (Windows). Absolute numbers are machine-specific and indicative; the committed harness is the reproducible artifact, not these values.

## Applicable areas

| Area | Metric | Baseline |
|---|---|---|
| Merge | `mergeProviders` over three providers | ~311K ops/s |
| Build | `createConfigService` (merge + freeze) | ~311K ops/s |
| Lookup | `get` (read + schema validate) | ~5.0M ops/s |
| Validation | `loadConfig` (build + validate) | ~286K ops/s |
| Snapshot creation | `mergeProviders` + deep freeze of a nested record | ~543K ops/s |
| Test execution | Full `vitest run --coverage` wall time (4 files, 27 tests) | ~2.2 s |
| Build | `tsup` bundle + rolled-up `.d.ts` wall time | JS ~0.06 s, dts ~1 s |
| Typecheck | `tsc --noEmit` wall time (after dependency build) | < 1 s |

## Not applicable to the config package

These Rule 5 areas belong to packages the config package does not own; they are measured where that concern lives.

- Startup / container build and DI resolution (DI, subsystem 03)
- Logging overhead per record (Logging, subsystem 05)
- Event dispatch per publish (Events, subsystem 06)
- Plugin discovery + validate + load (Plugins, subsystem 07)
