import { err, isErr, ok } from '@openlance/aios-kernel';
import type { Result } from '@openlance/aios-kernel';

import { createContainer, type Container } from './container.js';
import type { Registry } from './registry.js';
import { DependencyError } from './validation.js';

/**
 * A unit of registration. A module names itself and its version, optionally declares
 * the other modules it must be registered after, and registers its services.
 */
export interface Module {
  readonly name: string;
  readonly version: string;
  readonly dependsOn?: readonly string[];
  register(registry: Registry): void;
}

/**
 * The composition root: collect modules, then build a validated container. Modules
 * are registered in dependency order (a module is registered after the modules it
 * declares in `dependsOn`), and the resolved service graph is validated before the
 * container is returned.
 */
export interface ModuleHost {
  add(module: Module): this;
  build(): Result<Container, DependencyError[]>;
}

/** Internal: orders modules so every module follows the ones it depends on. */
const orderModules = (modules: readonly Module[]): Result<Module[], DependencyError[]> => {
  const byName = new Map<string, Module>();
  for (const module of modules) {
    byName.set(module.name, module);
  }

  const errors: DependencyError[] = [];
  const ordered: Module[] = [];
  const VISITING = 1;
  const VISITED = 2;
  const state = new Map<string, number>();
  const path: string[] = [];

  const visit = (module: Module): void => {
    state.set(module.name, VISITING);
    path.push(module.name);
    for (const dependency of module.dependsOn ?? []) {
      const dependencyModule = byName.get(dependency);
      if (!dependencyModule) {
        errors.push(
          new DependencyError(
            'DI.MISSING_MODULE',
            `Module '${module.name}' depends on unregistered module '${dependency}'.`,
            { module: module.name, missing: dependency },
          ),
        );
        continue;
      }
      const dependencyState = state.get(dependency) ?? 0;
      if (dependencyState === VISITING) {
        const cycle = path.slice(path.indexOf(dependency)).concat(dependency);
        errors.push(
          new DependencyError(
            'DI.CIRCULAR_MODULE',
            `Circular module dependency: ${cycle.join(' -> ')}.`,
            {
              cycle,
            },
          ),
        );
      } else if (dependencyState !== VISITED) {
        visit(dependencyModule);
      }
    }
    path.pop();
    state.set(module.name, VISITED);
    ordered.push(module);
  };

  for (const module of modules) {
    if ((state.get(module.name) ?? 0) !== VISITED) {
      visit(module);
    }
  }

  return errors.length === 0 ? ok(ordered) : err(errors);
};

class ModuleHostImpl implements ModuleHost {
  readonly #modules: Module[] = [];

  add(module: Module): this {
    this.#modules.push(module);
    return this;
  }

  build(): Result<Container, DependencyError[]> {
    const ordered = orderModules(this.#modules);
    if (isErr(ordered)) {
      return ordered;
    }
    const container = createContainer();
    for (const module of ordered.value) {
      module.register(container);
    }
    const validation = container.validate();
    if (isErr(validation)) {
      return err(validation.error);
    }
    return ok(container);
  }
}

/** Creates a new, empty module host. */
export const createModuleHost = (): ModuleHost => new ModuleHostImpl();
