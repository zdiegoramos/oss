import type { AnyFieldApi } from "@tanstack/react-form";
import { useRef } from "react";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/primitives/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFilteredInput } from "@/hooks/use-filtered-input";
import {
  type AllowedCharacters,
  getCleanTextUnicode,
} from "@/lib/allowed-chars";
import { formInputMetaSchema } from "@/lib/zod";

export function TextInput({
  schema,
  useFieldContext,
}: {
  schema?: ZodType<unknown, unknown>;
  useFieldContext: <_TData>() => AnyFieldApi;
}) {
  const field = useFieldContext<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  let allowedCharacters: AllowedCharacters | undefined;

  if (typeof schema !== "undefined") {
    allowedCharacters = formInputMetaSchema.parse(
      schema.meta()
    ).allowedCharacters;
  }

  const handleChange = useFilteredInput({
    ref: inputRef,
    filter: (value) => getCleanTextUnicode({ value, allowedCharacters }),
    onChange: field.handleChange,
  });

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Input
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        ref={inputRef}
        schema={schema}
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
