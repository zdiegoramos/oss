import type { AnyFieldApi } from "@tanstack/react-form";
import type { ZodType } from "zod/v4";
import { FieldInfo } from "@/components/form/primitives/field-info";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneNumber } from "@/lib/number";
import { deleteNonDigits } from "@/validation/utils";

export function PhoneNumberInput({
  schema,
  useFieldContext,
}: {
  schema?: ZodType<unknown, unknown>;
  useFieldContext: <_TData>() => AnyFieldApi;
}) {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name} schema={schema} />
      <Input
        autoComplete="off"
        autoCorrect="off"
        className="w-40"
        id={field.name}
        inputMode="numeric"
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => {
          const value = deleteNonDigits(e.target.value).slice(0, 10);

          field.handleChange(formatPhoneNumber(value));
        }}
        schema={schema}
        spellCheck="false"
        type="text"
        value={field.state.value}
      />
      <FieldInfo field={field} />
    </>
  );
}
