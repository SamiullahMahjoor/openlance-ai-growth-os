# Prompt predicate baselines

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only: these run outside
`src`, never on a runtime path, and never change behavior. The Prompts namespace is an immutable,
stateless domain model (ADR-0020) in ADR-0024 category 1 (Pure Domain Model, declared per §42); its
executable surface is four pure ordering predicates over prompt-owned classifications:

- `promptLayerAtOrAfter` - the prompt layer order, governing to task (ai/prompts/prompt-architecture.md).
- `promptPhaseAtOrAfter` - the prompt lifecycle phase order (ai/prompts/prompt-lifecycle.md).
- `assemblyStageAtOrAfter` - the prompt assembly stage order (ai/prompts/prompt-assembly.md).
- `validationCheckAtOrAfter` - the prompt validation check order (ai/prompts/prompt-validation.md).

All other prompt concerns are immutable definitions with no executable predicate to benchmark.

Run with `pnpm --filter @openlance/aios-prompts bench`. Each predicate is pure, total, and deterministic
over a prompt-owned classification and resolves in constant time (a single rank comparison), so
throughput is on the order of millions of operations per second and the numbers are recorded here only
as an observational baseline, not a threshold.
