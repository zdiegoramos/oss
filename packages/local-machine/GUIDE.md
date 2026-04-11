# Exposing a local machine to the internet with Cloudflare Tunnel

This guide walks you through every layer of the system — from a TCP
connection leaving your laptop to a `fetch()` call in a deployed Next.js
app — so you understand *why* each step exists, not just *what* to type.

---

## What we're building

```
Browser / deployed app
        |
        |  HTTPS  (standard port 443)
        v
Cloudflare Edge  ←──  your tunnel hostname, e.g. ping.example.com
        |
        |  QUIC / HTTP2  (outbound, port 7844 or 443)
        v
cloudflared   (running on your laptop)
        |
        |  HTTP  (loopback, no TLS needed)
        v
Bun ping server  →  GET /ping  →  { pong: true }
```

Nothing is opened inbound on your router or firewall.  
`cloudflared` dials *out* to Cloudflare; Cloudflare multiplexes requests back
down that same connection.

---

## Step 1 — Install cloudflared

`cloudflared` is the CLI that manages the outbound tunnel connection.

**macOS (Homebrew):**
```bash
brew install cloudflare/cloudflare/cloudflared
cloudflared --version
# cloudflared version 2025.x.x
```

**Linux:**
```bash
# Debian / Ubuntu
curl -L https://pkg.cloudflare.com/cloudflare-main.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloudflare-main.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bullseye main' | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt update && sudo apt install cloudflared
```

> **What just happened?**  
> `cloudflared` is a single Go binary. It speaks the Cloudflare Tunnel
> protocol (QUIC-based, built on top of HTTP/2). No kernel modules, no VPN
> drivers, no firewall changes required.

---

## Step 2 — Create a Cloudflare account and add your domain

1. Sign up or log in at **dash.cloudflare.com**.
2. Click **Add a site** and follow the wizard to point your domain's
   nameservers at Cloudflare.

> **What just happened?**  
> Cloudflare becomes the authoritative DNS resolver for your domain.  
> Every HTTPS request for `*.yourdomain.com` hits Cloudflare's edge first,
> giving you TLS termination, DDoS protection, and the ability to route
> traffic into your tunnel — all before the packet ever reaches your laptop.

---

## Step 3 — Create a named tunnel and grab the token

```bash
# Authenticate once (opens a browser)
cloudflared tunnel login

# Create a named tunnel
cloudflared tunnel create local-machine-ping

# The CLI prints:
#   Created tunnel local-machine-ping with id <UUID>
#   Credentials written to ~/.cloudflared/<UUID>.json

# Get the token you'll put in .env
cloudflared tunnel token local-machine-ping
# prints a long base64 string — this IS your CF_TUNNEL_TOKEN
```

> **What just happened?**
>
> Cloudflare stored a record of your tunnel in its control plane, identified
> by a UUID. The `~/.cloudflared/<UUID>.json` file is a short-lived
> credential set that cloudflared uses to prove "I am the process allowed to
> serve this tunnel". The **token** is a portable, single-string encoding of
> those same credentials — you'll use it in CI or on machines where you
> don't want to copy the JSON file.

---

## Step 4 — Route a public hostname to the tunnel

```bash
# Tell Cloudflare: requests for ping.yourdomain.com → this tunnel → port 7001
cloudflared tunnel route dns local-machine-ping ping.yourdomain.com
```

Under the hood this creates a **CNAME** in your Cloudflare DNS zone:
```
ping.yourdomain.com  CNAME  <UUID>.cfargotunnel.com
```

> **What just happened?**  
> `<UUID>.cfargotunnel.com` is a synthetic Cloudflare record that resolves
> to the edge nodes that know about your tunnel. When a browser looks up
> `ping.yourdomain.com`, DNS returns the CNAME, which resolves to Cloudflare
> IPs. Cloudflare holds the TLS certificate for your domain (issued via
> Let's Encrypt or Cloudflare's own CA) so the browser sees valid HTTPS — no
> cert setup needed on your laptop.

---

## Verify the Cloudflare tunnel setup

Use the Cloudflare CLI to confirm the tunnel and DNS routing are registered
correctly.

```bash
# List your tunnels and verify the named tunnel exists
cloudflared tunnel list

# Inspect the tunnel details by name and view associated routes
cloudflared tunnel info local-machine-ping
```

If the hostname is correctly routed, the tunnel info should show an entry
for `ping.yourdomain.com`.

---

## Step 5 — Configure the package

Copy `.env.example` to `.env` inside this package and fill in the values:

```bash
cp packages/local-machine/.env.example packages/local-machine/.env
```

```env
# packages/local-machine/.env

# Port the Bun ping server listens on (default 7001)
LOCAL_MACHINE_PORT=7001

# Token from Step 3
CF_TUNNEL_TOKEN=eyJh…

# Cloudflare Access service token credentials
CF_ACCESS_CLIENT_ID=...
CF_ACCESS_CLIENT_SECRET=...

# Hostname from Step 4 (for the log line only — cloudflared ignores this)
CF_TUNNEL_HOSTNAME=ping.yourdomain.com
```

---

## Step 6 — Start the server alone (no tunnel yet)

```bash
bun run ping
# [local-machine] ping server listening on http://localhost:7001
# [local-machine] GET http://localhost:7001/ping
```

Test it locally:
```bash
curl http://localhost:7001/ping
# {"pong":true,"machine":"local","timestamp":"2026-04-11T12:00:00.000Z"}
```

> **What just happened?**  
> `src/server.ts` calls `Bun.serve()`, which binds a TCP socket on port 7001.
> When `curl` connects, Bun parses the HTTP request, matches `/ping`, and
> returns JSON. The machine never left your loopback interface.

---

## Step 7 — Start with the tunnel

```bash
bun run start
# [local-machine] Ping server starting on http://localhost:7001…
# [local-machine:tunnel] Starting cloudflared tunnel…
# [local-machine:tunnel] Tunnel running → https://ping.yourdomain.com
# [local-machine:tunnel] Try: curl https://ping.yourdomain.com/ping
# [local-machine] All systems up. Press Ctrl-C to stop.
```

Open a second terminal and test from the public internet using Cloudflare Access service token headers:
```bash
curl \
  -H "CF-Access-Client-Id: $CF_ACCESS_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_ACCESS_CLIENT_SECRET" \
  https://ping.yourdomain.com/ping
# {"pong":true,"machine":"local","timestamp":"2026-04-11T12:00:01.123Z"}
```

> **What just happened — the full request journey:**
>
> 1. `curl` resolves `ping.yourdomain.com` → CNAME → Cloudflare edge IP.
> 2. TLS handshake completes at the Cloudflare edge (your laptop is not
>    involved at this point).
> 3. Cloudflare looks up which tunnel is registered for this hostname.
> 4. It multiplexes the HTTP/2 request down the persistent QUIC connection
>    that `cloudflared` (on your laptop) has been maintaining since startup.
> 5. `cloudflared` receives the request and makes an internal HTTP call to
>    `http://localhost:7001/ping`.
> 6. Bun handles it, returns JSON.
> 7. Response travels back up the same path: Bun → cloudflared → Cloudflare
>    edge → `curl`.

---

## Step 8 — Call the tunnel from a deployed Next.js app

Add the hostname to your app's environment:

```env
# apps/web/.env.local  (or Vercel dashboard)
LOCAL_MACHINE_PING_URL=https://ping.yourdomain.com
```

Call it from a Server Component or Route Handler using Cloudflare Access
service token headers:

```ts
// apps/web/src/app/ping/route.ts
export async function GET() {
  const res = await fetch(`${process.env.LOCAL_MACHINE_PING_URL}/ping`, {
    cache: "no-store",
    headers: {
      "CF-Access-Client-Id":     process.env.CF_ACCESS_CLIENT_ID!,
      "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET!,
    },
  });
  const data = await res.json();
  return Response.json(data);
}
```

Or test the tunnel directly with curl:

```bash
curl \
  -H "CF-Access-Client-Id: $CF_ACCESS_CLIENT_ID" \
  -H "CF-Access-Client-Secret: $CF_ACCESS_CLIENT_SECRET" \
  "https://ping.yourdomain.com/ping"
```

> **What just happened?**  
> The Next.js server (running on Vercel's edge or a Node.js container)
> makes an HTTPS request to Cloudflare. Cloudflare routes it through the
> tunnel to your laptop — exactly like `curl` did above. The deployed app
> has no idea it's talking to a laptop; it just sees an HTTPS endpoint.

---

## Step 9 — Protect the endpoint with Cloudflare Access

Cloudflare Access is the default and required way to secure the tunnel
connection in this guide. It adds a service-token gate at the edge so only
authorized machine-to-machine requests can reach your laptop.

```bash
# In the Cloudflare dashboard:
# Zero Trust → Access → Applications → Add an application
# Type: Self-hosted
# Application domain: ping.yourdomain.com
# Policy: Service Token only
```

1. Zero Trust → Access → Service Auth → Create Service Token.  
   Cloudflare gives you `CF-Access-Client-Id` and `CF-Access-Client-Secret`.
2. Add a policy that allows that service token on the application.
3. Pass the headers from the Next.js app:

```ts
const res = await fetch(`${process.env.LOCAL_MACHINE_PING_URL}/ping`, {
  cache: "no-store",
  headers: {
    "CF-Access-Client-Id":     process.env.CF_ACCESS_CLIENT_ID!,
    "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET!,
  },
});
```

> **What just happened?**  
> Cloudflare's edge validates the service token *before* forwarding the
> request to your tunnel. Unauthenticated requests are blocked at the edge,
> so `cloudflared` and your Bun server only see authorized traffic.

---

## What this package does NOT do

- Persist the tunnel across reboots (use `cloudflared service install` for that).
- Set up the Cloudflare-side routing programmatically (use `wrangler` or the
  dashboard).
- Handle authentication of requests *inside* the Bun server — rely on
  Cloudflare Access for that gate at the edge.

---

## File map

```
packages/local-machine/
├── src/
│   ├── env.ts        — typed env vars (LOCAL_MACHINE_PORT, CF_TUNNEL_*)
│   ├── server.ts     — Bun HTTP server, GET /ping
│   └── index.ts      — re-exports env for external consumers
├── scripts/
│   ├── tunnel.ts     — spawns cloudflared, exports spawnTunnel()
│   └── start.ts      — orchestrates server + tunnel together
├── .env.example      — template for local .env
├── GUIDE.md          — this file
└── package.json
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `cloudflared: command not found` | Not installed | Step 1 |
| `Error: CF_TUNNEL_TOKEN is not set` | Missing .env | Step 5 |
| `curl: (6) Could not resolve host` | DNS not propagated | Wait 60 s or check Step 4 |
| `error 1033` in browser | Tunnel offline | Make sure `bun run start` is running |
| `403 Forbidden` | Access policy blocked you | Add your IP/email to the policy or pass service token |
| No response from `https://ping.yourdomain.com/ping` | Cloudflare Access headers missing or hostname routing not active | Use the curl test with `CF-Access-Client-Id` and `CF-Access-Client-Secret`, and verify `cloudflared tunnel info local-machine-ping` |
| Port 7001 already in use | Another process | `lsof -i :7001` then kill it, or change `LOCAL_MACHINE_PORT` |
