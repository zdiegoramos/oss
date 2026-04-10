---
id: "008"
title: PDF support in cloud mode
prd: "0001"
status: open
type: afk
blocked_by: ["007"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Extend the cloud extraction module to handle PDFs. When the MIME type is `application/pdf`, install `poppler-utils` in the Vercel Sandbox via `dnf`, run `pdftoppm` to render the first page as a JPEG, then compress and extract via Claude Haiku. This completes full feature parity between local and cloud modes.

See PRD §"Online extraction module" (PDF handling section) and §"Further Notes" (snapshot optimization note).

## Acceptance criteria

- [ ] `invoice.extract` with `mode = "cloud"` and a valid PDF returns a correctly shaped `OllamaExtraction`.
- [ ] Only the first page of a multi-page PDF is processed.
- [ ] The rendered page is compressed (≤ 1024px, JPEG 85%) before being sent to Claude.
- [ ] A malformed PDF returns a descriptive error rather than a sandbox crash.
- [ ] Integration test (skipped without `VERCEL_OIDC_TOKEN` + `ANTHROPIC_API_KEY`) verifies full flow with a sample PDF.

## Blocked by

- ISSUE-007

## User stories addressed

- User story 8 (upload PDF in cloud mode)
- User story 11 (first page only)
