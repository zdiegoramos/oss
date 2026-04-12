import { getSession } from "@oss/auth/auth-server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: "4MB", maxFileCount: 1 },
	})
		.middleware(async () => {
			const session = await getSession();

			if (!session) {
				throw new UploadThingError("Unauthorized");
			}

			return { userId: session.user.id };
		})
		.onUploadComplete(({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId);
			console.log("File URL:", file.ufsUrl);
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
