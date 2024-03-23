import { getEnv } from "~/services/env";

export const apiBaseUrl = getEnv("API_URL");