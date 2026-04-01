"use client";

import { z } from "zod/v4";
import { Form, useAppForm } from "@/components/form";

const schema = z.object({
  value: z.string().meta({ label: "Plan" }),
});

const items: [string, string][] = [
  ["basic", "Basic — $9.99/mo"],
  ["pro", "Pro — $19.99/mo"],
  ["enterprise", "Enterprise — $49.99/mo"],
];

export function ChoiceInputDemo() {
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
        {(field) => (
          <field.ChoiceInput
            items={items}
            mode="single"
            schema={schema.shape.value}
          />
        )}
      </form.AppField>
    </Form>
  );
}
