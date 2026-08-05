# Runtime Execution Engine benchmark baseline

Observational micro-baselines for the Runtime Execution Engine's public operations (Engineering Rule 5, ADR-0022).
Measurement only; deterministic over fixed inputs. Absolute numbers are machine-dependent; they are recorded to detect a
regression in relative cost, not as a performance contract.

Representative run (Node 22, `vitest bench --run`), an eight-step sequential plan over an immediate seam:

| operation             | ops/sec (hz) | note                                              |
| --------------------- | ------------ | ------------------------------------------------- |
| execute (full run)    | ~25,000      | precondition gate, state machine, 8 steps, record |
| dependency resolution | ~778,000     | plan order + coordination cycle re-check          |
| scheduling            | ~1,158,000   | window into bounded-concurrency stages            |
| aggregation           | ~245,000     | deterministic ordering + deep freeze              |

The full-run cost is dominated by the per-step seam await and the immutable record construction; both are linear in the
number of steps. Orchestration decisions (state transitions, scheduling, retry/timeout/recovery) are allocation-light and
deterministic.
