# Reasoning-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Six
public operations are measured:

- **registration**: `ReasoningFactory.create` plus `ReasoningRegistry.register` on a fresh registry (validation,
  statement normalization, freezing, and Map insertion).
- **reasoning**: `ReasoningPlanner.plan` for a request (frame, decompose, validate the frozen dimensions, determine the
  terminal stage, assemble the governed plan); a deterministic reasoning that invokes no provider and carries nothing
  out.
- **decomposition**: `ReasoningDecomposer.decompose` (structural decomposition of the provided parts).
- **validation**: `ReasoningValidator.validate` (the four frozen dimensions, in order: assumption identification,
  grounding, evidence sufficiency, governed validation).
- **normalization**: `ReasoningNormalizer.normalize` (structural whitespace normalization).
- **workflow-order**: `ReasoningPlanner.workflowInConstitutionalOrder` (proof of the frozen workflow order over the
  predicate).

Run with `pnpm --filter @openlance/aios-reasoning-engine bench`. Each path is deterministic over its fixed inputs, so
the numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem,
vendor, or inference work, and none executes: the engine reasons deterministically and structurally over provided
knowledge and produces a governed reasoning plan.
