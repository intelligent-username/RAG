# FastAPI backend

import os
import uuid
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from dotenv import load_dotenv
from query import Query
from groq import Groq

from utils.constants import MAX_FILE_SIZE, MAX_TOTAL_SIZE
from scripts.chunk import chunk_all
from scripts.index import index as index_chunks

load_dotenv()

client = Groq()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session store ───────────────────────────────────────────────────
# Keyed by session_id (UUID string sent back to the frontend).
# Each entry holds the pipeline state for one upload dialogue:
#   "files"  : List[dict]  — {filename, contents: bytes}
#   "chunks" : List[...]   — populated by /chunk
#   "index"  : Any         — populated by /index
# The client calls DELETE /session/{session_id} when the dialogue is closed.
_sessions: Dict[str, Dict[str, Any]] = {}


@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.get("/")
def root():
    return {"message": "API Running"}


@app.post("/upload")
async def upload(files: List[UploadFile] = File(...)):
    """
    Accept PDFs into a new temporary session.
    Returns a session_id the frontend must include in subsequent /chunk and
    /index calls, and must DELETE when the dialogue is closed.
    """
    session_id = str(uuid.uuid4())
    accepted: List[Dict[str, Any]] = []
    total_bytes = 0

    for f in files:
        contents: bytes = await f.read()
        size = len(contents)

        if size > MAX_FILE_SIZE:
            continue

        total_bytes += size
        if total_bytes > MAX_TOTAL_SIZE:
            break

        accepted.append({"filename": f.filename, "contents": contents})

    _sessions[session_id] = {"files": accepted, "chunks": [], "index": None}

    return {
        "session_id": session_id,
        "accepted": len(accepted),
        "files": [{"filename": e["filename"], "size_bytes": len(e["contents"])} for e in accepted],
    }


@app.post("/chunk/{session_id}")
def chunk(session_id: str):
    """
    Reads the session's in-memory files, runs chunk_all, stores chunks back
    in the session. Chunking logic lives in scripts/chunk.py.
    """
    session = _sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    file_bytes: List[bytes] = [e["contents"] for e in session["files"]]
    chunks = chunk_all(file_bytes)          # chunk_all now receives bytes, not paths
    session["chunks"] = chunks

    return {"session_id": session_id, "chunk_count": len(chunks)}



@app.post("/index/{session_id}")
def index(session_id: str):
    """
    Reads the session's chunks, runs the indexer, stores the result back
    in the session. Indexing logic lives in scripts/index.py.
    """
    session = _sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session["chunks"]:
        raise HTTPException(status_code=400, detail="No chunks found — run /chunk first")

    result = index_chunks(session["chunks"])
    session["index"] = result

    return {"session_id": session_id, "status": "indexed"}



@app.delete("/session/{session_id}")
def close_session(session_id: str):
    """
    Discard all in-memory data for this upload session.
    The frontend calls this when the upload dialogue is closed.
    """
    _sessions.pop(session_id, None)
    return {"session_id": session_id, "status": "cleared"}


@app.post("/query")
def query(query: Query):
    """
    Takes in a VALID Query Object and returns the response from the LLM.
    Responses aren't streamed. Front end 
    """
    response = query.ask(client)
    return response
