"""
Give a list of PDFs (as raw bytes), chunk each of them up.
"""

from utils.constants import MAX_FILE_SIZE, MAX_TOTAL_SIZE
from pypdf import PdfReader
from typing import List
import io

def chunk_all(pdf_bytes_list: List[bytes]) -> List[str]:
    """
    Chunks all PDFs (given as raw bytes) into smaller pieces.
    """
    chunks = []
    for pdf_bytes in pdf_bytes_list:
        chunks.extend(chunk_one(pdf_bytes))
    return chunks

def chunk_one(pdf_bytes: bytes) -> List[str]:
    """
    Takes in a single PDF as raw bytes and chunks it into smaller pieces.
    
    Several sizes are used:
        - 1 sentence
        - 3 sentences
        - 100 words, rounded to the nearest sentence
        - 250 words, rounded to the nearest sentence
        - Full chapter, if applicable
    
    Each chunk contains the following fields:
        - text: str
        - origin_file: str
        - page_number: int
        - chunk_size: int
    
    """
    reader = PdfReader(io.BytesIO(pdf_bytes))
    
