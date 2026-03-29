import { os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/server/db";
import { insertWidgetSchema, widget as widgetTable } from "@/server/db/schema";

const widgetRouter = {
  create: os.input(insertWidgetSchema).handler(async ({ input }) => {
    const [widget] = await db.insert(widgetTable).values(input).returning();
    if (!widget) {
      throw new Error("Failed to create widget");
    }
    return { widget };
  }),

  list: os.handler(async () => {
    return await db.select().from(widgetTable).orderBy(widgetTable.createdAt);
  }),

  get: os.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const [widget] = await db
      .select()
      .from(widgetTable)
      .where(eq(widgetTable.nanoId, input.id));
    if (!widget) {
      throw new Error("Widget not found");
    }
    return { widget };
  }),
};

export const appRouter = {
  widget: widgetRouter,
};

export type AppRouter = typeof appRouter;
