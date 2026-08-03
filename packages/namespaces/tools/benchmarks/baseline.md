# Tool predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Tools namespace is an immutable,
stateless domain model (ADR-0020) in ADR-0024 category 4 (Infrastructure Adapter; its "Tool adapters"
example); its executable surface is two pure ordering predicates over tool-owned classifications:

- `toolPhaseAtOrAfter` - the tool lifecycle phase order, registration to retirement
  (ai/tools/tool-lifecycle.md).
- `toolValidationCheckAtOrAfter` - the tool validation check order, permission and safety first
  (ai/tools/tool-validation.md).

All other tool concerns are immutable definitions with no executable predicate to benchmark. In
particular, tool-execution owns "execution ordering" but the constitution does not enumerate the steps
within a tool execution, so there is no named ordered set and no predicate (as with Safety's
ordered-but-unnamed risk levels).

Run with `pnpm --filter @openlance/aios-tools bench`. Each predicate is pure, total, and deterministic
over a tool-owned classification and resolves in constant time (a single rank comparison), so throughput
is on the order of millions of operations per second and the numbers are recorded here only as an
observational baseline, not a threshold.
