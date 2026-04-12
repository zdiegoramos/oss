"use client";

import { authClient } from "@oss/auth/auth-client";
import { SignInForm } from "@oss/ui/components/auth/sign-in-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HOMEPAGE = "/";

export function Login() {
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
				// Error checking session, continue with login
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
		<div className="mx-auto max-w-sm pt-8">
			<div>Iniciar Sesión</div>
			<SignInForm />
		</div>
	);
}
