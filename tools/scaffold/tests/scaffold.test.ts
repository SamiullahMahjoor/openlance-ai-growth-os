import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const PKG_NAME = 'goldenfixture';
const pkgDir = join(repoRoot, 'packages', PKG_NAME);

const NS_NAME = 'goldennamespace';
const nsDir = join(repoRoot, 'packages', 'namespaces', NS_NAME);

/** Run a command from a working directory, throwing (failing the test) on a non-zero exit. */
const run = (command: string, cwd: string = repoRoot): void => {
  execSync(command, { cwd, stdio: 'pipe' });
};

afterAll(() => {
  rmSync(pkgDir, { recursive: true, force: true });
  rmSync(nsDir, { recursive: true, force: true });
});

describe('scaffold golden-file (generators)', () => {
  it('scaffolds a multi-file package that builds, type-checks, tests at full coverage, benchmarks, and passes depcruise with no manual edits', () => {
    rmSync(pkgDir, { recursive: true, force: true });

    run(
      `pnpm exec plop package ${PKG_NAME} "golden fixture" OL-AI-ARCHITECTURE-DEPENDENCY-MAP Experimental`,
    );

    // The full standard skeleton: a realistic multi-file package (barrel + module), a test,
    // a benchmark + baseline, and both tsconfigs (ADR-0009 declaration build).
    for (const file of [
      'package.json',
      'tsconfig.json',
      'tsconfig.build.json',
      'vitest.config.ts',
      'src/index.ts',
      `src/${PKG_NAME}.ts`,
      `tests/${PKG_NAME}.test.ts`,
      `benchmarks/${PKG_NAME}.bench.ts`,
      'benchmarks/baseline.md',
      'README.md',
    ]) {
      expect(existsSync(join(pkgDir, file))).toBe(true);
    }

    // Metadata + the convention-critical scripts (ADR-0009 build, Rule 5 bench, Rule 6 coverage).
    const manifest = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8')) as {
      name: string;
      sideEffects: boolean;
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
      aios: { layer: string; constitution: string[]; stability: string };
    };
    expect(manifest.name).toBe(`@openlance/aios-${PKG_NAME}`);
    expect(manifest.aios.layer).toBe('substrate');
    expect(manifest.aios.constitution).toEqual(['OL-AI-ARCHITECTURE-DEPENDENCY-MAP']);
    expect(manifest.aios.stability).toBe('Experimental');
    expect(manifest.sideEffects).toBe(false);
    expect(manifest.scripts.build).toContain('--tsconfig tsconfig.build.json');
    expect(manifest.scripts.test).toContain('--coverage');
    expect(manifest.scripts.bench).toBe('vitest bench --run');
    expect(manifest.devDependencies['@vitest/coverage-v8']).toBeDefined();

    // Builds, including the rolled-up declaration. The barrel re-exports a module, so a broken
    // declaration build (composite conflict, ADR-0009) would fail here with TS6307.
    expect(() =>
      run(
        'pnpm exec tsup src/index.ts --format esm --dts --clean --sourcemap --tsconfig tsconfig.build.json',
        pkgDir,
      ),
    ).not.toThrow();
    expect(existsSync(join(pkgDir, 'dist/index.d.ts'))).toBe(true);

    // Type-checks, tests at 100% coverage (the 100 thresholds fail the run otherwise), and
    // benchmarks, all on the as-generated package (no manual edits).
    expect(() => run('pnpm exec tsc --noEmit -p tsconfig.json', pkgDir)).not.toThrow();
    expect(() => run('pnpm exec vitest run --coverage', pkgDir)).not.toThrow();
    expect(() => run('pnpm exec vitest bench --run', pkgDir)).not.toThrow();

    // Passes the dependency graph (no cycles, no boundary or deep-import violations). Uses the
    // scaffold-local cruise config, which reuses the root rules but does not exclude the fixture.
    expect(() =>
      run(
        `pnpm exec depcruise packages/${PKG_NAME} --config tools/scaffold/tests/scaffold.dependency-cruiser.cjs`,
      ),
    ).not.toThrow();
  });

  it('reserves a namespace package with only package.json and README.md (no runtime code)', () => {
    rmSync(nsDir, { recursive: true, force: true });

    run(`pnpm exec plop namespace-package ${NS_NAME} OL-AI-RUNTIME-README`);

    // A reserved namespace is metadata only: exactly these two files, no src / tests / configs.
    expect(readdirSync(nsDir).sort()).toEqual(['README.md', 'package.json']);

    const manifest = JSON.parse(readFileSync(join(nsDir, 'package.json'), 'utf8')) as {
      name: string;
      aios: { layer: string; constitution: string[] };
    };
    expect(manifest.name).toBe(`@openlance/aios-${NS_NAME}`);
    expect(manifest.aios.layer).toBe('namespace');
    expect(manifest.aios.constitution).toEqual(['OL-AI-RUNTIME-README']);
  });
});
