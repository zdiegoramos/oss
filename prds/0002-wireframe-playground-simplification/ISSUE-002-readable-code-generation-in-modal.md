---
id: "002"
title: Readable code generation in the modal
prd: "0002"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

Refactor `generateCode()` in `wireframe-code-modal.tsx` to build an array of JSX string segments — one for the nav, one per sidebar, one for the children placeholder — then filter out empty segments and join them. Remove the dead commented-out `<Button>` from `DialogTrigger`.

## Acceptance criteria

- [ ] `generateCode()` uses array-of-parts instead of nested ternary template literals
- [ ] The commented-out `<Button>` dead code inside `DialogTrigger` is removed
- [ ] Generated code output is identical to before for all nav/sidebar combinations (top nav, bottom nav, sticky, responsive, left sidebar, right sidebar, combinations thereof)

## Blocked by

- ISSUE-001 (imports `defaultCSSVariables` from the config provider — that export must exist first)

## User stories addressed

- User story 2

## Completion

Refactored `generateCode()` in `wireframe-code-modal.tsx` to use an `innerParts: string[]` array. The nav segment is built first (using the existing `navParts.join` pattern for the "normal" case, or a direct string for "responsive"/"sticky"), then left sidebar and right sidebar segments are conditionally pushed, then the children placeholder is always pushed last. All segments are joined with `"\n\n  "` which preserves the blank-line separation between elements that existed in the original nested-ternary version. Removed the dead `sidebarStatus` array that was computed but never used. Removed the commented-out `<Button>` block from `DialogTrigger`.

## Suggested Commit

DIEGO: 002 PRD-0002 — readable code generation in the modal

- packages/ui/src/components/wireframe/wireframe-code-modal.tsx: replace nested ternary template in generateCode() with innerParts array joined with "\n\n  "
- packages/ui/src/components/wireframe/wireframe-code-modal.tsx: remove dead sidebarStatus variable and commented-out <Button> in DialogTrigger
