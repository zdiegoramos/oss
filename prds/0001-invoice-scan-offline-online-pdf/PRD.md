---
id: "0001"
title: Invoice Scan — Local Agent, Cloud Sandbox, PDF Support, and Image Compression
status: draft
created: 2026-04-09
---

## Problem Statement

The finance app's invoice scanning feature only works when a local Ollama instance is running on the same machine as the browser. Once the app is deployed, this path breaks entirely. Additionally, PDF uploads are rejected at runtime despite being accepted by the UI, and images are sent uncompressed to the model, increasing latency and payload size.

## Solution

Introduce two independent extraction backends that a deployed app can reach:

1. **Local Agent mode** — a new Docker-based service (`packages/local-agent`) that runs Ollama on the user's own machine, handles PDF conversion and image compression locally, and exposes a secure HTTP API via a Cloudflare Tunnel. The deployed app calls this agent over the internet using a user-provided tunnel URL and a shared API key secret. GPU resources (NVIDIA) are used by default.

2. **Cloud mode** — a Vercel Sandbox ephemeral Linux VM that receives the raw file, converts PDFs with `poppler-utils`, compresses images with ImageMagick, and calls the Claude claude-haiku-4-5 vision API for extraction. Works without any local setup.

Both modes support images (JPEG, PNG, WEBP) and PDFs (first page only). Both compress images to max 1024px / JPEG 85% before sending to the model. A visible toggle in the drop zone UI lets each user choose their preferred mode. A settings page lets users register their local agent URL and API key.

## User Stories

1. As a user, I want to toggle between "Local" and "Cloud" extraction modes in the upload UI, so that I can use whichever backend suits my current setup.
2. As a user, I want the selected mode to be visible before I drop a file, so that I know what will process my invoice.
3. As a user, I want to enter my local agent URL and API key in a settings page, so that the deployed app can reach my local machine.
4. As a user, I want a "Test connection" button on the settings page, so that I can verify my local agent is reachable before using it.
5. As a user, I want a clear warning in the drop zone when Local mode is selected but no agent URL is configured, so that I know to go to settings first.
6. As a user in local mode, I want to upload a PDF and have it extracted using my local Ollama, so that my hardware does the work.
7. As a user in local mode, I want the system to tell me clearly if my local agent is unreachable, so that I can check my Docker setup or switch to Cloud mode.
8. As a user in cloud mode, I want to upload a PDF and have it extracted via Vercel Sandbox and Claude, so that PDFs work without any local setup.
9. As a user in cloud mode, I want extraction to work without running anything locally, so that I can use the app from any machine.
10. As a user, I want large images to be automatically compressed before extraction, so that uploads are faster regardless of mode.
11. As a user, I want only the first page of a PDF to be processed, so that multi-page documents are handled without extra steps.
12. As a user, I want extracted fields to be the same regardless of which mode I used, so that the review and save workflow is unchanged.
13. As a user, I want a loading indicator that reflects the active mode (e.g. "Extracting with local agent…" vs "Starting cloud sandbox…"), so that I understand what is happening.
14. As a user, I want a clear error message if cloud extraction fails (sandbox timeout, missing API key, etc.), so that I understand what went wrong.
15. As a developer running the local agent, I want a single `docker compose up` command to start Ollama, the agent service, and the Cloudflare tunnel, so that setup is minimal.
16. As a developer, I want GPU passthrough (NVIDIA) enabled by default in the Docker Compose configuration, so that Ollama uses all available hardware automatically.
17. As a developer, I want the local agent's API key to be generated automatically on first run and printed to the console, so that I can copy it into the app settings without manual configuration.
18. As a developer, I want the local agent and the cloud extractor to share the same `OllamaExtraction` type and extraction prompt, so that output is consistent across modes.

## Implementation Decisions

### New package: `packages/local-agent`

A Node.js HTTP service (using Hono or a minimal framework) that runs inside Docker alongside Ollama. Responsibilities:

- Validate the `Authorization: Bearer <key>` header on every request.
- Accept a `POST /extract` endpoint with a multipart or JSON body containing the raw file buffer and MIME type.
- For PDFs: use `pdfjs-dist` + `@napi-rs/canvas` to render the first page to a PNG buffer.
- For images: use `sharp` to resize to max 1024px and re-encode as JPEG at 85%.
- Call the local Ollama HTTP API (`http://ollama:11434/api/generate`) with the processed image.
- Return the same `OllamaExtraction` JSON shape as the existing extractor.
- Generate a random API key on first startup if none is set via environment variable, print it to stdout, and persist it to a local file inside the container volume.

#### Docker Compose (`packages/local-agent/docker-compose.yml`)

Three services:
- **`ollama`** — official `ollama/ollama` image with NVIDIA GPU runtime enabled by default (`deploy.resources.reservations.devices`). Pulls `llama3.2-vision` on startup via an entrypoint script.
- **`agent`** — the local agent service built from `packages/local-agent/Dockerfile`. Depends on `ollama`. Exposes port 3010 internally (not published to host).
- **`tunnel`** — `cloudflare/cloudflared:latest` running `tunnel --url http://agent:3010`. Reads `CLOUDFLARE_TUNNEL_TOKEN` from `.env` for named/persistent tunnels, or runs in quick-tunnel mode (ephemeral URL) if the token is absent.

A `.env.example` file documents required variables: `CLOUDFLARE_TUNNEL_TOKEN` (optional), `AGENT_API_KEY` (auto-generated if absent).

### Cloud extraction module (new in `packages/api`)

- Spins up a Vercel Sandbox (`@vercel/sandbox`).
- Writes the raw file to the sandbox filesystem.
- For PDFs: installs `poppler-utils` via `dnf` and runs `pdftoppm -jpeg -r 150 -f 1 -l 1`.
- For images: runs ImageMagick `convert` to resize to max 1024px and re-encode as JPEG 85%.
- Sets `networkPolicy: { allow: ['api.anthropic.com'] }`.
- Calls Claude claude-haiku-4-5 via the Anthropic SDK with the base64 image and the shared extraction prompt.
- Stops the sandbox after extraction.
- `@vercel/sandbox` and `@anthropic-ai/sdk` are added as dependencies to `packages/api`.

### Shared extraction contract

- `OllamaExtraction` type and `EXTRACTION_PROMPT` constant are moved to a shared location within `packages/api` so both the local agent and the cloud extractor import from the same source.

### User settings (database + ORPC)

- A new `userSettings` table (or additional columns on the user table) stores `localAgentUrl` (text, nullable) and `localAgentKey` (text, nullable) per user.
- Two new protected ORPC procedures: `settings.get` and `settings.update`.
- The `invoice.extract` procedure reads the calling user's `localAgentUrl` and `localAgentKey` from the database when `mode` is `"local"`.

### ORPC invoice router (modified)

- The `extract` procedure gains `mode: z.enum(["local", "cloud"])` input (no default — the client must always send it explicitly).
- In local mode: fetches the user's agent URL + key, calls `POST /extract` on the agent, validates the response shape.
- In cloud mode: invokes the Vercel Sandbox extractor.
- Returns a descriptive error if local mode is selected but no agent URL is configured.
- Returns a descriptive error if cloud mode is selected but `ANTHROPIC_API_KEY` is missing from the environment.

### Environment configuration

- `ANTHROPIC_API_KEY` added to `packages/env` as an optional server-side variable (cloud mode fails gracefully without it).
- `VERCEL_OIDC_TOKEN` used automatically by `@vercel/sandbox` in production; provided locally via `vercel env pull`.

### New settings page (`apps/finance/src/app/settings/`)

- Form fields: **Local agent URL** and **API key** (password input, masked).
- **Test connection** button calls a new `settings.testConnection` ORPC procedure that makes a `GET /health` request to the configured agent URL with the API key and reports success/failure.
- Saves via `settings.update` on form submit.

### UI changes in drop zone

- Mode toggle ("Local" / "Cloud") visible above the drop area.
- If "Local" is selected and no agent URL is saved: show an inline warning with a link to the settings page.
- Loading message reflects the active mode.

## Testing Decisions

A good test verifies the external behavior of a module given a defined input — it does not assert on internal implementation details, intermediate state, or private function calls.

### Modules to test

- **Local agent HTTP handler**: unit tests using a test HTTP client — verify that missing/invalid API keys return 401, valid image input returns a correctly shaped `OllamaExtraction`, and PDF input triggers the PDF rendering path.
- **PDF renderer (local agent)**: unit test with a known single-page PDF buffer — verify that the output is a valid image buffer of reasonable dimensions.
- **Image compression utility**: unit test with sample buffers — verify oversized images are downscaled to ≤ 1024px, already-small images are not upscaled, and output is JPEG.
- **`safeParseExtraction`**: unit tests for malformed JSON, missing fields, and code-fenced responses.
- **ORPC `invoice.extract` routing logic**: unit test that local mode dispatches to the agent client, cloud mode dispatches to the sandbox extractor, and missing configuration returns a typed error in both cases.
- **Cloud extraction module**: integration test requiring `VERCEL_OIDC_TOKEN` and `ANTHROPIC_API_KEY` — skipped in CI without them. Tests full flow with a sample JPEG and a sample PDF.

### Test runner

The project uses `bun test`. All new test files follow the same naming and import conventions as existing tests in the monorepo.

## Out of Scope

- AMD/ROCm GPU support (NVIDIA only for the initial version).
- Multi-page PDF extraction (first page only).
- Client-side image compression in the browser.
- Snapshot-based Vercel Sandbox warm starts (can be added later as a performance optimization).
- Streaming extraction results token-by-token.
- Selecting which AI model to use from the UI.
- Per-user cloud API key management (the `ANTHROPIC_API_KEY` is a single server-side env var).
- Support for TIFF, BMP, or other formats beyond JPEG, PNG, and WEBP.
- Storing the extraction mode alongside the saved invoice record.
- Tailscale or ngrok as tunnel alternatives.

## Further Notes

- The Cloudflare quick-tunnel mode (no token) generates an ephemeral URL that changes on every `docker compose up`. For a stable URL across restarts, the user must create a named tunnel in the Cloudflare Zero Trust dashboard and set `CLOUDFLARE_TUNNEL_TOKEN` in their `.env`. The docker-compose setup and README should explain both options.
- `dnf install poppler-utils` inside the Vercel Sandbox adds several seconds to cold starts. A future optimization is to snapshot a sandbox with `poppler-utils` pre-installed and reuse it via `Sandbox.create({ source: { type: 'snapshot', snapshotId } })`.
- The local agent's `AGENT_API_KEY` auto-generation should use `crypto.randomBytes(32).toString('hex')` and write to a volume-mounted file so it survives container restarts.
- The `localAgentKey` stored in the database should be treated as a secret. Consider encrypting it at rest or storing only a hash (with the user re-entering it to test). For the initial version, storing it in plaintext in the database is acceptable with a note to revisit.
