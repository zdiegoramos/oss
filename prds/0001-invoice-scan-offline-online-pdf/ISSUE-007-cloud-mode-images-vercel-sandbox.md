---
id: "007"
title: Cloud mode — images via Vercel Sandbox + Claude Haiku
prd: "0001"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Implement the cloud extraction module. Spin up a Vercel Sandbox, write the image to its filesystem, apply ImageMagick compression, call Claude claude-haiku-4-5 via the Anthropic API, return the result, and stop the sandbox. Wire `invoice.extract` to dispatch to this module when `mode = "cloud"`. Add `ANTHROPIC_API_KEY` to the environment config.

See PRD §"Online extraction module".

## Acceptance criteria

- [ ] `invoice.extract` with `mode = "cloud"` and a valid JPEG/PNG/WEBP returns a correctly shaped `OllamaExtraction`.
- [ ] The sandbox network policy allows only `api.anthropic.com`.
- [ ] The sandbox is stopped after extraction completes (success or failure).
- [ ] A clear error is shown if `ANTHROPIC_API_KEY` is absent from the server environment.
- [ ] A clear error is shown if the sandbox times out or the Anthropic API returns an error.
- [ ] Loading state shows "Starting cloud sandbox…" during cloud mode extraction.
- [ ] `@vercel/sandbox` and `@anthropic-ai/sdk` are added as dependencies to `packages/api`.
- [ ] `ANTHROPIC_API_KEY` is added to `packages/env`.
- [ ] Integration test (skipped without `VERCEL_OIDC_TOKEN` + `ANTHROPIC_API_KEY`) verifies full flow with a sample JPEG.

## Blocked by

- ISSUE-001

## User stories addressed

- User story 1 (toggle between Local and Cloud)
- User story 8 (upload PDF in cloud mode — images path)
- User story 9 (works without local setup)
- User story 10 (images compressed before extraction)
- User story 13 (mode-specific loading message)
- User story 14 (clear error on failure)
