import type { MDXComponents } from "mdx/types";
import NextImage from "next/image";
import Link from "next/link";

const components: MDXComponents = {
	Image: NextImage as MDXComponents["Image"],
	h1: ({ children }) => (
		<h1 className="mt-0 mb-3 font-bold font-serif text-4xl leading-tight">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-10 mb-3 font-bold font-serif text-3xl leading-tight">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mt-8 mb-3 font-bold font-serif text-2xl leading-tight">
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4 className="mt-6 mb-3 font-bold font-serif text-xl leading-tight">
			{children}
		</h4>
	),
	p: ({ children }) => <p className="mb-6">{children}</p>,
	strong: ({ children }) => <strong className="font-bold">{children}</strong>,
	em: ({ children }) => <em className="italic">{children}</em>,
	blockquote: ({ children }) => (
		<blockquote className="my-6 border-border border-l-2 pl-5 text-muted-foreground italic">
			{children}
		</blockquote>
	),
	code: ({ children }) => (
		<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
			{children}
		</code>
	),
	pre: ({ children }) => (
		<pre className="my-6 overflow-x-auto rounded-lg font-mono text-sm [&_code]:bg-transparent [&_code]:p-0">
			{children}
		</pre>
	),
	ul: ({ children }) => <ul className="mb-6 list-disc pl-6">{children}</ul>,
	ol: ({ children }) => <ol className="mb-6 list-decimal pl-6">{children}</ol>,
	li: ({ children }) => <li className="mb-1.5">{children}</li>,
	hr: () => <hr className="my-10 border-border border-t" />,
	a: ({ href, children, ...props }) => {
		if (href?.startsWith("/")) {
			return (
				<Link href={href} {...props}>
					{children}
				</Link>
			);
		}
		return (
			<a href={href} rel="noopener noreferrer" target="_blank" {...props}>
				{children}
			</a>
		);
	},
};

export function useMDXComponents(): MDXComponents {
	return components;
}
