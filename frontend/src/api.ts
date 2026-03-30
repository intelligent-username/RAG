import type { QueryPayload } from "./types";

const BASE = "/";  // proxied via vite.config.ts

export async function sendQuery(payload: QueryPayload): Promise<string> {
  const res = await fetch(`${BASE}query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.response as string;
}
