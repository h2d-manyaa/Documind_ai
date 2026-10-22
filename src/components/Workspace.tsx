import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Search,
  Trash2,
  Sparkles,
  Send,
  Copy,
  Check,
  AlertCircle,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  X,
  ExternalLink,
  Info,
  Layers,
  FileUp,
} from 'lucide-react';
import {
  DocumentItem,
  DocumentChunk,
  ChatMessage,
  Citation,
  RetrievalResult,
} from '../types/index.ts';
import { ragService } from '../services/ragService.ts';
import { SourceModal } from './SourceModal.tsx';

interface WorkspaceProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ initialQuery, onClearInitialQuery }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(ragService.getDocuments());
  const [selectedDocId, setSelectedDocId] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<{ status: string; message: string } | null>(null);
  const [activeEvidence, setActiveEvidence] = useState<RetrievalResult[]>([]);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'docs' | 'evidence'>('chat');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [config, setConfig] = useState(ragService.getConfig());

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync documents list
  const refreshDocuments = () => {
    setDocuments(ragService.getDocuments());
  };

  useEffect(() => {
    refreshDocuments();
  }, []);

  // Handle incoming initial query from use-case chips on landing page
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInputValue(initialQuery);
      onClearInitialQuery?.();
      // focus textarea
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
    }
  }, [initialQuery]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processUploadedFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processUploadedFile = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'txt', 'text', 'md'].includes(ext)) {
      alert('Supported file formats are PDF (.pdf) and Text files (.txt, .md).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('File size exceeds the 25MB limit.');
      return;
    }

    setUploadStatus({ status: 'uploading', message: `Uploading ${file.name}...` });

    try {
      await ragService.ingestFile(file, (status, message) => {
        setUploadStatus({ status, message });
        refreshDocuments();
      });

      refreshDocuments();
      setTimeout(() => {
        setUploadStatus(null);
      }, 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload processing failed.';
      setUploadStatus({ status: 'failed', message: msg });
    }
  };

  const handleDeleteDocument = async (id: string, name: string) => {
    if (confirm(`Remove "${name}" and all its vector chunks from the index?`)) {
      await ragService.deleteDocument(id);
      refreshDocuments();
      if (selectedDocId === id) {
        setSelectedDocId('all');
      }
    }
  };

  const handleResetSamples = () => {
    // Re-initialize sample files
    window.location.reload();
  };

  // Submit query
  const handleSend = async (queryText?: string) => {
    const query = (queryText || inputValue).trim();
    if (!query || isLoading) return;

    if (documents.length === 0) {
      alert('Please upload a PDF or TXT document first.');
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const docScope = selectedDocId === 'all' ? undefined : [selectedDocId];
      const result = await ragService.askQuestion(query, { documentIds: docScope });

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: result.citations,
        retrievalResults: result.retrievalResults,
        isAbstention: result.isAbstention,
        latencyMs: result.latencyMs,
        modelUsed: result.modelUsed,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setActiveEvidence(result.retrievalResults);

      // On mobile, if evidence found, keep chat or show notification badge
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during retrieval.';
      const errorMessage: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `Error: ${errorMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAbstention: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const sampleSuggestions = [
    'Explain the core components of RAG architecture from the notes',
    'How does CRISPR-Cas9 locate target DNA using PAM sequences?',
    'What is the difference between RAG and Model Fine-Tuning?',
    'What are the chunk size and overlap recommendations?',
    'What is the capital of Mars? (Test Abstention Policy)',
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Workspace Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk']">
              Document Research Workspace
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              Active Index
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            Grounding on {documents.length} document(s) · {ragService.getDocuments().reduce((a, b) => a + b.chunkCount, 0)} indexed passages
          </p>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-3">
          {/* Document Scope Filter Selector */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 hidden md:inline">Scope:</span>
            <select
              value={selectedDocId}
              onChange={e => setSelectedDocId(e.target.value)}
              className="bg-[#0B1224] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Documents ({documents.length})</option>
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name.length > 25 ? d.name.slice(0, 22) + '...' : d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Config Settings Toggle */}
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="p-1.5 rounded-lg border border-white/10 bg-[#0B1224] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Configure RAG Parameters (Chunk size, overlap, Top-K)"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear the conversation history?')) {
                  setMessages([]);
                  setActiveEvidence([]);
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* RAG Parameter Settings Drawer (Collapsible) */}
      {isConfigOpen && (
        <div className="mb-4 p-4 rounded-xl bg-[#0B1224] border border-cyan-500/30 text-xs font-mono grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fadeIn">
          <div>
            <label className="text-slate-400 block mb-1">Chunk Size (chars)</label>
            <input
              type="number"
              value={config.chunkSize}
              onChange={e => {
                const val = parseInt(e.target.value, 10) || 800;
                setConfig(prev => ({ ...prev, chunkSize: val }));
                ragService.updateConfig({ chunkSize: val });
              }}
              className="w-full bg-[#101A30] border border-white/10 rounded px-2.5 py-1 text-cyan-300"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Chunk Overlap (chars)</label>
            <input
              type="number"
              value={config.chunkOverlap}
              onChange={e => {
                const val = parseInt(e.target.value, 10) || 120;
                setConfig(prev => ({ ...prev, chunkOverlap: val }));
                ragService.updateConfig({ chunkOverlap: val });
              }}
              className="w-full bg-[#101A30] border border-white/10 rounded px-2.5 py-1 text-cyan-300"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Top-K Retrieved</label>
            <input
              type="number"
              value={config.topK}
              onChange={e => {
                const val = parseInt(e.target.value, 10) || 5;
                setConfig(prev => ({ ...prev, topK: val }));
                ragService.updateConfig({ topK: val });
              }}
              className="w-full bg-[#101A30] border border-white/10 rounded px-2.5 py-1 text-cyan-300"
            />
          </div>
          <div className="flex items-end">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300">
              Strict Grounding Guardrails: <span className="font-bold text-emerald-400">ENABLED</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Tab Navigation Switches */}
      <div className="flex sm:hidden items-center justify-around mb-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setMobileTab('docs')}
          className={`text-xs font-mono py-1 px-3 rounded-lg ${
            mobileTab === 'docs' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          onClick={() => setMobileTab('chat')}
          className={`text-xs font-mono py-1 px-3 rounded-lg ${
            mobileTab === 'chat' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Chat & Answers
        </button>
        <button
          onClick={() => setMobileTab('evidence')}
          className={`text-xs font-mono py-1 px-3 rounded-lg ${
            mobileTab === 'evidence' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Evidence ({activeEvidence.length})
        </button>
      </div>

      {/* 3-Column Coordinated Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Document Management & Upload (col-span-3)                    */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-3 space-y-4 ${mobileTab !== 'docs' ? 'hidden sm:block' : ''}`}>
          
          {/* Upload Drop Zone Card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-5 rounded-2xl border-2 border-dashed transition-all text-center relative overflow-hidden ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/40'
                : 'border-cyan-500/30 bg-[#0B1224]/80 hover:border-cyan-400/60 hover:bg-[#101A30]/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.text,.md"
              onChange={handleFileInputChange}
              className="hidden"
              id="doc-file-input"
            />

            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 mx-auto flex items-center justify-center text-cyan-400 mb-3">
              <UploadCloud className="w-6 h-6 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>

            <div className="text-sm font-bold text-white font-['Space_Grotesk']">
              Upload Your Documents
            </div>
            <p className="text-xs text-slate-400 mt-1 mb-3">
              Drag & drop PDF or TXT files here, or browse from device (max 25MB).
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Select PDF / TXT</span>
            </button>

            {/* Active Uploading / Processing State feedback */}
            {uploadStatus && (
              <div className="mt-3 p-2.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs font-mono text-left">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="uppercase">{uploadStatus.status}</span>
                </div>
                <div className="text-slate-300 truncate">{uploadStatus.message}</div>
              </div>
            )}
          </div>

          {/* Document Library List */}
          <div className="rounded-2xl bg-[#0B1224] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Indexed Files ({documents.length})
                </span>
              </div>
              <button
                onClick={handleResetSamples}
                className="text-[10px] font-mono text-cyan-400 hover:underline"
                title="Restore default academic lecture notes"
              >
                Reset Samples
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs font-mono">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedDocId === doc.id
                        ? 'bg-[#101A30] border-cyan-500/60 shadow-md shadow-cyan-950/30'
                        : 'bg-[#070B16] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {doc.type}
                        </span>
                        <div className="text-xs font-medium text-white truncate max-w-[160px]" title={doc.name}>
                          {doc.name}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteDocument(doc.id, doc.name)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="Delete document and remove vector chunks"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{doc.chunkCount} chunks · {doc.pageCount} page(s)</span>
                      <span className="text-emerald-400 font-bold">Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Interactive Conversation Stream & Composer (col-span-6)    */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-6 flex flex-col h-[640px] rounded-2xl bg-[#0B1224] border border-white/10 overflow-hidden shadow-2xl ${mobileTab !== 'chat' ? 'hidden sm:flex' : ''}`}>
          
          {/* Messages Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Empty State */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-950/40">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    Your documents are ready to think with.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Ask a question to discover the most relevant information in your uploaded files. All answers are strictly grounded with inspectable citations.
                  </p>
                </div>

                {/* Suggested prompt chips */}
                <div className="w-full max-w-lg space-y-2 text-left pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Suggested Questions to Try:</span>
                  </div>
                  <div className="space-y-1.5">
                    {sampleSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#101A30] hover:bg-[#14223B] border border-white/5 hover:border-cyan-500/40 text-xs text-slate-200 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <span className="truncate pr-2">{suggestion}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                } space-y-1.5`}
              >
                {/* Author Label */}
                <div className="text-[10px] font-mono text-slate-400 px-1">
                  {msg.role === 'user' ? 'You' : `DocuMind AI · ${msg.modelUsed || 'Grounded Engine'}`} · {msg.timestamp}
                </div>

                {/* Bubble Container */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl max-w-[90%] text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-lg shadow-cyan-950/30'
                      : 'bg-[#101A30] text-slate-200 border border-white/10 rounded-tl-none shadow-xl shadow-black/40'
                  }`}
                >
                  {/* Warning / Abstention Banner if triggered */}
                  {msg.isAbstention && (
                    <div className="mb-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs font-mono text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Strict Grounding Abstention</div>
                        <div className="text-amber-200/80 mt-0.5">
                          The system refused to guess because the uploaded documents lack sufficient context for this prompt.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Text with Clickable Citations */}
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed select-text">
                    {msg.content.split(/(\[Source\s+\d+[^\]]*\])/g).map((part, pIdx) => {
                      const match = part.match(/\[Source\s+(\d+)/i);
                      if (match) {
                        const sourceNum = parseInt(match[1], 10);
                        const citation = msg.citations?.find(c => c.sourceNumber === sourceNum);
                        return (
                          <button
                            key={pIdx}
                            onClick={() => {
                              if (citation) {
                                setSelectedCitation(citation);
                              }
                            }}
                            className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 hover:bg-cyan-900/80 font-mono text-xs font-bold transition-colors cursor-pointer"
                            title={`Inspect Source ${sourceNum}: ${citation?.documentName || 'Passage'}`}
                          >
                            <Bookmark className="w-3 h-3 text-cyan-400" />
                            <span>Source {sourceNum}</span>
                          </button>
                        );
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                  </div>

                  {/* Message Action Bar for Assistant */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        {msg.latencyMs && (
                          <span className="text-[10px] text-cyan-400">
                            Latency: {msg.latencyMs}ms
                          </span>
                        )}
                        {msg.citations && msg.citations.length > 0 && (
                          <span className="text-[10px] text-emerald-400 font-bold">
                            {msg.citations.length} cited source(s)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer p-1"
                        title="Copy answer to clipboard"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start space-y-1.5">
                <div className="p-4 rounded-2xl bg-[#101A30] border border-cyan-500/30 rounded-tl-none space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Executing Semantic Vector Retrieval...</span>
                  </div>
                  <div className="flex gap-1.5 py-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Question Composer Box */}
          <div className="p-4 border-t border-white/10 bg-[#070B16]">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="relative rounded-xl bg-[#101A30] border border-cyan-500/30 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400 transition-all"
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  documents.length === 0
                    ? 'Upload a document to ask questions...'
                    : 'Ask any question about your documents (Enter to submit, Shift+Enter for newline)...'
                }
                disabled={documents.length === 0 || isLoading}
                rows={2}
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none resize-none font-sans"
              />

              <div className="flex items-center justify-between px-3 py-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                <span className="hidden sm:inline">
                  Strict Evidence Mode Active · Enter to send
                </span>

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading || documents.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <span>Query</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Retrieved Evidence & Source Inspector (col-span-3)          */}
        {/* ========================================================================= */}
        <div className={`lg:col-span-3 space-y-4 ${mobileTab !== 'evidence' ? 'hidden sm:block' : ''}`}>
          
          <div className="rounded-2xl bg-[#0B1224] border border-white/10 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Evidence Inspector
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
                {activeEvidence.length} Chunks
              </span>
            </div>

            {activeEvidence.length === 0 ? (
              <div className="text-center py-12 px-3 text-slate-400 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-slate-300 font-mono">
                  No Active Query Evidence
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Submit a question in the chat to see the retrieved text passages, similarity scores, and exact page markers.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
                {activeEvidence.map((res, idx) => {
                  const sourceNum = idx + 1;
                  const { chunk, score, matchedKeywords } = res;
                  const matchPct = Math.round(score * 100);

                  return (
                    <div
                      key={chunk.id}
                      className="p-3.5 rounded-xl bg-[#101A30] border border-cyan-500/20 hover:border-cyan-500/50 transition-all space-y-2 group"
                    >
                      {/* Source Header */}
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                          Source {sourceNum}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 font-bold">
                          {matchPct}% Match
                        </span>
                      </div>

                      {/* File & Page */}
                      <div className="text-xs font-semibold text-white truncate" title={chunk.documentName}>
                        {chunk.documentName}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                        <span>Page {chunk.pageNumber}</span>
                        <span>·</span>
                        <span>Chunk #{chunk.chunkIndex}</span>
                      </div>

                      {/* Snippet */}
                      <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3 italic bg-[#070B16] p-2 rounded-lg border border-white/5">
                        "{chunk.text.slice(0, 150)}..."
                      </p>

                      {/* Matched Keywords Tags */}
                      {matchedKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {matchedKeywords.slice(0, 3).map((kw, kIdx) => (
                            <span
                              key={kIdx}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-white/5"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Inspect Action */}
                      <button
                        onClick={() => {
                          setSelectedCitation({
                            sourceNumber: sourceNum,
                            documentId: chunk.documentId,
                            documentName: chunk.documentName,
                            pageNumber: chunk.pageNumber,
                            chunkIndex: chunk.chunkIndex,
                            excerpt: chunk.text,
                            score,
                          });
                        }}
                        className="w-full mt-1 pt-1.5 border-t border-white/5 text-[11px] font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 flex items-center justify-between cursor-pointer"
                      >
                        <span>Inspect Full Passage</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Full Passage Inspector Modal */}
      <SourceModal
        citation={selectedCitation}
        fullChunk={selectedCitation ? ragService.getChunk(`${selectedCitation.documentId}_p${selectedCitation.pageNumber}_c${selectedCitation.chunkIndex}`) : null}
        onClose={() => setSelectedCitation(null)}
      />

    </div>
  );
};
