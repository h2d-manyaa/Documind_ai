import { DocumentChunk, RetrievalResult } from '../types/index.ts';

/**
 * Stop words to prune from vector weighting
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s',
  'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself',
  'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 'shouldn\'t', 'so', 'some', 'such',
  'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize and normalize text into clean words
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Compute term frequency vector for a chunk
 */
export function computeTermFrequency(tokens: string[]): Record<string, number> {
  const tf: Record<string, number> = {};
  if (tokens.length === 0) return tf;

  for (const token of tokens) {
    tf[token] = (tf[token] || 0) + 1;
  }

  // Normalize by total tokens
  for (const term in tf) {
    tf[term] = tf[term] / tokens.length;
  }

  return tf;
}

export class SemanticVectorStore {
  private chunks: DocumentChunk[] = [];
  private documentFrequency: Record<string, number> = {};
  private totalIndexedDocuments: number = 0;

  constructor(initialChunks: DocumentChunk[] = []) {
    if (initialChunks.length > 0) {
      this.addChunks(initialChunks);
    }
  }

  public addChunks(newChunks: DocumentChunk[]): void {
    for (const chunk of newChunks) {
      const tokens = tokenize(chunk.text);
      chunk.termFrequency = computeTermFrequency(tokens);

      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        this.documentFrequency[term] = (this.documentFrequency[term] || 0) + 1;
      }

      this.chunks.push(chunk);
    }
    this.totalIndexedDocuments = this.chunks.length;
  }

  public removeDocument(documentId: string): void {
    const toRemove = this.chunks.filter(c => c.documentId === documentId);
    if (toRemove.length === 0) return;

    for (const chunk of toRemove) {
      if (chunk.termFrequency) {
        for (const term of Object.keys(chunk.termFrequency)) {
          if (this.documentFrequency[term]) {
            this.documentFrequency[term] = Math.max(0, this.documentFrequency[term] - 1);
            if (this.documentFrequency[term] === 0) {
              delete this.documentFrequency[term];
            }
          }
        }
      }
    }

    this.chunks = this.chunks.filter(c => c.documentId !== documentId);
    this.totalIndexedDocuments = this.chunks.length;
  }

  public getChunkCount(): number {
    return this.chunks.length;
  }

  public getAllChunks(): DocumentChunk[] {
    return [...this.chunks];
  }

  public clear(): void {
    this.chunks = [];
    this.documentFrequency = {};
    this.totalIndexedDocuments = 0;
  }

  /**
   * Search vector store using BM25/TF-IDF semantic scoring with query term weighting and exact phrase boosting.
   */
  public search(
    query: string,
    options: {
      topK?: number;
      minScore?: number;
      documentIds?: string[];
    } = {}
  ): RetrievalResult[] {
    const topK = options.topK ?? 5;
    const minScore = options.minScore ?? 0.08;
    const documentIds = options.documentIds;

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const queryLower = query.toLowerCase().trim();
    const queryPhrases = queryLower.split(/[.,;!?]+/).map(p => p.trim()).filter(p => p.length > 6);

    const candidates = documentIds && documentIds.length > 0
      ? this.chunks.filter(c => documentIds.includes(c.documentId))
      : this.chunks;

    if (candidates.length === 0) return [];

    const N = Math.max(1, this.totalIndexedDocuments);
    const results: RetrievalResult[] = [];

    for (const chunk of candidates) {
      const chunkTextLower = chunk.text.toLowerCase();
      let score = 0;
      const matchedKeywords: string[] = [];

      for (const token of queryTokens) {
        const tf = chunk.termFrequency?.[token] || 0;
        if (tf > 0) {
          matchedKeywords.push(token);
          // Inverse document frequency calculation
          const df = this.documentFrequency[token] || 1;
          const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
          score += tf * (idf > 0 ? idf : 0.5) * 10;
        }
      }

      // Exact phrase match boost
      for (const phrase of queryPhrases) {
        if (chunkTextLower.includes(phrase)) {
          score += 2.5;
        }
      }

      // Substring match boost for specific keyword combinations
      for (const token of queryTokens) {
        if (token.length >= 4 && chunkTextLower.includes(token) && !matchedKeywords.includes(token)) {
          matchedKeywords.push(token);
          score += 0.3;
        }
      }

      if (score >= minScore && matchedKeywords.length > 0) {
        // Normalize score between 0.0 and 0.99
        const normalizedScore = Math.min(0.98, parseFloat((score / (score + 5)).toFixed(3)));
        results.push({
          chunk,
          score: normalizedScore,
          matchedKeywords: Array.from(new Set(matchedKeywords)),
        });
      }
    }

    // Sort descending by score
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, topK);
  }
}
