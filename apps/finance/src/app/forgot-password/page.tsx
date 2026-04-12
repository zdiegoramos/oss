import { auth } from "@oss/auth";
import { ForgotPasswordForm } from "@oss/ui/components/auth/forgot-password-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HOMEPAGE = "/";

export default async function Page() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Authenticated users should not access the forgot password page
	if (session) {
		redirect(HOMEPAGE);
	}

	return <ForgotPasswordForm />;
}
