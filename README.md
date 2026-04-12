# OSS

A public monorepo where I share the patterns I use to build production-grade full-stack applications. It's a living portfolio — things are always being added and improved.

- [finance.zdiego.com](https://finance.zdiego.com) — AI-powered invoice scanner and expense dashboard
- [oss.zdiego.com](https://oss.zdiego.com) — component showcase

---

## Why this exists

I built this to demonstrate how I approach full-stack engineering as a startup generalist — from database schema design to infrastructure to UI. Every decision here reflects how I'd build a real product: end-to-end type safety, secure infrastructure, and clean separation of concerns across a monorepo.

---

## The flagship app: AI invoice scanner

Most businesses that deal with high volumes of invoices still rely on people manually reading and entering data into a database. That's slow, expensive, and doesn't scale. This repo includes a proof-of-concept that automates that process entirely.

**How it works:**

1. A user drops an invoice (PDF, PNG, JPG, or WEBP) onto the finance app
2. The file is sent via oRPC to a Next.js API route
3. The API calls a local [Ollama](https://ollama.com) vision model running on my machine
4. The model extracts structured fields: merchant, date, amount, currency, category, tax, and description
5. The result is returned to the UI, reviewed, and saved to Postgres

**The infrastructure challenge:** Ollama runs locally, but the finance app is deployed on Vercel. To bridge that gap, I expose the local Ollama server through a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) — a named, persistent tunnel that requires no open ports or firewall changes. The tunnel is protected by [Cloudflare Zero Trust Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) using service tokens, so only the deployed app can reach it.

**What's next:** The extraction accuracy will improve with image compression (reduce payload size), fine-tuned models, and better PDF processing strategies. The economics only make sense at high volume — thousands of invoices per day — and that's exactly the target use case I'm validating.

---

## Apps

### `finance` — [finance.zdiego.com](https://finance.zdiego.com)
A fully functional demo of an AI invoice scanner. Users submit their invoices on finance.zdiego.com and an ollama vision LLM extracts structured data from it. Turning pdfs/images into a queryable database.

This setup achieves private inference because the LLM runs on a local machine, which is exposed to the internet using a Cloudflare Tunnel + Zero Trust Access.

![Finance app demo](apps/finance/public/finance.gif)

### `web` — [oss.zdiego.com](https://oss.zdiego.com)
A frontend component showcase. I open-source the components I've built and refined across projects — starting with things like the `Wireframe` layout component. This app is intentionally frontend-only: no backend, just patterns and primitives worth sharing.

---

## Stack

**Monorepo**
- [Turborepo](https://turbo.build) — task orchestration and build caching
- [Bun](https://bun.sh) — package manager and runtime

**Frontend**
- [Next.js 16](https://nextjs.org) + React 19
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) — component primitives
- [TanStack Form](https://tanstack.com/form) — form management
- [TanStack Table](https://tanstack.com/table) — data tables
- [TanStack Query](https://tanstack.com/query) — server state

**Backend & Data**
- [oRPC](https://orpc.unnoq.com) — end-to-end typesafe RPC
- [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) — serverless Postgres
- [Better Auth](https://better-auth.com) + passkeys — authentication
- [Zod v4](https://zod.dev) — schema validation, co-located with Drizzle table definitions

**Infrastructure**
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) + Zero Trust Access — securely exposes local services to deployed apps
- [Ollama](https://ollama.com) — local LLM / vision model inference

**Tooling**
- [Biome](https://biomejs.dev) + [Ultracite](https://ultracite.dev) — linting and formatting
- [Husky](https://typicode.github.io/husky/) + lint-staged — pre-commit hooks
- [Resend](https://resend.com) + [React Email](https://react.email) — transactional email
- [Polar](https://polar.sh) — billing

---

## Packages

| Package | Description |
|---|---|
| `api` | oRPC router — widgets, users, invoices, credit cards, addresses, bugs, plans, ping, ollama |
| `auth` | Better Auth config with passkey plugin |
| `db` | Drizzle schema + Neon client. Tables use a bigint internal PK and a public nanoId — the bigint never leaves the server |
| `ui` | Shared component library |
| `llm` | Starts Ollama locally and exposes it via a Cloudflare Tunnel with Zero Trust auth |
| `local-machine` | A minimal Bun HTTP server used to learn and validate the Cloudflare Tunnel setup before applying it to `llm` |
| `env` | Type-safe environment variables |
| `config` | Shared TypeScript and tooling config |
| `shared` | Shared utilities — input validation presets, metadata, allowed character sets |

---

Created by [Diego](https://zdiego.com)
