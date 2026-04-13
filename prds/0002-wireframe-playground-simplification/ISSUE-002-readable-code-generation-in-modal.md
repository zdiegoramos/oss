---
id: "002"
title: Readable code generation in the modal
prd: "0002"
status: open
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
