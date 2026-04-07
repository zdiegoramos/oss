import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Input } from "@oss/ui/components/input";
import { Label } from "@oss/ui/components/label";
import type { AnyFieldApi } from "@tanstack/react-form";
import type { ZodType } from "zod/v4";

export function TextInputRaw({
	schema,
	useFieldContext,
	type = "text",
}: {
	schema?: ZodType<unknown, unknown>;
	useFieldContext: <_TData>() => AnyFieldApi;
	type?: string;
}) {
	const field = useFieldContext<string>();

	return (
		<div>
			<Label htmlFor={field.name} schema={schema} />
			<Input
				id={field.name}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				schema={schema}
				type={type}
				value={field.state.value}
			/>
			<FieldInfo field={field} />
		</div>
	);
}
