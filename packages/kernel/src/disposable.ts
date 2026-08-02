/**
 * Disposable: the deterministic teardown contract.
 *
 * A resource that must release something on shutdown implements this. Disposal may
 * be synchronous or asynchronous; a caller awaits the result to sequence teardown
 * deterministically (docs/implementation/01-core-framework.md).
 */

export interface Disposable {
  dispose(): void | Promise<void>;
}
