"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { UserNavigation } from "@/components/nav/navigation";
import { Button } from "@/components/ui/button";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

const planSchema = z.object({
  plan: z.enum(["basic", "pro"], {
    error: "Please select a plan",
  }),
});

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$9.99/mo",
    features: ["Feature 1", "Feature 2", "Feature 3"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19.99/mo",
    features: ["Everything in Basic", "Feature 4", "Feature 5"],
  },
] as const;

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: { plan: "basic" as "basic" | "pro" },
    validators: { onSubmit: planSchema },
    onSubmit: async ({ value }) => {
      console.log("Selected plan:", value.plan);
      setSubmitted(true);
    },
  });

  if (submitted) {
    return (
      <WireframeDefault>
        <Providers>
          <UserNavigation />
          <main className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="space-y-2 text-center">
              <h1 className="font-bold text-2xl">Thank you!</h1>
              <p className="text-muted-foreground">
                You selected the{" "}
                <span className="font-medium text-foreground">
                  {form.state.values.plan.toUpperCase()}
                </span>{" "}
                plan.
              </p>
            </div>
          </main>
        </Providers>
      </WireframeDefault>
    );
  }

  return (
    <WireframeDefault>
      <Providers>
        <UserNavigation />
        <main className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4">
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-2xl">Choose Your Plan</h1>
            <p className="text-muted-foreground text-sm">
              Select the subscription that works for you
            </p>
          </div>

          <form
            className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {PLANS.map((plan) => (
              <form.Field key={plan.id} name="plan">
                {(field) => (
                  <label
                    className={`relative flex cursor-pointer flex-col rounded-lg border-2 p-6 transition-colors ${
                      field.state.value === plan.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      className="sr-only"
                      name="plan"
                      onChange={() => field.handleChange(plan.id)}
                      type="radio"
                      value={plan.id}
                    />
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-lg">{plan.name}</span>
                      <span className="font-bold text-primary">
                        {plan.price}
                      </span>
                    </div>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature}>• {feature}</li>
                      ))}
                    </ul>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="mt-2 text-destructive text-xs">
                          {String(field.state.meta.errors[0])}
                        </p>
                      )}
                  </label>
                )}
              </form.Field>
            ))}
          </form>

          <form.Subscribe
            selector={(s) => [s.values.plan, s.isSubmitting] as const}
          >
            {([plan, isSubmitting]) => (
              <Button
                className="min-w-40"
                disabled={isSubmitting}
                onClick={() => form.handleSubmit()}
                type="button"
              >
                {isSubmitting
                  ? "Processing..."
                  : `Continue with ${plan === "basic" ? "Basic" : "Pro"}`}
              </Button>
            )}
          </form.Subscribe>
        </main>
      </Providers>
    </WireframeDefault>
  );
}
