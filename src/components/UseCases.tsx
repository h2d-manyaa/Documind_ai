import React from 'react';
import {
  GraduationCap,
  Microscope,
  Briefcase,
  FileSpreadsheet,
  Code2,
  Library,
  ArrowRight,
} from 'lucide-react';

interface UseCasesProps {
  onSelectUseCase: (sampleQuery: string) => void;
}

export const UseCases: React.FC<UseCasesProps> = ({ onSelectUseCase }) => {
  const cases = [
    {
      title: 'Study Companion & Exam Prep',
      description: 'Upload your lecture slide PDFs, syllabus, and study notes. Ask the assistant to clarify tough definitions or explain core algorithms.',
      icon: GraduationCap,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      sampleQuery: 'Explain the core components of RAG architecture from the lecture notes',
      category: 'Education & Academics',
    },
    {
      title: 'Research Assistant',
      description: 'Analyze dense academic papers, scientific literature, and theses. Trace claims back to specific equations and page references.',
      icon: Microscope,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      sampleQuery: 'How does CRISPR-Cas9 locate target DNA using PAM sequences?',
      category: 'Scientific Research',
    },
    {
      title: 'Business Knowledge Search',
      description: 'Query company operating procedures, employee handbooks, compliance policies, and internal wikis with exact evidence citations.',
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      sampleQuery: 'What are the security and compliance requirements for document handling?',
      category: 'Enterprise Knowledge',
    },
    {
      title: 'Report Intelligence',
      description: 'Extract key financial indicators, audit conclusions, and quarterly summaries across multi-page annual reports and market whitepapers.',
      icon: FileSpreadsheet,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      sampleQuery: 'What are the main findings and risk factors outlined in the report?',
      category: 'Financial & Strategic',
    },
    {
      title: 'Technical Documentation',
      description: 'Navigate complex developer manuals, SDK references, and API specifications. Find configuration flags and architectural designs instantly.',
      icon: Code2,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      sampleQuery: 'What is the recommended chunk size and overlap for dense text documents?',
      category: 'Software Engineering',
    },
    {
      title: 'Personal Knowledge Library',
      description: 'Turn your personal markdown archives, journal entries, and reading notes into an interactive, privately searchable intelligence hub.',
      icon: Library,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      sampleQuery: 'Summarize the primary takeaways across all active documents',
      category: 'Personal Productivity',
    },
  ];

  return (
    <section id="use-cases" className="py-20 bg-[#0B1224] border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span>REAL-WORLD APPLICATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Built for Every Document-Intensive Workflow
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Whether preparing for midterm exams, synthesizing clinical genetics research, or auditing business reports, DocuMind AI ensures every answer is grounded in your files.
          </p>
        </div>

        {/* 6 Cards Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-2xl bg-[#101A30] border border-white/5 hover:border-cyan-500/40 hover:bg-[#14223B] transition-all flex flex-col justify-between hover:-translate-y-1 shadow-lg shadow-black/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-white/5">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5">
                  <button
                    onClick={() => onSelectUseCase(item.sampleQuery)}
                    className="w-full inline-flex items-center justify-between text-xs font-mono font-medium text-cyan-400 group-hover:text-cyan-300 py-1 cursor-pointer"
                  >
                    <span className="truncate pr-2">Try: "{item.sampleQuery}"</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
