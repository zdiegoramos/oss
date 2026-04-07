// import { polarClient } from "@polar-sh/better-auth";

import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [passkeyClient()],
});
