import { PRIMITIVES_NAV } from "config/primitives";
import type { ComponentType } from "react";
import { CardNumberInputDemo } from "./[slug]/card-number-input-demo";
import { ChoiceInputDemo } from "./[slug]/choice-input-demo";
import { CountryCodeInputDemo } from "./[slug]/country-code-input-demo";
import { CurrencyInputDemo } from "./[slug]/currency-input-demo";
import { CvvInputDemo } from "./[slug]/cvv-input-demo";
import { DateInputDemo } from "./[slug]/date-input-demo";
import { DateRangeInputDemo } from "./[slug]/date-range-input-demo";
import { DecimalInputDemo } from "./[slug]/decimal-input-demo";
import { PhoneNumberInputDemo } from "./[slug]/phone-number-input-demo";
import { SelectInputDemo } from "./[slug]/select-input-demo";
import { TextAreaInputDemo } from "./[slug]/text-area-input-demo";
import { TextInputDemo } from "./[slug]/text-input-demo";
import { TextInputRawDemo } from "./[slug]/text-input-raw-demo";
import { UsernameInputDemo } from "./[slug]/username-input-demo";

export const PRIMITIVE_DEMOS = {
	"card-number-input": CardNumberInputDemo,
	"choice-input": ChoiceInputDemo,
	"country-code-input": CountryCodeInputDemo,
	"currency-input": CurrencyInputDemo,
	"cvv-input": CvvInputDemo,
	"date-input": DateInputDemo,
	"date-range-input": DateRangeInputDemo,
	"decimal-input": DecimalInputDemo,
	"phone-number-input": PhoneNumberInputDemo,
	"select-input": SelectInputDemo,
	"text-area-input": TextAreaInputDemo,
	"text-input": TextInputDemo,
	"text-input-raw": TextInputRawDemo,
	"username-input": UsernameInputDemo,
} as const satisfies Record<string, ComponentType>;

export type PrimitiveSlug = keyof typeof PRIMITIVE_DEMOS;

const primitiveBySlug = Object.fromEntries(
	PRIMITIVES_NAV.map((primitive) => [
		primitive.href.replace("/primitives/", ""),
		primitive,
	])
) as Record<PrimitiveSlug, (typeof PRIMITIVES_NAV)[number]>;

export function getPrimitiveDetail(slug: PrimitiveSlug) {
	return {
		Demo: PRIMITIVE_DEMOS[slug],
		primitive: primitiveBySlug[slug],
	};
}
