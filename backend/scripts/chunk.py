"""
Give in a list of PDFs (as raw bytes), chunk each of them up.
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
        - author: str
        - title: str
        - origin_file: str
 
        - page_number: int
        - chunk_size: int
        - text: str
    
    """
    reader = PdfReader(io.BytesIO(pdf_bytes))
    metadata = reader.metadata

    author = getattr(metadata, 'author', None) or "Unknown"
    title = getattr(metadata, 'title', None) or "Untitled"
    # origin_file is not available from bytes, so set to None or a placeholder
    origin_file = getattr(pdf_bytes, 'name', None) or "Unknown"

    import re
    def split_sentences(text):
        # Simple sentence splitter (not perfect)
        return re.split(r'(?<=[.!?])\s+', text.strip())

    def chunk_by_words(sentences, max_words):
        chunks = []
        current = []
        word_count = 0
        for sent in sentences:
            words = sent.split()
            if word_count + len(words) > max_words and current:
                chunks.append(' '.join(current))
                current = []
                word_count = 0
            current.append(sent)
            word_count += len(words)
        if current:
            chunks.append(' '.join(current))
        return chunks

    bites = []
    for page_num, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        sentences = split_sentences(text)
        # 1 sentence chunks
        for i, sent in enumerate(sentences):
            if sent.strip():
                bites.append({
                    'author': author,
                    'title': title,
                    'origin_file': origin_file,
                    'page_number': page_num + 1,
                    'chunk_size': 1,
                    'text': sent.strip()
                })
        # 3 sentence chunks
        for i in range(0, len(sentences), 3):
            chunk = ' '.join(sentences[i:i+3]).strip()
            if chunk:
                bites.append({
                    'author': author,
                    'title': title,
                    'origin_file': origin_file,
                    'page_number': page_num + 1,
                    'chunk_size': 3,
                    'text': chunk
                })
        # 100 word chunks (rounded to sentence)
        word_chunks = chunk_by_words(sentences, 100)
        for chunk in word_chunks:
            if chunk.strip():
                bites.append({
                    'author': author,
                    'title': title,
                    'origin_file': origin_file,
                    'page_number': page_num + 1,
                    'chunk_size': 100,
                    'text': chunk.strip()
                })
        # 250 word chunks (rounded to sentence)
        word_chunks_250 = chunk_by_words(sentences, 250)
        for chunk in word_chunks_250:
            if chunk.strip():
                bites.append({
                    'author': author,
                    'title': title,
                    'origin_file': origin_file,
                    'page_number': page_num + 1,
                    'chunk_size': 250,
                    'text': chunk.strip()
                })
    # For now, skip full chapter logic (requires more structure)
    return bites
