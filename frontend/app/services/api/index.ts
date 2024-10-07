import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl, waitForWindow } from "~/constants/api";

let client: AxiosInstance | null = null;

const initializeClient = async () => {
  await waitForWindow; // Ensure the window is ready and URL is set
  client = axios.create({
    baseURL: await getApiBaseUrl(),
    timeout: 300000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

initializeClient();

export const getClient = async (): Promise<AxiosInstance> => {
  if (!client) {
    await initializeClient();
  }
  return client!;
};

export default getClient;
