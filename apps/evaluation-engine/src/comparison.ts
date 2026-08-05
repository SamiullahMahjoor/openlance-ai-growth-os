import type { Benchmark, Comparison, ComparisonEntry, MeasuredMetric, Standing } from './types.js';

/** The relative standing of a measured value against a benchmark value. */
const standingOf = (measured: number, benchmark: number): Standing => {
  if (measured > benchmark) {
    return 'above';
  }
  if (measured < benchmark) {
    return 'below';
  }
  return 'equal';
};

/**
 * The comparator: it compares the measured metrics against a benchmark, like for like - only metrics present in both are
 * compared, on the same metric - recording the benchmark version compared against. It reports relative standing (per
 * metric and overall) and never decides, ranks for action, or changes behavior. It rests on the measured values only.
 */
export class Comparator {
  /** Compare the measured metrics against a benchmark, reporting relative standing. */
  compare(measured: readonly MeasuredMetric[], benchmark: Benchmark): Comparison {
    const reference = new Map<string, number>();
    for (const value of benchmark.values) {
      reference.set(value.metric, value.value);
    }
    const entries: ComparisonEntry[] = [];
    let measuredSum = 0;
    let benchmarkSum = 0;
    for (const metric of measured) {
      const standard = reference.get(metric.metric);
      if (standard === undefined) {
        continue;
      }
      measuredSum += metric.value;
      benchmarkSum += standard;
      entries.push(
        Object.freeze({
          metric: metric.metric,
          measured: metric.value,
          benchmark: standard,
          standing: standingOf(metric.value, standard),
        }),
      );
    }
    return Object.freeze({
      benchmark: benchmark.name,
      version: benchmark.version,
      entries: Object.freeze(entries),
      standing: entries.length === 0 ? 'equal' : standingOf(measuredSum, benchmarkSum),
    });
  }
}
