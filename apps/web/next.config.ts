import "@oss/env/web";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDX = createMDX({
	options: {
		remarkPlugins: ["remark-frontmatter"],
	},
});

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
