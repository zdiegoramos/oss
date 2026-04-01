---
id: "001"
title: Primitives route scaffold with one primitive end-to-end
prd: "0001"
status: closed
type: afk
blocked_by: []
created: 2026-04-01
---

## Parent PRD

prds/0001-primitives-route/PRD.md

## What to build

Stand up the full `/primitives` route structure with a single primitive (`text-input`) working end-to-end. Create the nav config, layout with `PrimitivesSidebar`, a grid page with one card, and a detail page at `/primitives/text-input` with a live interactive demo. The layout must match the existing `/forms` section pattern (wireframe wrapper, responsive sidebar, back link).

## Acceptance criteria

- [x] Navigating to `/primitives` renders a grid page with at least one card (TextInput)
- [x] The card shows the primitive name, a short description, and a Lucide icon
- [x] Clicking the card navigates to `/primitives/text-input`
- [x] The detail page renders a working `TextInput` inside a minimal self-contained form
- [x] A `PrimitivesSidebar` is visible on both the grid and detail pages
- [x] The sidebar lists the primitive and highlights the active route
- [x] The sidebar contains a back link to `/primitives`
- [x] Layout matches the existing `/forms` section style
- [x] No TypeScript errors (`tsc --noEmit` passes)

## Blocked by

None — can start immediately.

## User stories addressed

- User story 1
- User story 2
- User story 3
- User story 4
- User story 5
- User story 6
- User story 7
- User story 8
- User story 9

## Completion

Created the full `/primitives` route scaffold end-to-end with `TextInput` as the first primitive:

- `src/components/nav/primitives.ts` — nav config (single source of truth for slug, name, description, icon)
- `src/components/nav/primitives-sidebar.tsx` — desktop sidebar matching the `FormsSidebar` / `ToolsSidebar` pattern
- `src/components/nav/section-nav.tsx` — added `PrimitivesNav` for mobile bottom-nav
- `src/app/(app)/primitives/layout.tsx` — layout with `WireframeDefault` + `Providers` + sidebar + mobile nav
- `src/app/(app)/primitives/page.tsx` — grid page driven by `PRIMITIVES_NAV`
- `src/app/(app)/primitives/[slug]/text-input-demo.tsx` — self-contained `TextInput` demo with its own `useAppForm` instance
- `src/app/(app)/primitives/[slug]/page.tsx` — detail page with slug→component mapping; unknown slugs call `notFound()`
- `src/app/(app)/primitives/__tests__/primitives.test.ts` — 5 passing tests covering nav config shape and slug format

TypeScript: clean (`tsc --noEmit` passes). Tests: 5/5 passing.
