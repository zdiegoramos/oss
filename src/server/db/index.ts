import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import { mockDb } from "./mock";
import schema from "./schema";

// When DB_MOCK=true every query returns [] without opening a real connection.
export const db = env.DB_MOCK
  ? mockDb
  : drizzle(postgres(env.DATABASE_URL), { schema });
