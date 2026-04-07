import { auth } from "@oss/auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { utapi } from "./utapi";

export async function GET(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user?.id) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	const searchParams = request.nextUrl.searchParams;

	const paramsSchema = z.object({
		fileKey: z.string().min(1),
	});

	const result = paramsSchema.safeParse({
		fileKey: searchParams.get("fileKey"),
	});

	if (!result.success) {
		return new NextResponse("fileKey is required", {
			status: 400,
		});
	}

	const { fileKey } = result.data;
	// const userId = BigInt(session.user.id);

	// const docRecord = await db.query.doc.findFirst({
	// 	where: (table) => eq(table.fileKey, fileKey),
	// 	columns: {
	// 		companyId: true,
	// 		fileType: true,
	// 	},
	// });

	// if (!docRecord) {
	// 	return NextResponse.json({ message: "File not found" }, { status: 404 });
	// }

	const { ufsUrl } = await utapi.generateSignedURL(
		fileKey,
		{ expiresIn: 30 } // 30 seconds
	);

	const response = await fetch(ufsUrl);

	// Stream the response body
	return new NextResponse(response.body, {
		status: 200,
		headers: {
			// "Content-Type": docRecord.fileType,
			// Optional: Set Content-Disposition for download,
			// or if you want to suggest a filename.
			// "Content-Disposition": `inline; filename="${fileName}"`,
		},
	});
}
