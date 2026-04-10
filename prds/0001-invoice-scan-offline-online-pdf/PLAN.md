# Plan: Invoice Scan — Local Agent, Cloud Sandbox, PDF Support, and Image Compression

> Source PRD: prds/0001-invoice-scan-offline-online-pdf/PRD.md

## Architectural decisions

- **Extraction modes**: `"local"` (local agent via Cloudflare Tunnel) and `"cloud"` (Vercel Sandbox + Claude Haiku). The client always sends the mode explicitly.
- **Routes**: New `/settings` page in the finance app. New ORPC procedures: `settings.get`, `settings.update`, `settings.testConnection`. Modified procedure: `invoice.extract` gains a `mode` field.
- **Schema**: New `userSettings` table with `userId` (FK), `localAgentUrl` (text, nullable), `localAgentKey` (text, nullable).
- **Local agent contract**: `GET /health` (returns 200 + `{ ok: true }`), `POST /extract` (JSON body: `{ fileBase64: string, mimeType: string }`, returns `OllamaExtraction`). Auth via `Authorization: Bearer <key>` header.
- **Shared types**: `OllamaExtraction` type and `EXTRACTION_PROMPT` constant live in `packages/api` and are imported by both the cloud extractor and the local agent.
- **Image compression target**: max 1024px on longest side, JPEG quality 85, applied server-side before any model call.
- **PDF handling**: first page only. Local agent uses `pdfjs-dist` + `@napi-rs/canvas`. Cloud sandbox uses `poppler-utils` (`pdftoppm`).
- **Auth**: all new ORPC procedures are protected (same pattern as existing invoice procedures).
- **Environment variables**: `ANTHROPIC_API_KEY` (server-side, required for cloud mode), `VERCEL_OIDC_TOKEN` (injected automatically in Vercel production, provided locally via `vercel env pull`).

---

## Phase 1: Shared extraction contract + image compression

**User stories**: 10, 18

### What to build

Consolidate the extraction contract so both future backends share the same types and prompt. Add a server-side image compression utility and wire it into the existing Ollama extraction path so all images are resized and re-encoded before being sent to the model.

This is a pure internal refactor with a concrete observable effect: after this phase, a large image dropped in the existing scan UI will be compressed before hitting Ollama, reducing payload size and latency.

### Acceptance criteria

- [ ] `OllamaExtraction` type and `EXTRACTION_PROMPT` are exported from a single location in `packages/api` and the existing Ollama extractor imports from there (no duplicate definitions).
- [ ] A compression utility accepts a `Buffer` + MIME type and returns a JPEG `Buffer` with longest side ≤ 1024px at 85% quality.
- [ ] Images already smaller than 1024px pass through without upscaling.
- [ ] The existing `extractInvoiceFromOllama` function applies compression before sending the image to Ollama.
- [ ] Unit tests cover: oversized image is downscaled, small image is not upscaled, output is JPEG.

---

## Phase 2: Local agent service skeleton

**User stories**: 15, 17

### What to build

Create `packages/local-agent` — a minimal Hono HTTP server that accepts image extraction requests, validates an API key, calls a local Ollama instance, and returns `OllamaExtraction` JSON. No PDF support yet. Includes a Dockerfile and a health endpoint.

After this phase, a developer can build and run the agent container and verify extraction works end-to-end via `curl`.

### Acceptance criteria

- [ ] `GET /health` returns `200 { ok: true }` regardless of auth.
- [ ] `POST /extract` with a missing or incorrect `Authorization: Bearer` header returns `401`.
- [ ] `POST /extract` with a valid key and a JPEG/PNG/WEBP base64 payload returns a correctly shaped `OllamaExtraction` JSON.
- [ ] The agent reads `AGENT_API_KEY` from the environment; if absent it generates a random 32-byte hex key, prints it to stdout, and writes it to a volume-mounted file so it survives restarts.
- [ ] The agent calls Ollama at `http://ollama:11434` (configurable via `OLLAMA_URL` env var).
- [ ] A working `Dockerfile` builds the agent successfully.
- [ ] Unit tests cover: missing auth → 401, invalid MIME type → 400, valid image → shaped response.

---

## Phase 3: Docker Compose + Cloudflare Tunnel

**User stories**: 15, 16, 17

### What to build

Add a `docker-compose.yml` to `packages/local-agent` that wires together three services: `ollama` (with NVIDIA GPU passthrough enabled by default), `agent`, and `tunnel` (Cloudflare Tunnel). Include a `.env.example` and a README that explains both quick-tunnel (ephemeral URL, no token needed) and named-tunnel (stable URL, requires `CLOUDFLARE_TUNNEL_TOKEN`) modes.

After this phase, a developer runs `docker compose up` and sees a publicly accessible tunnel URL in the logs they can curl for extraction.

### Acceptance criteria

- [ ] `docker compose up` starts all three services without errors (on a machine with Docker and an NVIDIA GPU).
- [ ] The `ollama` service automatically pulls `llama3.2-vision` on first start.
- [ ] NVIDIA GPU resources are requested by default in the Compose file; the setup degrades gracefully (CPU only) if no GPU is present.
- [ ] In quick-tunnel mode (no `CLOUDFLARE_TUNNEL_TOKEN`), the tunnel URL is printed to the `tunnel` service logs.
- [ ] In named-tunnel mode (`CLOUDFLARE_TUNNEL_TOKEN` set), the tunnel connects to the configured Cloudflare tunnel.
- [ ] A `POST /extract` request sent to the tunnel URL with a valid API key returns a correct extraction response.
- [ ] `.env.example` documents all required and optional variables.
- [ ] README covers prerequisites, quick-start, and both tunnel modes.

---

## Phase 4: PDF support in local agent

**User stories**: 6, 11

### What to build

Extend the local agent to accept `application/pdf` uploads. Use `pdfjs-dist` + `@napi-rs/canvas` to render the first page of the PDF to a PNG buffer, then pass it through the existing compression utility before sending to Ollama.

After this phase, dropping a PDF through the agent (via curl or tunnel) returns a correct extraction response.

### Acceptance criteria

- [ ] `POST /extract` with a valid PDF base64 payload returns a correctly shaped `OllamaExtraction` JSON.
- [ ] Only the first page of a multi-page PDF is processed.
- [ ] The rendered PDF page is compressed (≤ 1024px, JPEG 85%) before being sent to Ollama.
- [ ] A malformed or password-protected PDF returns a descriptive `400` error rather than a crash.
- [ ] Unit tests cover: valid single-page PDF → image buffer of reasonable dimensions, multi-page PDF → only first page rendered.

---

## Phase 5: User settings (DB + API + UI)

**User stories**: 3, 4, 5

### What to build

Add a `userSettings` table to the database. Add three protected ORPC procedures: `settings.get`, `settings.update`, and `settings.testConnection`. Build a `/settings` page in the finance app with a form for the local agent URL and API key (masked), and a "Test connection" button.

After this phase, a logged-in user can save their local agent URL and key, and verify connectivity from the app.

### Acceptance criteria

- [ ] `settings.get` returns the current user's `localAgentUrl` and `localAgentKey` (or nulls if unset).
- [ ] `settings.update` saves the URL and key for the current user.
- [ ] `settings.testConnection` makes a `GET /health` request to the stored URL with the stored key and returns success or a descriptive error.
- [ ] The `/settings` page renders a form pre-populated with saved values.
- [ ] The API key field is masked (password input) and only shows a placeholder when already set.
- [ ] The "Test connection" button shows a success or error state after the check.
- [ ] A database migration is included for the `userSettings` table.

---

## Phase 6: Local mode end-to-end in the deployed app

**User stories**: 1, 2, 5, 6, 7, 13, 14

### What to build

Wire up the Local mode path in the deployed finance app. The `invoice.extract` ORPC procedure gains a `mode` field. When `mode = "local"`, it reads the user's saved agent URL + key and forwards the request to `POST /extract` on their local agent. The drop zone UI gains a Local/Cloud toggle, a warning when local mode is selected but no agent URL is configured, and mode-specific loading messages.

After this phase, a user with a running local agent and a saved URL can extract invoices through the deployed app.

### Acceptance criteria

- [ ] The drop zone renders a visible "Local" / "Cloud" toggle.
- [ ] Selecting "Local" with no agent URL configured shows an inline warning linking to `/settings`.
- [ ] `invoice.extract` with `mode = "local"` calls the user's saved local agent and returns the extraction result.
- [ ] A clear error is shown if the agent is unreachable (network error, 401, timeout).
- [ ] Loading state shows "Extracting with local agent…" in local mode.
- [ ] The existing save/review/create invoice workflow is unchanged after extraction.
- [ ] Unit tests cover: local mode with no saved URL → descriptive error, local mode with agent returning 401 → descriptive error.

---

## Phase 7: Cloud mode — images via Vercel Sandbox + Claude Haiku

**User stories**: 1, 8, 9, 10, 13, 14

### What to build

Implement the cloud extraction module. Spin up a Vercel Sandbox, write the image to its filesystem, apply ImageMagick compression, call Claude claude-haiku-4-5 via the Anthropic API, and return the result. Wire `invoice.extract` to dispatch to this module when `mode = "cloud"`. Add `ANTHROPIC_API_KEY` to the environment config. Loading state reflects cloud mode.

After this phase, dropping a JPEG/PNG/WEBP in cloud mode extracts without any local setup.

### Acceptance criteria

- [ ] `invoice.extract` with `mode = "cloud"` and a valid image returns a correctly shaped `OllamaExtraction`.
- [ ] The sandbox network policy allows only `api.anthropic.com`.
- [ ] The sandbox is stopped after extraction completes (success or failure).
- [ ] A clear error is shown if `ANTHROPIC_API_KEY` is missing from the server environment.
- [ ] A clear error is shown if the sandbox times out or the Anthropic API returns an error.
- [ ] Loading state shows "Starting cloud sandbox…" in cloud mode.
- [ ] Integration test (skipped without `VERCEL_OIDC_TOKEN` + `ANTHROPIC_API_KEY`) verifies full flow with a sample JPEG.

---

## Phase 8: PDF support in cloud mode

**User stories**: 8, 11

### What to build

Extend the cloud extraction module to handle PDFs. When the input MIME type is `application/pdf`, install `poppler-utils` in the sandbox via `dnf` and run `pdftoppm` to render the first page as a JPEG before compression and extraction.

After this phase, dropping a PDF in cloud mode returns a correct extraction — completing full feature parity between local and cloud modes.

### Acceptance criteria

- [ ] `invoice.extract` with `mode = "cloud"` and a valid PDF returns a correctly shaped `OllamaExtraction`.
- [ ] Only the first page of a multi-page PDF is processed.
- [ ] The rendered PDF page is compressed (≤ 1024px, JPEG 85%) before being sent to Claude.
- [ ] A malformed PDF returns a descriptive error rather than a sandbox crash.
- [ ] Integration test (skipped without credentials) verifies full flow with a sample PDF.
