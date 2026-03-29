"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { fieldError } from "@/lib/utils";

const emailSchema = z
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .regex(/^[\x20-\x7E]+$/, "Email must only contain standard characters");

const NON_ASCII_RE = /[^\x20-\x7E]/;

const forgotPasswordSchema = z.object({ email: emailSchema });

const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-input/30 px-3 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgotPasswordSchema },
    onSubmit: async () => {
      setServerError(null);
      setSuccess(true);
    },
  });

  if (success) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="font-bold text-2xl">Check your email</h1>
          <p className="text-muted-foreground">
            If an account exists for that address, a password reset link has
            been sent.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/sign-in" />}
            variant="outline"
          >
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl">Forgot password</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email and we'll send you a reset link.
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
            name="email"
            validators={{ onChange: emailSchema, onBlur: emailSchema }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="font-medium text-sm" htmlFor="email">
                  Email
                </label>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  autoComplete="email"
                  className={INPUT_CLASS}
                  id="email"
                  maxLength={254}
                  onBeforeInput={(e) => {
                    const data = (e.nativeEvent as InputEvent).data;
                    if (data && NON_ASCII_RE.test(data)) {
                      e.preventDefault();
                    }
                  }}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
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
                {isSubmitting ? "Sending…" : "Send reset link"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-center text-sm">
          <Link className="text-muted-foreground underline" href="/sign-in">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
