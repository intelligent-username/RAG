import { useMemo } from "react";
import type { Message } from "../types";
import { renderMarkdown } from "../markdown";

interface Props {
  message: Message;
}

export default function ChatBubble({ message }: Props) {
  const html = useMemo(() => renderMarkdown(message.content), [message.content]);

  return (
    <div className={`bubble ${message.role}`}>
      <div
        className="bubble-md"
        // Safe: output is sanitized by DOMPurify in renderMarkdown
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
