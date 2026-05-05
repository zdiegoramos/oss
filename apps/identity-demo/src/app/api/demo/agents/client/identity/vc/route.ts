import { NextResponse } from "next/server";

/**
 * GET /api/demo/agents/client/identity/vc
 *
 * Protocol endpoint stub — registered as a DID document service endpoint.
 * Full implementation is deferred to a later slice.
 */
export function GET() {
	return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
