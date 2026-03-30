import type { QueryPayload } from "./types";

const BASE = "/";

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

export interface UploadFileResult {
  filename: string;
  status: "received" | "rejected" | "skipped";
  size_bytes?: number;
  reason?: string;
}

export async function uploadFiles(
  agentName: string,
  files: File[]
): Promise<{ sessionId: string; files: UploadFileResult[] }> {
  const form = new FormData();
  for (const f of files) {
    form.append("files", f);
  }
  const res = await fetch(`${BASE}upload?agent=${encodeURIComponent(agentName)}`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed HTTP ${res.status}: ${text}`);
  }

  const data = await res.json();
  return { sessionId: data.session_id, files: data.files as UploadFileResult[] };
}

export async function clearSession(sessionId: string): Promise<void> {
  // Called when the upload dialogue is closed — backend drops all in-memory data.
  await fetch(`${BASE}session/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
}
