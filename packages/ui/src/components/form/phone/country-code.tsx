import {
	type PhoneCountryCode,
	phoneCountryCodes,
	phoneCountryCodesMapping,
} from "@oss/shared/enums/phone";
import { FieldInfo } from "@oss/ui/components/form/field-info";
import { Label } from "@oss/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@oss/ui/components/select";
import type { ZodType } from "zod/v4";
import { useFieldContext } from "..";

export function CountryCodeInput({
	schema,
}: {
	schema?: ZodType<unknown, unknown>;
}) {
	const field = useFieldContext<string>();
	return (
		<>
			<Label htmlFor={field.name} schema={schema} />
			<Select
				onOpenChange={(open) => {
					if (open === false) {
						field.handleBlur();
					}
				}}
				onValueChange={(e) => field.handleChange(e as PhoneCountryCode)}
				value={field.state.value}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select" />
				</SelectTrigger>
				<SelectContent>
					{phoneCountryCodes.map((code) => (
						<SelectItem key={code} value={code}>
							{code} {phoneCountryCodesMapping[code]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldInfo field={field} />
		</>
	);
}
