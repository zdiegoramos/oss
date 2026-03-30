import { insertUserSchema } from "@/server/db/schema";

export const createUserFormSchema = insertUserSchema.pick({
  username: true,
  email: true,
});

export type CreateUserFormSchema = typeof createUserFormSchema._zod.input;
export type CreateUserFormOutput = typeof createUserFormSchema._zod.output;
