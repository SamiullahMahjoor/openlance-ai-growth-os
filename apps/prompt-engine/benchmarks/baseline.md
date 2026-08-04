# Prompt-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Six
hot paths are measured:

- **register**: `PromptRegistry.register` on a fresh registry (identity check plus Map insertion).
- **compile**: `PromptCompiler.compile` for a governed definition with one variable (inheritance resolution, variable
  substitution, assembly in the frozen layer order, normalization, validation, and building the execution-ready
  `ProviderRequest`).
- **resolve-variables**: `PromptVariableResolver.resolve` (required-variable check plus placeholder substitution).
- **normalize**: `PromptNormalizer.normalize` (structural whitespace normalization).
- **validate**: `PromptValidator.validate` (the four frozen checks, in order).
- **assemble**: `PromptAssembler.assemble` (composition in the frozen `PROMPT_LAYERS` order).

Run with `pnpm --filter @openlance/aios-prompt-engine bench`. Each path is deterministic over its fixed inputs, so the
numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem, or
vendor work, and none invokes a provider or executes a prompt: the engine prepares an execution-ready payload for the
Provider Engine and nothing more.
