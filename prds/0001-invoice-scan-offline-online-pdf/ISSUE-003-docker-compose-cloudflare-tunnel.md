---
id: "003"
title: Docker Compose + Cloudflare Tunnel
prd: "0001"
status: open
type: afk
blocked_by: ["002"]
created: 2026-04-09
---

## Parent PRD

prds/0001-invoice-scan-offline-online-pdf/PRD.md

## What to build

Add a `docker-compose.yml` to `packages/local-agent` wiring three services: `ollama` (with NVIDIA GPU passthrough by default), `agent`, and `tunnel` (Cloudflare Tunnel via `cloudflare/cloudflared`). Include `.env.example` and a README covering quick-tunnel (ephemeral URL) and named-tunnel (stable URL via `CLOUDFLARE_TUNNEL_TOKEN`) modes.

See PRD §"Docker Compose" and §"Further Notes" (Cloudflare tunnel modes).

## Acceptance criteria

- [ ] `docker compose up` starts all three services without errors on a machine with Docker and an NVIDIA GPU.
- [ ] The `ollama` service pulls `llama3.2-vision` automatically on first start.
- [ ] NVIDIA GPU resources are declared by default; the setup degrades to CPU-only if no GPU is present.
- [ ] In quick-tunnel mode (no `CLOUDFLARE_TUNNEL_TOKEN`), the public tunnel URL appears in the `tunnel` service logs.
- [ ] In named-tunnel mode (`CLOUDFLARE_TUNNEL_TOKEN` set), the tunnel connects to the configured Cloudflare tunnel.
- [ ] A `POST /extract` request sent to the tunnel URL with a valid API key returns a correct extraction response.
- [ ] `.env.example` documents all required and optional variables.
- [ ] README covers prerequisites, quick-start steps, and both tunnel modes.

## Blocked by

- ISSUE-002

## User stories addressed

- User story 15 (single `docker compose up` setup)
- User story 16 (GPU passthrough by default)
- User story 17 (API key auto-generation, tunnel URL in logs)
