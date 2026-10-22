export type DocumentStatus =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'chunking'
  | 'indexing'
  | 'ready'
  | 'failed';

export interface DocumentItem {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'txt' | 'md';
  status: DocumentStatus;
  statusMessage?: string;
  chunkCount: number;
  pageCount: number;
  uploadedAt: string;
  error?: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  chunkIndex: number;
  text: string;
  pageNumber: number;
  headings?: string[];
  embedding?: number[];
  termFrequency?: Record<string, number>;
}

export interface Citation {
  sourceNumber: number;
  documentId: string;
  documentName: string;
  pageNumber: number;
  chunkIndex: number;
  excerpt: string;
  score: number;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
  matchedKeywords: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: Citation[];
  retrievalResults?: RetrievalResult[];
  isAbstention?: boolean;
  modelUsed?: string;
  latencyMs?: number;
}

export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  similarityThreshold: number;
  temperature: number;
  strictGrounding: boolean;
}
