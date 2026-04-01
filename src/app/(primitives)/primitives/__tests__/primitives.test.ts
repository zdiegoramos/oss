import { describe, expect, it } from "vitest";
import { PRIMITIVES_NAV } from "@/components/nav/primitives";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;

describe("PRIMITIVES_NAV", () => {
  it("contains all 14 primitives", () => {
    expect(PRIMITIVES_NAV).toHaveLength(14);
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

  it("includes all expected slugs", () => {
    const expectedSlugs = [
      "card-number-input",
      "choice-input",
      "country-code-input",
      "currency-input",
      "cvv-input",
      "date-input",
      "date-range-input",
      "decimal-input",
      "phone-number-input",
      "select-input",
      "text-area-input",
      "text-input",
      "text-input-raw",
      "username-input",
    ];
    const actualSlugs = PRIMITIVES_NAV.map((e) =>
      e.href.replace("/primitives/", "")
    );
    for (const slug of expectedSlugs) {
      expect(actualSlugs).toContain(slug);
    }
  });

  it("activePatterns include the href itself and a wildcard", () => {
    for (const entry of PRIMITIVES_NAV) {
      expect(entry.activePatterns).toContain(entry.href);
      expect(entry.activePatterns.some((p) => p.endsWith("/*"))).toBe(true);
    }
  });
});
