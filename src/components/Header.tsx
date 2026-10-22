import React, { useState } from 'react';
import { Sparkles, FileText, Database, Shield, BookOpen, Layers, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeView: 'landing' | 'workspace';
  onNavigate: (view: 'landing' | 'workspace') => void;
  documentCount: number;
  chunkCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigate,
  documentCount,
  chunkCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    if (activeView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#070B16]/85 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-lg p-1"
          aria-label="DocuMind AI Home"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
            <div className="w-full h-full bg-[#070B16] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-white font-['Space_Grotesk'] text-lg">
              DocuMind <span className="text-cyan-400 font-extrabold">AI</span>
            </div>
            <div className="text-[10px] tracking-wider uppercase text-slate-400 font-mono -mt-1">
              Document Intelligence
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300" aria-label="Main Navigation">
          <button
            onClick={() => scrollToSection('overview')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('rag-vs-finetuning')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            RAG vs Fine-Tuning
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Use Cases
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Security
          </button>
        </nav>

        {/* Right Action / Engine Status */}
        <div className="hidden sm:flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300"
            title={`${documentCount} document(s), ${chunkCount} passage chunks active in semantic index`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">RAG:</span>
            <span>{chunkCount} Chunks</span>
          </div>

          <button
            onClick={() => onNavigate(activeView === 'workspace' ? 'landing' : 'workspace')}
            className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/40 transition-all cursor-pointer"
          >
            {activeView === 'workspace' ? (
              <>
                <BookOpen className="w-4 h-4" />
                <span>View Overview</span>
              </>
            ) : (
              <>
                <span>Open Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onNavigate(activeView === 'workspace' ? 'landing' : 'workspace')}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-cyan-500 text-slate-950"
          >
            {activeView === 'workspace' ? 'Docs' : 'Workspace'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1224] border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5 text-xs font-mono text-cyan-300">
            <span>RAG Vector Store Active</span>
            <span className="text-emerald-400 font-bold">{chunkCount} chunks indexed</span>
          </div>
          <button
            onClick={() => scrollToSection('overview')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('rag-vs-finetuning')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            RAG vs Fine-Tuning
          </button>
          <button
            onClick={() => scrollToSection('use-cases')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            Use Cases
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            Architecture
          </button>
          <button
            onClick={() => scrollToSection('security')}
            className="block w-full text-left py-2 text-slate-300 hover:text-cyan-300 text-sm"
          >
            Security
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg text-center font-medium text-sm text-white bg-gradient-to-r from-cyan-500 to-violet-600"
            >
              Enter RAG Workspace
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
