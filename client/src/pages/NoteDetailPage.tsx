import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Download, Trash2, MessageSquare, AlignLeft,
  Send, Loader2, ChevronDown, ChevronUp, Copy, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { notesApi } from '../api/notesApi';
import MarkdownRenderer from '../components/MarkdownRenderer';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Note } from '../types';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      const data = await notesApi.getById(id!);
      setNote(data);
    } catch {
      toast.error('Note not found');
      navigate('/notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this note permanently?')) return;
    try {
      await notesApi.delete(id!);
      toast.success('Note deleted');
      navigate('/notes');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setAskLoading(true);
    try {
      const ans = await notesApi.askQuestion(id!, question);
      setAnswer(ans);
    } catch {
      toast.error('Failed to get answer');
    } finally {
      setAskLoading(false);
    }
  };

  const handleSummary = async () => {
    if (summary) { setShowSummary(!showSummary); return; }
    setSummaryLoading(true);
    try {
      const s = await notesApi.getSummary(id!);
      setSummary(s);
      setShowSummary(true);
    } catch {
      toast.error('Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCopy = () => {
    if (!note) return;
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!note) return;
    const blob = new Blob([note.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded as Markdown');
  };

  if (loading) return <div className="py-24 flex justify-center"><LoadingSpinner size={40} text="Loading note..." /></div>;
  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to="/notes" className="btn-secondary p-2 rounded-xl">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{note.title}</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {note.source.toUpperCase()} • {new Date(note.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
              {note.pages ? ` • ${note.pages} pages` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="btn-secondary flex items-center gap-2 text-sm">
            {copied ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
            Copy
          </button>
          <button onClick={handleDownload} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={15} />
            Download
          </button>
          <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Summary Toggle */}
      <div className="card border border-accent-500/20 bg-accent-500/5">
        <button
          onClick={handleSummary}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-accent-300 font-semibold">
            <AlignLeft size={18} />
            Quick Summary
          </div>
          {summaryLoading ? (
            <Loader2 size={18} className="animate-spin text-slate-500" />
          ) : showSummary ? (
            <ChevronUp size={18} className="text-slate-500" />
          ) : (
            <ChevronDown size={18} className="text-slate-500" />
          )}
        </button>

        {showSummary && summary && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 text-slate-300 text-sm leading-relaxed">
            {summary}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="card">
        <MarkdownRenderer content={note.content} />
      </div>

      {/* Q&A Section */}
      <div className="card border border-primary-500/20 bg-primary-500/5">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <MessageSquare size={20} className="text-primary-400" />
          Ask a Question
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Ask anything about this document..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !askLoading && handleAsk()}
            className="input-field flex-1"
          />
          <button
            onClick={handleAsk}
            disabled={askLoading || !question.trim()}
            className="btn-primary flex items-center gap-2 px-4"
          >
            {askLoading ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </div>

        {answer && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Answer</p>
            <p className="text-slate-200 text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
