import { NextResponse } from "next/server";
import { getSession } from "@/lib/demo-store";

/**
 * GET /api/demo/agents/server/identity/vc
 *
 * DID document service endpoint — returns the signed ownership VC JWT for the
 * server agent if one has been issued, or 404 if not yet issued.
 *
 * Note: server ownership VC issuance is implemented in a later slice.
 */
export function GET() {
	const session = getSession();

	if (!session.serverAgent) {
		return NextResponse.json(
			{ error: "Server agent has not been created yet." },
			{ status: 404 }
		);
	}

	// Server ownership VC issuance is deferred to the next slice.
	return NextResponse.json(
		{ error: "Server ownership VC not yet issued." },
		{ status: 404 }
	);
}
