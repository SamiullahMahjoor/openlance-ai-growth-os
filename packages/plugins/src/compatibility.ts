import { BaseError } from '@openlance/aios-errors';
import { err, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import type { PluginManifest } from './manifest.js';

/**
 * A plugin compatibility or dependency problem: an unsupported API version, a
 * missing or out-of-range dependency, a circular dependency, or an unavailable
 * plugin. It is a domain error distinguished by its stable `PLUGIN.*` code.
 */
export class PluginError extends BaseError {
  readonly category = 'domain';
}

interface SemVer {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

const parseVersion = (value: string): SemVer | undefined => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value.trim());
  if (!match) {
    return undefined;
  }
  return { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
};

const compare = (a: SemVer, b: SemVer): number =>
  a.major - b.major || a.minor - b.minor || a.patch - b.patch;

const OPERATORS = ['>=', '<=', '>', '<', '='] as const;

const satisfiesComparator = (version: SemVer, comparator: string): boolean => {
  const operator = OPERATORS.find((candidate) => comparator.startsWith(candidate));
  const target = parseVersion(operator ? comparator.slice(operator.length) : comparator);
  if (!target) {
    return false;
  }
  const order = compare(version, target);
  if (operator === '>=') {
    return order >= 0;
  }
  if (operator === '<=') {
    return order <= 0;
  }
  if (operator === '>') {
    return order > 0;
  }
  if (operator === '<') {
    return order < 0;
  }
  return order === 0;
};

/**
 * Internal minimal semver satisfaction over a documented subset:
 * - `^X.Y.Z` (caret): the same major and at least `X.Y.Z`;
 * - comparators `>=`, `>`, `<=`, `<`, `=` followed by a version, space-separated
 *   as a conjunction;
 * - a bare `X.Y.Z` means exact equality.
 */
const satisfies = (version: string, range: string): boolean => {
  const parsed = parseVersion(version);
  if (!parsed) {
    return false;
  }
  const trimmed = range.trim();
  if (trimmed.startsWith('^')) {
    const base = parseVersion(trimmed.slice(1));
    if (!base) {
      return false;
    }
    return parsed.major === base.major && compare(parsed, base) >= 0;
  }
  return trimmed.split(/\s+/).every((comparator) => satisfiesComparator(parsed, comparator));
};

const dependencyNames = (manifest: PluginManifest): readonly string[] =>
  (manifest.dependsOn ?? []).map((dependency) => dependency.name);

/**
 * Internal: topologically orders items by their manifests' `dependsOn`, so an item
 * follows the items it depends on. A missing dependency is skipped here (it is
 * reported by `validateCompatibility`); a cycle yields a `PluginError`.
 */
export const orderByDeps = <T>(
  items: readonly T[],
  nameOf: (item: T) => string,
  depsOf: (item: T) => readonly string[],
): Result<T[], PluginError[]> => {
  const byName = new Map<string, T>();
  for (const item of items) {
    byName.set(nameOf(item), item);
  }
  const errors: PluginError[] = [];
  const ordered: T[] = [];
  const VISITING = 1;
  const VISITED = 2;
  const state = new Map<string, number>();
  const path: string[] = [];

  const visit = (item: T): void => {
    const name = nameOf(item);
    state.set(name, VISITING);
    path.push(name);
    for (const depName of depsOf(item)) {
      const depItem = byName.get(depName);
      if (!depItem) {
        continue;
      }
      const depState = state.get(depName) ?? 0;
      if (depState === VISITING) {
        const cycle = path.slice(path.indexOf(depName)).concat(depName);
        errors.push(
          new PluginError(
            'PLUGIN.CIRCULAR_DEPENDENCY',
            `Circular plugin dependency: ${cycle.join(' -> ')}.`,
            {
              cycle,
            },
          ),
        );
      } else if (depState !== VISITED) {
        visit(depItem);
      }
    }
    path.pop();
    state.set(name, VISITED);
    ordered.push(item);
  };

  for (const item of items) {
    if ((state.get(nameOf(item)) ?? 0) !== VISITED) {
      visit(item);
    }
  }

  return errors.length === 0 ? ok(ordered) : err(errors);
};

/**
 * Validates a set of manifests, returning every problem found: an `apiVersion`
 * outside the host's supported range, a missing dependency, a dependency whose
 * version is out of the required range, and any circular dependency. It fails
 * closed: any problem is returned before a plugin is loaded.
 */
export const validateCompatibility = (
  manifests: readonly PluginManifest[],
  supportedApiVersion: string,
): Result<void, PluginError[]> => {
  const errors: PluginError[] = [];
  const byName = new Map<string, PluginManifest>();
  for (const manifest of manifests) {
    byName.set(manifest.name, manifest);
  }

  for (const manifest of manifests) {
    if (!satisfies(manifest.apiVersion, supportedApiVersion)) {
      errors.push(
        new PluginError(
          'PLUGIN.INCOMPATIBLE_API',
          `Plugin '${manifest.name}' targets apiVersion '${manifest.apiVersion}', outside supported '${supportedApiVersion}'.`,
          {
            plugin: manifest.name,
            apiVersion: manifest.apiVersion,
            supported: supportedApiVersion,
          },
        ),
      );
    }
  }

  for (const manifest of manifests) {
    for (const dependency of manifest.dependsOn ?? []) {
      const target = byName.get(dependency.name);
      if (!target) {
        errors.push(
          new PluginError(
            'PLUGIN.MISSING_DEPENDENCY',
            `Plugin '${manifest.name}' depends on missing '${dependency.name}'.`,
            {
              plugin: manifest.name,
              missing: dependency.name,
            },
          ),
        );
      } else if (!satisfies(target.version, dependency.range)) {
        errors.push(
          new PluginError(
            'PLUGIN.INCOMPATIBLE_DEPENDENCY',
            `Plugin '${manifest.name}' requires '${dependency.name}' ${dependency.range}, but found '${target.version}'.`,
            {
              plugin: manifest.name,
              dependency: dependency.name,
              range: dependency.range,
              found: target.version,
            },
          ),
        );
      }
    }
  }

  const cycles = orderByDeps(
    manifests,
    (manifest) => manifest.name,
    (manifest) => dependencyNames(manifest),
  );
  if (!cycles.ok) {
    errors.push(...cycles.error);
  }

  return errors.length === 0 ? ok(undefined) : err(errors);
};
