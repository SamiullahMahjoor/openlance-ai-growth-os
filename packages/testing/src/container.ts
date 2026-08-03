import { createContainer } from '@openlance/aios-di';
import type { Container, Registry } from '@openlance/aios-di';

/**
 * Creates a fresh, isolated dependency-injection container for a test. Each call
 * returns a new container, so tests never share registration state. An optional
 * `configure` callback registers services before the container is returned.
 */
export const createTestContainer = (configure?: (registry: Registry) => void): Container => {
  const container = createContainer();
  if (configure) {
    configure(container);
  }
  return container;
};
