"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import type { infer as ZodInfer, ZodType } from "zod/v4";

export function useAppForm<TSchema extends ZodType>({
  schema,
  defaultValues,
  action,
}: {
  schema: TSchema;
  defaultValues: ZodInfer<TSchema>;
  action: (value: ZodInfer<TSchema>) => Promise<void>;
}) {
  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema as never,
      onSubmit: schema as never,
    },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({ onSubmit: undefined });
      try {
        await action(value as ZodInfer<TSchema>);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        formApi.setErrorMap({ onSubmit: message } as unknown as Parameters<
          typeof formApi.setErrorMap
        >[0]);
        toast.error(`Error: ${message}`);
      }
    },
  });

  return Object.assign(form, { AppField: form.Field });
}
