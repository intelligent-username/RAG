# FastAPI backend
# Just use this to make the Groq API calls and serve it to the frontend.

import os

from fastapi import FastAPI
from dotenv import load_dotenv
from .query import Query

import os

load_dotenv()

key = os.getenv("GROQ_KEY")

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "API Running"}
