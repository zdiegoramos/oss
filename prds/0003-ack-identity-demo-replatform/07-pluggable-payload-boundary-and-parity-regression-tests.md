# 07 - Pluggable payload boundary and parity regression tests

Status: needs-triage

## What to build

Isolate haiku-specific model/prompt behavior behind a replaceable payload boundary while keeping ACK-ID orchestration generic, then add parity-focused automated tests at package and app levels to lock the migrated behavior.

## Acceptance criteria

- [ ] Core identity orchestration can run without haiku-specific modules in the same package boundary
- [ ] The current haiku payload remains functional as the default demo payload
- [ ] Package-level tests cover owner creation, agent creation, VC issuance, and verification success/failure paths
- [ ] App-level integration tests cover guided flow parity through verified fulfillment

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/06-verified-interaction-gate-with-haiku-fulfillment.md
