"use client";

import { insertPlanSchema } from "@oss/db/schema";
import { Form, useAppForm } from "@oss/ui/components/form";
import { FormFooter } from "@oss/ui/components/form/form-footer";
import { toast } from "sonner";

export const selectPlanFormSchema = insertPlanSchema.pick({
	type: true,
});

const planItems: [string, string][] = [
	["basic", "Basic — $9.99/mo"],
	["pro", "Pro — $19.99/mo"],
] as const;

export function SelectPlanForm() {
	const form = useAppForm({
		defaultValues: {
			type: "",
		},
		validators: {
			onChange: selectPlanFormSchema,
		},
		onSubmit: () => {
			try {
				toast("Plan selected!");
			} catch {
				toast("Error selecting plan");
			}
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
			<form.AppField name="type">
				{(field) => (
					<field.ChoiceInput
						items={planItems}
						mode="single"
						schema={selectPlanFormSchema.shape.type}
					/>
				)}
			</form.AppField>

			<FormFooter form={form} label="Continue" />
		</Form>
	);
}
