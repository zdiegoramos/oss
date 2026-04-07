import { type CharSpec, getCleanTextUnicode } from "@oss/shared/allowed-chars";
import { formInputMetaSchema } from "@oss/shared/zod";
import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Input } from "@oss/ui/components/input";
import { Label } from "@oss/ui/components/label";
import { useFilteredInput } from "@oss/ui/hooks/use-filtered-input";
import { useRef } from "react";
import type { ZodType } from "zod/v4";
import { useFieldContext } from ".";

export function TextInput({ schema }: { schema?: ZodType<unknown, unknown> }) {
	const field = useFieldContext<string>();
	const inputRef = useRef<HTMLInputElement>(null);

	let chars: CharSpec | undefined;

	if (typeof schema !== "undefined") {
		chars = formInputMetaSchema.parse(schema.meta()).chars;
	}

	const handleChange = useFilteredInput({
		ref: inputRef,
		filter: (value) => getCleanTextUnicode({ value, chars }),
		onChange: field.handleChange,
	});

	return (
		<div>
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
		</div>
	);
}
