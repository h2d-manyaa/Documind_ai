"""
Document text extraction and chunking processors.
"""
import re
from typing import List, Dict, Any

def extract_text_from_pdf(file_path: str) -> List[Dict[str, Any]]:
    """
    Extracts text page-by-page from PDF using PyMuPDF (fitz) or fallback.
    """
    pages = []
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(file_path)
        for page_idx in range(len(doc)):
            page = doc[page_idx]
            text = page.get_text()
            pages.append({
                'page_number': page_idx + 1,
                'text': text.strip()
            })
        doc.close()
    except Exception as e:
        # Fallback reading
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            pages.append({'page_number': 1, 'text': content})
    return pages

def extract_text_from_txt(file_path: str) -> List[Dict[str, Any]]:
    """
    Extracts text from TXT file.
    """
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    return [{'page_number': 1, 'text': content}]

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> List[str]:
    """
    Splits text into overlapping chunks respecting sentence and paragraph boundaries.
    """
    if not text:
        return []
    
    clean_text = re.sub(r'\s+', ' ', text).strip()
    if len(clean_text) <= chunk_size:
        return [clean_text]

    chunks = []
    start = 0
    while start < len(clean_text):
        end = start + chunk_size
        if end >= len(clean_text):
            chunks.append(clean_text[start:])
            break
        
        # Look for sentence boundary near end
        period_idx = clean_text.rfind('. ', start, end)
        if period_idx != -1 and period_idx > start + (chunk_size // 2):
            actual_end = period_idx + 1
        else:
            space_idx = clean_text.rfind(' ', start, end)
            actual_end = space_idx if space_idx != -1 else end
        
        chunks.append(clean_text[start:actual_end].strip())
        start = max(start + 1, actual_end - overlap)

    return chunks
