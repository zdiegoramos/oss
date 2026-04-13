---
id: "001"
title: Single source of truth for default CSS variables
prd: "0002"
status: open
type: afk
blocked_by: []
created: 2026-04-13
---

## Parent PRD

prds/0002-wireframe-playground-simplification/PRD.md

## What to build

Export `defaultCSSVariables` from `wireframe-config-provider.tsx`. Update `wireframe-code-modal.tsx` to import it from the config provider instead of redeclaring the same object. Delete the duplicate declaration from the modal.

See "Implementation Decisions" in the parent PRD for context on why duplication here is the highest-risk item — a silent divergence causes the modal to generate incorrect default-filtering.

## Acceptance criteria

- [ ] `defaultCSSVariables` is exported from the config provider
- [ ] The code modal imports `defaultCSSVariables` from the config provider
- [ ] No duplicate `defaultCSSVariables` object remains in the modal file
- [ ] The playground's "copy code" output is identical before and after

## Blocked by

None — can start immediately.

## User stories addressed

- User story 3
- User story 7
