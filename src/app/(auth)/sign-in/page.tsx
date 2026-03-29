"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .max(128, "Password is too long");

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const INPUT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-input/30 px-3 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20";

export default function SignInPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: signInSchema },
    onSubmit: async () => {
      setServerError(null);
      router.push("/");
      router.refresh();
    },
  });

  return (
    <main className="flex min-h-svh items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="font-bold text-2xl">Sign in</h1>
          <p className="text-muted-foreground text-sm">
            No account yet?{" "}
            <Link className="text-foreground underline" href="/sign-up">
              Sign up
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
                <div className="flex items-center justify-between">
                  <label className="font-medium text-sm" htmlFor="password">
                    Password
                  </label>
                  <Link
                    className="text-muted-foreground text-xs underline"
                    href="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  aria-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  autoComplete="current-password"
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
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </main>
  );
}
