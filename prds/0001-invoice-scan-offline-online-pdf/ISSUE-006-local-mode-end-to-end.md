---
id: "006"
title: Local mode end-to-end in the deployed app
prd: "0001"
status: open
type: afk
blocked_by: ["003", "004", "005"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Wire up the Local mode path in the deployed finance app. `invoice.extract` gains a `mode` field and dispatches to an HTTP client that calls the user's saved local agent. The drop zone gains a Local/Cloud toggle, an inline warning when local mode is selected but no agent URL is configured, and mode-specific loading messages.

See PRD §"ORPC invoice router (modified)" and §"UI changes in drop zone".

## Acceptance criteria

- [ ] The drop zone renders a visible "Local" / "Cloud" toggle.
- [ ] Selecting "Local" with no saved agent URL shows an inline warning linking to `/settings`.
- [ ] `invoice.extract` with `mode = "local"` calls the user's saved local agent and returns the extraction result.
- [ ] A clear toast error is shown if the agent is unreachable (network error, 401, timeout).
- [ ] Loading state shows "Extracting with local agent…" during local mode extraction.
- [ ] The existing review → save → create invoice workflow is unchanged after extraction.
- [ ] Unit tests cover: local mode with no saved URL → descriptive error, local mode with agent returning 401 → descriptive error.

## Blocked by

- ISSUE-003
- ISSUE-004
- ISSUE-005

## User stories addressed

- User story 1 (toggle between Local and Cloud)
- User story 2 (selected mode visible before drop)
- User story 5 (warning when no URL configured)
- User story 6 (PDF extraction in local mode)
- User story 7 (error when agent unreachable)
- User story 13 (mode-specific loading message)
- User story 14 (clear error on failure)
