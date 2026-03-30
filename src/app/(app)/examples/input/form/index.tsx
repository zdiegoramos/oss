"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { Form } from "@/components/form";
import { TextInput } from "@/components/form/primitives/text-input";
import { Button } from "@/components/ui/button";
import { useOnSubmit } from "./on-submit";
import { type CreateUserFormSchema, createUserFormSchema } from "./schema";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
  },
  formComponents: {},
});

const defaultValues: CreateUserFormSchema = {
  email: "",
  username: "",
};

export function CreateUserForm({ redirect }: { redirect: string }) {
  const onSubmit = useOnSubmit({ redirect });

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: createUserFormSchema,
    },
    onSubmit,
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => {
          const schema = createUserFormSchema.shape.email;
          return <field.TextInput {...{ useFieldContext, schema }} />;
        }}
      </form.AppField>

      <form.AppField name="username">
        {(field) => {
          const schema = createUserFormSchema.shape.username;
          return <field.TextInput {...{ useFieldContext, schema }} />;
        }}
      </form.AppField>

      <form.Subscribe selector={(state) => [state.canSubmit]}>
        {([canSubmit]) => (
          <Button disabled={canSubmit === false} type="submit">
            <Save />
            Guardar
          </Button>
        )}
      </form.Subscribe>
    </Form>
  );
}
