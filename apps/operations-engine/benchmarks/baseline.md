# Operations Engine benchmark baseline

Observational micro-baselines for the Operations Engine's public operations (Engineering Rule 5, ADR-0022). Measurement
only; deterministic over fixed inputs. Absolute numbers are machine-dependent; they are recorded to detect a regression
in relative cost, not as a performance contract.

Representative run (Node 22, `vitest bench --run`):

| operation             | note                                                          |
| --------------------- | ------------------------------------------------------------- |
| observe (full cycle)  | dedup, telemetry, metrics, health, incident, alert, audit     |
| metrics aggregation   | collect one observation's facts + build immutable metrics     |
| health assessment     | apply the frozen health states from the metrics               |
| incident recognition  | correlate a disruption into one incident                      |

All operations are pure and allocation-light. The full observe cycle is dominated by immutable output construction and
event emission; every derivation is deterministic and idempotent.
