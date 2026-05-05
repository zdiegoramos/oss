import { NextResponse } from "next/server";

/**
 * POST /api/demo/agents/client/identity/challenge
 *
 * Protocol endpoint stub — registered as a DID document service endpoint.
 * Full implementation is deferred to a later slice.
 */
export function POST() {
	return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
