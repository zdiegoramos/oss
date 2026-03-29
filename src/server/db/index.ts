import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import { post, user, widget } from "./schema";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema: { user, post, widget } });
