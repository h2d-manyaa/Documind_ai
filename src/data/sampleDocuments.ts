import { DocumentItem, DocumentChunk } from '../types/index.ts';
import { chunkDocumentText } from '../rag/chunking.ts';

export interface PreloadedDoc {
  doc: DocumentItem;
  chunks: DocumentChunk[];
}

export const SAMPLE_DOC_1_TEXT = `--- [Page 1] ---
COURSE: CS482 ADVANCED ARTIFICIAL INTELLIGENCE & NATURAL LANGUAGE PROCESSING
MODULE 4: RETRIEVAL-AUGMENTED GENERATION (RAG) ARCHITECTURE
PROFESSOR: Dr. Elena Vance | Stanford AI Lab

1. INTRODUCTION & THE PARAMETRIC KNOWLEDGE PROBLEM
Large Language Models (LLMs) such as Transformer-based foundation models encode world knowledge in their internal weights (parametric memory). However, parametric memory suffers from three fundamental flaws:
1. Knowledge Cutoff: An LLM has no knowledge of events, internal company documents, or scientific papers published after its training snapshot.
2. Hallucinations: When an LLM lacks confidence or encounters ambiguous prompts, it frequently synthesizes plausible-sounding but completely fabricated facts.
3. Lack of Provenance: Parametric answers provide no traceable citations, making verification impossible for critical academic and scientific research.

Retrieval-Augmented Generation (RAG) solves these issues by combining a non-parametric retrieval system (vector index over external documents) with a parametric generative model. When a user queries the system, relevant passages are dynamically retrieved from the knowledge base and injected into the model prompt as verified factual context.

--- [Page 2] ---
2. DOCUMENT INGESTION, EXTRACTION, AND CHUNKING PIPELINE
Before documents can be queried, they must undergo the preprocessing ingestion pipeline:
A. Text Extraction: Raw text is extracted from PDF, TXT, Markdown, or HTML files, while stripping binary artifacts and preserving semantic paragraph and page markers.
B. Chunking Strategy: Documents are partitioned into smaller passages. The standard baseline chunk size is typically 600 to 1,000 characters with an overlap of 100 to 150 characters.
Why Overlap Matters: If a key definition or relationship spans the boundary between Chunk A and Chunk B, a zero-overlap window will truncate the context. An overlap ensures semantic continuity across chunk transitions.
Chunk boundaries should preserve paragraph structures and sentence endings rather than arbitrarily splitting in the middle of words.

--- [Page 3] ---
3. EMBEDDINGS & VECTOR DATABASE STORAGE
Once chunks are generated, each chunk is passed into an embedding model (e.g. text-embedding-3-small, BAAI/bge-small-en, or sentence-transformers).
The embedding model converts each text passage into a dense vector representation in high-dimensional space (e.g., 384, 768, or 1536 dimensions).
Semantic Meaning as Geometry: In embedding space, semantically similar concepts (such as "cardiac infarction" and "heart attack") are located close to each other, even if they share zero vocabulary overlap.
Vector Databases: Chunks and their vectors are indexed in dedicated vector stores such as ChromaDB, Pinecone, FAISS, or Weaviate. Approximate Nearest Neighbor (ANN) indexing structures such as HNSW (Hierarchical Navigable Small World) enable sub-millisecond similarity search across millions of documents.

--- [Page 4] ---
4. SEMANTIC RETRIEVAL AND RE-RANKING
When a student submits a question:
1. The question is converted into a query embedding vector using the identical embedding model.
2. The vector index executes a cosine similarity search:
   cosine_similarity(u, v) = (u · v) / (||u|| * ||v||)
3. The top-K candidates (typically K = 3 to 7) are retrieved.
4. Hybrid Search Enhancement: Combining dense vector retrieval with sparse BM25 keyword matching provides superior recall, ensuring that exact terminology, acronyms, and product codes are not missed by purely semantic approximations.
5. Minimum Similarity Thresholding: Chunks with similarity below a confidence threshold (e.g., 0.15) are discarded to prevent injecting irrelevant noise into the prompt.

--- [Page 5] ---
5. GROUNDED GENERATION & STRICT ABSTENTION POLICY
The retrieved chunks are assembled into a bounded, untrusted context block within the LLM prompt.
The generation model is guided by strict system constraints:
- "Answer solely using the facts in the provided document passages."
- "Include inline citations in the format [Source X] corresponding to the exact passage."
- "If the supplied context does not contain sufficient facts to answer the question, you must explicitly state that the answer could not be found in the uploaded documents."
Strict Abstention is the single most critical quality metric of a trustworthy RAG system. A reliable assistant must prefer admitting lack of knowledge over inventing plausible misinformation.

--- [Page 6] ---
6. RAG VS FINE-TUNING COMPARISON
Students often ask when to use RAG versus Model Fine-Tuning:
- Model Training Required: RAG requires no retraining or fine-tuning of base weights; Fine-tuning requires expensive gradient updates on GPUs.
- Data Freshness: RAG is instantly updatable by adding or deleting files in the vector database; Fine-tuning requires full retraining to incorporate new data.
- Provenance & Citations: RAG provides exact passage-level citations; Fine-tuning answers from internal weights without source traceability.
- Cost: RAG is significantly faster and cheaper to deploy; Fine-tuning requires dataset curation, compute clusters, and ongoing maintenance.
- Best Use Case: Use RAG for knowledge retrieval, document QA, and private search. Use Fine-tuning for teaching an LLM a specific tone, dialect, structured JSON output format, or specialized programming syntax.`;

export const SAMPLE_DOC_2_TEXT = `--- [Page 1] ---
BIOLOGY 305: MOLECULAR GENETICS & GENOME ENGINEERING
LECTURE 7: CRISPR-CAS9 SYSTEM & APPLICATIONS
INSTRUCTOR: Dr. Marcus Holloway | Department of Genetics

1. DISCOVERY & BACTERIAL IMMUNE SYSTEM
CRISPR stands for "Clustered Regularly Interspaced Short Palindromic Repeats". It was initially identified in bacteria and archaea as an adaptive immune mechanism against bacteriophages (viral predators).
When a bacterium survives a viral infection, Cas enzymes capture fragments of the foreign viral DNA and integrate them into the CRISPR locus of the bacterial genome as "spacers".
Upon subsequent viral invasion, the bacterium transcribes these spacers into CRISPR RNA (crRNA), which forms a complex with trans-activating crRNA (tracrRNA) and the Cas9 endonuclease enzyme.

--- [Page 2] ---
2. THE CAS9 CLEAVAGE MECHANISM & GUIDE RNA
In 2012, researchers engineered a single guide RNA (sgRNA) fusing crRNA and tracrRNA into a single synthetic construct.
The Cas9 protein interrogates the host genome for a Protospacer Adjacent Motif (PAM) sequence. For Streptococcus pyogenes Cas9 (SpCas9), the canonical PAM sequence is 5'-NGG-3' (where N is any nucleotide).
Once the PAM is recognized, Cas9 unwinds the adjacent DNA double helix. If the 20-nucleotide guide RNA matches the target DNA strand through complementary base pairing, Cas9's two catalytic endonuclease domains—RuvC and HNH—cleave both strands of DNA, producing a clean double-strand break (DSB) 3 to 4 nucleotides upstream of the PAM.

--- [Page 3] ---
3. DNA REPAIR PATHWAYS: NHEJ VS HDR
Once Cas9 induces a double-strand break, the host cell activates one of two primary endogenous repair pathways:
1. Non-Homologous End Joining (NHEJ): An error-prone, rapid ligation mechanism that frequently introduces insertions or deletions (indels). This frameshift mutation disrupts the open reading frame, effectively knocking out (inactivating) the target gene.
2. Homology-Directed Repair (HDR): A precise, high-fidelity repair pathway that utilizes an exogenous donor DNA template supplied alongside Cas9. HDR allows scientists to introduce specific point mutations, correct disease-causing genetic defects, or insert entire new genes into designated loci.

--- [Page 4] ---
4. CLINICAL THERAPEUTICS & CASGEVY APPROVAL
The most prominent clinical milestone of CRISPR technology is the regulatory approval of exagamglogene autotemcel (brand name Casgevy) for sickle cell disease and transfusion-dependent beta-thalassemia.
In sickle cell disease, a point mutation in the beta-globin gene causes hemoglobin to polymerize under low oxygen, distorting erythrocytes into rigid sickle shapes that obstruct microvasculature.
Casgevy does not directly repair the mutant beta-globin gene. Instead, it uses CRISPR-Cas9 to edit the BCL11A erythroid enhancer in patient hematopoietic stem cells, reactivating the production of fetal hemoglobin (HbF), which compensates for the defective adult hemoglobin.`;

export function getSampleDocuments(): PreloadedDoc[] {
  const doc1Id = 'sample-rag-cs482';
  const doc2Id = 'sample-crispr-bio305';

  const doc1Item: DocumentItem = {
    id: doc1Id,
    name: 'CS482_RAG_Architecture_Guide.txt',
    size: SAMPLE_DOC_1_TEXT.length,
    type: 'txt',
    status: 'ready',
    chunkCount: 6,
    pageCount: 6,
    uploadedAt: 'Sample Knowledge Base',
  };

  const doc2Item: DocumentItem = {
    id: doc2Id,
    name: 'BIO305_CRISPR_Cas9_Genome_Notes.txt',
    size: SAMPLE_DOC_2_TEXT.length,
    type: 'txt',
    status: 'ready',
    chunkCount: 4,
    pageCount: 4,
    uploadedAt: 'Sample Knowledge Base',
  };

  const doc1Chunks: DocumentChunk[] = [];
  const pages1 = SAMPLE_DOC_1_TEXT.split('--- [Page ');
  pages1.forEach((pageContent, idx) => {
    if (!pageContent.trim()) return;
    const pageNumMatch = pageContent.match(/^(\d+)\]\s*---/);
    const pageNum = pageNumMatch ? parseInt(pageNumMatch[1], 10) : idx;
    const cleanContent = pageContent.replace(/^(\d+)\]\s*---\n?/, '').trim();
    const chunks = chunkDocumentText(cleanContent, doc1Id, doc1Item.name, pageNum, {
      chunkSize: 750,
      chunkOverlap: 100,
    });
    doc1Chunks.push(...chunks);
  });
  doc1Item.chunkCount = doc1Chunks.length;

  const doc2Chunks: DocumentChunk[] = [];
  const pages2 = SAMPLE_DOC_2_TEXT.split('--- [Page ');
  pages2.forEach((pageContent, idx) => {
    if (!pageContent.trim()) return;
    const pageNumMatch = pageContent.match(/^(\d+)\]\s*---/);
    const pageNum = pageNumMatch ? parseInt(pageNumMatch[1], 10) : idx;
    const cleanContent = pageContent.replace(/^(\d+)\]\s*---\n?/, '').trim();
    const chunks = chunkDocumentText(cleanContent, doc2Id, doc2Item.name, pageNum, {
      chunkSize: 750,
      chunkOverlap: 100,
    });
    doc2Chunks.push(...chunks);
  });
  doc2Item.chunkCount = doc2Chunks.length;

  return [
    { doc: doc1Item, chunks: doc1Chunks },
    { doc: doc2Item, chunks: doc2Chunks },
  ];
}
