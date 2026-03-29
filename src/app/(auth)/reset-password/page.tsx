"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { fieldError } from "@/lib/utils";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/\d/, "Must include a number");

const resetPasswordSchema = z.object({ newPassword: passwordSchema });

const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-input/30 px-3 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { newPassword: "" },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async () => {
      if (!token) {
        return;
      }
      setServerError(null);
      router.push("/sign-in");
    },
  });

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="font-bold text-2xl">Invalid link</h1>
        <p className="text-muted-foreground">
          This reset link is missing a token. Please request a new one.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/forgot-password" />}
          variant="outline"
        >
          Request new link
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="font-bold text-2xl">Reset password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="newPassword"
          validators={{ onChange: passwordSchema, onBlur: passwordSchema }}
        >
          {(field) => (
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="newPassword">
                New password
              </label>
              <input
                aria-invalid={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                }
                autoComplete="new-password"
                className={INPUT_CLASS}
                id="newPassword"
                maxLength={128}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                value={field.state.value}
              />
              {field.state.meta.isTouched &&
                fieldError(field.state.meta.errors) && (
                  <p className="text-destructive text-xs">
                    {fieldError(field.state.meta.errors)}
                  </p>
                )}
            </div>
          )}
        </form.Field>

        {serverError && (
          <p className="text-destructive text-sm">{serverError}</p>
        )}

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Resetting…" : "Reset password"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-svh items-center justify-center">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
