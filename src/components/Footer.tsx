import React from 'react';
import { Sparkles, Shield, Cpu, Database, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'workspace') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    onNavigate('landing');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-[#070B16] border-t border-white/10 text-slate-400 py-12 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#070B16] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-white font-['Space_Grotesk'] text-lg">
                DocuMind <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Your Documents. Your Knowledge. One Intelligent Search. Purpose-built for students, researchers, and technical workflows.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Platform
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => scrollTo('overview')} className="hover:text-cyan-300 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('how-it-works')} className="hover:text-cyan-300 transition-colors">
                  How RAG Works
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('rag-vs-finetuning')} className="hover:text-cyan-300 transition-colors">
                  RAG vs Fine-Tuning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workspace')} className="text-cyan-400 hover:text-cyan-300 font-bold">
                  Open Workspace →
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Technology
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li>
                <button onClick={() => scrollTo('architecture')} className="hover:text-cyan-300 transition-colors">
                  6-Tier Architecture
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('use-cases')} className="hover:text-cyan-300 transition-colors">
                  Academic Use Cases
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('security')} className="hover:text-cyan-300 transition-colors">
                  Security & Abstention
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy Note */}
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Grounding Policy
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              DocuMind AI guarantees that all statements are accompanied by traceable [Source X] citations. When context is missing, the engine abstains.
            </p>
          </div>
        </div>

        {/* Bottom Technical Note */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div>
            © {currentYear} DocuMind AI. All rights reserved.
          </div>
          <div className="text-center sm:text-right text-[11px] text-slate-400">
            Powered by retrieval-augmented generation. Answers depend on the content and quality of the uploaded documents.
          </div>
        </div>

      </div>
    </footer>
  );
};
