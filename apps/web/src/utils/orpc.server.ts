import "server-only";

import { createRouterClient } from "@orpc/server";
import { appRouter } from "@oss/api/routers/index";
import { auth } from "@oss/auth";
import { headers } from "next/headers";

globalThis.$orpc = createRouterClient(appRouter, {
	context: async () => {
		const h = await headers();
		return {
			auth: null,
			session: await auth.api.getSession({ headers: h }),
		};
	},
});
