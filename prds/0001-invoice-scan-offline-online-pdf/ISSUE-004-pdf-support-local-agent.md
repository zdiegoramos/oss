---
id: "004"
title: PDF support in local agent
prd: "0001"
status: open
type: afk
blocked_by: ["002"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Extend the local agent to accept `application/pdf` uploads. Use `pdfjs-dist` + `@napi-rs/canvas` to render the first page of the PDF to a PNG buffer, then pass it through the existing compression utility before sending to Ollama for extraction.

See PRD §"PDF rendering utility for offline mode".

## Acceptance criteria

- [ ] `POST /extract` with a valid PDF base64 payload returns a correctly shaped `OllamaExtraction` JSON.
- [ ] Only the first page of a multi-page PDF is processed.
- [ ] The rendered page passes through compression (≤ 1024px, JPEG 85%) before being sent to Ollama.
- [ ] A malformed or password-protected PDF returns a descriptive `400` error rather than a crash.
- [ ] `pdfjs-dist` and `@napi-rs/canvas` are added as dependencies to `packages/local-agent`.
- [ ] Unit tests cover: valid single-page PDF → image buffer of reasonable dimensions, multi-page PDF → only first page rendered.

## Blocked by

- ISSUE-002

## User stories addressed

- User story 6 (upload PDF in local mode and have it extracted)
- User story 11 (first page only)
