import { createSeoConfig } from "@oss/seo";

export const { generateMetadata, generateOgImage } = createSeoConfig({
	baseUrl: "https://oss.zdiego.com",
	primaryColor: "#6366f1",
	siteName: "OSS",
});
