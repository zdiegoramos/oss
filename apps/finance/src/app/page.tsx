import { Dashboard } from "@/app/dashboard";

export default function Page() {
	return (
		<main className="mx-auto max-w-5xl px-4 py-8">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">Dashboard</h1>
				<p className="mt-1 text-muted-foreground text-sm">
					Overview of your recorded expenses
				</p>
			</div>

			<Dashboard />
		</main>
	);
}
