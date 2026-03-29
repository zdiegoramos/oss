"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { fieldError } from "@/lib/utils";

const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters")
  .regex(
    /^[\p{L}\p{M}\s'\-.]+$/u,
    "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
  );

const emailSchema = z
  .email("Invalid email address")
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .regex(/^[\x20-\x7E]+$/, "Email must only contain standard characters");

const NON_ASCII_RE = /[^\x20-\x7E]/;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/\d/, "Must include a number");

const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-input/30 px-3 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20";

export default function SignUpPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    validators: { onSubmit: signUpSchema },
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
            A verification link has been sent. Please verify your email before
            signing in.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/sign-in" />}
            variant="outline"
          >
            Go to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl">Create an account</h1>
          <p className="text-muted-foreground text-sm">
            Already have one?{" "}
            <Link className="text-foreground underline" href="/sign-in">
              Sign in
            </Link>
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
            name="name"
            validators={{ onChange: nameSchema, onBlur: nameSchema }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="font-medium text-sm" htmlFor="name">
                  Name
                </label>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  autoComplete="name"
                  className={INPUT_CLASS}
                  id="name"
                  maxLength={50}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
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

          <form.Field
            name="password"
            validators={{ onChange: passwordSchema, onBlur: passwordSchema }}
          >
            {(field) => (
              <div className="space-y-1">
                <label className="font-medium text-sm" htmlFor="password">
                  Password
                </label>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  autoComplete="new-password"
                  className={INPUT_CLASS}
                  id="password"
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
                {isSubmitting ? "Creating account…" : "Sign up"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </main>
  );
}
