import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * Permanent runtime-dependency-boundary guard (ADR-0056). Automation Intelligence's runtime dependency set is closed and
 * minimal: exactly its immediate predecessor (Growth Workflows), the two frozen engine contracts it frames for
 * (Agent Engine, Evaluation Engine), and three substrate packages (kernel, errors, di). It takes NO dependency on the
 * execution, governance, provider, operations, or safety engines, so it cannot duplicate Runtime Execution or bypass
 * GovernanceClearance, and NO dependency on any planner package (the earlier chain is reached transitively through the
 * growth workflow). A future dependency edge outside this closed set fails CI immediately.
 */
const manifestPath = fileURLToPath(new URL('../package.json', import.meta.url));
const runtimeDependencies = (): string[] => {
  const json = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    dependencies?: Record<string, string>;
  };
  return Object.keys(json.dependencies ?? {});
};

const EXPECTED_RUNTIME_DEPENDENCIES = [
  '@openlance/aios-agent-engine',
  '@openlance/aios-di',
  '@openlance/aios-errors',
  '@openlance/aios-evaluation-engine',
  '@openlance/aios-kernel',
  '@openlance/aios-openlance-growth-workflows',
];

/** Engines whose ownership Automation must never duplicate or bypass; a runtime edge to any is forbidden. */
const FORBIDDEN_ENGINE_DEPENDENCIES = [
  '@openlance/aios-runtime-execution-engine',
  '@openlance/aios-governance-engine',
  '@openlance/aios-provider-engine',
  '@openlance/aios-operations-engine',
  '@openlance/aios-safety-engine',
  '@openlance/aios-prompt-engine',
  '@openlance/aios-reasoning-engine',
  '@openlance/aios-retrieval-engine',
  '@openlance/aios-memory-engine',
  '@openlance/aios-tool-engine',
];

/** Planner packages: reached transitively through the growth workflow, never a direct runtime edge (no fan-in). */
const FORBIDDEN_PLANNER_DEPENDENCIES = [
  '@openlance/aios-marketing-intelligence',
  '@openlance/aios-content-intelligence',
  '@openlance/aios-seo-intelligence',
  '@openlance/aios-social-intelligence',
  '@openlance/aios-analytics-intelligence',
  '@openlance/aios-campaign-intelligence',
];

describe('runtime dependency boundaries (ADR-0056)', () => {
  it('the runtime dependency set is exactly the closed, minimal set', () => {
    expect([...runtimeDependencies()].sort()).toEqual([...EXPECTED_RUNTIME_DEPENDENCIES].sort());
  });

  it('takes no runtime dependency on the execution, governance, provider, operations, or safety engines', () => {
    const deps = new Set(runtimeDependencies());
    for (const engine of FORBIDDEN_ENGINE_DEPENDENCIES) {
      expect(deps.has(engine), `must not depend on ${engine}`).toBe(false);
    }
  });

  it('takes no direct runtime dependency on any planner package (no fan-in; reached transitively)', () => {
    const deps = new Set(runtimeDependencies());
    for (const planner of FORBIDDEN_PLANNER_DEPENDENCIES) {
      expect(deps.has(planner), `must not depend on ${planner}`).toBe(false);
    }
  });
});
