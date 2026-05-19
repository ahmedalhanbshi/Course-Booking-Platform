const envApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const isBrowser = typeof window !== "undefined";
const isLocalDevHost = isBrowser
  ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  : false;

// Resolution strategy:
// 1) Use NEXT_PUBLIC_API_URL when set.
// 2) For local frontend dev host, default to local backend.
// 3) Otherwise use same-origin relative paths (prevents production fallback to localhost).
const resolvedApiBaseUrl = envApiBaseUrl
  ? envApiBaseUrl
  : isLocalDevHost
    ? "http://localhost:5000"
    : "";

export const API_BASE_URL = resolvedApiBaseUrl.replace(/\/$/, "");

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
