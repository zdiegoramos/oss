# 04 - Server owner and agent setup in walkthrough

Status: needs-triage

## What to build

Mirror the setup flow for the counterparty by adding guided steps to create the server owner and server agent, then render their DID artifacts so both sides of the interaction are visible before verification and fulfillment begin.

## Acceptance criteria

- [ ] The walkthrough can create server owner and server agent in-memory
- [ ] Server DID and DID document artifacts are rendered in the browser
- [ ] Step ordering enforces server setup after client-side setup and VC issuance
- [ ] Integration coverage verifies both identities exist and are visible before interaction starts

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/03-client-ownership-vc-issuance-and-verification-preview.md
