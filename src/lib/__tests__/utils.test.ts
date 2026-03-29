import { describe, expect, it } from "vitest";
import { cn, fieldError } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("resolves Tailwind conflicts — last value wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("ignores falsy values", () => {
    expect(cn("text-sm", false, undefined)).toBe("text-sm");
  });
});

describe("fieldError", () => {
  it("returns null for an empty array", () => {
    expect(fieldError([])).toBeNull();
  });

  it("returns a string error as-is", () => {
    expect(fieldError(["Required"])).toBe("Required");
  });

  it("extracts the message from an error object", () => {
    expect(fieldError([{ message: "Too short" }])).toBe("Too short");
  });

  it("returns null when the first error is undefined", () => {
    expect(fieldError([undefined])).toBeNull();
  });
});
