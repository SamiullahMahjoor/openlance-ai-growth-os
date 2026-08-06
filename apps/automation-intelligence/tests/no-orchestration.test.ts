import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0056 anti-duplication boundary, enforced structurally: Automation Intelligence never becomes an orchestration
 * engine, never duplicates Runtime Execution, and never bypasses GovernanceClearance. It owns no scheduler, orchestrator,
 * or cron/job primitive (all owned by ai/runtime, realized by the runtime-execution-engine), never references a Runtime
 * `ExecutionRequest` / `ExecutionRecord` / `ExecutionContext` envelope or a runtime step-execution mechanism, and never
 * references a `GovernanceClearance`, `GovernanceDecision`, or `SafetyDecision`. This guard scans every source file under
 * `src/` for orchestration, runtime-execution, and governance/safety-envelope tokens (identifier or call-shaped, never
 * English prose) and fails the build on any occurrence.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  '.orchestrate(',
  'orchestrator',
  'scheduler',
  'cronjob',
  'executionrequest',
  'executionrecord',
  'executioncontext',
  'runtimeexecutionmanager',
  'stepexecutor',
  'retrymanager',
  'timeoutmanager',
  'cancellationmanager',
  'checkpointmanager',
  'governanceclearance',
  'governancedecision',
  'safetydecision',
];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no orchestration / no runtime duplication (ADR-0056)', () => {
  it('the subsystem source owns no orchestration, runtime-execution, or governance/safety envelope', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
