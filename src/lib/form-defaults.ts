import type { ZodType } from "zod/v4";

function deriveDefaults(schema: ZodType): unknown {
  const def = (
    schema as {
      _zod: {
        def: { type: string; shape?: Record<string, ZodType>; inner?: ZodType };
      };
    }
  )._zod.def;

  switch (def.type) {
    case "string":
      return "";
    case "number":
    case "int":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "optional":
    case "nullable":
      return undefined;
    case "object": {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(def.shape ?? {})) {
        result[key] = deriveDefaults(value);
      }
      return result;
    }
    default:
      return undefined;
  }
}

function deepMerge(base: unknown, overrides: unknown): unknown {
  if (
    typeof base === "object" &&
    base !== null &&
    !Array.isArray(base) &&
    typeof overrides === "object" &&
    overrides !== null &&
    !Array.isArray(overrides)
  ) {
    const result = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(
      overrides as Record<string, unknown>
    )) {
      if (value !== undefined) {
        result[key] = deepMerge(result[key], value);
      }
    }
    return result;
  }
  if (overrides !== undefined) {
    return overrides;
  }
  return base;
}

export function getFormDefaults<T extends ZodType>(
  schema: T,
  overrides: Partial<Record<string, unknown>> = {}
): ReturnType<T["parse"]> {
  const defaults = deriveDefaults(schema);
  return deepMerge(defaults, overrides) as ReturnType<T["parse"]>;
}
