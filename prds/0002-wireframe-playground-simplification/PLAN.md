# Plan: Wireframe Playground Component Simplification

> Source PRD: prds/0002-wireframe-playground-simplification/PRD.md

## Architectural decisions

- **Scope**: Playground-specific components only — `wireframe.tsx` is untouched.
- **New shared primitive**: `LayoutPreviewButton` is a new file in `packages/ui/src/components/wireframe/` since it is shared by two files.
- **`DemoSidebar`**: File-local component inside `configurable-wireframe.tsx`, not exported.
- **Exports from config provider**: `defaultCSSVariables`, `WireframeConfig`, and `WireframeCornerOptions` are exported from `wireframe-config-provider.tsx` so other modules can import rather than duplicate.
- **No behavior changes**: All changes are pure refactors — playground must look and function identically after every phase.

---

## Phase 1: Single source of truth for default CSS variables

**User stories**: 3, 7

### What to build

Export `defaultCSSVariables` from `wireframe-config-provider.tsx`. Update `wireframe-code-modal.tsx` to import it instead of redeclaring the same object. Delete the duplicate declaration from the modal.

### Acceptance criteria

- [ ] `defaultCSSVariables` is exported from the config provider
- [ ] The code modal imports `defaultCSSVariables` from the config provider
- [ ] No duplicate `defaultCSSVariables` object exists in the modal
- [ ] The playground's "copy code" output is identical before and after

---

## Phase 2: Readable code generation in the modal

**User stories**: 2

### What to build

Refactor `generateCode()` in the code modal to build an array of JSX string segments — one for the nav, one per sidebar, one for the children placeholder — then filter out empty segments and join them. Remove the dead commented-out `<Button>` from `DialogTrigger`.

### Acceptance criteria

- [ ] `generateCode()` uses array-of-parts instead of nested ternary template literals
- [ ] The commented-out `<Button>` dead code is removed
- [ ] Generated code output is identical to before for all nav/sidebar combinations

---

## Phase 3: Shared `LayoutPreviewButton` primitive

**User stories**: 4, 5

### What to build

Create a `LayoutPreviewButton` component in the wireframe component directory. It wraps a `<button>` with the selection ring styling (`border-primary ring-2 ring-primary ring-offset-2` when selected, `border-border hover:border-primary/50` when not). Update `corner-control.tsx` and `responsive-corner-control.tsx` to use it for their option buttons.

### Acceptance criteria

- [ ] `LayoutPreviewButton` exists as a new file accepting `selected`, `onClick`, and `children`
- [ ] Both `corner-control.tsx` and `responsive-corner-control.tsx` use `LayoutPreviewButton`
- [ ] No duplicated button border/ring class strings remain across those two files
- [ ] All corner and responsive corner toggles work visually identically

---

## Phase 4: Simplify `corner-control.tsx` internal layout logic

**User stories**: 4

### What to build

Replace the 4 separate boolean variables (`isTopLeft`, `isTopRight`, `isBottomLeft`, `isBottomRight`) with direct string-based checks (e.g., `corner.startsWith('top')`, `corner.endsWith('Left')`). Simplify `renderNavbarDominant` and `renderSidebarDominant` to read more cleanly.

### Acceptance criteria

- [ ] No 4-boolean decode of the `corner` prop
- [ ] Corner preview thumbnails render identically to before
- [ ] Code is visibly shorter and linearly readable

---

## Phase 5: `DemoSidebar` internal sub-component

**User stories**: 1

### What to build

Extract a file-local `DemoSidebar` component inside `configurable-wireframe.tsx`. It accepts `position` (`"left" | "right"`), `collapsed` (boolean), and `onToggle` (function). Replace the duplicated left/right sidebar blocks with two `<DemoSidebar>` usages.

### Acceptance criteria

- [ ] A file-local `DemoSidebar` component exists in `configurable-wireframe.tsx`
- [ ] The left and right sidebar demo blocks are replaced by `<DemoSidebar position="left" ...>` and `<DemoSidebar position="right" ...>`
- [ ] Collapse/expand toggles work identically for both sides
- [ ] `ComponentName` tooltip labels still show correct component name per side

---

## Phase 6: Named prop types in `layout-controls-panel.tsx`

**User stories**: 6

### What to build

Export `WireframeConfig` and `WireframeCornerOptions` from `wireframe-config-provider.tsx`. Update `NavCornersSection` and `ResponsiveCornersSection` in `layout-controls-panel.tsx` to use those named types instead of `ReturnType<typeof useWireframeConfig>[...]` shapes.

### Acceptance criteria

- [ ] `WireframeConfig` and `WireframeCornerOptions` are exported from the config provider
- [ ] Sub-component prop types in the controls panel use the short named types
- [ ] TypeScript compiles without errors
- [ ] Controls panel behavior is unchanged
