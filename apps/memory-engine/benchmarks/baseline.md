# Memory-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Five
hot paths are measured:

- **register**: `MemoryRegistry.register` on a fresh registry (identity check plus Map insertion).
- **index**: `MemoryIndexer.index` on a fresh indexer (structural scope and type indexing).
- **lookup**: `MemoryResolver.resolve` for a scope (structural lookup by scope plus lifecycle and retention
  filtering); a deterministic recall over retained records, with no retrieval technique.
- **normalize**: `MemoryNormalizer.normalize` (structural whitespace normalization).
- **validate**: `MemoryValidator.validate` (grounding validation).

Run with `pnpm --filter @openlance/aios-memory-engine bench`. Each path is deterministic over its fixed inputs, so the
numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem, vendor,
or retrieval work: the engine forms, indexes, recalls, and removes retained records over its own store, and nothing more.
