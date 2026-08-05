# @openlance/aios-provider-adapter-openai

The AIOS **OpenAI provider adapter** (Platform Completion, PC-2): the first concrete provider adapter, a separate leaf package implemented against the frozen Provider Engine seam. See [ADR-0047](../../docs/implementation/adr/0047-provider-adapters.md) and the [design doc](../../docs/implementation/44-provider-adapters.md).

This is the second item of the Platform Completion milestone (the prerequisite to Phase 5, AI Growth OS Features). It is not Phase 5.

## What it does

`createOpenAIProvider(options)` returns a frozen-seam `ProviderDescriptor` that the Provider Engine's `ProviderFactory` validates into a `Provider`. Its `invoke(clearance, request)` maps a neutral text-generation request (`{ prompt }`) to the OpenAI chat-completions request body, calls the injected transport, and maps the response back to a neutral `{ text, model, id }` output. Its `probe()` reports `healthy` or `unhealthy` from a lightweight models request. `options = { transport, apiKey, model, baseUrl?, capability? }`.

## Isolation and safety

All vendor knowledge (the vendor name, model ids, endpoint paths, the authorization scheme, and the request/response mapping) lives only in this package; every engine stays vendor-neutral. The adapter performs no I/O itself: it calls an injected `Transport` and imports no HTTP client and no SDK, so it is deterministic under a supplied transport and performs no network call during validation. It embeds no credential: the API key and base URL are injected as options (a `no-embedded-credential` guard test enforces this). It is fail-closed and never throws: `invoke` returns `err(ProviderError)` on an unsupported capability, a malformed payload, a non-success status, a transport rejection, or an unparseable body. It accepts a `GovernanceClearance` and never inspects or mints one; the engine's executor enforces the governed path.

## Boundaries

It depends only on `@openlance/aios-provider-engine` (the frozen seam types plus `ProviderError`) and `@openlance/aios-kernel` (`Result`). It never modifies the Provider Engine, imports no other engine, and nothing depends on it (an acyclic leaf). The composition root (PC-3) constructs it with a concrete transport and credential and registers it with the Provider Engine.
