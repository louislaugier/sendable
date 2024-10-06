export const latestApiMainVersion = 1

export const apiBaseUrl = `${!!import.meta.env['DEV'] ? 'http://localhost' : `https://api.${window.location.hostname}`}/v${latestApiMainVersion.toString()}`
