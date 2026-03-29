import type { z } from "zod/v4";
import { formInputMetaSchema } from "@/lib/zod";

const schema = formInputMetaSchema.shape.allowedCharacters.unwrap();

const spacesRegex = /\s+/;

export type AllowedCharacters = z.output<typeof schema>;

function cleanTextRegex({
  letters,
  numbers,
  spaces,
  punctuation,
  spanish,
}: AllowedCharacters) {
  const l = letters === true ? "A-Za-z" : "";
  const n = numbers === true ? "0-9" : "";
  const s = spaces === true ? "\\s" : "";
  const p =
    punctuation === true ? `\`~!@#$%^&*()_+\\-={}|[\\]:"“”;'‘’<>?,./\\\\` : "";
  const sl = spanish?.letters === true ? "áéíóúüñÁÉÍÓÚÜÑ" : "";
  const sp = spanish?.punctuation === true ? "¡¿" : "";

  const regex = new RegExp(`[^${l}${n}${s}${p}${sl}${sp}]`, "gu");

  return regex;
}

// function cleanTextRegex2({
// 	letters,
// 	numbers,
// 	spaces,
// 	punctuation,
// 	currencySymbols,
// }: AllowedCharacters) {
// 	const l = letters === true ? "\\p{L}" : "";
// 	const n = numbers === true ? "\\p{N}" : "";
// 	const z = spaces === true ? "\\p{Z}" : "";
// 	const p = punctuation === true ? "\\p{P}" : "";
// 	const sc = currencySymbols === true ? "\\p{Sc}" : "";

// 	const regex = new RegExp(`[^${l}${n}${z}${p}${sc}]`, "gu");

// 	return regex;
// }

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape
// https://unicode.org/reports/tr18/#General_Category_Property
// https://regexr.com/45vjd
// Remove any strange characters like emojis, special characters, etc.
export function getCleanTextUnicode({
  value,
  allowedCharacters = {},
  allowMultipleSpaces = false,
}: {
  value: string;
  allowedCharacters?: AllowedCharacters;
  allowMultipleSpaces?: boolean;
}) {
  if (allowedCharacters.newLines === true) {
    // Split by newlines to process each line separately
    const lines = value.split("\n");

    // Clean each line individually
    const cleanedLines = lines.map((line) => {
      const cleanedLine = line.replace(cleanTextRegex(allowedCharacters), "");
      if (allowMultipleSpaces === false) {
        return cleanedLine.split(spacesRegex).join(" ");
      }
      return cleanedLine;
    });

    // Rejoin with newlines to preserve original line structure
    return cleanedLines.join("\n");
  }

  const payload = value.replace(cleanTextRegex(allowedCharacters), "");

  if (allowMultipleSpaces === false) {
    return payload.split(spacesRegex).join(" ");
  }

  return payload;
}

const usernameAllowedCharacters = /[^a-z0-9_]/g;

// english alphabet, lowercase, alphanumeric plus underscore characters
// allowed but with no consecutive underscores and no underscore
// allowed at the beginning or end of the string
// https://regexr.com/8g8lf
export const usernameRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/g;

export function parseUsernameInput(value: string) {
  const payload = value
    // convert to lowercase
    .toLowerCase()
    // replace spaces with underscores
    .replace(/\s+/g, "_")
    // remove any character that is not a lowercase letter, digit, or underscore
    .replace(usernameAllowedCharacters, "")
    // replace consecutive underscores with a single underscore
    .replace(/_+/g, "_");

  return payload;
}
