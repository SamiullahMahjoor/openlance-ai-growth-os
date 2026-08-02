import { err, none, ok, some } from '@openlance/aios-kernel';
import type { Disposable, Option, Result } from '@openlance/aios-kernel';

import type { Lifetime, Provider, Resolver } from './provider.js';
import type { Scope } from './scope.js';
import { describeToken, type Token } from './token.js';
import { DependencyError, validateGraph, type GraphNode } from './validation.js';

/** Internal: a registered service, stored per token. */
interface Descriptor {
  readonly provider: Provider<unknown>;
  readonly lifetime: Lifetime;
}

/** Internal: the mutable state a single scope owns. */
interface ScopeState {
  readonly instances: Map<symbol, unknown>;
  readonly disposables: Disposable[];
}

const isDisposable = (value: unknown): value is Disposable =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { dispose?: unknown }).dispose === 'function';

const disposeAll = async (disposables: readonly Disposable[]): Promise<void> => {
  for (const disposable of [...disposables].reverse()) {
    await disposable.dispose();
  }
};

const dependenciesOf = (provider: Provider<unknown>): readonly symbol[] => {
  if ('useValue' in provider) {
    return [];
  }
  return provider.inject ?? [];
};

/**
 * A composition container: register services, resolve them by lifetime, create
 * scopes, validate the graph, and dispose. Its `register` signature matches
 * `Registry`, so it can receive module registrations directly.
 */
export interface Container extends Resolver, Disposable {
  register<T>(token: Token<T>, provider: Provider<T>, opts?: { lifetime?: Lifetime }): void;
  createScope(): Scope;
  validate(): Result<void, DependencyError[]>;
  dispose(): Promise<void>;
}

class ContainerImpl implements Container {
  readonly #descriptors = new Map<symbol, Descriptor>();
  readonly #singletons = new Map<symbol, unknown>();
  readonly #disposables: Disposable[] = [];
  readonly #rootScope: ScopeState = { instances: new Map(), disposables: this.#disposables };
  #disposed = false;

  register<T>(tokenValue: Token<T>, provider: Provider<T>, opts?: { lifetime?: Lifetime }): void {
    this.#descriptors.set(tokenValue, {
      provider: provider as Provider<unknown>,
      lifetime: opts?.lifetime ?? 'singleton',
    });
  }

  resolve<T>(tokenValue: Token<T>): T {
    return this.#resolve(tokenValue, this.#rootScope, new Set()) as T;
  }

  tryResolve<T>(tokenValue: Token<T>): Option<T> {
    if (!this.#descriptors.has(tokenValue)) {
      return none;
    }
    return some(this.resolve(tokenValue));
  }

  createScope(): Scope {
    return new ScopeImpl(this);
  }

  validate(): Result<void, DependencyError[]> {
    const nodes = new Map<symbol, GraphNode>();
    for (const [tokenSym, descriptor] of this.#descriptors) {
      nodes.set(tokenSym, {
        lifetime: descriptor.lifetime,
        dependencies: dependenciesOf(descriptor.provider),
      });
    }
    const errors = validateGraph(nodes);
    return errors.length === 0 ? ok(undefined) : err(errors);
  }

  async dispose(): Promise<void> {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    await disposeAll(this.#disposables);
  }

  /** Internal: resolve within a specific scope state, used by child scopes. */
  resolveInScope<T>(tokenValue: Token<T>, scope: ScopeState, stack: Set<symbol>): T {
    return this.#resolve(tokenValue, scope, stack) as T;
  }

  /** Internal: try-resolve within a specific scope state, used by child scopes. */
  tryResolveInScope<T>(tokenValue: Token<T>, scope: ScopeState): Option<T> {
    if (!this.#descriptors.has(tokenValue)) {
      return none;
    }
    return some(this.#resolve(tokenValue, scope, new Set()) as T);
  }

  #resolve(tokenSym: symbol, scope: ScopeState, stack: Set<symbol>): unknown {
    const descriptor = this.#descriptors.get(tokenSym);
    if (!descriptor) {
      throw new DependencyError(
        'DI.UNREGISTERED_TOKEN',
        `No provider registered for '${describeToken(tokenSym)}'.`,
        { token: describeToken(tokenSym) },
      );
    }
    if (descriptor.lifetime === 'singleton') {
      if (this.#singletons.has(tokenSym)) {
        return this.#singletons.get(tokenSym);
      }
      const instance = this.#instantiate(tokenSym, descriptor.provider, this.#rootScope, stack);
      this.#singletons.set(tokenSym, instance);
      if (isDisposable(instance)) {
        this.#disposables.push(instance);
      }
      return instance;
    }
    if (descriptor.lifetime === 'scoped') {
      if (scope.instances.has(tokenSym)) {
        return scope.instances.get(tokenSym);
      }
      const instance = this.#instantiate(tokenSym, descriptor.provider, scope, stack);
      scope.instances.set(tokenSym, instance);
      if (isDisposable(instance)) {
        scope.disposables.push(instance);
      }
      return instance;
    }
    return this.#instantiate(tokenSym, descriptor.provider, scope, stack);
  }

  #instantiate(
    tokenSym: symbol,
    provider: Provider<unknown>,
    scope: ScopeState,
    stack: Set<symbol>,
  ): unknown {
    if (stack.has(tokenSym)) {
      const cycle = [...stack, tokenSym].map(describeToken);
      throw new DependencyError(
        'DI.CIRCULAR_DEPENDENCY',
        `Circular dependency: ${cycle.join(' -> ')}.`,
        {
          cycle,
        },
      );
    }
    stack.add(tokenSym);
    try {
      const resolver: Resolver = {
        resolve: <U>(dep: Token<U>): U => this.#resolve(dep, scope, stack) as U,
        tryResolve: <U>(dep: Token<U>): Option<U> =>
          this.#descriptors.has(dep) ? some(this.#resolve(dep, scope, stack) as U) : none,
      };
      if ('useValue' in provider) {
        return provider.useValue;
      }
      if ('useClass' in provider) {
        const deps = (provider.inject ?? []).map((dep) => resolver.resolve(dep));
        const Ctor = provider.useClass as unknown as new (...args: unknown[]) => unknown;
        return new Ctor(...deps);
      }
      return provider.useFactory(resolver);
    } finally {
      stack.delete(tokenSym);
    }
  }
}

class ScopeImpl implements Scope {
  readonly #host: ContainerImpl;
  readonly #state: ScopeState = { instances: new Map(), disposables: [] };
  #disposed = false;

  constructor(host: ContainerImpl) {
    this.#host = host;
  }

  resolve<T>(tokenValue: Token<T>): T {
    return this.#host.resolveInScope(tokenValue, this.#state, new Set());
  }

  tryResolve<T>(tokenValue: Token<T>): Option<T> {
    return this.#host.tryResolveInScope(tokenValue, this.#state);
  }

  async dispose(): Promise<void> {
    if (this.#disposed) {
      return;
    }
    this.#disposed = true;
    await disposeAll(this.#state.disposables);
  }
}

/** Creates a new, empty composition container. */
export const createContainer = (): Container => new ContainerImpl();
