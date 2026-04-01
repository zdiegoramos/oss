"use client";

import { z } from "zod/v4";
import { Form, useAppForm } from "@/components/form";

const schema = z.object({
  value: z.string().meta({ label: "Colour", placeholder: "Pick a colour…" }),
});

const items: [string, string][] = [
  ["red", "Red"],
  ["green", "Green"],
  ["blue", "Blue"],
];

export function SelectInputDemo() {
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
          <field.SelectInput items={items} schema={schema.shape.value} />
        )}
      </form.AppField>
    </Form>
  );
}
