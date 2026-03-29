---
name: build-form
description: Build a type-safe form in this codebase following the strict form pattern. Use when creating a new form, retrofitting an existing form, or when the user says "build a form" or "add a form for [entity]". Covers schema derivation, shared hook, primitives, error handling, and submit flow.
---

You are building a form in this codebase. Follow every rule below — none are optional. The goal is that the user cannot input an invalid value, errors never cause layout shift, and the form can only submit data the database accepts.

## Tech stack

- **TanStack Form v1** (`@tanstack/react-form`) — form state
- **Zod v4** (`zod/v4`) — validation and schema derivation
- **oRPC** (`@orpc/server`, `@orpc/client`) — mutations (type-safe HTTP procedures)
- **drizzle-zod** — DB insert schemas (source of truth)
- **Sonner** — toasts

---

## Rule 1 — Schema file (`[name]-schema.ts`)

The form schema must be a strict subset of the DB insert schema. Start from `insertXxxSchema` and only `.pick()`, `.refine()`, or `.superRefine()`. Never `.extend()` with fields that don't exist in the insert schema.

```ts
// src/app/(app)/[feature]/[name]-schema.ts
import { z } from "zod/v4";
import { insertXxxSchema } from "@/server/db/schema";

export const xxxFormSchema = insertXxxSchema
  .pick({
    title: true,
    description: true,
    // ... only fields this form captures
  })
  .refine(
    (data) => { /* cross-field rule */ },
    { message: "...", path: ["fieldName"] }
  );
```

**Rules:**
- This file has zero React imports — it must be server-importable
- Do not introduce UI-only fields (no `confirmPassword`, etc.)
- TypeScript enforces the safety at the `orpc.xxx.create(value)` call: if the form schema output doesn't satisfy the procedure input, TypeScript will error

---

## Rule 2 — Default values

Use `getFormDefaults` to auto-generate defaults from the schema shape. Never write `{ title: EMPTY_STRING, ... }` by hand.

```ts
import { getFormDefaults } from "@/lib/form-defaults";

const defaultValues = getFormDefaults(xxxFormSchema, {
  // override only fields that need runtime values
  branchNanoId: app.branch.nanoId,
});
```

`getFormDefaults` produces:
- `z.string()` → `""`
- `z.array()` → `[]`
- `z.boolean()` → `false`
- `z.optional(...)` → `undefined`
- `z.object(...)` → recursively applied

The second `overrides` argument is a deep partial of the schema's input type, merged on top.

---

## Rule 3 — Shared form hook

Import the shared `useAppForm` — never call `useForm` with manual validators and error handling inside a form component.

```ts
import { useAppForm } from "@/components/form/use-app-form";
```

---

## Rule 4 — `useAppForm` API

Pass `schema` and `action`. Do not write `validators` or `onSubmit` manually.

```ts
const form = useAppForm({
  schema: xxxFormSchema,
  defaultValues,
  action: async (value) => {
    // happy path only — error handling is automatic
    toast("Guardando...");
    const result = await orpc.xxx.create(value);
    toast("Guardado.");
    router.push(`/somewhere/${result.nanoId}`);
  },
});
```

`useAppForm` automatically:
- Sets `validators: { onChange: schema, onSubmit: schema }`
- Wraps `action` in try/catch
- On error: calls `form.setErrorMap({ onSubmit: error.message })` and `toast("Error: ...")`
- Clears `errorMap` at the start of each submission attempt

---

## Rule 5 — Field errors: show after any submit attempt

`FieldInfo` shows errors when `isTouched || field.form.state.submissionAttempts > 0`. This means:
- Silent while untouched, before any submit attempt
- Immediate feedback after the user touches a field
- All errors revealed after the first failed submit attempt (even untouched fields)

This is already implemented in `src/components/form/primitives/field-info.tsx` — no action needed. Just always render `<FieldInfo field={field} />` inside every `form.AppField`.

---

## Rule 6 — Submit area: always use `<FormFooter>`

Replace any manual subscribe + button logic with:

```tsx
import { FormFooter } from "@/components/form/form-footer";

// Inside the form JSX:
<FormFooter form={form as unknown as AnyFormApi} label="Crear solicitud" />
```

`FormFooter` handles:
- **Server error display**: renders `form.state.errorMap.onSubmit` in a visible error block above the button (space is always reserved — no layout shift)
- **Disabled state**: `disabled={!canSubmit || isSubmitting}`
- **Loading state**: reflects `isSubmitting`

---

## Rule 7 — Input components: character filtering

Specialized inputs own their own character filtering. Do not add `allowedCharacters` to Zod `.meta()`.

| Field type | Use |
|---|---|
| Free text | `TextInput` |
| Long text | `TextAreaInput` |
| Currency (RD$) | `CurrencyInput` |
| Decimal number | `DecimalInput` |
| Date picker | `DateInput` |
| Cédula (11 digits) | `CedulaInput` |
| RNC (9 digits) | `RNCInput` |
| Phone number | `PhoneNumberInput` + `CountryCodeInput` |
| Enum / select | `SelectInput` |
| Radio group | `RadioGroupInput` |
| Checkbox toggle | `CheckboxInput` |
| Province | `ProvinceInput` |

---

## Rule 8 — Enum options must come from the schema

Never hardcode options for a `SelectInput` or `RadioGroupInput` when the field's schema is a `z.enum()`. Use `getEnumOptions`:

```ts
import { getEnumOptions } from "@/lib/form-enum-options";

// schema: z.enum(["draft", "active", "closed"])
<form.AppField name="status">
  {(field) => (
    <SelectInput
      field={field}
      schema={xxxFormSchema.shape.status}
      options={getEnumOptions(xxxFormSchema.shape.status)}
    />
  )}
</form.AppField>
```

`getEnumOptions` returns `{ value: string; label: string }[]` derived from `schema._zod.def.entries`. Labels are title-cased from the enum value unless a custom label map is passed as the second argument.

---

## Rule 9 — Labels from `.meta()`, override in JSX when needed

Labels, placeholders, and `required` indicators are read from the Zod schema's `.meta({ label, placeholder, info })`. The `Label` component auto-derives `required` by checking if `undefined` fails the schema.

You don't need to pass `label` in JSX for 90% of fields. Override only when context demands a different label:

```tsx
<TextInput field={field} schema={schema} label="Nombre de la sucursal" />
```

---

## Rule 10 — Cross-field validation

Use `onChangeListenTo` + `fieldApi.form.getFieldValue()` in the field-level validator:

```tsx
<form.AppField
  name="deliverDate"
  validators={{
    onChangeListenTo: ["startDate"],
    onChange: ({ value, fieldApi }) => {
      const start = fieldApi.form.getFieldValue("startDate");
      if (start && value && value < start) {
        return "La fecha de entrega debe ser posterior al inicio";
      }
    },
  }}
>
```

---

## oRPC setup

### Procedure definition (`src/server/orpc/router.ts`)

```ts
import { os } from "@orpc/server";
import { db } from "@/server/db";
import { widgets, insertWidgetSchema } from "@/server/db/schema";

export const appRouter = {
  widget: {
    create: os
      .input(insertWidgetSchema)
      .handler(async ({ input }) => {
        const [widget] = await db.insert(widgets).values(input).returning();
        if (!widget) throw new Error("Failed to create widget");
        return { widget };
      }),
  },
};

export type AppRouter = typeof appRouter;
```

### API route (`src/app/api/orpc/[...rest]/route.ts`)

```ts
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@/server/orpc/router";

const handler = new RPCHandler(appRouter);

async function handleRequest(request: Request) {
  const { matched, response } = await handler.handle(request, {
    prefix: "/api/orpc",
  });
  if (matched) {
    return response;
  }
  return new Response("Not found", { status: 404 });
}

export { handleRequest as GET, handleRequest as POST };
```

### Client (`src/lib/orpc.ts`)

```ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@/server/orpc/router";

const link = new RPCLink({ url: "/api/orpc" });
export const orpc = createORPCClient<RouterClient<AppRouter>>(link);
```

---

## File checklist

For every new form, create exactly two files:

```
src/app/(app)/[feature]/
  [name]-schema.ts   ← Zod schema, no React, server-safe
  [name]-form.tsx    ← React component, imports schema
```

---

## Complete minimal example

```ts
// create-widget-schema.ts
import { insertWidgetSchema } from "@/server/db/schema";

export const createWidgetSchema = insertWidgetSchema.pick({
  name: true,
  category: true,
  amount: true,
});
```

```tsx
// create-widget-form.tsx
"use client";
import type { AnyFieldApi, AnyFormApi } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormFooter } from "@/components/form/form-footer";
import { useAppForm } from "@/components/form/use-app-form";
import { FieldInfo } from "@/components/form/primitives/field-info";
import { Form } from "@/components/form";
import { getEnumOptions } from "@/lib/form-enum-options";
import { getFormDefaults } from "@/lib/form-defaults";
import { orpc } from "@/lib/orpc";
import { createWidgetSchema } from "./create-widget-schema";

export function CreateWidgetForm() {
  const router = useRouter();

  const form = useAppForm({
    schema: createWidgetSchema,
    defaultValues: getFormDefaults(createWidgetSchema),
    action: async (value) => {
      toast("Creating widget...");
      const { widget } = await orpc.widget.create(value);
      toast.success("Widget created.");
      router.push(`/widgets/${widget.nanoId}`);
    },
  });

  return (
    <Form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.AppField name="name">
        {(field) => (
          <>
            <TextInput field={field} schema={createWidgetSchema.shape.name} />
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </>
        )}
      </form.AppField>

      <form.AppField name="category">
        {(field) => (
          <>
            <SelectInput
              field={field}
              schema={createWidgetSchema.shape.category}
              options={getEnumOptions(createWidgetSchema.shape.category)}
            />
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </>
        )}
      </form.AppField>

      <form.AppField name="amount">
        {(field) => (
          <>
            <CurrencyInput field={field} schema={createWidgetSchema.shape.amount} />
            <FieldInfo field={field as unknown as AnyFieldApi} />
          </>
        )}
      </form.AppField>

      <FormFooter form={form as unknown as AnyFormApi} label="Create Widget" />
    </Form>
  );
}
```

---

## What NOT to do

- ❌ Manual `validators: { onChange: ..., onSubmit: ... }` inside form components — `useAppForm` handles this
- ❌ Manual `try/catch` in `onSubmit` — `useAppForm` handles this
- ❌ Manual subscribe logic for the submit button — use `<FormFooter>`
- ❌ Hardcoded options for enum fields — use `getEnumOptions`
- ❌ `allowedCharacters` in Zod `.meta()` — specialized inputs own filtering
- ❌ `.extend()` on the insert schema to add UI-only fields
- ❌ Manual `defaultValues: { field: EMPTY_STRING, ... }` — use `getFormDefaults`
- ❌ Defining oRPC procedures inside form components — keep them in `src/server/orpc/router.ts`
