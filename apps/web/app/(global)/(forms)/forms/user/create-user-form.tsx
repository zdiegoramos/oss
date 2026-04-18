"use client";

import { insertUserSchema } from "@oss/db/schema";
import { Button } from "@oss/ui/components/button";
import { Form, useAppForm } from "@oss/ui/components/form";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const createUserFormSchema = insertUserSchema.pick({
	name: true,
	email: true,
});

export function CreateUserForm() {
	const router = useRouter();

	const form = useAppForm({
		defaultValues: {
			email: "",
			name: "",
		},
		validators: {
			onChange: createUserFormSchema,
		},
		onSubmit: () => {
			try {
				toast("Creating user...");

				toast("User created, redirecting...");
				router.push("/");
			} catch {
				toast("Error creating user");
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
			<form.AppField name="email">
				{(field) => (
					<field.TextInput schema={createUserFormSchema.shape.email} />
				)}
			</form.AppField>

			<form.AppField name="name">
				{(field) => (
					<field.TextInput schema={createUserFormSchema.shape.name} />
				)}
			</form.AppField>

			<form.Subscribe selector={(state) => [state.canSubmit]}>
				{([canSubmit]) => (
					<Button disabled={canSubmit === false} type="submit">
						<Save />
						Save
					</Button>
				)}
			</form.Subscribe>
		</Form>
	);
}
