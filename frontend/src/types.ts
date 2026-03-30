export interface ContextItem {
  quote: string;
  author: string;
  relevance: number;
  citation: string;
}

export interface QueryPayload {
  query: string;
  context: ContextItem[];
  author?: string;
  custom_instructions?: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant" | "error";
  content: string;
}

export interface CustomPerson {
  name: string;
  files: File[];
  vectorized: boolean;
}

export const BASE_AUTHORS = ["Plato", "Aristotle", "Nietzsche"] as const;
export type BaseAuthor = (typeof BASE_AUTHORS)[number];
