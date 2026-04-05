import { env } from "@/env";
import { db } from "@/server/db";
import { user } from "@/server/db/schema";

export async function ping(): Promise<boolean> {
  if (env.DB_MOCK) {
    return true;
  }
  //   get the first user in the database, if it exists
  const result = await db.select().from(user).limit(1);
  console.log("Ping result:", result);
  return result.length > 0;
}

ping()
  .then(() => {
    console.log("Database ping successful");
  })
  .catch((err) => {
    console.error("Failed to ping the database:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
