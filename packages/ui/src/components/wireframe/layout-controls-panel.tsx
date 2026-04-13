"use client";

import { Label } from "@oss/ui/components/label";
import { Slider } from "@oss/ui/components/slider";
import type { WireframeCSSVariables } from "@oss/ui/components/wireframe";
import { CornerControl } from "@oss/ui/components/wireframe/corner-control";
import { NavControl } from "@oss/ui/components/wireframe/nav-control";
import { ResponsiveCornerControl } from "@oss/ui/components/wireframe/responsive-corner-control";
import { SidebarControl } from "@oss/ui/components/wireframe/sidebar-control";
import type { WireframeConfig } from "@oss/ui/components/wireframe/wireframe-config-provider";
import { useWireframeConfig } from "@oss/ui/components/wireframe/wireframe-config-provider";

// Tailwind spacing scale values (in multiples of 0.25rem/4px)
const SPACING_OPTIONS = [
	{ label: "0", value: 0 },
	{ label: "1 (4px)", value: 1 },
	{ label: "2 (8px)", value: 2 },
	{ label: "3 (12px)", value: 3 },
	{ label: "4 (16px)", value: 4 },
	{ label: "6 (24px)", value: 6 },
	{ label: "8 (32px)", value: 8 },
	{ label: "10 (40px)", value: 10 },
	{ label: "12 (48px)", value: 12 },
	{ label: "16 (64px)", value: 16 },
	{ label: "20 (80px)", value: 20 },
	{ label: "24 (96px)", value: 24 },
	{ label: "32 (128px)", value: 32 },
	{ label: "40 (160px)", value: 40 },
	{ label: "48 (192px)", value: 48 },
	{ label: "56 (224px)", value: 56 },
	{ label: "64 (256px)", value: 64 },
];

type CSSVariableGroup =
	| "sticky-nav"
	| "top-nav"
	| "bottom-nav"
	| "left-sidebar"
	| "right-sidebar";

const CSS_VARIABLE_GROUPS: Record<
	CSSVariableGroup,
	{
		label: string;
		variables: Array<{
			key: string;
			label: string;
			min: number;
			max: number;
			defaultIndex: number;
		}>;
	}
> = {
	"sticky-nav": {
		label: "Sticky Nav",
		variables: [
			{
				key: "--sticky-nav-height",
				label: "Height",
				min: 0,
				max: 16,
				defaultIndex: 12,
			},
			{
				key: "--sticky-nav-top-offset",
				label: "Top Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
		],
	},
	"top-nav": {
		label: "Top Nav",
		variables: [
			{
				key: "--top-nav-height",
				label: "Height",
				min: 0,
				max: 16,
				defaultIndex: 12,
			},
			{
				key: "--top-nav-left-offset",
				label: "Left Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--top-nav-right-offset",
				label: "Right Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--top-nav-top-offset",
				label: "Top Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--top-nav-bottom-offset",
				label: "Bottom Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
		],
	},
	"bottom-nav": {
		label: "Bottom Nav",
		variables: [
			{
				key: "--bottom-nav-height",
				label: "Height",
				min: 0,
				max: 16,
				defaultIndex: 6,
			},
			{
				key: "--bottom-nav-left-offset",
				label: "Left Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--bottom-nav-right-offset",
				label: "Right Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--bottom-nav-top-offset",
				label: "Top Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--bottom-nav-bottom-offset",
				label: "Bottom Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
		],
	},
	"left-sidebar": {
		label: "Left Sidebar",
		variables: [
			{
				key: "--left-sidebar-width-collapsed",
				label: "Width (Collapsed)",
				min: 0,
				max: 16,
				defaultIndex: 12,
			},
			{
				key: "--left-sidebar-width-expanded",
				label: "Width (Expanded)",
				min: 0,
				max: 16,
				defaultIndex: 15,
			},
			{
				key: "--left-sidebar-left-offset",
				label: "Left Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--left-sidebar-right-offset",
				label: "Right Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--left-sidebar-top-offset",
				label: "Top Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--left-sidebar-bottom-offset",
				label: "Bottom Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
		],
	},
	"right-sidebar": {
		label: "Right Sidebar",
		variables: [
			{
				key: "--right-sidebar-width-collapsed",
				label: "Width (Collapsed)",
				min: 0,
				max: 16,
				defaultIndex: 12,
			},
			{
				key: "--right-sidebar-width-expanded",
				label: "Width (Expanded)",
				min: 0,
				max: 16,
				defaultIndex: 15,
			},
			{
				key: "--right-sidebar-left-offset",
				label: "Left Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--right-sidebar-right-offset",
				label: "Right Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--right-sidebar-top-offset",
				label: "Top Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
			{
				key: "--right-sidebar-bottom-offset",
				label: "Bottom Offset",
				min: 0,
				max: 16,
				defaultIndex: 0,
			},
		],
	},
};

type NavCornersSectionProps = {
	config: WireframeConfig;
	updateCorner: ReturnType<typeof useWireframeConfig>["updateCorner"];
};

function NavCornersSection({ config, updateCorner }: NavCornersSectionProps) {
	const hasTopLeft = config.showTopNav && config.showLeftSidebar;
	const hasTopRight = config.showTopNav && config.showRightSidebar;
	const hasBottomLeft = config.showBottomNav && config.showLeftSidebar;
	const hasBottomRight = config.showBottomNav && config.showRightSidebar;

	if (!(hasTopLeft || hasTopRight || hasBottomLeft || hasBottomRight)) {
		return null;
	}

	return (
		<div className="space-y-2">
			<Label className="font-semibold text-sm">Nav Corners</Label>
			<div className="grid grid-cols-2 gap-6">
				{hasTopLeft && (
					<CornerControl
						corner="topLeft"
						onSelect={(value) => updateCorner("topLeft", value)}
						selected={config.corners.topLeft}
					/>
				)}
				{hasTopRight && (
					<CornerControl
						corner="topRight"
						onSelect={(value) => updateCorner("topRight", value)}
						selected={config.corners.topRight}
					/>
				)}
				{hasBottomLeft && (
					<CornerControl
						corner="bottomLeft"
						onSelect={(value) => updateCorner("bottomLeft", value)}
						selected={config.corners.bottomLeft}
					/>
				)}
				{hasBottomRight && (
					<CornerControl
						corner="bottomRight"
						onSelect={(value) => updateCorner("bottomRight", value)}
						selected={config.corners.bottomRight}
					/>
				)}
			</div>
		</div>
	);
}

type ResponsiveCornersSectionProps = {
	config: WireframeConfig;
	updateResponsiveCorner: ReturnType<
		typeof useWireframeConfig
	>["updateResponsiveCorner"];
};

function ResponsiveCornersSection({
	config,
	updateResponsiveCorner,
}: ResponsiveCornersSectionProps) {
	if ((config.showLeftSidebar || config.showRightSidebar) === false) {
		return null;
	}

	return (
		<div className="space-y-2">
			<Label className="font-semibold text-sm">Responsive Nav Corners</Label>
			<div className="grid grid-cols-2 gap-3">
				{config.showLeftSidebar && (
					<ResponsiveCornerControl
						onSelect={(value) => updateResponsiveCorner("left", value)}
						selected={config.corners.responsive.left}
						side="left"
					/>
				)}
				{config.showRightSidebar && (
					<ResponsiveCornerControl
						onSelect={(value) => updateResponsiveCorner("right", value)}
						selected={config.corners.responsive.right}
						side="right"
					/>
				)}
			</div>
		</div>
	);
}

export function LayoutControlsPanel() {
	const {
		config,
		updateConfig,
		updateCSSVariable,
		updateCorner,
		updateResponsiveCorner,
	} = useWireframeConfig();

	const getSpacingIndex = (cssValue: number | undefined): number => {
		if (cssValue === undefined) {
			return 0;
		}
		const index = SPACING_OPTIONS.findIndex((opt) => opt.value === cssValue);
		return index >= 0 ? index : 0;
	};

	const handleSliderChange = (key: string, values: number[]) => {
		const spacingValue = SPACING_OPTIONS[values[0] ?? "0"]?.value ?? 0;
		updateCSSVariable(key as WireframeCSSVariables, spacingValue);
	};

	// Determine which CSS variable groups should be visible
	const visibleGroups: CSSVariableGroup[] = [];

	if (config.navType === "sticky") {
		visibleGroups.push("sticky-nav");
	}

	if (config.navType === "normal" || config.navType === "responsive") {
		visibleGroups.push("top-nav", "bottom-nav");
	}

	if (config.showLeftSidebar) {
		visibleGroups.push("left-sidebar");
	}

	if (config.showRightSidebar) {
		visibleGroups.push("right-sidebar");
	}

	return (
		<div className="space-y-6">
			{/* Nav Type Selection */}
			<div className="space-y-2">
				<Label className="font-semibold text-sm">Navigation Type</Label>
				<div className="flex flex-wrap justify-start gap-3">
					<NavControl
						enabled={config.navType === "normal" && config.showTopNav}
						label="Top Nav"
						onToggle={() => {
							if (config.navType === "normal") {
								updateConfig("showTopNav", !config.showTopNav);
							} else {
								updateConfig("navType", "normal");
								updateConfig("showTopNav", true);
							}
						}}
						type="top"
					/>
					<NavControl
						enabled={config.navType === "normal" && config.showBottomNav}
						label="Bottom Nav"
						onToggle={() => {
							if (config.navType === "normal") {
								updateConfig("showBottomNav", !config.showBottomNav);
							} else {
								updateConfig("navType", "normal");
								updateConfig("showBottomNav", true);
							}
						}}
						type="bottom"
					/>
					<NavControl
						enabled={config.navType === "sticky"}
						label="Sticky"
						onToggle={() => updateConfig("navType", "sticky")}
						type="sticky"
					/>
					<NavControl
						enabled={config.navType === "responsive"}
						label="Responsive"
						onToggle={() => updateConfig("navType", "responsive")}
						type="responsive"
					/>
				</div>
			</div>

			{/* Sidebar Controls */}
			<div className="space-y-3">
				<Label className="font-semibold text-sm">Sidebars</Label>
				<div className="flex gap-3">
					<div className="flex flex-col items-center gap-1">
						<SidebarControl
							enabled={config.showLeftSidebar}
							onToggle={() =>
								updateConfig("showLeftSidebar", !config.showLeftSidebar)
							}
							side="left"
						/>
						<Label className="text-xs">Left</Label>
					</div>
					<div className="flex flex-col items-center gap-1">
						<SidebarControl
							enabled={config.showRightSidebar}
							onToggle={() =>
								updateConfig("showRightSidebar", !config.showRightSidebar)
							}
							side="right"
						/>
						<Label className="text-xs">Right</Label>
					</div>
				</div>
			</div>

			{/* Nav Corners (for normal nav) */}
			{config.navType === "normal" && (
				<NavCornersSection config={config} updateCorner={updateCorner} />
			)}

			{/* Responsive Nav Corners */}
			{config.navType === "responsive" && (
				<ResponsiveCornersSection
					config={config}
					updateResponsiveCorner={updateResponsiveCorner}
				/>
			)}

			{/* CSS Variables */}
			{visibleGroups.length > 0 && (
				<div className="space-y-4">
					<Label className="font-semibold text-sm">CSS Variables</Label>
					{visibleGroups.map((groupKey) => {
						const group = CSS_VARIABLE_GROUPS[groupKey];
						return (
							<div className="space-y-3" key={groupKey}>
								<Label className="font-medium text-muted-foreground text-xs">
									{group.label}
								</Label>
								{group.variables.map((variable) => {
									const currentIndex = getSpacingIndex(
										config.cssVariables[
											variable.key as keyof typeof config.cssVariables
										]
									);
									return (
										<div className="space-y-1" key={variable.key}>
											<div className="flex items-center justify-between">
												<Label className="text-xs">{variable.label}</Label>
												<span className="text-muted-foreground text-xs">
													{SPACING_OPTIONS[currentIndex]?.label}
												</span>
											</div>
											<Slider
												className="w-full"
												max={SPACING_OPTIONS.length - 1}
												onValueChange={(values) =>
													handleSliderChange(variable.key, values as number[])
												}
												step={1}
												value={[currentIndex]}
											/>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
