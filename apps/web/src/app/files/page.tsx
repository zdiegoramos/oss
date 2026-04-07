import { FilesClient } from "./files-client";

export default function FilesPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
			<h1 className="font-bold text-2xl">File Upload Test</h1>
			<FilesClient />
		</main>
	);
}
