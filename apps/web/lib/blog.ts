import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMetadata = {
	title: string;
	date: string;
	description?: string;
};

export type Post = {
	slug: string;
	metadata: PostMetadata;
};

const contentDir = path.join(process.cwd(), "content/blog");

export function getBlogSlugs(): string[] {
	return fs
		.readdirSync(contentDir)
		.filter((f) => f.endsWith(".mdx"))
		.map((f) => f.replace(".mdx", ""));
}

export function getBlogPost(slug: string): Post | undefined {
	const filePath = path.join(contentDir, `${slug}.mdx`);
	if (!fs.existsSync(filePath)) {
		return undefined;
	}
	const raw = fs.readFileSync(filePath, "utf8");
	const { data } = matter(raw);
	return { slug, metadata: data as PostMetadata };
}

export function getBlogPosts(): Post[] {
	const slugs = getBlogSlugs();
	const posts = slugs.map((slug) => {
		const filePath = path.join(contentDir, `${slug}.mdx`);
		const raw = fs.readFileSync(filePath, "utf8");
		const { data } = matter(raw);
		return { slug, metadata: data as PostMetadata };
	});
	return posts.sort(
		(a, b) =>
			new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
	);
}
