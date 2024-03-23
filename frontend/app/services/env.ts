export const getEnv = (variable: string) => import.meta.env[`VITE_${variable}`];
