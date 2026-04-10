---
id: "005"
title: User settings — DB, API, and UI
prd: "0001"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Add a `userSettings` table to the database. Implement three protected ORPC procedures: `settings.get`, `settings.update`, and `settings.testConnection`. Build a `/settings` page in the finance app with a form for the local agent URL and API key (masked), and a "Test connection" button.

See PRD §"User settings", §"New settings page", and §"ORPC invoice router".

## Acceptance criteria

- [ ] Database migration adds a `userSettings` table with `userId` (FK), `localAgentUrl` (text, nullable), `localAgentKey` (text, nullable).
- [ ] `settings.get` returns the current user's stored URL and key (or nulls if unset).
- [ ] `settings.update` saves the URL and key for the current user.
- [ ] `settings.testConnection` makes a `GET /health` request to the stored URL with the stored key and returns success or a descriptive error.
- [ ] The `/settings` page renders a form pre-populated with saved values.
- [ ] The API key field is masked (password input); shows a placeholder when a key is already saved.
- [ ] The "Test connection" button shows a success or error state after the check.
- [ ] All three procedures are protected (require authenticated session).

## Blocked by

- ISSUE-001

## User stories addressed

- User story 3 (enter local agent URL and key in settings)
- User story 4 (test connection button)
- User story 5 (warning when no URL configured)
