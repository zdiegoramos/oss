# 06 - Verified interaction gate with haiku fulfillment

Status: needs-triage

## What to build

Deliver the end-to-end interaction step where the server agent refuses fulfillment until client identity validation succeeds via DID exchange, challenge signing, and VC verification, then completes the haiku response after verification passes.

## Acceptance criteria

- [ ] The interaction path shows a blocked state when identity verification has not completed
- [ ] DID exchange, challenge validation, and VC verification are executed in the app-based flow
- [ ] The server agent fulfills the request only after successful verification
- [ ] The guided UI clearly shows both blocked and successful outcomes

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/05-server-ownership-vc-and-protocol-route-surfaces.md
