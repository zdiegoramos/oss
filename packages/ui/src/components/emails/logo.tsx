import { APP } from "@oss/shared/metadata";
import { Img } from "@react-email/components";

export function Logo() {
	return (
		<div className="mb-6 flex items-baseline gap-2">
			<Img
				alt={`${APP.displayName} logo`}
				className="aspect-square size-8 object-contain"
				height="50"
				src={`https://${APP.domain}/logo.png`}
				width="50"
			/>
			<span className="font-bold text-3xl">{APP.displayName}</span>
		</div>
	);
}
