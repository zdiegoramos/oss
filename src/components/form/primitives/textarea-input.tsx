import type { AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/primitives/field-info";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFilteredInput } from "@/hooks/use-filtered-input";
import {
  type AllowedCharacters,
  getCleanTextUnicode,
} from "@/lib/allowed-chars";
import { formInputMetaSchema } from "@/lib/zod";

const MAX_ROWS = 15;

export function TextAreaInput({
  schema,
  useFieldContext,
  rows = 5,
}: {
  rows?: number;
  schema?: ZodType<unknown, unknown>;
  useFieldContext: <_TData>() => AnyFieldApi;
}) {
  const field = useFieldContext<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [dynamicRows, setDynamicRows] = useState(rows);

  let allowedCharacters: AllowedCharacters | undefined;

  if (typeof schema !== "undefined") {
    allowedCharacters = formInputMetaSchema.parse(
      schema.meta()
    ).allowedCharacters;
  }

  useEffect(() => {
    const value = field.state.value ?? "";
    const lineCount = value.split("\n").length;
    const calculatedRows = Math.min(Math.max(lineCount, rows), MAX_ROWS);
    setDynamicRows(calculatedRows);
  }, [field.state.value, rows]);

  const handleChange = useFilteredInput({
    ref: textareaRef,
    filter: (value) => getCleanTextUnicode({ value, allowedCharacters }),
    onChange: field.handleChange,
  });

  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Textarea
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={handleChange}
        ref={textareaRef}
        rows={dynamicRows}
        schema={schema}
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
