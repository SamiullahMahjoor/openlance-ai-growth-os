# Safety Engine benchmark baseline

Observational micro-baselines for the Safety Engine's public operations (Engineering Rule 5, ADR-0022). Measurement
only; deterministic over fixed inputs. Absolute numbers are machine-dependent; they are recorded to detect a regression
in relative cost, not as a performance contract.

Representative run (Node 22, `vitest bench --run`):

| operation             | ops/sec (hz) | note                                                  |
| --------------------- | ------------ | ----------------------------------------------------- |
| evaluate (decision)   | ~35,000      | the full pipeline over a four-step plan               |
| hazard analysis       | ~198,000     | inspects every step and coordination                  |
| risk classification   | ~171,000     | applies the governed trust floor and impact mapping   |
| prompt inspection     | ~630,000     | tokens, recursion, and reference bound                |
| tool inspection       | ~1,775,000   | restricted, unknown, sandbox, argument tokens         |
| memory inspection     | ~1,346,000   | scope allowlist and restriction                       |
| retrieval inspection  | ~1,395,000   | scope allowlist and restriction                       |
| normalization         | ~973,000     | whitespace, trim, lowercase                           |
| hashing               | ~2,037,000   | FNV-1a content hash                                   |

All operations are pure and allocation-light. The decision path is dominated by hazard analysis and risk classification;
both are linear in the number of steps and identified hazards.
