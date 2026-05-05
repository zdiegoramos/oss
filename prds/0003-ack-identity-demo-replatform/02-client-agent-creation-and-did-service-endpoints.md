# 02 - Client agent creation and DID service endpoints

Status: closed

## What to build

Extend the guided flow to create the client agent from the app and render its DID document with service endpoints that map to app-router protocol paths, proving this step works end-to-end from UI action to in-memory identity state.

## Acceptance criteria

- [x] The walkthrough can create a client agent after client owner creation
- [x] Client agent DID and DID document are rendered in the UI
- [x] DID service endpoints resolve to namespaced app-router paths, not localhost port surfaces
- [x] Integration coverage proves the client agent step is executable after slice 01

## Blocked by

- /Users/diego/dev/niwa/.scratch/ack-identity-demo-replatform/issues/01-identity-demo-shell-client-owner-flow.md
