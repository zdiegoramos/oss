import type { ZodType } from "zod/v4";

type EnumDef = {
  type: "enum";
  entries: Record<string, string>;
};

export function getEnumOptions(
  schema: ZodType,
  labelMap?: Record<string, string>
): { value: string; label: string }[] {
  const def = (schema as unknown as { _zod: { def: EnumDef } })._zod.def;

  if (def.type !== "enum") {
    throw new Error("getEnumOptions: schema must be a z.enum()");
  }

  return Object.keys(def.entries).map((value) => ({
    value,
    label:
      labelMap?.[value] ??
      value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}
