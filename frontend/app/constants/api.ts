export const latestApiMainVersion = 1;

let url: string | null = null;

// Create a promise that resolves when the window object is available and the URL is set
export const waitForWindow = new Promise<void>((resolve) => {
    const checkForWindow = setInterval(() => {
        if (typeof window !== 'undefined') {
            url = `${!!import.meta.env['DEV'] ? 'http://localhost' : `https://api.${window.location.hostname}`}/v${latestApiMainVersion}`;
            clearInterval(checkForWindow);
            resolve();
        }
    }, 100);
});

// Function to get the API base URL, ensuring it waits for the URL to be set
export const getApiBaseUrl = async (): Promise<string> => {
    await waitForWindow; // Ensure the promise resolves before returning the URL
    return url || '';
};
