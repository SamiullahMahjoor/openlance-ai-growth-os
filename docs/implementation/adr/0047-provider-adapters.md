---
id: ADR-0047
title: Concrete provider adapters are separate vendor packages implemented against the frozen Provider seam behind an injected transport with no embedded credentials; the OpenAI adapter is the first, and the frozen Provider Engine is never modified
status: Accepted
date: 2026-08-06
supersedes: []
superseded_by: null
---

# ADR-0047: Concrete provider adapters are separate vendor packages implemented against the frozen Provider seam behind an injected transport with no embedded credentials; the OpenAI adapter is the first, and the frozen Provider Engine is never modified

## Status

**Accepted** (Platform Completion, PC-2). Approved under ADR-0007's design-first cadence before implementation. It changes no frozen work, supersedes nothing, and realizes the concrete-adapter sub-stage ADR-0035 explicitly deferred. It preserves the `phase-4-frozen` baseline and every prior ADR.

## Context

ADR-0035 (Phase 4, Stage 1) built the vendor-neutral Provider Engine and deliberately deferred concrete provider adapters: "each concrete adapter (for example a specific vendor) is a separate later sub-stage implemented against the frozen engine, so vendor and model churn never touch the core," and "Concrete providers are implemented later as independent adapter packages that depend on the frozen `Provider` abstraction, never the reverse; that dependency direction is permanent." The engine holds no vendor knowledge, enforced by a guard test.

A source reading of the frozen engine fixes the seam this ADR must honor (`apps/provider-engine/src/types.ts`, `factory.ts`, `governance-clearance.ts`, `executor.ts`):

- The only surface an adapter implements is `Provider` / `ProviderDescriptor`: `id`, `capabilities`, an optional lifecycle `phase`, `invoke(clearance, request): Promise<Result<unknown, ProviderError>>`, and an optional `probe(): Promise<HealthStatus>`. The engine's `ProviderFactory` validates a descriptor into an immutable `Provider`.
- `invoke` requires a `GovernanceClearance`, whose brand is module-private and whose minter is never exported. An adapter accepts a clearance but can neither inspect nor mint one; the engine's `ProviderExecutor` refuses any invocation without a genuine clearance, so "governance precedes execution" holds by construction and the adapter cannot open an ungoverned path.
- `ProviderRequest` carries a neutral `capability` and an opaque `payload`; the engine normalizes the adapter's raw output. The adapter maps the neutral request to and from its vendor shape at the edge.

The Platform Completion milestone (PC-2) needs at least one production adapter to make the AIOS able to call a real model, while keeping all vendor knowledge out of every engine.

## Decision

1. **A concrete provider adapter is a separate `apps/*` package that implements the frozen `ProviderDescriptor` seam.** It depends only on `@openlance/aios-provider-engine` (the frozen seam types plus the `ProviderError` value) and the substrate (`@openlance/aios-kernel`). It depends on no engine in reverse, imports no other operational engine, and is an acyclic leaf; the composition root (PC-3) constructs it and registers it with the Provider Engine. The frozen Provider Engine is never modified.

2. **All vendor knowledge lives only inside the adapter package.** The adapter names its vendor, its model identifiers, its endpoint paths, its authorization scheme, and its request and response mapping. This is the one place vendor knowledge is permitted; every engine remains vendor-neutral and its `no-vendor-knowledge` guard is untouched. An adapter is never imported by an engine, so no engine acquires vendor knowledge transitively.

3. **The adapter performs no I/O itself; it calls an injected transport.** The adapter defines a minimal, technology-neutral `Transport` seam (a single `send(request): Promise<TransportResult>`) and receives an implementation at construction. It imports no HTTP client and no vendor SDK, so it carries no network or SDK dependency, is fully deterministic under a supplied transport in tests, and never performs a real network call during validation.

4. **The adapter embeds no credential.** The API key and base URL are injected as construction options, never hardcoded. The adapter source contains no secret and no key literal, enforced by a `no-embedded-credential` guard test that scans the source. Reading configuration through the environment is already forbidden by the lint determinism seam.

5. **The adapter is fail-closed and never throws.** `invoke` returns `Result<unknown, ProviderError>`: an unsupported capability, a malformed payload, a non-success transport status, a transport rejection, or an unparseable response body each yields an `err(ProviderError)` with a stable `PROVIDER.ADAPTER_*` code; nothing throws out of the public surface. It requires the `GovernanceClearance` as a typed precondition, accepts it, and neither inspects nor mints it.

6. **The OpenAI adapter (`@openlance/aios-provider-adapter-openai`) is the first concrete adapter.** It maps a neutral text-generation request to the OpenAI chat-completions request shape and maps the response back to a neutral output, behind the injected transport, with the model and base URL injected. It is a production-shaped mapping; supplied a real transport and key at runtime it calls the real API, and supplied a fake transport in tests it is fully deterministic.

## Rationale

The naive alternative, teaching the Provider Engine about a vendor, is exactly what ADR-0035 forbids. The decision keeps the permanent dependency direction (adapter to engine, never the reverse), isolates all churn in leaf packages, and makes the governed path and the no-secret and no-SDK properties structural. Alternatives considered and rejected:

- **A vendor adapter inside the Provider Engine or a shared engine.** Rejected: it re-owns the frozen vendor-neutrality invariant (ADR-0035 Decision 5) and would trip the engine's guard.
- **The adapter performing HTTP directly (importing a client or the vendor SDK).** Rejected: it couples the adapter to a runtime and a network, defeats deterministic testing, and risks bundling secrets or SDK surface. The injected transport keeps the adapter pure and testable and leaves transport choice to the composition root.
- **Embedding the API key or reading it from the environment.** Rejected: a secret in source or a direct environment read violates the security posture; credentials are injected as options, sourced by the composition root from the frozen config.
- **Minting or validating the governance clearance in the adapter.** Rejected: the minter is deliberately unexported and the executor already enforces the clearance; an adapter that inspected or forged one would breach "governance precedes execution."

## Consequences

- The `apps/` layer gains its first concrete provider adapter; more adapters (other vendors) follow as further independent leaf packages against the same seam, each its own design artifact, never modifying the engine.
- The composition root (PC-3) is the single place that constructs an adapter with a concrete transport and credential and registers it with the Provider Engine's manager; until then the adapter is inert (nothing constructs it).
- A future runtime validation pipeline / governance enforcement engine becomes the sole clearance minter with no change to the adapter, which already only accepts a clearance.
- Changing any of these decisions requires a superseding ADR and full validation. No frozen namespace, substrate package, constitution document, dependency rule, or prior ADR's decision changes; `ai/` and `knowledge/` remain byte-identical.

## Related constitutional references

Referenced and conformed to, never restated or modified: `ai/providers/README.md` (the provider-neutral model; a provider is invoked and executed by the Runtime), `ai/runtime/README.md` ("Governance precedes execution"), and the frozen `@openlance/aios-provider-engine` public seam (`Provider`, `ProviderDescriptor`, `ProviderRequest`, `GovernanceClearance`, `ProviderError`).

## Related ADRs

Supersedes none. Realizes the concrete-adapter sub-stage deferred by ADR-0035 (Decisions 4 to 6, Consequences). Builds on ADR-0006 (Result error handling), ADR-0007 / ADR-0023 (design-first cadence and lifecycle), and ADR-0015 (100% coverage). Second item of the Platform Completion milestone (PC-2), after ADR-0046 (PC-1).
