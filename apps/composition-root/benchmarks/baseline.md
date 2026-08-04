# Composition-root bootstrap baseline

Observational micro-baseline (Engineering Rule 5, ADR-0022). Measurement only: it runs outside `src`, composes
the substrate services into a validated graph, and never runs the layer. The composition root is a thin
application over the frozen `@openlance/aios-di` mechanism (ADR-0005, ADR-0026); its one executable path is
`bootstrap`, which:

- builds the three substrate services through their owning-package builders (`createConfigService`,
  `createLogger`, `createEventBus`),
- wraps each as a `di` module and hands them, plus any extension modules, to `createModuleHost().build()`,
- returns the immutable `Application` over the validated container, or fails closed with `CompositionError[]`.

The measured cost is dominated by `di`'s topological module ordering and startup `validate()`, not by logic this
package owns; the composition root defines no container, registry, or validation of its own.

Run with `pnpm --filter @openlance/aios-composition-root bench`. `bootstrap` is deterministic over a fixed
configuration and composes a bounded three-service graph, so throughput is high and the number is recorded here
only as an observational baseline, not a threshold.
