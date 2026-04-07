"use client";

import Image from "next/image";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";

export function FilesClient() {
	const [url, setUrl] = useState<string | null>(null);

	return (
		<div className="flex flex-col items-center gap-4">
			<UploadButton
				endpoint="imageUploader"
				onClientUploadComplete={(res) => {
					setUrl(res[0]?.ufsUrl ?? null);
				}}
				onUploadError={(error) => {
					console.error("Upload error:", error);
				}}
			/>
			{url && (
				<Image
					alt="Uploaded file"
					className="rounded border"
					height={400}
					src={url}
					width={400}
				/>
			)}
		</div>
	);
}
