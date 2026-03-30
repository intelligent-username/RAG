# FastAPI backend
# Just use this to make the Groq API calls and serve it to the frontend.

import os

from fastapi import FastAPI
from dotenv import load_dotenv
from query import Query
from groq import Groq

import os

load_dotenv()

key = os.getenv("GROQ_KEY")

client = Groq()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"message": "pong"}


@app.get("/")
def read_root():
    return {"message": "API Running"}

@app.post("/query")
def query(query: Query):
    # Call Groq
    response = query.ask(client)
    # Then just return the response
    return response
