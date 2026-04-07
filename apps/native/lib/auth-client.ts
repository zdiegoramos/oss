import { expoClient } from "@better-auth/expo/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { env } from "@oss/env/native";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
	baseURL: env.EXPO_PUBLIC_SERVER_URL,
	plugins: [
		passkeyClient(),
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
	],
});
