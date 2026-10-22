import { DocumentChunk } from '../types/index.ts';

export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

/**
 * Normalizes text while preserving structure (paragraphs, punctuation).
 * Strips dangerous control chars and collapses excessive whitespace.
 */
export function normalizeText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove invisible control chars
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Splits text into overlapping chunks, respecting paragraphs, headings, and sentence boundaries.
 */
export function chunkDocumentText(
  text: string,
  documentId: string,
  documentName: string,
  pageNumber: number = 1,
  options: ChunkingOptions = {}
): DocumentChunk[] {
  const chunkSize = options.chunkSize ?? 800;
  const chunkOverlap = options.chunkOverlap ?? 120;
  const normalized = normalizeText(text);

  if (!normalized) return [];

  // If text is smaller than chunkSize, return a single chunk
  if (normalized.length <= chunkSize) {
    return [
      {
        id: `${documentId}_p${pageNumber}_c0`,
        documentId,
        documentName,
        chunkIndex: 0,
        text: normalized,
        pageNumber,
      },
    ];
  }

  const chunks: DocumentChunk[] = [];
  const paragraphs = normalized.split(/\n\n+/);
  let currentBuffer = '';
  let chunkIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i].trim();
    if (!para) continue;

    // If single paragraph is longer than chunkSize, split it by sentence boundaries
    if (para.length > chunkSize) {
      if (currentBuffer) {
        chunks.push({
          id: `${documentId}_p${pageNumber}_c${chunkIndex++}`,
          documentId,
          documentName,
          chunkIndex: chunkIndex - 1,
          text: currentBuffer.trim(),
          pageNumber,
        });
        currentBuffer = '';
      }

      // Sentence splitting
      const sentences = para.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g) || [para];
      let subBuffer = '';

      for (const sentence of sentences) {
        if ((subBuffer + sentence).length > chunkSize && subBuffer.length > 0) {
          chunks.push({
            id: `${documentId}_p${pageNumber}_c${chunkIndex++}`,
            documentId,
            documentName,
            chunkIndex: chunkIndex - 1,
            text: subBuffer.trim(),
            pageNumber,
          });
          // Retain overlap from end of subBuffer
          const overlapStart = Math.max(0, subBuffer.length - chunkOverlap);
          subBuffer = subBuffer.slice(overlapStart) + sentence;
        } else {
          subBuffer += sentence;
        }
      }

      if (subBuffer.trim()) {
        currentBuffer = subBuffer.trim();
      }
      continue;
    }

    if ((currentBuffer + '\n\n' + para).length > chunkSize && currentBuffer.length > 0) {
      chunks.push({
        id: `${documentId}_p${pageNumber}_c${chunkIndex++}`,
        documentId,
        documentName,
        chunkIndex: chunkIndex - 1,
        text: currentBuffer.trim(),
        pageNumber,
      });

      // Retain overlap from currentBuffer
      const overlapStart = Math.max(0, currentBuffer.length - chunkOverlap);
      const overlapText = currentBuffer.slice(overlapStart).trim();
      currentBuffer = overlapText ? `${overlapText}\n\n${para}` : para;
    } else {
      currentBuffer = currentBuffer ? `${currentBuffer}\n\n${para}` : para;
    }
  }

  if (currentBuffer.trim()) {
    chunks.push({
      id: `${documentId}_p${pageNumber}_c${chunkIndex++}`,
      documentId,
      documentName,
      chunkIndex: chunkIndex - 1,
      text: currentBuffer.trim(),
      pageNumber,
    });
  }

  return chunks;
}
