"use client";

import { z } from "zod/v4";
import { Form, useAppForm } from "@/components/form";

const schema = z.object({
  value: z
    .string()
    .meta({ label: "Phone Number", placeholder: "(555) 555-5555" }),
});

export function PhoneNumberInputDemo() {
  const form = useAppForm({
    defaultValues: { value: "" },
    validators: { onChange: schema },
    onSubmit: async () => {
      // demo only — no submission action
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="value">
        {(field) => <field.PhoneNumberInput schema={schema.shape.value} />}
      </form.AppField>
    </Form>
  );
}
