import { z } from "zod/v4";

// There's no point in creating a registry because the data could
// still be undefined
export const formInputMetaSchema = z
  .object({
    label: z.string(),
    info: z.string().optional(),
    placeholder: z.string().optional(),
    sectionHeading: z.string().optional(),
    allowedCharacters: z
      .object({
        letters: z.boolean().optional(),
        numbers: z.boolean().optional(),
        spaces: z.boolean().optional(),
        punctuation: z.boolean().optional(),
        currencySymbols: z.boolean().optional(),
        newLines: z.boolean().optional(),
        spanish: z
          .object({
            letters: z.boolean().optional(),
            punctuation: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .strict();
