import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

/**
 * The ADR-0037 memory-versus-retrieval boundary, enforced structurally: memory is not retrieval, and the
 * engine performs no retrieval technique (semantic search, embeddings, vector search, ranking, similarity,
 * RAG). Indexing, lookup, and recall are deterministic and structural over the engine's own retained
 * records. This guard scans every source file under `src/` and fails the build if any retrieval-technique
 * token appears; those concepts belong to ai/retrieval/, not the Memory Engine.
 */
const srcDir = fileURLToPath(new URL('../src/', import.meta.url));

const FORBIDDEN = [
  'embedding',
  'vector',
  'semantic',
  'similarity',
  'cosine',
  'ranking',
  ' rag ',
  'retrieval-augmented',
  'knn',
];

const sourceFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });

describe('no retrieval / RAG (ADR-0037 memory-is-not-retrieval boundary)', () => {
  it('the engine source applies no retrieval technique', () => {
    for (const file of sourceFiles(srcDir)) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const term of FORBIDDEN) {
        expect(
          text.includes(term),
          `${file} contains the forbidden retrieval token '${term}'`,
        ).toBe(false);
      }
    }
  });
});
