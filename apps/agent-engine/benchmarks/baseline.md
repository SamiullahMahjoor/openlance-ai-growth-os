# Agent-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Six
public operations are measured:

- **registration**: `AgentFactory.create` plus `AgentRegistry.register` on a fresh registry (validation, specialization
  normalization, freezing, and Map insertion).
- **planning**: `AgentPlanner.plan` for a request (look up the agent, frame the task, compose the steps, validate, and
  coordinate); a deterministic composition that invokes no engine and executes nothing.
- **composition**: `AgentComposer.compose` (bounded composition within the agent's held capabilities).
- **validation**: `AgentValidator.validate` (the agent's permissions applied to each step).
- **normalization**: `AgentNormalizer.normalize` (structural whitespace normalization).
- **execution-plan-generation**: `AgentPlanner.plan` assembling the immutable `AgentExecutionPlan` blueprint.

Run with `pnpm --filter @openlance/aios-agent-engine bench`. Each path is deterministic over its fixed inputs, so the
numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem, vendor,
or engine-execution work, and none executes: the engine composes an immutable agent execution plan over the six engines'
contracts and stops.
