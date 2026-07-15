# InkPoint Studio — Live Site Slice

## Live demo

https://upwork-demo-w650-ai-created-site-de.vercel.app


A deployable Next.js slice of a tattoo studio site. It builds the three pages that carry the risk — gallery, booking, FAQ — as production-shaped App Router code, and adds the thing a static design can't do: the booking form returns an **AI-generated consultation brief**, so the studio reads a structured request instead of a raw message.

## What this demonstrates

- **Gallery with real filtering** (`/gallery`) — 12 seeded pieces, style filter driven by the URL query string (`?style=Fine-line`), so a filtered view is shareable. Tiles open a detail dialog with artist, style, placement and session length; closes on Escape, backdrop, or the close button.
- **Booking with real validation** (`/book`) — one Zod schema shared by the client form and the server action. Inline field errors block submission; a valid submit stores the request and returns a reference ID like `INK-4F2A`.
- **AI consultation brief** — the free-text idea becomes a 2-sentence summary, a suggested artist from the seeded roster, an estimated session count and three prep notes.
- **Graceful degradation** — no API key, a failed call, or a rate limit all fall back to a deterministic brief labelled "sample brief". No error page, no blank screen.
- **FAQ accordion** (`/faq`) — 8 seeded items, first open by default.
- **Studio queue** (`/studio/requests`) — this session's requests, newest first, above two seeded examples; each row expands to its brief. Unauthenticated demo page.

## BYOK — bring your own key

The AI brief runs on **your** key, in **your** browser. Open `/settings`, pick a provider (Anthropic, OpenAI or Google), paste a key and choose a model. It is saved only to `localStorage` under `byok`, sent straight from the browser to the provider via the Vercel AI SDK, and never touches this app's server — no key is logged, proxied or billed to anyone but you.

Every non-AI part of the site works fully without a key; booking just returns the sample brief.

## Run locally

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Note: use `pnpm run build` — bare `pnpm build` is shadowed by a pnpm 10 built-in that rebuilds dependencies.

```bash
pnpm run build      # production build
pnpm exec playwright install --with-deps chromium
pnpm test           # 10 Playwright acceptance tests, one per acceptance criterion
```

Tests stub the LLM with a `mock` provider sentinel, so the suite needs no API key and makes no network calls.

## Scope

Seeded JSON content (artists, artwork, FAQ) in typed modules — the client's real copy and photos drop straight in by pointing `imageUrl` at their CDN. Artwork is generated placeholder SVG. Requests live in an in-memory store for the life of the server process: no database, no auth, no payments, no notifications.

## Stack

Next.js (App Router) · TypeScript strict · Tailwind · Radix primitives (Dialog, Accordion, Select) · Zod · Vercel AI SDK (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai`, `@ai-sdk/google`) · Playwright
