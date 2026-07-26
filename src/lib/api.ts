import { apiUrl } from "./paths";

export async function api<T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(apiUrl(url), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Request failed" };
    return { data: json as T };
  } catch {
    return { error: "Network error" };
  }
}
