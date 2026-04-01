import { describe, expect, it } from "vitest";
import { PRIMITIVES_NAV } from "@/components/nav/primitives";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;

describe("PRIMITIVES_NAV", () => {
  it("contains at least one entry", () => {
    expect(PRIMITIVES_NAV.length).toBeGreaterThan(0);
  });

  it("every entry has a name, description, href, icon, and activePatterns", () => {
    for (const entry of PRIMITIVES_NAV) {
      expect(typeof entry.name).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);

      expect(typeof entry.description).toBe("string");
      expect(entry.description.length).toBeGreaterThan(0);

      expect(typeof entry.href).toBe("string");
      expect(entry.href.startsWith("/primitives/")).toBe(true);

      expect(entry.icon).toBeTruthy();

      expect(Array.isArray(entry.activePatterns)).toBe(true);
      expect(entry.activePatterns.length).toBeGreaterThan(0);
    }
  });

  it("slugs are lowercase and hyphenated", () => {
    for (const entry of PRIMITIVES_NAV) {
      const slug = entry.href.replace("/primitives/", "");
      expect(slug).toMatch(SLUG_PATTERN);
    }
  });

  it("includes text-input", () => {
    const textInput = PRIMITIVES_NAV.find(
      (e) => e.href === "/primitives/text-input"
    );
    expect(textInput).toBeDefined();
    expect(textInput?.name).toBe("Text Input");
  });

  it("activePatterns include the href itself and a wildcard", () => {
    for (const entry of PRIMITIVES_NAV) {
      expect(entry.activePatterns).toContain(entry.href);
      expect(entry.activePatterns.some((p) => p.endsWith("/*"))).toBe(true);
    }
  });
});
