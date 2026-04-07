import { formatPhoneNumber } from "@oss/shared/number";
import { deleteNonDigits } from "@oss/shared/utils";
import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Input } from "@oss/ui/components/input";
import { Label } from "@oss/ui/components/label";
import type { ZodType } from "zod/v4";
import { useFieldContext } from "..";

export function PhoneNumberInput({
	schema,
}: {
	schema?: ZodType<unknown, unknown>;
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
