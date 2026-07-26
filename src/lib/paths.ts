/** Base path for GitHub Pages (`/CSMMS`) or empty for local/Vercel. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const external = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (external) {
    return `${external}${normalized}`;
  }
  return withBasePath(normalized);
}

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
