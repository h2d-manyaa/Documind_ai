import React from 'react';
import { Layers, Cpu, Database, Sparkles, Shield, ArrowDown, FileSearch } from 'lucide-react';

export const Architecture: React.FC = () => {
  const tiers = [
    {
      title: '1. USER INTERFACE & INPUT',
      desc: 'Semantic HTML5, responsive layout, drag-and-drop document upload, and interactive question composer with suggested academic prompts.',
      icon: Layers,
      color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40',
    },
    {
      title: '2. APPLICATION ROUTER & VALIDATION',
      desc: 'File extension & MIME type checking, size enforcement (max 25MB), sanitization against path traversal, and multi-document filtering.',
      icon: Shield,
      color: 'border-blue-500/40 text-blue-300 bg-blue-950/40',
    },
    {
      title: '3. DOCUMENT PROCESSING & CHUNKING',
      desc: 'Page-by-page text extraction for PDF and TXT. Overlapping chunker (800 chars / 120 overlap) preserving syntactic boundaries.',
      icon: FileSearch,
      color: 'border-indigo-500/40 text-indigo-300 bg-indigo-950/40',
    },
    {
      title: '4. EMBEDDINGS & VECTOR DATABASE',
      desc: 'High-dimensional term vectors, inverse document frequency (IDF) weighting, and persistent cosine similarity indexing.',
      icon: Database,
      color: 'border-violet-500/40 text-violet-300 bg-violet-950/40',
    },
    {
      title: '5. STRICT GROUNDED GENERATION',
      desc: 'Bounded prompt assembly with untrusted document tagging, prompt injection defense, and strict abstention if evidence is insufficient.',
      icon: Cpu,
      color: 'border-purple-500/40 text-purple-300 bg-purple-950/40',
    },
    {
      title: '6. EVIDENCE RESPONSE & PROVENANCE',
      desc: 'Audited answer with inline citation tags [Source X], match percentage badges, and inspectable source passage drawer.',
      icon: Sparkles,
      color: 'border-pink-500/40 text-pink-300 bg-pink-950/40',
    },
  ];

  return (
    <section id="architecture" className="py-20 bg-[#070B16] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-mono">
            <span>TECHNICAL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Engineered for Grounded Accuracy
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            A transparent 6-tier pipeline guaranteeing zero hallucinations and complete traceability from original document to final response.
          </p>
        </div>

        {/* 6-Tier Pipeline Flow */}
        <div className="max-w-4xl mx-auto space-y-4">
          {tiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <React.Fragment key={idx}>
                <div className={`p-5 rounded-xl bg-[#0B1224] border ${tier.color} shadow-lg shadow-black/30 flex items-start sm:items-center gap-4 transition-all hover:scale-[1.01]`}>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${tier.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white font-mono tracking-wide">
                      {tier.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>
                  <span className="hidden sm:inline-block text-xs font-mono text-slate-500">
                    TIER 0{idx + 1}
                  </span>
                </div>

                {idx < tiers.length - 1 && (
                  <div className="flex justify-center -my-1">
                    <ArrowDown className="w-5 h-5 text-cyan-500/60 animate-bounce" style={{ animationDuration: '2.5s' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};
