import { useState, useRef, useEffect, type DragEvent } from "react";
import { uploadFiles, clearSession, type UploadFileResult } from "../api";

interface Props {
  onAdd: (name: string, files: File[]) => void;
  resetAfterAdd?: boolean;
  autoFocus?: boolean;
}

export default function UploadForm({ onAdd, resetAfterAdd = true, autoFocus = false }: Props) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [vectorizing, setVectorizing] = useState(false);
  const [results, setResults] = useState<UploadFileResult[] | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // When the panel unmounts (dialogue closed), drop the backend session immediately.
  useEffect(() => {
    return () => {
      if (sessionId) clearSession(sessionId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const vectorized = results !== null && results.every((r) => r.status === "received");

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf");
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !names.has(f.name))];
    });
    setResults(null);
    setUploadError(null);
  };

  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); };
  const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const removeFile = (fname: string) => {
    setFiles((p) => p.filter((f) => f.name !== fname));
    setResults(null);
    setUploadError(null);
  };

  const handleVectorize = async () => {
    if (!name.trim() || files.length === 0) return;
    setVectorizing(true);
    setResults(null);
    setUploadError(null);
    try {
      const { sessionId: sid, files: res } = await uploadFiles(name.trim(), files);
      setSessionId(sid);
      setResults(res);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setVectorizing(false);
    }
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), files);
    if (resetAfterAdd) {
      // Clear backend session on explicit add too
      if (sessionId) clearSession(sessionId);
      setName(""); setFiles([]); setResults(null); setUploadError(null); setSessionId(null);
    }
  };

  const vectorizeBtnLabel = vectorizing
    ? "Uploading…"
    : vectorized
    ? "✓ Received"
    : "Vectorize";

  return (
    <>
      <p className="panel-title">New Knowledge Base</p>

      <label className="panel-label">Agent Name</label>
      <input
        className="panel-input"
        type="text"
        placeholder="e.g. Kant, Hegel…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus={autoFocus}
      />

      <label className="panel-label">Source PDFs</label>
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" multiple accept="application/pdf"
          style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
        <span className="drop-icon">📄</span>
        <span className="drop-text">{files.length > 0 ? "Drop more or click" : "Drop PDFs or click"}</span>
      </div>

      <div className="size-note">
        <span>Max per file: 10 MB</span>
        <span>Max total: 75 MB</span>
      </div>

      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f) => {
            const res = results?.find((r) => r.filename === f.name);
            return (
              <li key={f.name} className="file-item">
                <span className="file-name">{f.name}</span>
                {res && res.status !== "received" && (
                  <span className="file-status-err" title={res.reason}>⚠</span>
                )}
                {res && res.status === "received" && (
                  <span className="file-status-ok">✓</span>
                )}
                <button className="file-remove" onClick={() => removeFile(f.name)}>✕</button>
              </li>
            );
          })}
        </ul>
      )}

      {uploadError && <p className="upload-error">{uploadError}</p>}

      <div className="panel-actions">
        <button className="btn-vectorize" onClick={handleVectorize}
          disabled={!name.trim() || files.length === 0 || vectorizing || vectorized}>
          {vectorizeBtnLabel}
        </button>
        <button className="btn-primary" onClick={handleAdd} disabled={!name.trim()}>
          Add Agent
        </button>
      </div>
    </>
  );
}
