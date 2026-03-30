import { Marked } from "marked";
import markedKatex from "marked-katex-extension";
import DOMPurify from "dompurify";

const marked = new Marked();

marked.use(
  markedKatex({
    throwOnError: false,
    displayMode: false,
  })
);

// Custom renderer tweaks
marked.use({
  renderer: {
    link({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const t = title ? ` title="${title}"` : "";
      return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer" class="md-link">${text}</a>`;
    },
    code({ text, lang }: { text: string; lang?: string }) {
      return `<pre class="md-pre"><code class="md-code ${lang ? `language-${lang}` : ""}">${text}</code></pre>`;
    },
    codespan({ text }: { text: string }) {
      return `<code class="md-inline-code">${text}</code>`;
    },
    blockquote({ text }: { text: string }) {
      return `<blockquote class="md-blockquote">${text}</blockquote>`;
    },
  },
});

export function renderMarkdown(src: string): string {
  const raw = marked.parse(src) as string;
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ["math", "annotation", "semantics", "mrow", "mi", "msup", "mfrac"],
    ADD_ATTR: ["xmlns", "data-formula"],
  });
}
