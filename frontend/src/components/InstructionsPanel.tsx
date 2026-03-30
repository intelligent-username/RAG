import { useState } from "react";

interface Props {
  value: string;
  onSave: (val: string) => void;
}

export default function InstructionsPanel({ value, onSave }: Props) {
  const [draft, setDraft] = useState(value);

  return (
    <>
      <p className="panel-title">Custom Instructions</p>
      <p className="panel-hint">
        What should the answers keep in mind?
      </p>
      <textarea
        className="instructions-area"
        placeholder="e.g. Always give concrete examples. Prefer Socratic style."
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <div className="panel-actions">
        <button className="btn-primary" onClick={() => onSave(draft.trim())}>
          Apply
        </button>
      </div>
    </>
  );
}
