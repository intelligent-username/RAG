# Frontend

A React + TypeScript interface for the Philosophical RAG chatbot, built with [Vite](https://vitejs.dev/).

## Features

- **Markdown & LaTeX Support**: Renders complex philosophical equations and formatting using `marked` and `KaTeX`.
- **Dynamic Author Selection**: Sidebar for defining and vectorizing custom agents from PDFs.
- **Custom Instructions**: Panel to append specific styling or cognitive rules to every query.
- **Responsive Layout**: Three-column design with expandable side panels and a centered chat focus.

## Setup

Ensure you have npm or an npm alternative ready.

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Backend Connectivity**:

   The frontend is configured to proxy requests to `http://localhost:8000` via `vite.config.ts`.

## Running the App

Start the development server:

```bash
npm run dev
```

## Structure

- `src/App.tsx`: Main shell layout and state orchestration.
- `src/components/`: Modular UI units (Chat bubbles, Side panels, Modals).
- `src/index.css`: Custom minimal dark-theme design system.
- `src/markdown.ts`: Sanitized markdown and math rendering pipeline.
- `src/api.ts`: Typed interface for backend communication.
