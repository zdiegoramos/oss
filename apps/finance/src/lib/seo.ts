import { createSeoConfig } from "@oss/seo";

export const { generateMetadata, generateOgImage } = createSeoConfig({
	baseUrl: "https://finance.zdiego.com",
	primaryColor: "#10b981",
	siteName: "Finance",
});
