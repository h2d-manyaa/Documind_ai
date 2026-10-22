import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, EyeOff, Trash2, Cpu } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const protections = [
    {
      title: 'Prompt Injection Defense',
      desc: 'Retrieved text is wrapped inside isolated untrusted envelopes. Malicious instructions embedded in documents (e.g., "ignore prior instructions") are neutralized before prompting.',
      icon: AlertTriangle,
    },
    {
      title: 'Strict Grounding & Abstention',
      desc: 'System prompt guardrails strictly prohibit the model from inventing unverified facts. If context is missing, the model returns an honest abstention rather than hallucinating.',
      icon: ShieldCheck,
    },
    {
      title: 'Zero Training on Uploads',
      desc: 'Your lecture notes, research drafts, and private documents are never used to train foundation models. Context is discarded after each query generation cycle.',
      icon: EyeOff,
    },
    {
      title: 'Complete Vector Deletion',
      desc: 'Deleting a document removes the raw file, its extracted passages, and all associated mathematical vectors from the memory store simultaneously.',
      icon: Trash2,
    },
    {
      title: 'Isolated Document Scoping',
      desc: 'Queries can be scoped to specific documents or whole workspace indexes, preventing context bleeding across unrelated academic subjects.',
      icon: Lock,
    },
    {
      title: 'Client & Server Sandboxing',
      desc: 'File formats are strictly validated (PDF, TXT) with maximum size thresholds (25MB) and content type integrity verification.',
      icon: Cpu,
    },
  ];

  return (
    <section id="security" className="py-20 bg-[#0B1224] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>SECURITY, INTEGRITY & PRIVACY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Built for Academic Integrity and Confidentiality
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Document intelligence requires uncompromising security. We treat all user documents as untrusted data inputs, protecting against hallucinations and injections.
          </p>
        </div>

        {/* Protection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {protections.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#101A30] border border-white/5 hover:border-emerald-500/40 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
