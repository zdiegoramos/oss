---
id: "0002"
title: Wireframe Playground Component Simplification
status: draft
created: 2026-04-13
---

## Problem Statement

The components that make up the wireframe playground demo are harder to read and maintain than they need to be. Specific problems:

1. `defaultCSSVariables` is duplicated verbatim in both `wireframe-code-modal.tsx` and `wireframe-config-provider.tsx` — if defaults change in one place they silently diverge.
2. `generateCode()` in the code modal uses nested template literals with embedded ternaries, making the output logic difficult to follow.
3. `corner-control.tsx` and `responsive-corner-control.tsx` both render the same "two visual toggle buttons with a selection ring" pattern, duplicating the button styling and selection logic.
4. The left and right sidebar demo blocks in `configurable-wireframe.tsx` are near-identical (~40 lines each), duplicating collapse logic, button rendering, and layout structure.
5. Prop types in `layout-controls-panel.tsx` use `ReturnType<typeof useWireframeConfig>["config"]` and similar verbose shapes instead of named types, making the signatures hard to scan.

## Solution

Simplify and deduplicate the playground-specific components without changing any observable behavior:

1. Export `defaultCSSVariables` from `wireframe-config-provider.tsx` and import it in the code modal — single source of truth for defaults.
2. Refactor `generateCode()` to build an array of JSX string parts and filter/join them — reads linearly top-to-bottom.
3. Extract a shared `LayoutPreviewButton` primitive (a button with the selection ring styling) used by both `corner-control.tsx` and `responsive-corner-control.tsx`.
4. Extract a `DemoSidebar` internal sub-component inside `configurable-wireframe.tsx` that accepts `position`, `collapsed`, and `onToggle` props.
5. Export named types (`WireframeConfig`, `WireframeCornerOptions`) from `wireframe-config-provider.tsx` and use them directly in `layout-controls-panel.tsx`.

All changes are playground/demo files only. The core `wireframe.tsx` library is out of scope.

## User Stories

1. As a developer reading `configurable-wireframe.tsx`, I want left and right sidebar rendering to share a single `DemoSidebar` component, so that the file is half as long and each concept appears once.
2. As a developer reading `wireframe-code-modal.tsx`, I want to see `generateCode()` expressed as an array of parts, so that I can add or remove output lines without untangling nested template literals.
3. As a developer reading `wireframe-code-modal.tsx`, I want `defaultCSSVariables` imported from a single source, so that I don't have to keep two copies in sync.
4. As a developer reading `corner-control.tsx`, I want the selection button to be a reusable `LayoutPreviewButton` primitive, so that the file only describes the visual layout, not button chrome.
5. As a developer reading `responsive-corner-control.tsx`, I want the same `LayoutPreviewButton` primitive, so that the ring/border selection logic lives in one place.
6. As a developer reading `layout-controls-panel.tsx`, I want sub-component prop types to use short named types, so that function signatures are scannable at a glance.
7. As a developer making a future change to default CSS variable values, I want to edit one place, so that both the config provider and the code modal stay in sync automatically.

## Implementation Decisions

### Modules modified (playground only)

- **wireframe-config-provider**: Export `defaultCSSVariables` and the named types `WireframeConfig` and `WireframeCornerOptions` so they can be imported by other modules.
- **wireframe-code-modal**: Import `defaultCSSVariables` from the config provider. Refactor `generateCode()` to collect an array of JSX string segments (nav part, left sidebar part, right sidebar part, children placeholder) and join them, rather than using nested ternary template literals.
- **layout-preview-button** (new file): A single `LayoutPreviewButton` component that wraps a `<button>` with the selection ring styling (`border-primary ring-2 ring-primary ring-offset-2` when selected, `border-border hover:border-primary/50` when not). Accepts `selected`, `onClick`, and `children`.
- **corner-control**: Use `LayoutPreviewButton` for each of the two option buttons. Simplify the 4-boolean decode of `corner` prop — derive top/bottom/left/right from the string directly.
- **responsive-corner-control**: Use `LayoutPreviewButton` for each of the two option buttons.
- **configurable-wireframe**: Extract a file-local `DemoSidebar` component that renders either left or right sidebar demo content given `position`, `collapsed`, and `onToggle`.
- **layout-controls-panel**: Replace `ReturnType<typeof useWireframeConfig>["config"]` shapes with `WireframeConfig` and `WireframeCornerOptions` imported from the config provider.

### Key constraints

- No behavior changes — the playground must look and function identically after the refactor.
- `wireframe.tsx` (core library) is not touched.
- `DemoSidebar` is a file-local component, not exported, since it is a rendering detail of the demo only.
- `LayoutPreviewButton` is a new file in the wireframe component directory since it is shared across two files.

## Testing Decisions

These are UI demo components with no business logic; automated unit tests are not warranted. The test strategy is visual: run the dev server and verify the playground renders and behaves identically before and after each change.

No test files need to be created or modified.

## Out of Scope

- `wireframe.tsx` (core library component) — complexity there is necessary and intentional.
- `sidebar-static.tsx` — already trivially simple.
- Any changes to the playground page layout or visual design.
- Adding new features to the playground.
- Accessibility improvements beyond what already exists.

## Further Notes

The duplicated `defaultCSSVariables` object is the highest-risk item because a silent divergence could cause the code modal to generate incorrect default-filtering. This should be addressed in the first issue.
