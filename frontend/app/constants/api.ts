import { getEnv } from "~/services/utils/env";

export const latestApiMainVersion = 1

export const apiBaseUrl = `${getEnv("API_URL")}/v${latestApiMainVersion.toString()}`;
