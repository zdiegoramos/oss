# 05 - Server ownership VC and protocol route surfaces

Status: done

## What to build

Complete protocol-level app-router surfaces for both client and server agents (`chat`, `identity/challenge`, `identity/vc`) and add server ownership VC issuance so the demo exposes the same HTTP semantics as the original identity demo.

## Acceptance criteria

- [x] Route handlers exist and function for `POST /api/demo/agents/[agentId]/chat`
- [x] Route handlers exist and function for `POST /api/demo/agents/[agentId]/identity/challenge`
- [x] Route handlers exist and function for `GET /api/demo/agents/[agentId]/identity/vc`
- [x] The server ownership VC can be issued and retrieved through the guided flow and protocol surfaces

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/04-server-owner-and-agent-setup-in-walkthrough.md
