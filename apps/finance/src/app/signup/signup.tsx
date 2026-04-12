"use client";

import { authClient } from "@oss/auth/auth-client";
import { SignUpForm } from "@oss/ui/components/auth/sign-up-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HOMEPAGE = "/";

export function Signup() {
	const router = useRouter();
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		const checkAuthAndInitialize = async () => {
			try {
				const session = await authClient.getSession();

				if (session?.data?.session) {
					// User is authenticated, redirect to their app side from database
					router.push(HOMEPAGE);
					return;
				}
			} catch {
				// Error checking session, continue with signup
			} finally {
				setShouldRender(true);
			}
		};

		checkAuthAndInitialize();
	}, [router]);

	if (!shouldRender) {
		return null;
	}

	return (
		<div className="mx-auto mb-8 max-w-prose">
			<div>Crear Cuenta</div>

			<SignUpForm />
		</div>
	);
}
