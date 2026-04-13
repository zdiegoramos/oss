---
id: "005"
title: DemoSidebar internal sub-component
prd: "0002"
status: open
type: afk
blocked_by: []
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

Extract a file-local `DemoSidebar` component inside `configurable-wireframe.tsx`. It accepts `position` (`"left" | "right"`), `collapsed` (boolean), and `onToggle` (function). Replace the near-duplicate left and right sidebar demo blocks with two `<DemoSidebar>` usages — one per side.

`DemoSidebar` is not exported; it is a rendering detail of the demo only.

## Acceptance criteria

- [ ] A file-local `DemoSidebar` component exists in `configurable-wireframe.tsx`
- [ ] The left and right sidebar blocks are replaced by `<DemoSidebar position="left" ...>` and `<DemoSidebar position="right" ...>`
- [ ] Collapse/expand toggles work correctly for both sides
- [ ] `ComponentName` tooltip labels still show the correct component name for each side
- [ ] No duplicated sidebar layout markup remains between the two usages

## Blocked by

None — can start immediately.

## User stories addressed

- User story 1
