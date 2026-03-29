from pydantic import BaseModel

class Context(BaseModel):
    quote: str
    author: str
    relevance: float

    def __init__(self, quote: str, author: str, relevance: float):
        self.quote = quote
        self.author = author
        self.relevance = relevance


class Query(BaseModel):
    query: str
    context: Context
    instructions: str

    def __init__(self, query: str, context: Context, author: str):
        self.query = query
        self.context = context
        self.instructions = "You're an incisive tutor and writer. You are to answer the questions as best as you can. The context provided should be used in the answer. Respond to the query directly. The relevance of each piece of context ranges from 0 to 1." + f"The current author we're discussing is {author}." if author else "You are to present the perspective of each author in the context in a balanced manner."
