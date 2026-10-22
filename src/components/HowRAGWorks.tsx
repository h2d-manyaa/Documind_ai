import React, { useState } from 'react';
import { UploadCloud, Layers, Database, Search, CheckCircle2, Check, ChevronRight, Terminal } from 'lucide-react';

export const HowRAGWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      step: '01',
      title: 'Load Your Data',
      subtitle: 'PDF & TXT Ingestion',
      icon: UploadCloud,
      color: 'from-cyan-500 to-blue-500',
      badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/60',
      summary: 'Upload textbooks, lecture slides, papers, or revision notes. Files are securely validated and processed locally or via server.',
      detail: 'Supports standard PDF files and raw UTF-8 text documents. Binary artifacts are sanitized, text streams extracted page-by-page, and document integrity verified before indexing.',
      codeSnippet: `// Document Ingestion
const doc = await ragService.ingestFile(uploadedPdf);
console.log('Pages extracted:', doc.pageCount); // e.g. 14 pages`,
    },
    {
      step: '02',
      title: 'Extract & Chunk',
      subtitle: 'Overlapping Passages',
      icon: Layers,
      color: 'from-blue-500 to-indigo-500',
      badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-950/60',
      summary: 'Text is parsed into bounded, overlapping chunks to guarantee definitions and formulas do not get severed.',
      detail: 'DocuMind applies an 800-character window with a 120-character sliding overlap. Sentence boundaries and paragraph markers are strictly preserved, avoiding broken mid-sentence fragments.',
      codeSnippet: `// Sliding Window Chunking
const chunks = chunkDocumentText(extractedText, docId, 'lecture.pdf', pageNum, {
  chunkSize: 800,
  chunkOverlap: 120,
});`,
    },
    {
      step: '03',
      title: 'Embed & Index',
      subtitle: 'Vector Space Representation',
      icon: Database,
      color: 'from-indigo-500 to-violet-500',
      badgeColor: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/60',
      summary: 'Each chunk is transformed into high-dimensional vectors and stored in an indexed vector database for sub-millisecond similarity search.',
      detail: 'Semantic embeddings map text into coordinate geometry. Similar concepts (e.g. "Photosynthesis" and "Calvin Cycle") cluster together, even when worded differently.',
      codeSnippet: `// High-Dimensional Vector Embeddings
const vector = embedPassage(chunk.text); // [0.243, -0.012, 0.891, ...]
vectorStore.addChunks(chunks);`,
    },
    {
      step: '04',
      title: 'Retrieve Evidence',
      subtitle: 'Semantic & Lexical Matching',
      icon: Search,
      color: 'from-violet-500 to-purple-500',
      badgeColor: 'border-violet-500/40 text-violet-300 bg-violet-950/60',
      summary: 'When you ask a question, the vector store calculates cosine similarity and BM25 scores to retrieve top matching passages.',
      detail: 'Hybrid search ranks the top-K chunks while enforcing minimum similarity thresholds. Irrelevant chunks are discarded to protect generative precision.',
      codeSnippet: `// Similarity Retrieval & Top-K Filtering
const matches = vectorStore.search("Explain CRISPR-Cas9 guide RNA", {
  topK: 5,
  minScore: 0.12
});`,
    },
    {
      step: '05',
      title: 'Generate & Cite',
      subtitle: 'Grounded Answer with Citations',
      icon: CheckCircle2,
      color: 'from-purple-500 to-pink-500',
      badgeColor: 'border-pink-500/40 text-pink-300 bg-pink-950/60',
      summary: 'The model answers solely from the retrieved context, appending traceable [Source X] citations and refusing to hallucinate.',
      detail: 'If the retrieved passages do not contain the answer, DocuMind AI triggers an explicit abstention policy instead of guessing, ensuring academic integrity.',
      codeSnippet: `// Bounded Grounded Generation
if (matches.length === 0) return ABSTENTION_MESSAGE;
const answer = await generateGroundedAnswer(query, matches);
// Output: "CRISPR-Cas9 uses sgRNA [Source 1: p.2]..."`,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#0B1224] border-y border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span>HOW RAG WORKS (STEP BY STEP)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            The Science of Grounded Retrieval
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Retrieval-Augmented Generation replaces memorized guesses with traceable, evidence-backed answers. Here is what happens from your file upload to the final cited answer.
          </p>
        </div>

        {/* 5-Step Horizontal Navigation Bar (Desktop) / Vertical (Mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = activeStep === idx;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#101A30] border-cyan-400/60 shadow-lg shadow-cyan-950/50 -translate-y-1'
                    : 'bg-[#070B16]/70 border-white/5 hover:border-white/20 hover:bg-[#101A30]/50'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500" />
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                    STEP {item.step}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="font-semibold text-white text-sm font-['Space_Grotesk']">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {item.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Breakdown Card */}
        <div className="rounded-2xl bg-[#101A30] border border-cyan-500/30 p-6 sm:p-8 shadow-xl shadow-cyan-950/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left detail explanation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                  {steps[activeStep].step}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
                    {steps[activeStep].title}
                  </h3>
                  <div className="text-xs text-cyan-300 font-mono">
                    {steps[activeStep].subtitle}
                  </div>
                </div>
              </div>

              <p className="text-slate-200 text-base leading-relaxed">
                {steps[activeStep].summary}
              </p>

              <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-cyan-500/40 pl-3.5 italic">
                {steps[activeStep].detail}
              </p>

              {/* Progress step forward / backward */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev: number) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-white/10 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  ← Previous Step
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {activeStep + 1} of {steps.length}
                </span>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev: number) => Math.min(steps.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/40 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                  Next Step →
                </button>
              </div>
            </div>

            {/* Right code/data preview */}
            <div className="lg:col-span-5">
              <div className="rounded-xl bg-[#070B16] border border-white/10 overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-white/10 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>pipeline_stage_{steps[activeStep].step}.ts</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">EXECUTING</span>
                </div>
                <div className="p-4 text-slate-300 overflow-x-auto">
                  <pre className="text-cyan-200/90 whitespace-pre font-mono text-xs leading-relaxed">
                    {steps[activeStep].codeSnippet}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
