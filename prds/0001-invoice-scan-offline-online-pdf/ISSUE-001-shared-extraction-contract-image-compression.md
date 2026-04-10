---
id: "001"
title: Shared extraction contract + image compression
prd: "0001"
status: open
type: afk
blocked_by: []
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Consolidate the extraction contract so both future backends share the same types and prompt. Move `OllamaExtraction` and `EXTRACTION_PROMPT` to a single exported location in `packages/api`. Add a server-side image compression utility using `sharp` (resize to max 1024px longest side, JPEG 85%) and wire it into the existing Ollama extraction path.

See PRD §"Shared extraction contract" and §"Shared image compression utility".

## Acceptance criteria

- [ ] `OllamaExtraction` type and `EXTRACTION_PROMPT` are exported from a single location in `packages/api`; the existing Ollama extractor imports from there with no duplicate definitions.
- [ ] A compression utility accepts a `Buffer` + MIME type and returns a JPEG `Buffer` with longest side ≤ 1024px at 85% quality.
- [ ] Images already smaller than 1024px pass through without upscaling.
- [ ] The existing `extractInvoiceFromOllama` function applies compression before sending the image to Ollama.
- [ ] Unit tests cover: oversized image is downscaled, small image is not upscaled, output is JPEG.
- [ ] `sharp` is added as a dependency to `packages/api`.

## Blocked by

None — can start immediately.

## User stories addressed

- User story 10 (images are automatically compressed before extraction)
- User story 18 (shared type and prompt across modes)
