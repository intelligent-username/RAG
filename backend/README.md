# Backend

FastAPI-powered server for the Philosophical RAG chatbot. It handles query processing, LLM orchestration (via Groq), and system-level persona enforcement.

## Setup

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:

   Create a `.env` file in this directory with your API key:

   ```bash
   GROQ_API_KEY=your_key_here
   ```

## Running the Server

Start the server using `uvicorn`:

```bash
uvicorn app:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Endpoints

- `POST /query`: Processes a philosophical inquiry using the RAG pipeline.
- `GET /ping`: Basic health check.

## Structure

- `app.py`: FastAPI application entry point and CORS configuration.
- `query.py`: Core logic for building system prompts, handling context, and interfacing with Groq.
