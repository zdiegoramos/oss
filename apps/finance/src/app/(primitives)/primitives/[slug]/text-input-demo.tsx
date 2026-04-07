"use client";

import { textField } from "@oss/shared/allowed-chars";
import { Form, useAppForm } from "@oss/ui/components/form";
import { z } from "zod/v4";

const schema = z.object({
	value: textField({
		chars: { preset: "prose" },
		label: "Text",
		placeholder: "Enter some text…",
	}),
});

export function TextInputDemo() {
	const form = useAppForm({
		defaultValues: { value: "" },
		validators: { onChange: schema },
		onSubmit: async () => {
			// demo only — no submission action
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
			<form.AppField name="value">
				{(field) => <field.TextInput schema={schema.shape.value} />}
			</form.AppField>
		</Form>
	);
}
