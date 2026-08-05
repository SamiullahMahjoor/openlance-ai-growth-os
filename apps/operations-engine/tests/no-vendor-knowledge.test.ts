import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0045 / ADR-0035 invariant, enforced structurally: the Operations Engine holds no vendor knowledge and names no
 * monitoring tool, dashboard product, or alerting platform (the frozen operations model is technology-neutral). This
 * guard scans every source file under `src/` and fails the build if it names a vendor, a monitoring or alerting product,
 * a client library or SDK, an API URL, or authentication material.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'openai',
  'anthropic',
  'gemini',
  'claude',
  'gpt',
  'prometheus',
  'grafana',
  'datadog',
  'pagerduty',
  'kubernetes',
  'cloudwatch',
  'splunk',
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

describe('no vendor knowledge (ADR-0045 / ADR-0035 invariant)', () => {
  it('the engine source names no vendor, monitoring or alerting product, SDK, URL, or authentication material', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(text.includes(term), `${file} contains the forbidden token '${term}'`).toBe(false);
      }
    }
  });
});
