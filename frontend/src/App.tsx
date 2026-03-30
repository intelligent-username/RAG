import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import type { Message, CustomPerson } from "./types";
import { BASE_AUTHORS } from "./types";
import { sendQuery } from "./api";
import ChatBubble from "./components/ChatBubble";
import UploadPanel from "./components/UploadPanel";
import InstructionsPanel from "./components/InstructionsPanel";
import "./index.css";

let nextId = 0;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [author, setAuthor] = useState<string>(BASE_AUTHORS[0]);
  const [loading, setLoading] = useState(false);
  const [customPersons, setCustomPersons] = useState<CustomPerson[]>([]);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allAuthors = [...BASE_AUTHORS, ...customPersons.map((p) => p.name)];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<Message, "id">) =>
    setMessages((prev) => [...prev, { ...msg, id: nextId++ }]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    addMessage({ role: "user", content: text });
    setInput("");
    setLoading(true);
    try {
      const response = await sendQuery({
        query: text,
        context: [],
        author,
        custom_instructions: customInstructions || undefined,
      });
      addMessage({ role: "assistant", content: response });
    } catch (err) {
      addMessage({ role: "error", content: err instanceof Error ? err.message : "Unknown error" });
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const handleAddPerson = (name: string, files: File[]) => {
    setCustomPersons((prev) => [...prev, { name, files, vectorized: false }]);
    setAuthor(name);
  };

  return (
    <div className="shell">
      {/* ── Top bar ── */}
      <div className="shell-topbar">
        <button
          className={`side-trigger left ${showUpload ? "open" : ""}`}
          onClick={() => setShowUpload((p) => !p)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload
        </button>

        <h1 className="page-title">Your RAG-Based Second Brain</h1>

        <button
          className={`side-trigger right ${showInstructions ? "open" : ""} ${customInstructions ? "has-value" : ""}`}
          onClick={() => setShowInstructions((p) => !p)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          {customInstructions ? "Instructions ●" : "Instructions"}
        </button>
      </div>

      {/* ── Body: [left panel] | [chat] | [right panel] ── */}
      <div className="shell-body">
        {/* Left panel */}
        <div className={`side-panel left ${showUpload ? "open" : ""}`}>
          <div className="panel-inner">
            <UploadPanel
              onAdd={(name: string, files: File[]) => { handleAddPerson(name, files); setShowUpload(false); }}
            />
          </div>
        </div>

        {/* Chat column */}
        <div className="chat-col">
          <div className="chat-container">
            <div className="chat-log">
              {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
              {loading && (
                <div className="bubble assistant loading">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="input-row">
              <select
                className="kb-select"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              >
                {allAuthors.map((a) => <option key={a}>{a}</option>)}
              </select>
              <input
                className="question-input"
                type="text"
                placeholder={`Ask about ${author}…`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                disabled={loading}
                autoComplete="off"
              />
              <button className="send-btn" onClick={handleSend} disabled={loading || !input.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={`side-panel right ${showInstructions ? "open" : ""}`}>
          <div className="panel-inner">
            <InstructionsPanel
              value={customInstructions}
              onSave={(v) => { setCustomInstructions(v); setShowInstructions(false); }}
            />
          </div>
        </div>
      </div>

      <a
        className="github-badge"
        href="https://github.com/intelligent-username/RAG/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      </a>
    </div>
  );
}
