const DEFAULT_API_BASE_URL = "http://localhost:5000";

const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
