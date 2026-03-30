import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import schema, { user } from "../src/server/db/schema";

const client = postgres(env.DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding database...");

  const [inserted] = await db
    .insert(user)
    .values({
      username: "seed_user",
      email: "seed@example.com",
    })
    .returning();

  console.log("Created user:", inserted);
  console.log("Done.");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
