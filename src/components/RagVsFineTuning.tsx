import React from 'react';
import { Check, X, Scale, Zap, RefreshCw, DollarSign, Database, BrainCircuit } from 'lucide-react';

export const RagVsFineTuning: React.FC = () => {
  return (
    <section id="rag-vs-finetuning" className="py-20 bg-[#070B16] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Scale className="w-3.5 h-3.5 text-violet-400" />
            <span>ARCHITECTURE DECISION MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            RAG vs Fine-Tuning: Which Fits Your Needs?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            A key concept for computer science students and engineers: when should you use Retrieval-Augmented Generation instead of retraining model weights?
          </p>
        </div>

        {/* Split Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* RAG Card (Hero Recommendation) */}
          <div className="rounded-2xl bg-[#0B1224] border-2 border-cyan-500/50 p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-cyan-950/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-slate-950 text-xs font-bold font-mono px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              RECOMMENDED FOR DOC QA
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                    RAG (DocuMind AI)
                  </h3>
                  <div className="text-xs text-cyan-400 font-mono">
                    Retrieval-Augmented Generation
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Connects an LLM to your private PDF and TXT files via semantic vector search. The model reads verified context before crafting its answer.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">No Model Training Required:</span>
                    <span className="text-slate-400 ml-1">Runs immediately without training loops or GPU clusters.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Instantly Updatable:</span>
                    <span className="text-slate-400 ml-1">Drop a new lecture PDF or syllabus file and it's queryable in seconds.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Traceable Source Citations:</span>
                    <span className="text-slate-400 ml-1">Every answer cites [Source X] with filename and page numbers for auditability.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Strict Abstention Guardrail:</span>
                    <span className="text-slate-400 ml-1">Explicitly states when documents lack information instead of guessing.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Cost & Energy Efficient:</span>
                    <span className="text-slate-400 ml-1">Fraction of the compute cost of fine-tuning foundation models.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Ideal for: Lecture notes, study guides, research papers, legal documents, and private enterprise manuals.</span>
            </div>
          </div>

          {/* Fine-Tuning Card */}
          <div className="rounded-2xl bg-[#0B1224] border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center text-violet-300">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                    Model Fine-Tuning
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Weight Adjustment & Retraining
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Modifies the internal neural network parameters (weights) of a base foundation model using thousands of paired training examples.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Requires Heavy Compute:</span>
                    <span className="text-slate-400 ml-1">Needs dedicated high-end GPU clusters (A100/H100) and substantial time.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Difficult to Update:</span>
                    <span className="text-slate-400 ml-1">Adding newly published documents requires a completely new training run.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">No Provenance or Page Numbers:</span>
                    <span className="text-slate-400 ml-1">Generates responses from weight probabilities without inspectable sources.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Hallucination Risk Remains:</span>
                    <span className="text-slate-400 ml-1">Fine-tuned models still hallucinate facts when queried on edge cases.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-white">Great For Tone & Syntax:</span>
                    <span className="text-slate-400 ml-1">Excels at teaching specific stylistic formats, specialized code, or JSON syntax.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-3 rounded-xl bg-slate-900 border border-white/5 text-xs font-mono text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Ideal for: Custom character personas, specialized coding DSLs, or rigid structured formatting.</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
