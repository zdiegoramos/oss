import { parseUsernameInput } from "@oss/shared/allowed-chars";
import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Input } from "@oss/ui/components/input";
import { Label } from "@oss/ui/components/label";
import type { ZodType } from "zod/v4";
import { useFieldContext } from ".";

export function UsernameInput({
	schema,
}: {
	schema?: ZodType<unknown, unknown>;
}) {
	const field = useFieldContext<string>();

	return (
		<div>
			<Label htmlFor={field.name} schema={schema} />
			<Input
				id={field.name}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(parseUsernameInput(e.target.value))}
				schema={schema}
				value={field.state.value}
			/>
			<FieldInfo field={field} schema={schema} />
		</div>
	);
}
