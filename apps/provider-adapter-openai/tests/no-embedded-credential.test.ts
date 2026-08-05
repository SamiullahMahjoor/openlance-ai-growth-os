import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0047 invariant, enforced structurally: the adapter embeds no credential. The API key and base URL are injected
 * as options, never hardcoded. This guard scans every source file under `src/` and fails the build if it finds a provider
 * secret-key literal or a secret assigned to a string literal. (Reading configuration through the environment is already
 * forbidden by the lint determinism seam.)
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN_PATTERNS: readonly RegExp[] = [
  /sk-[A-Za-z0-9]{16,}/,
  /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/i,
];

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no embedded credential (ADR-0047 invariant)', () => {
  it('the adapter source embeds no secret key literal', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8');
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(pattern.test(text), `${file} appears to embed a credential (${pattern})`).toBe(
          false,
        );
      }
    }
  });
});
