import React, { useState } from 'react';
import { X, Copy, Check, FileText, Hash, Bookmark, ExternalLink } from 'lucide-react';
import { Citation, DocumentChunk } from '../types/index.ts';

interface SourceModalProps {
  citation: Citation | null;
  fullChunk?: DocumentChunk | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ citation, fullChunk, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!citation) return null;

  const textToDisplay = fullChunk?.text || citation.excerpt;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0B1224] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#101A30]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs">
              S{citation.sourceNumber}
            </span>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-md">
                {citation.documentName}
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300">
                  <Bookmark className="w-3 h-3" /> Page {citation.pageNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" /> Chunk #{citation.chunkIndex}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {Math.round(citation.score * 100)}% Match
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Passage text */}
        <div className="p-6 overflow-y-auto space-y-4 font-sans text-sm leading-relaxed text-slate-200">
          <div className="p-4 rounded-xl bg-[#070B16] border border-white/10 font-mono text-xs text-cyan-100 whitespace-pre-wrap leading-relaxed select-text">
            {textToDisplay}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
            <span>Passage length: {textToDisplay.length} characters</span>
            <span className="text-emerald-400 font-mono">Status: Verified Grounded Chunk</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#101A30] flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Source ID: {citation.documentId}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-white/10 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Passage</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
