import * as pdfjsLib from 'pdfjs-dist';

// Use worker from unpkg or pdfjs CDN for client-side execution
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;
}

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface DocumentExtractionResult {
  pages: ExtractedPage[];
  fullText: string;
  pageCount: number;
}

/**
 * Extracts text page-by-page from a PDF ArrayBuffer or Uint8Array
 */
export async function extractTextFromPdf(data: ArrayBuffer | Uint8Array): Promise<DocumentExtractionResult> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
    });
    const pdfDoc = await loadingTask.promise;
    const pageCount = pdfDoc.numPages;
    const pages: ExtractedPage[] = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageItems = textContent.items as Array<{ str?: string }>;
      const pageText = pageItems
        .map(item => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      pages.push({
        pageNumber: pageNum,
        text: pageText,
      });
      fullText += `\n--- [Page ${pageNum}] ---\n` + pageText;
    }

    return {
      pages,
      fullText: fullText.trim(),
      pageCount,
    };
  } catch (error) {
    console.warn('PDF.js standard parsing error, attempting raw text stream fallback:', error);
    // Fallback: simple text decoding if PDF stream contains plain strings
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const raw = decoder.decode(data);
    const cleaned = raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      pages: [{ pageNumber: 1, text: cleaned }],
      fullText: cleaned,
      pageCount: 1,
    };
  }
}

/**
 * Extracts text from a TXT or Markdown string / file buffer
 */
export function extractTextFromTxt(rawText: string): DocumentExtractionResult {
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return {
    pages: [{ pageNumber: 1, text: normalized }],
    fullText: normalized,
    pageCount: 1,
  };
}
