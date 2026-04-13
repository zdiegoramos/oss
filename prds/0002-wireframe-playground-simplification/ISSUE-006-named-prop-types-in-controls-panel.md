---
id: "006"
title: Named prop types in layout-controls-panel
prd: "0002"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

Export `WireframeConfig` and `WireframeCornerOptions` from `wireframe-config-provider.tsx`. Update `NavCornersSection` and `ResponsiveCornersSection` in `layout-controls-panel.tsx` to use those named types in their prop signatures instead of the verbose `ReturnType<typeof useWireframeConfig>["config"]` shapes.

## Acceptance criteria

- [ ] `WireframeConfig` and `WireframeCornerOptions` are exported from the config provider
- [ ] Sub-component prop types in the controls panel use the short named types
- [ ] TypeScript compiles without errors
- [ ] Controls panel behavior is unchanged

## Blocked by

- ISSUE-001 (the config provider file is already being modified in that issue — coordinate to avoid conflicts, or stack this on top)

## User stories addressed

- User story 6

## Completion

Added `export` to both `WireframeConfig` and `WireframeCornerOptions` type declarations in `wireframe-config-provider.tsx`. Updated `layout-controls-panel.tsx` to import `WireframeConfig` from the config provider and use it in the `config` prop of both `NavCornersSectionProps` and `ResponsiveCornersSectionProps`, replacing the verbose `ReturnType<typeof useWireframeConfig>["config"]` shapes. TypeScript compiles cleanly with no changes to runtime behaviour.

## Suggested Commit

DIEGO: 006 PRD-0002 — named prop types in layout-controls-panel

- packages/ui/src/components/wireframe/wireframe-config-provider.tsx: export WireframeConfig and WireframeCornerOptions
- packages/ui/src/components/wireframe/layout-controls-panel.tsx: use WireframeConfig for NavCornersSection and ResponsiveCornersSection prop types
