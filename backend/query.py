from pydantic import BaseModel
from openai import OpenAI

class Context(BaseModel):
    quote: str
    author: str
    relevance: float
    src: str

    def __init__(self, quote: str, author: str, relevance: float, src: str):
        """
        Args:
            - quote is the actual retrieved text
            - author is the author of the retrieved text (if applicable)
            - relevance is a score from 0 to 1 indicating relevance
            - src is the source of the retrieved text (page and line number, etc.)
        """
        self.quote = quote
        self.author = author
        self.relevance = relevance
        self.src = src


class Query(BaseModel):
    query: str
    context: Context
    instructions: str

    def __init__(self, query: str, context: Context, author: str):
        self.role = "You're an incisive tutor and writer. You are to answer the questions as best as you can."
        self.query = query
        self.context = context
        self.instructions = "The context provided should be used in the answer. Respond to the query directly. The relevance of each piece of context ranges from 0 to 1." + f"The current author we're discussing is {author}." if author else "You are to present the perspective of each author in the context in a balanced manner."
    
    def call(self):
        return {
            "query": self.query,
            "context": {
                "quote": self.context.quote,
                "author": self.context.author,
                "relevance": self.context.relevance
            },
            "instructions": self.instructions
        }

    def ask(self, client: OpenAI):
        # Actually CALL Groq here
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages = [
                {
                "role": self.role,
                "content": self.call()
                }
            ],
            temperature=0.7, max_completion_tokens=4096,
            top_p=0.9, reasoning_effort = "medium",
            stream=True, stop=["\n"]
        )

        yield response
