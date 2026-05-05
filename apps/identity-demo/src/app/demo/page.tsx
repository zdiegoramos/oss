"use client";

import type { DidDocument } from "agentcommercekit";
import { ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";

type IdentityArtifacts = {
	did: string;
	didDocument: DidDocument;
};

function ArtifactBlock({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1">
			<p className="font-medium text-muted-foreground text-xs uppercase tracking-widest">
				{label}
			</p>
			<pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-xs leading-relaxed">
				{children}
			</pre>
		</div>
	);
}

function StepCard({
	number,
	title,
	done,
	children,
}: {
	number: number;
	title: string;
	done: boolean;
	children: React.ReactNode;
}) {
	return (
		<section aria-label={title} className="space-y-6 rounded-lg border p-6">
			<div className="flex items-center gap-3">
				<span
					className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs ${
						done
							? "bg-green-100 text-green-700"
							: "bg-muted text-muted-foreground"
					}`}
				>
					{done ? "✓" : number}
				</span>
				<p className="font-semibold">{title}</p>
			</div>
			{children}
		</section>
	);
}

export default function DemoPage() {
	const [ownerLoading, setOwnerLoading] = useState(false);
	const [owner, setOwner] = useState<IdentityArtifacts | null>(null);
	const [ownerError, setOwnerError] = useState<string | null>(null);

	const [agentLoading, setAgentLoading] = useState(false);
	const [agent, setAgent] = useState<IdentityArtifacts | null>(null);
	const [agentError, setAgentError] = useState<string | null>(null);

	async function handleInitialise() {
		setOwnerLoading(true);
		setOwnerError(null);
		setOwner(null);
		setAgent(null);
		try {
			const res = await fetch("/api/demo/session", { method: "POST" });
			if (!res.ok) {
				throw new Error(`Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setOwner(data);
		} catch (err) {
			setOwnerError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setOwnerLoading(false);
		}
	}

	async function handleCreateAgent() {
		setAgentLoading(true);
		setAgentError(null);
		try {
			const res = await fetch("/api/demo/agents/client", { method: "POST" });
			if (!res.ok) {
				const body = (await res.json()) as { error?: string };
				throw new Error(body.error ?? `Server error: ${res.status}`);
			}
			const data = (await res.json()) as IdentityArtifacts;
			setAgent(data);
		} catch (err) {
			setAgentError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setAgentLoading(false);
		}
	}

	return (
		<main className="mx-auto max-w-2xl space-y-8 px-4 py-16">
			{/* Header */}
			<div className="space-y-2">
				<div className="flex items-center gap-2 font-medium text-indigo-500 text-sm">
					<ShieldCheck className="h-4 w-4" />
					ACK Identity Demo
				</div>
				<h1 className="font-bold text-2xl tracking-tight">
					Guided Identity Flow
				</h1>
				<p className="text-muted-foreground text-sm leading-relaxed">
					Walk through the ACK identity protocol step by step. Each step creates
					or exchanges identity artifacts that are rendered here for inspection.
				</p>
			</div>

			{/* Step 1 — Client Owner */}
			<StepCard done={!!owner} number={1} title="Create Client Owner">
				<p className="text-muted-foreground text-sm leading-relaxed">
					An <strong>Owner</strong> is the human or legal entity responsible for
					an agent&apos;s actions. Generating a keypair derives a{" "}
					<strong>Decentralized Identifier (DID)</strong> — a self-sovereign
					identifier anchored to no central authority.
				</p>

				{!owner && (
					<button
						className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={ownerLoading}
						onClick={handleInitialise}
						type="button"
					>
						{ownerLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Generating…
							</>
						) : (
							<>
								<ChevronRight className="h-4 w-4" />
								Initialise demo session
							</>
						)}
					</button>
				)}

				{ownerError && (
					<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
						{ownerError}
					</p>
				)}

				{owner && (
					<div className="space-y-4">
						<ArtifactBlock label="Owner DID">{owner.did}</ArtifactBlock>
						<ArtifactBlock label="DID Document">
							{JSON.stringify(owner.didDocument, null, 2)}
						</ArtifactBlock>
						<button
							className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
							onClick={handleInitialise}
							type="button"
						>
							Re-generate
						</button>
					</div>
				)}
			</StepCard>

			{/* Step 2 — Client Agent (unlocked after Step 1) */}
			{owner && (
				<StepCard done={!!agent} number={2} title="Create Client Agent">
					<p className="text-muted-foreground text-sm leading-relaxed">
						An <strong>Agent</strong> acts on behalf of its owner. The
						agent&apos;s DID document includes{" "}
						<strong>service endpoints</strong> that map to the namespaced
						app-router protocol paths — replacing the separate localhost ports
						used by the original CLI demo.
					</p>

					{!agent && (
						<button
							className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={agentLoading}
							onClick={handleCreateAgent}
							type="button"
						>
							{agentLoading ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Generating…
								</>
							) : (
								<>
									<ChevronRight className="h-4 w-4" />
									Create client agent
								</>
							)}
						</button>
					)}

					{agentError && (
						<p className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
							{agentError}
						</p>
					)}

					{agent && (
						<div className="space-y-4">
							<ArtifactBlock label="Agent DID">{agent.did}</ArtifactBlock>
							<ArtifactBlock label="DID Document">
								{JSON.stringify(agent.didDocument, null, 2)}
							</ArtifactBlock>
							<button
								className="text-muted-foreground text-xs underline transition-colors hover:text-foreground"
								onClick={handleCreateAgent}
								type="button"
							>
								Re-generate
							</button>
						</div>
					)}
				</StepCard>
			)}
		</main>
	);
}
