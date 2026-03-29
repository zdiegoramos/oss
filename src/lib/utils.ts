import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Extracts the first human-readable error message from a TanStack Form errors array. */
export function fieldError(errors: unknown[]) {
  const err = errors[0];
  if (!err) {
    return null;
  }
  if (typeof err === "string") {
    return err;
  }
  if (typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return null;
}
