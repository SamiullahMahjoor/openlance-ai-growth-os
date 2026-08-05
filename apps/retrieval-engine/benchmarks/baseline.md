# Retrieval-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Six
hot paths are measured:

- **register**: `RetrievalRegistry.register` on a fresh registry (identity check plus Map insertion).
- **retrieve**: `RetrievalExecutor.execute` for a scope (discover, select, resolve dependencies, prioritize, assemble,
  validate, produce result) over a populated registry; a deterministic determination, with no search technology.
- **filter**: `RetrievalFilter.discover` (structural topic match).
- **rank**: `RetrievalRanker.rank` (deterministic authority ordering with an id tiebreak).
- **normalize**: `RetrievalNormalizer.normalize` (structural whitespace normalization).
- **validate**: `RetrievalValidator.validate` (the five frozen validation dimensions, in order).

Run with `pnpm --filter @openlance/aios-retrieval-engine bench`. Each path is deterministic over its fixed inputs, so
the numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem,
vendor, or search work, and none loads or executes: the engine determines a validated knowledge set over provided
candidates and stops.
