---
id: "002"
title: Local agent service skeleton
prd: "0001"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Create `packages/local-agent` — a Hono HTTP server with API key auth, `GET /health`, and `POST /extract` for images (JPEG/PNG/WEBP). Imports the shared `OllamaExtraction` type and `EXTRACTION_PROMPT` from `packages/api`. Calls a local Ollama instance. Includes a Dockerfile. API key is auto-generated on first start if absent.

See PRD §"New package: packages/local-agent".

## Acceptance criteria

- [ ] `GET /health` returns `200 { ok: true }` regardless of auth.
- [ ] `POST /extract` with missing or invalid `Authorization: Bearer` header returns `401`.
- [ ] `POST /extract` with a valid key and a JPEG/PNG/WEBP base64 payload returns a correctly shaped `OllamaExtraction` JSON.
- [ ] Unsupported MIME type returns a descriptive `400` error.
- [ ] If `AGENT_API_KEY` is absent, a random 32-byte hex key is generated, printed to stdout, and written to a volume-mounted file.
- [ ] Ollama URL defaults to `http://ollama:11434` and is overridable via `OLLAMA_URL` env var.
- [ ] `Dockerfile` builds the agent successfully.
- [ ] Unit tests cover: missing auth → 401, invalid MIME type → 400, valid image → shaped response.

## Blocked by

- ISSUE-001

## User stories addressed

- User story 15 (single `docker compose up` setup)
- User story 17 (API key auto-generation)
