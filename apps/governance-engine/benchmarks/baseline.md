# Governance-engine baseline

Observational micro-baselines (Engineering Rule 5, ADR-0022). Measurement only, deterministic over fixed inputs. Six
public operations are measured:

- **registration**: `GovernanceFactory.create` plus `GovernanceRegistry.register` on a fresh registry (validation, name
  normalization, freezing, and Map insertion).
- **evaluation**: `GovernanceEvaluator.evaluate` for a request (permission, constitutional validation, autonomy, and
  human oversight, in order, then the immutable decision with its content-hash audit id); a deterministic authorization
  that invokes no engine and executes nothing.
- **permission**: `PermissionEvaluator.evaluate` (partition the plan's capabilities against the grant).
- **constitutional-validation**: `ConstitutionalValidator.isValidated` (validation precedes authorization).
- **normalization**: `GovernanceNormalizer.normalize` (structural whitespace normalization).
- **hashing**: `GovernanceHash.hash` (deterministic FNV-1a content hash for the audit id).

Run with `pnpm --filter @openlance/aios-governance-engine bench`. Each path is deterministic over its fixed inputs, so
the numbers are recorded here only as observational baselines, not thresholds. No path performs network, filesystem,
vendor, or engine-execution work, and none executes: the engine authorizes an agent execution plan into an immutable
governance decision and stops.
