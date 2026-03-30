"use client";

import { toast } from "sonner";
import { Form, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import { insertBugSchema } from "@/server/db/schema";

export const reportBugSchema = insertBugSchema.pick({
  title: true,
  description: true,
});

const DESCRIPTION_MAX = 1000;

export function ReportBugForm() {
  const form = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onChange: reportBugSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await orpc.bug.create(value);
        toast("Bug report submitted!");
        form.reset();
      } catch {
        toast("Error submitting bug report");
      }
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
      <form.AppField name="title">
        {(field) => <field.TextInput schema={reportBugSchema.shape.title} />}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <div className="mb-3">
            <field.TextAreaInput schema={reportBugSchema.shape.description} />
            <p className="mb-1 text-muted-foreground text-xs">
              {field.state.value.length}/{DESCRIPTION_MAX} characters
            </p>
            <p className="text-muted-foreground text-sm">
              Include steps to reproduce, expected behavior, and what actually
              happened.
            </p>
          </div>
        )}
      </form.AppField>

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <div className="flex gap-2">
            <Button
              onClick={() => form.reset()}
              type="button"
              variant="outline"
            >
              Reset
            </Button>
            <Button disabled={!canSubmit || isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </Form>
  );
}
