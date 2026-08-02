import type { ConfigService } from '@openlance/aios-config';
import type { Registry } from '@openlance/aios-di';
import type { EventBus } from '@openlance/aios-events';
import type { Logger } from '@openlance/aios-logging';

/**
 * The narrowed capability surface a plugin may touch. It is deliberately not the
 * raw container: a plugin registers services through the DI `registry`, reads typed
 * `config`, logs through `logger`, and publishes or subscribes through `events`, and
 * nothing more.
 */
export interface PluginContext {
  readonly registry: Registry;
  readonly config: ConfigService;
  readonly logger: Logger;
  readonly events: EventBus;
}
