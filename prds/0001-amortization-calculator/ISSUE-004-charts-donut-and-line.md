---
id: "004"
title: Charts — donut and line
prd: "0001"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-03-31
---

## Parent PRD

prds/0001-amortization-calculator/PRD.md

## What to build

Add two recharts-based charts to the right column of the desktop layout (stacked below the summary card), using the existing `ChartContainer` wrapper from `src/components/ui/chart.tsx` and the app's chart color tokens.

**Files to create:**
- `src/app/tools/amortization/components/amortization-pie-chart.tsx` — donut chart, Principal vs. Interest
- `src/app/tools/amortization/components/amortization-line-chart.tsx` — line chart, yearly Balance / Cumulative Interest / Payment

**Donut chart:** Two segments — Principal (= totalPayments − totalInterest) and Interest (= totalInterest). Renders with a legend labeling each segment.

**Line chart:** Three lines over the loan's yearly schedule:
- Ending Balance (decreasing to 0)
- Cumulative Interest (increasing)
- Payment (flat horizontal line — constant monthly payment × 12)

X-axis: year number. Y-axis: abbreviated dollar amounts (`$200K`, `$100K`). One data point per year from `yearlySchedule`.

Both charts only render when results are available (after Calculate). Both are responsive within their container via `ChartContainer`.

## Acceptance criteria

- [ ] Donut chart renders two segments: Principal and Interest — proportions match `(totalPayments - totalInterest) / totalPayments` and `totalInterest / totalPayments`
- [ ] Donut chart has a legend (or labels) identifying Principal and Interest segments
- [ ] Line chart renders three lines: Ending Balance, Cumulative Interest, Payment — one data point per year
- [ ] Line chart X-axis labels show year numbers; Y-axis labels show abbreviated USD (e.g. `$200K`)
- [ ] Both charts use the existing `ChartContainer` component and app chart color tokens (no hardcoded hex colors)
- [ ] Both charts are hidden when no results exist (before first Calculate)
- [ ] Both charts are responsive within their column container
- [ ] Charts update correctly when user changes inputs and clicks Calculate again

## Blocked by

- ISSUE-001

## User stories addressed

- User story 10 (pie/donut chart: Principal vs. Interest proportion)
- User story 11 (line chart: Balance, Cumulative Interest, Payment over time)

## Completion

Built `amortization-pie-chart.tsx` (donut) and `amortization-line-chart.tsx` (line) and wired both into `page.tsx`.

**Key decisions:**
- `AmortizationPieChart`: `PieChart` with `innerRadius="55%"` for donut shape; two `Cell`s using `var(--color-principal)` and `var(--color-interest)` from `ChartConfig` CSS vars via `ChartContainer`; `ChartLegendContent` labels segments; tooltip formatter shows USD rounded to 0 decimal places.
- `AmortizationLineChart`: three `Line`s — `endingBalance`, `cumulativeInterest`, `annualPayment` (constant = monthlyPayment × 12, dashed); `YAxis` uses `formatAbbreviated()` for `$200K` style labels; `XAxis` shows year number; `ChartLegendContent` labels all three lines.
- All colors via `hsl(var(--chart-1/2/3))` tokens — no hardcoded hex.
- Both charts gated behind `result` state — hidden before first Calculate.
- Right column changed to `flex flex-col gap-6` to stack summary + pie + line vertically.
- `typecheck`: no errors.

**Files created:**
- `src/app/tools/amortization/components/amortization-pie-chart.tsx`
- `src/app/tools/amortization/components/amortization-line-chart.tsx`

**Files modified:**
- `src/app/tools/amortization/page.tsx`
