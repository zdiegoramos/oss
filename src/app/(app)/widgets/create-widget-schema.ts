import { insertWidgetSchema } from "@/server/db/schema";

export const createWidgetSchema = insertWidgetSchema.pick({
  name: true,
  category: true,
  amount: true,
});
