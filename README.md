# DocuMind AI — Premium RAG Document Intelligence Platform

> **Your Documents. Your Knowledge. One Intelligent Search.**

DocuMind AI is a production-grade Retrieval-Augmented Generation (RAG) platform tailored for students, researchers, and technical organizations. It enables users to upload PDF and TXT documents, query them with natural language, receive strictly grounded answers with traceable passage-level citations (`[Source 1: Page 1]`), and inspect supporting evidence in real-time.

---

## Key Features

1. **Strict Evidence-Grounded Answers**: Every finding is accompanied by verifiable inline citations (`[Source X]`) mapping directly to document names, page numbers, and chunk indices.
2. **Honest Abstention Policy**: When documents lack sufficient context to answer a query, DocuMind explicitly abstains instead of hallucinating.
3. **Interactive Visual Learning Core**: Includes an interactive 5-step visual breakdown (*Upload → Chunk → Embed → Retrieve → Grounded Answer*) inspired by modern AI infographics.
4. **Architectural Comparison**: Clear "RAG vs Model Fine-Tuning" decision matrix comparing compute cost, update latency, and citation provenance.
5. **Interactive 3-Column Workspace**:
   - **Document Library**: Drag & drop PDF/TXT ingestion, chunk counters, page markers, and instant delete with vector cleanup.
   - **Conversation Stream**: Chat history, smart prompt chips, copyable responses, and interactive citation badges.
   - **Evidence Inspector**: Live relevance percentage, query keyword highlighting, and full passage modal inspection.
6. **Pre-Loaded Authentic Academic Samples**: Includes comprehensive lecture notes on *RAG Architecture (CS482)* and *CRISPR-Cas9 Genetics (BIO305)* for immediate out-of-the-box exploration.
7. **Prompt Injection Defense**: All user documents are isolated in untrusted envelopes to prevent prompt override attacks.

---

## Architecture Overview

```
USER INTERFACE (HTML5 · CSS3 · Tailwind · React · Lucide)
   │
   ▼
APPLICATION CONTROLLER & ROUTER (/api/documents, /api/chat/ask)
   │
   ▼
DOCUMENT PROCESSING (PDF page extraction · Overlapping Chunking: 800 chars / 120 overlap)
   │
   ▼
EMBEDDING & VECTOR SEARCH (BM25 + TF-IDF Semantic Index · Cosine Similarity Scoring)
   │
   ▼
STRICT GROUNDED GENERATION (Bounded Context · Citation Extraction · Abstention Guardrail)
   │
   ▼
EVIDENCE RESPONSE (Answer · Source Passages · Metadata · Inspectable Excerpts)
```

---

## Local Setup & Quick Start

### 1. Web Applet (Dev Server)

The app is built on a full-stack Node.js / Vite architecture:

```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (Chunking, vector store, citation validation, abstention)
./node_modules/.bin/tsx --test src/rag/rag.test.ts

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with DocuMind AI.

### 2. Django Backend (Alternative Python Environment)

A complete standalone Django 5 backend is located in `django_backend/`:

```bash
cd django_backend

# 1. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python manage.py migrate

# 4. (Optional) Create superuser
python manage.py createsuperuser

# 5. Start Django development server
python manage.py runserver 8000
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
# Optional: Set Gemini API key for high-performance server-side LLM inference.
# If omitted, DocuMind AI automatically uses its built-in deterministic grounded synthesizer.
GEMINI_API_KEY="your-gemini-api-key"

# Application host URL
APP_URL="http://localhost:3000"

# RAG Hyperparameters
RAG_CHUNK_SIZE=800
RAG_CHUNK_OVERLAP=120
RAG_TOP_K=5
RAG_SIMILARITY_THRESHOLD=0.12
```

---

## Testing & Quality Assurance

DocuMind AI comes with automated unit tests verifying critical RAG invariants:

- **Text Normalization**: Collapses excessive whitespace, strips unprintable control codes.
- **Syntactic Chunking**: Preserves paragraph and sentence boundaries with configurable overlap.
- **Semantic Vector Storage**: Indexes passage terms, performs inverse document frequency weighting, and retrieves top-K matches by cosine similarity.
- **Document Isolation & Deletion**: Verifies that deleting a document purges all related chunks from memory.
- **Citation Validation**: Rejects fabricated or out-of-bounds citations.
- **Abstention Policy**: Guarantees that queries lacking document evidence trigger explicit refusal.
- **Prompt Injection Defense**: Sanitizes malicious command overrides.

Run the test suite:
```bash
./node_modules/.bin/tsx --test src/rag/rag.test.ts
```

---

## Security & Privacy Constitution

- **Untrusted Input Sandboxing**: Uploaded PDF and TXT text is never executed or trusted as system instructions.
- **Zero Training**: Uploads are used solely for real-time prompt context and are never incorporated into model training sets.
- **Auditability**: Every claim provides page-level references.
