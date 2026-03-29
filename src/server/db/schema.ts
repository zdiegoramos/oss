import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  type AllowedCharacters,
  getCleanTextUnicode,
  parseUsernameInput,
} from "@/lib/allowed-chars";
import { myNanoid, NANO_ID_LENGTH } from "@/lib/constants";

// ─── USER TABLE ──────────────────────────────────────────────────────────────

export const user = pgTable(
  "user",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    username: varchar("username", { length: 30 }).notNull().unique(),
    email: varchar("email", { length: 254 }).notNull().unique(),
  },
  (t) => [
    uniqueIndex("user_nano_id_idx").on(t.nanoId),
    uniqueIndex("user_username_idx").on(t.username),
    uniqueIndex("user_email_idx").on(t.email),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
}));

export const userAllowedCharacters = {
  username: {},
  email: {},
} as const satisfies Partial<
  Record<keyof typeof user.$inferInsert, AllowedCharacters>
>;

export const selectUserSchema = createSelectSchema(user);

export const insertUserSchema = createInsertSchema(user, {
  username: z
    .string()
    .overwrite((v) => parseUsernameInput(v))
    .min(3, "Must be at least 3 characters")
    .max(30, "Cannot exceed 30 characters")
    .regex(
      /^[a-z0-9]+(_[a-z0-9]+)*$/,
      "Only lowercase letters, numbers, and underscores — no leading or trailing underscores"
    )
    .meta({ label: "Username", placeholder: "my_username" }),
  email: z
    .string()
    .email("Must be a valid email address")
    .max(254, "Cannot exceed 254 characters")
    .meta({ label: "Email", placeholder: "email@example.com" }),
}).strict();

// ─── EXAMPLE BUSINESS TABLE ─────────────────────────────────────────────────
// Demonstrates every pattern to replicate when adding real tables.

// pgEnum is the single source of truth for post.status.
// The DB enforces valid values natively; zod derives its enum from the same list.
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

export type PostStatus = (typeof postStatusEnum.enumValues)[number];

export const post = pgTable(
  "post",
  {
    // ── Primary key ───────────────────────────────────────────────────────────
    // Internal bigint — never sent to clients. Fast joins, no enumeration risk.
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    // ── Public identifier ────────────────────────────────────────────────────
    // nanoId: the only ID safe to expose in URLs / API responses.
    // The bigint `id` is used exclusively for internal FK references.
    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    // ── Timestamps ───────────────────────────────────────────────────────────
    // withTimezone: always stores as UTC, avoids DST surprises.
    // $onUpdate is the Drizzle layer; the DB trigger is the safety net for
    // raw SQL updates (see drizzle/setup-triggers.sql).
    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    // ── Business columns ─────────────────────────────────────────────────────
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),

    // ── Enum field ───────────────────────────────────────────────────────────
    // Native PG enum — DB enforces valid values at the type level.
    status: postStatusEnum("status").notNull().default("draft"),

    // ── Foreign key ──────────────────────────────────────────────────────────
    // bigint FK matches the bigint PK on user — no implicit casts needed.
    creatorId: bigint("creator_id", { mode: "bigint" })
      .notNull()
      .references(() => user.id),
  },
  (t) => [
    // Index on FK for efficient reverse-lookups (all posts by a user).
    index("post_creator_id_idx").on(t.creatorId),
    // Unique index on the public ID — used for URL lookups.
    uniqueIndex("post_nano_id_idx").on(t.nanoId),
  ]
);

// ── Relations ─────────────────────────────────────────────────────────────────

export const postRelations = relations(post, ({ one }) => ({
  creator: one(user, { fields: [post.creatorId], references: [user.id] }),
}));

// ── Allowed characters ────────────────────────────────────────────────────────
// Drives both the input sanitiser and the keyboard filter in the UI.
// Co-located here so the constraint, the schema, and the UI config never drift.

export const postAllowedCharacters = {
  title: {
    letters: true,
    spaces: true,
    numbers: true,
    punctuation: true,
    spanish: { letters: true },
  },
  content: {
    letters: true,
    spaces: true,
    numbers: true,
    punctuation: true,
    newLines: true,
    currencySymbols: true,
    spanish: { letters: true, punctuation: true },
  },
} as const satisfies Partial<
  Record<keyof typeof post.$inferInsert, AllowedCharacters>
>;

// ── Schemas ───────────────────────────────────────────────────────────────────
// selectSchema: used in server-side reads. Exact shape of a DB row.
// insertSchema: used in forms AND server-side mutations. Single source of
// validation truth — the same schema validates the form and the API handler.

export const selectPostSchema = createSelectSchema(post);

export const insertPostSchema = createInsertSchema(post, {
  title: z
    .string()
    .overwrite((v) =>
      getCleanTextUnicode({
        value: v,
        allowedCharacters: postAllowedCharacters.title,
      })
    )
    .min(3, "Must be at least 3 characters")
    .max(100, "Cannot exceed 100 characters")
    .meta({
      label: "Title",
      placeholder: "My post",
      allowedCharacters: postAllowedCharacters.title,
    }),
  content: z
    .string()
    .overwrite((v) =>
      getCleanTextUnicode({
        value: v,
        allowedCharacters: postAllowedCharacters.content,
      })
    )
    .min(1, "Content cannot be empty")
    .meta({
      label: "Content",
      allowedCharacters: postAllowedCharacters.content,
    }),
  status: z
    .enum(postStatusEnum.enumValues)
    .default("draft")
    .meta({ label: "Status" }),
}).strict();

// ─── WIDGET TABLE ─────────────────────────────────────────────────────────────

export const widgetCategoryEnum = pgEnum("widget_category", [
  "basic",
  "advanced",
  "premium",
]);

export type WidgetCategory = (typeof widgetCategoryEnum.enumValues)[number];

export const widget = pgTable(
  "widget",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    category: widgetCategoryEnum("category").notNull().default("basic"),
    amount: integer("amount").notNull(),
  },
  (t) => [
    uniqueIndex("widget_nano_id_idx").on(t.nanoId),
    index("widget_category_idx").on(t.category),
  ]
);

export const widgetAllowedCharacters = {
  name: {
    letters: true,
    spaces: true,
    numbers: true,
    punctuation: true,
    spanish: { letters: true },
  },
} as const satisfies Partial<
  Record<keyof typeof widget.$inferInsert, AllowedCharacters>
>;

export const selectWidgetSchema = createSelectSchema(widget);

export const insertWidgetSchema = createInsertSchema(widget, {
  name: z
    .string()
    .overwrite((v) =>
      getCleanTextUnicode({
        value: v,
        allowedCharacters: widgetAllowedCharacters.name,
      })
    )
    .min(2, "Must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters")
    .meta({
      label: "Name",
      placeholder: "My widget",
      allowedCharacters: widgetAllowedCharacters.name,
    }),
  category: z
    .enum(widgetCategoryEnum.enumValues)
    .default("basic")
    .meta({ label: "Category" }),
  amount: z
    .number()
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .meta({ label: "Amount" }),
}).strict();
