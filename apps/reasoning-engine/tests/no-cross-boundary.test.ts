import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0040 Decision 4 boundary, enforced structurally: the Reasoning Engine is foundational and reaches into no
 * operational service and no sibling namespace. Per the frozen `reasoning-boundaries`, a reasoning is expressed as
 * prompts and executed by providers (owned by their namespaces), consumes retrieved knowledge (owned by retrieval), and
 * applies governing rules (owned by governance), all referenced not consumed. This guard scans every source file under
 * `src/` for the forbidden package specifiers and fails the build on any occurrence. (The legal edges are reasoning, di,
 * events, errors, plugins, kernel.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN_SPECIFIERS = [
  '@openlance/aios-provider',
  '@openlance/aios-prompt',
  '@openlance/aios-tool',
  '@openlance/aios-memory',
  '@openlance/aios-retrieval',
  '@openlance/aios-agents',
  '@openlance/aios-governance',
  '@openlance/aios-runtime',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no cross-boundary dependency (ADR-0040 Decision 4)', () => {
  it('the engine source imports no provider, prompt, tool, memory, retrieval, agent, governance, or runtime package', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8');
      for (const specifier of FORBIDDEN_SPECIFIERS) {
        expect(
          text.includes(specifier),
          `${file} references the forbidden package '${specifier}'`,
        ).toBe(false);
      }
    }
  });
});
