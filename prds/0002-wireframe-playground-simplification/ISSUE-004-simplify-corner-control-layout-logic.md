---
id: "004"
title: Simplify corner-control internal layout logic
prd: "0002"
status: open
type: afk
blocked_by: ["003"]
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

In `corner-control.tsx`, replace the four boolean decode variables (`isTopLeft`, `isTopRight`, `isBottomLeft`, `isBottomRight`) with direct string-based checks derived from the `corner` prop (e.g. checking whether the corner name starts with `"top"` or ends with `"Left"`). Simplify `renderNavbarDominant` and `renderSidebarDominant` so the visual layout logic reads linearly.

## Acceptance criteria

- [ ] No separate 4-boolean decode of the `corner` prop
- [ ] Corner preview thumbnails render identically to before for all four corner values
- [ ] The file is visibly shorter and linearly readable

## Blocked by

- ISSUE-003 (the `LayoutPreviewButton` refactor should land first so this issue only needs to handle the layout logic, not the button chrome)

## User stories addressed

- User story 4
