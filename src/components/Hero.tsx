import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Cpu,
  Database,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';

interface HeroProps {
  onOpenWorkspace: () => void;
  onExploreHowItWorks: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenWorkspace, onExploreHowItWorks }) => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(3);

  const pipelineSteps = [
    { label: '1. Ingest PDF & TXT', icon: FileText, color: 'text-cyan-400' },
    { label: '2. Split & Chunk', icon: Layers, color: 'text-blue-400' },
    { label: '3. Vector Embeddings', icon: Database, color: 'text-indigo-400' },
    { label: '4. Retrieve Evidence', icon: Search, color: 'text-violet-400' },
    { label: '5. Grounded Answer', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden tech-grid-bg">
      {/* Background radial luminous gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>INTELLIGENT DOCUMENT RETRIEVAL</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Space_Grotesk'] leading-[1.15]">
              Turn Your Documents Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
                Answers.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Upload your PDFs and text files. Ask questions in plain language. Get clear answers backed by the exact passages your documents contain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenWorkspace}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Start Asking Questions</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Microcopy & Trust signals */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>PDF & TXT support</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Source-backed answers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>Transparent retrieval</span>
              </div>
            </div>

            {/* Quick feature callouts for students */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="p-3 rounded-lg bg-[#0B1224]/80 border border-white/5">
                <div className="text-cyan-400 font-bold font-mono text-lg">100%</div>
                <div className="text-xs text-slate-400">Strictly Grounded</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1224]/80 border border-white/5">
                <div className="text-violet-400 font-bold font-mono text-lg">Traceable</div>
                <div className="text-xs text-slate-400">Exact Page Citations</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0B1224]/80 border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-emerald-400 font-bold font-mono text-lg">Zero-Slop</div>
                <div className="text-xs text-slate-400">Honest Abstention</div>
              </div>
            </div>
          </div>

          {/* Right Visual: Futuristic RAG Architecture Core */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-[#0B1224]/90 border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/50 glow-cyan backdrop-blur-xl">
              
              {/* Top Bar of the Visual Core */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">DOCUMIND_RAG_PIPELINE</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  LIVE SYSTEM
                </div>
              </div>

              {/* RAG Pipeline Flow Diagram */}
              <div className="space-y-3.5">
                {/* Stage 1: Document Inputs */}
                <div className="p-3 rounded-xl bg-[#101A30] border border-cyan-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Student Uploads</div>
                      <div className="text-[11px] text-slate-400 font-mono">Lecture_Notes.pdf · Paper.txt</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/20">
                    Extract Text
                  </span>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center -my-1 text-cyan-400/60">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 animate-pulse" />
                </div>

                {/* Stage 2: Chunking & Overlap */}
                <div className="p-3 rounded-xl bg-[#101A30] border border-blue-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Overlapping Chunking</div>
                      <div className="text-[11px] text-slate-400 font-mono">800 chars / 120 overlap</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-500/20">
                    Preserves Context
                  </span>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center -my-1 text-blue-400/60">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 animate-pulse" />
                </div>

                {/* Stage 3: Vector Database & Embeddings */}
                <div className="p-3 rounded-xl bg-[#101A30] border border-indigo-500/30 flex items-center justify-between relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Vector Index (Chroma / Pinecone)</div>
                      <div className="text-[11px] text-slate-400 font-mono">Embedding: [0.23, -0.11, 0.87...]</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                    Similarity Search
                  </span>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center -my-1 text-indigo-400/60">
                  <div className="h-4 w-0.5 bg-gradient-to-b from-indigo-500 to-violet-500 animate-pulse" />
                </div>

                {/* Stage 4: Retrieval + Grounded Answer Output */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#101A30] to-[#14223B] border border-violet-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-violet-300">
                      <Sparkles className="w-4 h-4 text-violet-400" />
                      <span>Evidence-Grounded Response</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Passages
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-white/5 text-xs text-slate-200 leading-relaxed font-sans">
                    "RAG dynamically retrieves relevant external chunks to ground the model prompt, eliminating parameter hallucinations."
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                      [Source 1: p. 1]
                    </span>
                  </div>
                </div>

              </div>

              {/* Interactive pipeline footer button */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ready to test with your own syllabus or notes?</span>
                <button
                  onClick={onOpenWorkspace}
                  className="text-xs font-mono font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
