import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { HowRAGWorks } from './components/HowRAGWorks.tsx';
import { RagVsFineTuning } from './components/RagVsFineTuning.tsx';
import { UseCases } from './components/UseCases.tsx';
import { Architecture } from './components/Architecture.tsx';
import { SecuritySection } from './components/SecuritySection.tsx';
import { Workspace } from './components/Workspace.tsx';
import { Footer } from './components/Footer.tsx';
import { ragService } from './services/ragService.ts';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'workspace'>('landing');
  const [pendingQuery, setPendingQuery] = useState<string>('');

  const documents = ragService.getDocuments();
  const chunkCount = documents.reduce((sum, d) => sum + d.chunkCount, 0);

  const handleOpenWorkspace = (query?: string) => {
    if (query) {
      setPendingQuery(query);
    }
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreHowItWorks = () => {
    setActiveView('landing');
    setTimeout(() => {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#070B16] text-[#F4F7FF] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Header */}
      <Header
        activeView={activeView}
        onNavigate={view => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        documentCount={documents.length}
        chunkCount={chunkCount}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' ? (
          <div>
            <Hero
              onOpenWorkspace={() => handleOpenWorkspace()}
              onExploreHowItWorks={handleExploreHowItWorks}
            />
            <HowRAGWorks />
            <RagVsFineTuning />
            <UseCases onSelectUseCase={query => handleOpenWorkspace(query)} />
            <Architecture />
            <SecuritySection />
          </div>
        ) : (
          <Workspace
            initialQuery={pendingQuery}
            onClearInitialQuery={() => setPendingQuery('')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={view => {
        setActiveView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />
    </div>
  );
}
