# Database

**Stack:** PostgreSQL · Drizzle ORM · drizzle-kit · `postgres` driver

## How it fits together

```
src/env.ts          — validates DATABASE_URL at startup (t3-env + zod)
src/server/db/index.ts  — creates the postgres client and drizzle instance
src/server/db/schema.ts — table definitions + zod insert schemas
drizzle.config.ts   — points drizzle-kit at the schema file
```

The `db` export from `src/server/db/index.ts` is the single entry point for all queries. Import it directly in server code.

```ts
import { db } from "@/server/db";
```

## Schema

One table today: `widgets`

| Column       | Type        | Notes                         |
|--------------|-------------|-------------------------------|
| `id`         | integer PK  | auto-increment (identity)     |
| `nano_id`    | text unique | nanoid generated on insert    |
| `name`       | text        | required                      |
| `category`   | text enum   | `basic` \| `advanced` \| `premium` |
| `amount`     | integer     | min 1                         |
| `created_at` | timestamp   | defaultNow                    |

`insertWidgetSchema` (drizzle-zod) is exported from the schema file and used for form and API validation — it omits `nanoId` and `createdAt` since those are server-generated.

## Migrations

Migrations are SQL files managed by drizzle-kit.

```bash
bun db:generate   # generate a new migration from schema changes
bun db:migrate    # apply pending migrations
bun db:push       # push schema directly (dev only, no migration files)
bun db:studio     # open Drizzle Studio
```

## Local development

```bash
bun db     # start Docker postgres + run migrations + create .env
bun dev    # start the app
```

`scripts/db.sh` handles the full lifecycle:

```bash
bun db up      # start container (creates it if needed) and migrate
bun db down    # stop and remove container
bun db reset   # fresh database (down + up)
bun db status  # show container status
```

The container name is `stack-postgres`, port `5432`. Connection string:

```
postgresql://postgres:password@localhost:5432/stack
```

## Adding a new table

1. Add the table definition to `src/server/db/schema.ts`
2. Register it in the `drizzle()` call in `src/server/db/index.ts`
3. Run `bun db:generate` then `bun db:migrate`
