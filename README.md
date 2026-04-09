# OSS by Diego Ramos

In this repo I share the patterns I use for development.

## Stack

**Monorepo**
- [Turborepo](https://turbo.build) — build system and task orchestration
- [Bun](https://bun.sh) — package manager and runtime

**Apps**
- `web` — [Next.js](https://nextjs.org) web app
- `native` — [Expo](https://expo.dev) / React Native mobile app
- `finance` — [Next.js](https://nextjs.org) finance app

**Packages**
- `db` — [Drizzle ORM](https://orm.drizzle.team) + [Neon](https://neon.tech) (serverless Postgres)
- `auth` — [Better Auth](https://better-auth.com)
- `ui` — shared component library
- `env`, `config`, `shared` — shared utilities and configuration

**Key Libraries**
- [oRPC](https://orpc.unnoq.com) — end-to-end typesafe RPC
- [TanStack Form](https://tanstack.com/form) — form management
- [Zod](https://zod.dev) — schema validation
- [Resend](https://resend.com) + [React Email](https://react.email) — transactional email
- [Polar](https://polar.sh) — billing
- [Biome](https://biomejs.dev) — linting and formatting
