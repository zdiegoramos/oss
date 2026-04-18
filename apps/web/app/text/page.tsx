import type { Metadata } from "next";
import { Text } from "@/app/text/text";

const BASE_URL = "https://ramoz.dev";

export const metadata: Metadata = {
	title: "Diego Ramos",
	openGraph: {
		title: "Diego Ramos",
		videos: [
			{
				url: `${BASE_URL}/og/text.mp4`,
				width: 600,
				height: 600,
				type: "video/mp4",
			},
		],
	},
	twitter: {
		card: "player",
		players: [
			{
				playerUrl: `${BASE_URL}/og/text.mp4`,
				streamUrl: `${BASE_URL}/og/text.mp4`,
				width: 600,
				height: 600,
			},
		],
	},
};

export default function Page() {
	return <Text />;
}
