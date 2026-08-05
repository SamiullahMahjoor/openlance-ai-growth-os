import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0042 / ADR-0035 invariant, enforced structurally: the Governance Enforcement Engine never contains vendor
 * knowledge and names no model. It is provider-agnostic. This guard scans every source file under `src/` and fails the
 * build if it names a vendor, references a client library or SDK, embeds an API URL, or carries authentication material.
 * The bare word "authorization" is not forbidden here: it is this engine's core governance domain term (governance
 * authorizes an action), not the HTTP `Authorization` header; the specific credential tokens below catch auth material.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'openai',
  'anthropic',
  'gemini',
  'grok',
  'deepseek',
  'ollama',
  'claude',
  'gpt',
  'https://',
  'http://',
  'api_key',
  'apikey',
  'x-api-key',
  'bearer',
  'sdk',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no vendor knowledge (ADR-0042 / ADR-0035 invariant)', () => {
  it('the engine source names no vendor, client library, SDK, URL, or authentication material', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
