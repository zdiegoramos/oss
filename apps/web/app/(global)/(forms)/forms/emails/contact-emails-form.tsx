"use client";

import { Button } from "@oss/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@oss/ui/components/card";
import { Form, useAppForm } from "@oss/ui/components/form";
import { Input } from "@oss/ui/components/input";
import { Separator } from "@oss/ui/components/separator";
import { X } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { z } from "zod/v4";

const MAX_EMAILS = 5;

const contactEmailsSchema = z.object({
	emails: z
		.array(
			z.object({
				id: z.string(),
				value: z.email("Must be a valid email address"),
			})
		)
		.min(1, "At least one email is required")
		.max(MAX_EMAILS, `Cannot have more than ${MAX_EMAILS} email addresses`),
});

export function ContactEmailsForm() {
	const form = useAppForm({
		defaultValues: {
			emails: [{ id: nanoid(), value: "" }],
		},
		validators: {
			onChange: contactEmailsSchema,
		},
		onSubmit: ({ value }) => {
			try {
				const firstEmail = value.emails[0]?.value;
				if (!firstEmail) {
					throw new Error("No email provided");
				}
				toast("Email updated successfully.");
			} catch {
				toast("Error updating email.");
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
			<Card>
				<CardHeader>
					<div className="font-semibold text-base">Contact Emails</div>
					<div className="text-muted-foreground text-sm">
						Manage your contact email addresses.
					</div>
				</CardHeader>

				<Separator />

				<CardContent className="pt-6">
					<div className="mb-4">
						<div className="font-semibold text-sm">Email Addresses</div>
						<div className="mt-1 text-muted-foreground text-sm">
							Add up to {MAX_EMAILS} email addresses where we can contact you.
						</div>
					</div>

					<form.AppField mode="array" name="emails">
						{(field) => (
							<div className="space-y-2">
								{field.state.value.map((item, i) => (
									<form.AppField key={item.id} name={`emails[${i}].value`}>
										{(emailField) => (
											<div className="flex items-center gap-2">
												<Input
													id={emailField.name}
													name={emailField.name}
													onBlur={emailField.handleBlur}
													onChange={(e) =>
														emailField.handleChange(e.target.value)
													}
													placeholder="name@example.com"
													type="email"
													value={emailField.state.value}
												/>
												<Button
													disabled={field.state.value.length <= 1}
													onClick={() => field.removeValue(i)}
													size="icon"
													type="button"
													variant="ghost"
												>
													<X />
												</Button>
											</div>
										)}
									</form.AppField>
								))}

								<Button
									className="mt-2 w-full"
									disabled={field.state.value.length >= MAX_EMAILS}
									onClick={() => field.pushValue({ id: nanoid(), value: "" })}
									type="button"
									variant="outline"
								>
									Add Email Address
								</Button>
							</div>
						)}
					</form.AppField>
				</CardContent>

				<Separator />

				<CardFooter className="pt-6">
					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<div className="flex gap-2">
								<Button
									onClick={() => form.reset()}
									type="button"
									variant="outline"
								>
									Reset
								</Button>
								<Button disabled={!canSubmit || isSubmitting} type="submit">
									{isSubmitting ? "Saving..." : "Save"}
								</Button>
							</div>
						)}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</Form>
	);
}
