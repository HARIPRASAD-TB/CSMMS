"use client";

import { useEffect } from "react";
import { apiUrl, isDemoMode } from "@/lib/paths";
import { demoFetch } from "@/lib/demo/handler";

export function FetchInterceptor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const original = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;

      const apiPath = url.startsWith("/api")
        ? url
        : (() => {
            try {
              const parsed = new URL(url, window.location.origin);
              if (parsed.origin !== window.location.origin) return null;
              return parsed.pathname.startsWith("/api") ? parsed.pathname + parsed.search : null;
            } catch {
              return null;
            }
          })();

      if (!apiPath) {
        return original(input, init);
      }

      if (isDemoMode) {
        return demoFetch(apiPath, init);
      }

      return original(apiUrl(apiPath), init);
    };

    return () => {
      window.fetch = original;
    };
  }, []);

  return children;
}
