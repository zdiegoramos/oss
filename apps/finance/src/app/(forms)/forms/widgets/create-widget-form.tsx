"use client";

import type { WidgetCategory } from "@oss/db/schema";
import { insertWidgetSchema } from "@oss/db/schema";
import { Form, useAppForm } from "@oss/ui/components/form";
import { FormFooter } from "@oss/ui/components/form/form-footer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

export const createWidgetSchema = insertWidgetSchema.pick({
	name: true,
	category: true,
	amount: true,
});

const categoryItems: [string, string][] = [
	["basic", "Basic"],
	["advanced", "Advanced"],
	["premium", "Premium"],
];

export function CreateWidgetForm() {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			name: "",
			category: "",
			amount: "",
		},
		validators: {
			onChange: createWidgetSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				await orpc.widget.create({
					name: value.name,
					category: value.category as WidgetCategory,
					amount: value.amount,
				});
				toast("Widget created!");
				router.push("/forms/widgets/list");
			} catch {
				toast("Error creating widget");
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
			<form.AppField name="name">
				{(field) => <field.TextInput schema={createWidgetSchema.shape.name} />}
			</form.AppField>

			<form.AppField name="category">
				{(field) => (
					<field.SelectInput
						items={categoryItems}
						schema={createWidgetSchema.shape.category}
					/>
				)}
			</form.AppField>

			<form.AppField name="amount">
				{(field) => (
					<field.TextInput schema={createWidgetSchema.shape.amount} />
				)}
			</form.AppField>

			<FormFooter form={form} label="Create Widget" />
		</Form>
	);
}
