"use client";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@oss/ui/components/tabs";
import { CodePreview } from "@oss/ui/components/wireframe/code-preview";
import { ConfigurableWireframe } from "@oss/ui/components/wireframe/configurable-wireframe";
import { LayoutControlsPanel } from "@oss/ui/components/wireframe/layout-controls-panel";
import { WireframeConfigProvider } from "@oss/ui/components/wireframe/wireframe-config-provider";
import { Code2 } from "lucide-react";

function PlaygroundContent() {
	return (
		<ConfigurableWireframe>
			<div className="mx-auto max-w-4xl space-y-6 p-8">
				<div className="space-y-4">
					<h1 className="font-bold text-4xl">Wireframe Playground</h1>
					<p className="text-lg text-muted-foreground">
						Customize the wireframe layout using the controls below. Adjust
						navigation types, sidebar positions, corner behaviors, and fine-tune
						spacing with CSS variables.
					</p>
				</div>

				<Tabs defaultValue="config">
					<TabsList className="mb-4">
						<TabsTrigger value="config">
							<Code2 className="mr-2 size-4" />
							Configuration
						</TabsTrigger>
						<TabsTrigger value="code">Code</TabsTrigger>
					</TabsList>
					<TabsContent value="config">
						<div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
							<LayoutControlsPanel />
						</div>
					</TabsContent>
					<TabsContent value="code">
						<CodePreview />
					</TabsContent>
				</Tabs>
			</div>
		</ConfigurableWireframe>
	);
}

export default function PlaygroundPage() {
	return (
		<WireframeConfigProvider>
			<PlaygroundContent />
		</WireframeConfigProvider>
	);
}
