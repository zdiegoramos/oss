import { formInputMetaSchema } from "@oss/shared/zod";
import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Label } from "@oss/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@oss/ui/components/select";
import type { ZodType } from "zod/v4";
import { useFieldContext } from ".";

export function SelectInput({
	schema,
	items,
	placeholder,
}: {
	schema?: ZodType<unknown, unknown>;
	items: [string, string][];
	placeholder?: string;
}) {
	const field = useFieldContext<string>();

	let resolvedPlaceholder = placeholder;
	if (
		typeof resolvedPlaceholder === "undefined" &&
		typeof schema !== "undefined"
	) {
		resolvedPlaceholder = formInputMetaSchema.parse(schema.meta()).placeholder;
	}

	return (
		<div>
			<Label htmlFor={field.name} schema={schema} />

			<Select
				name={field.name}
				onOpenChange={(open) => {
					if (open === false) {
						field.handleBlur();
					}
				}}
				onValueChange={(e) => e && field.handleChange(e)}
				value={field.state.value}
			>
				<SelectTrigger>
					<SelectValue placeholder={resolvedPlaceholder ?? "Seleccione"} />
				</SelectTrigger>
				<SelectContent>
					{items.map(([id, displayName]) => (
						<SelectItem key={id} value={id}>
							{displayName}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldInfo field={field} />
		</div>
	);
}
