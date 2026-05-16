/** Render API URL in production (Vercel). Empty in local dev — Vite proxies /api. */
export const getApiBase = () => (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
