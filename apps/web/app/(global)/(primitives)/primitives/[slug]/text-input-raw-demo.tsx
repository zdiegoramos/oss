"use client";

import { Form, useAppForm, useFieldContext } from "@oss/ui/components/form";
import { z } from "zod/v4";

const schema = z.object({
	value: z
		.string()
		.meta({ label: "Raw Text", placeholder: "Unfiltered text input…" }),
});

export function TextInputRawDemo() {
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
				{(field) => (
					<field.TextInputRaw
						schema={schema.shape.value}
						useFieldContext={useFieldContext}
					/>
				)}
			</form.AppField>
		</Form>
	);
}
