---
id: "003"
title: Amortization schedule table
prd: "0001"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-03-31
---

## Parent PRD

prds/0001-amortization-calculator/PRD.md

## What to build

Add a full-width amortization schedule table below the two-column summary section. The table has two tabs — Annual Schedule and Monthly Schedule — toggled with shadcn/ui `<Tabs>`. Both tabs source their data from the already-computed result of `calculateAmortization()` (no re-computation on tab switch).

**File to create:**
- `src/app/tools/amortization/components/amortization-table.tsx` — receives `monthlySchedule` and `yearlySchedule` as props, renders `<Tabs>` + `<Table>`

**Annual tab columns:** Year | Interest | Principal | Ending Balance  
**Monthly tab columns:** Month | Interest | Principal | Ending Balance  

The table is scrollable horizontally on narrow viewports (`overflow-x-auto`). Only rendered after Calculate has been clicked (results exist).

## Acceptance criteria

- [ ] Table section only appears after Calculate is clicked (hidden when no results)
- [ ] Two tabs: "Annual Schedule" and "Monthly Schedule" using shadcn/ui `<Tabs>`
- [ ] Annual tab shows one row per year with: Year number, total Interest paid that year, total Principal paid that year, Ending Balance at year-end — all values matching `calculateAmortization()` output
- [ ] Monthly tab shows one row per month with: Month number (1–N), Interest, Principal, Ending Balance — all values matching `calculateAmortization()` output
- [ ] All monetary columns formatted as USD
- [ ] Table container has `overflow-x-auto` so it scrolls horizontally on mobile
- [ ] Switching tabs does not re-invoke `calculateAmortization()`

## Blocked by

- ISSUE-001

## User stories addressed

- User story 12 (Annual/Monthly tab toggle)
- User story 13 (annual schedule: Year, Interest, Principal, Ending Balance)
- User story 14 (monthly schedule: Month, Interest, Principal, Ending Balance)

## Completion

Built `src/app/tools/amortization/components/amortization-table.tsx` implementing the full amortization schedule table.

**Key decisions:**
- `<Tabs defaultValue="annual">` with shadcn/ui Tabs — Annual and Monthly tabs toggle without re-running calculation
- Annual tab aggregates yearly data from `yearlySchedule` prop (Year, Interest, Principal, Ending Balance)
- Monthly tab renders all rows from `monthlySchedule` prop (Month, Interest, Principal, Ending Balance)
- `overflow-x-auto` wrapper on both tab table containers for horizontal scroll on mobile
- `Intl.NumberFormat` USD formatter for all monetary columns
- Table is gated behind `result && ...` in `page.tsx` — hidden until Calculate is clicked

**Files created:**
- `src/app/tools/amortization/components/amortization-table.tsx`
