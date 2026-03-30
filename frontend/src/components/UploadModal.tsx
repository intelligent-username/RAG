import { useState, useRef, type DragEvent } from "react";

interface Props {
  side?: "left" | "right";
  onClose: () => void;
  onAdd: (name: string, files: File[]) => void;
}

export default function UploadModal({ side, onClose, onAdd }: Props) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [vectorizing, setVectorizing] = useState(false);
  const [vectorized, setVectorized] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter((f) => f.type === "application/pdf");
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !names.has(f.name))];
    });
    setVectorized(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };
  const onDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const removeFile = (fname: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fname));
    setVectorized(false);
  };

  const handleVectorize = () => {
    if (!name.trim() || files.length === 0) return;
    setVectorizing(true);
    // Non-functional placeholder — will hook into backend later
    setTimeout(() => { setVectorizing(false); setVectorized(true); }, 1400);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), files);
    onClose();
  };

  return (
    <div className={`modal-overlay ${side || ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Knowledge Base</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <label className="modal-label">Agent Name</label>
        <input
          className="modal-input"
          type="text"
          placeholder="e.g. Kant, Hegel, My Thesis…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <label className="modal-label">Source PDFs</label>
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={(e) => addFiles(e.target.files)}
          />
          <span className="drop-icon">📄</span>
          <span className="drop-text">
            {files.length > 0 ? "Drop more PDFs or click to browse" : "Drop PDFs here or click to browse"}
          </span>
        </div>

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f) => (
              <li key={f.name} className="file-item">
                <span className="file-name">{f.name}</span>
                <button
                  className="file-remove"
                  onClick={() => removeFile(f.name)}
                  aria-label={`Remove ${f.name}`}
                >✕</button>
              </li>
            ))}
          </ul>
        )}

        <div className="modal-actions">
          <button
            className="btn-vectorize"
            onClick={handleVectorize}
            disabled={!name.trim() || files.length === 0 || vectorizing || vectorized}
          >
            {vectorizing ? "Vectorizing…" : vectorized ? "✓ Vectorized" : "Vectorize"}
          </button>
          <button
            className="btn-primary"
            onClick={handleAdd}
            disabled={!name.trim()}
          >
            Add Agent
          </button>
        </div>
      </div>
    </div>
  );
}
