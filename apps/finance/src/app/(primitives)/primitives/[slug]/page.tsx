import { PRIMITIVES_NAV } from "@oss/ui/components/nav/primitives";
import { notFound } from "next/navigation";
import { CardNumberInputDemo } from "./card-number-input-demo";
import { ChoiceInputDemo } from "./choice-input-demo";
import { CountryCodeInputDemo } from "./country-code-input-demo";
import { CurrencyInputDemo } from "./currency-input-demo";
import { CvvInputDemo } from "./cvv-input-demo";
import { DateInputDemo } from "./date-input-demo";
import { DateRangeInputDemo } from "./date-range-input-demo";
import { DecimalInputDemo } from "./decimal-input-demo";
import { PhoneNumberInputDemo } from "./phone-number-input-demo";
import { SelectInputDemo } from "./select-input-demo";
import { TextAreaInputDemo } from "./text-area-input-demo";
import { TextInputDemo } from "./text-input-demo";
import { TextInputRawDemo } from "./text-input-raw-demo";
import { UsernameInputDemo } from "./username-input-demo";

const DEMO_MAP: Record<string, React.ComponentType> = {
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
};

export default async function PrimitiveDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const Demo = DEMO_MAP[slug];
	const primitive = PRIMITIVES_NAV.find(
		(p) => p.href === `/primitives/${slug}`
	);

	if (!(Demo && primitive)) {
		notFound();
	}

	return (
		<main className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">{primitive.name}</h1>
				<p className="text-muted-foreground text-sm">{primitive.description}</p>
			</div>

			<div className="max-w-prose">
				<Demo />
			</div>
		</main>
	);
}
