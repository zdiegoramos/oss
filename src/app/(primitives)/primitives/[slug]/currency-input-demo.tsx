"use client";

import { z } from "zod/v4";
import { Form, useAppForm } from "@/components/form";

const schema = z.object({
  value: z.string().meta({ label: "Amount", placeholder: "$0.00" }),
});

export function CurrencyInputDemo() {
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
          <field.CurrencyInput
            maxCharCount={10}
            maxValueCents={999_999_999}
            minValueCents={1}
            schema={schema.shape.value}
          />
        )}
      </form.AppField>
    </Form>
  );
}
