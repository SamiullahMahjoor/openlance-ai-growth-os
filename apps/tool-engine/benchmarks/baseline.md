# Tool-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Seven
hot paths are measured:

- **registration**: `ToolFactory.create` plus `ToolRegistry.register` on a fresh registry (validation, name
  normalization, freezing, and Map insertion).
- **discovery**: `ToolSelector.discover` (structural capability match over declared capabilities).
- **selection**: `ToolSelector.select` (deterministic single choice by the lowest-id code-point tiebreak).
- **validation**: `ToolValidator.validate` (the four frozen checks, in order: permission, safety, constitutional,
  compatibility).
- **execution-preparation**: `ToolResolver.resolve` (single, acyclic capability-inheritance resolution).
- **execution**: `ToolExecutor.prepare` for a request (normalize, discover, select, resolve, validate, assemble the
  validated response); a deterministic preparation that carries nothing out.
- **normalization**: `ToolNormalizer.normalize` (structural whitespace normalization of a name).

Run with `pnpm --filter @openlance/aios-tool-engine bench`. Each path is deterministic over its fixed inputs, so the
numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem, vendor,
or provider work, and none carries out a tool interaction: the engine prepares a validated, governed execution over
provided tools and stops.
