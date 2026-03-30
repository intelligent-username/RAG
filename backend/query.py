"""
Initiating and Querying the LLM
Requires the Retriever Script for Context
"""

from pydantic import BaseModel
from typing import List, Optional, Any

class ContextItem(BaseModel):
    quote: str
    author: str
    relevance: float
    citation: str

class Query(BaseModel):
    query: str
    context: List[ContextItem] = []
    author: Optional[str] = None
    custom_instructions: Optional[str] = None

    def build_messages(self) -> List[dict]:
        role = (
            "You are a scholarly tutor and writer. You operate under the following strict rules — "
            "no exceptions.\n\n"
            "STYLE RULES:\n"
            "- Write in a clear, rigorous, classical prose style; incisive rather than verbose, "
            "formal rather than casual.\n"
            "- Never open with extensive greetings, affirmations, filler phrases, or casual language "
            "(e.g. never 'Sure, I can help with that!', 'Great question!', 'Of course!', or similar).\n"
            "- Begin your answer immediately and directly.\n"
            "- Vary sentence structure; do not repeat the same syntactic pattern consecutively.\n\n"
            "DATE RULES:\n"
            "- Always write dates as 'Month Day, Year BC' or 'Month Day, Year AD'. "
            "Never use BCE, CE, or any other era notation. This is non-negotiable.\n\n"
            "Always include dates when drawing out timelines and details"
            "SCOPE RULES:\n"
            "- Answer only questions pertaining to philosophy, intellectual history, and related academic topics. "
            "Decline all other requests."
        )

        instructions = (
            "Respond directly to the query without preamble. "
        )
        if self.author:
            instructions += f"The subject of discussion is {self.author}; confine your answer to that scope."
        else:
            instructions += "Where multiple authors appear in the context, represent each perspective fairly."

        # System message = persistent meta-prompt (role + behavioural instructions + any user additions)
        system_content = f"{role}\n\n{instructions}"
        if self.custom_instructions:
            system_content += f"\n\nADDITIONAL USER INSTRUCTIONS:\n{self.custom_instructions}"

        # User message = dynamic payload (context passages + query)
        context_body = ""
        if self.context:
            context_str_list = [
                f"[Result {i+1}]\nQuote: {item.quote}\nAuthor: {item.author}"
                f"\nRelevance: {item.relevance}\nCitation: {item.citation}"
                for i, item in enumerate(self.context)
            ]
            context_body = "Context:\n" + "\n\n".join(context_str_list) + "\n\n"

        user_content = f"{context_body}Query:\n{self.query}"

        return [
            {"role": "system", "content": system_content},
            {"role": "user",   "content": user_content},
        ]


    def ask(self, client: Any):
        # Actually CALL Groq here
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=self.build_messages(),
            temperature=0.75, 
            max_completion_tokens=4096,
            top_p=0.9, 
            reasoning_effort="medium",
            stream=False # I like the streams but FastAPI has a harder time with this. And Groq is just so fast.
        )

        return {"response": response.choices[0].message.content}
    
    def __str__(self):
        return(f"This query has the following attributes:\n"
               f"Query: {self.query}\n"
               f"Context: {self.context}\n"
               f"Author: {self.author}\n"
               f"Custom Instructions: {self.custom_instructions}"
               )
