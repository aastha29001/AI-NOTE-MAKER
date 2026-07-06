import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle, AlertCircle, FileUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadApi } from '../api/notesApi';
import type { NoteStyle } from '../types';
import clsx from 'clsx';

const styles: { value: NoteStyle; label: string; desc: string }[] = [
  { value: 'comprehensive', label: 'Comprehensive', desc: 'Detailed notes with all key points' },
  { value: 'concise', label: 'Concise', desc: 'Short bullet-point style notes' },
  { value: 'structured', label: 'Structured', desc: 'Organized with clear hierarchy' },
];

type Mode = 'pdf' | 'text';

export default function UploadPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState<NoteStyle>('comprehensive');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0]);
      if (!title) setTitle(accepted[0].name.replace('.pdf', ''));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    onDropRejected: () => toast.error('Invalid file. Only PDFs up to 20MB allowed.'),
  });

  const handleSubmit = async () => {
    if (mode === 'pdf' && !file) {
      toast.error('Please select a PDF file');
      return;
    }
    if (mode === 'text' && text.trim().length < 20) {
      toast.error('Please enter at least 20 characters of text');
      return;
    }

    // Auto-generate title if blank
    const finalTitle = title.trim() ||
      (mode === 'pdf' && file ? file.name.replace('.pdf', '') : `Note – ${new Date().toLocaleDateString('en-IN')}`);

    setLoading(true);
    setProgress(0);

    try {
      let note;
      if (mode === 'pdf') {
        toast.loading('Uploading & processing PDF...', { id: 'gen' });
        note = await uploadApi.uploadPDF(file!, style, finalTitle, setProgress);
      } else {
        toast.loading('Generating notes with AI...', { id: 'gen' });
        note = await uploadApi.generateFromText(text, finalTitle, style);
      }

      toast.success('Notes generated successfully!', { id: 'gen' });
      navigate(`/notes/${note.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to generate notes';
      toast.error(msg, { id: 'gen' });
      console.error('Generation error:', err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Generate Notes</h1>
        <p className="text-slate-400 mt-1">Upload a PDF or paste text to create AI-powered study notes</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-slate-800/50 rounded-xl p-1 gap-1">
        {([['pdf', 'PDF Upload', FileUp], ['text', 'Paste Text', FileText]] as const).map(([m, label, Icon]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              mode === m
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Note Title <span className="text-slate-500 font-normal">(optional)</span></label>
        <input
          type="text"
          placeholder="e.g. Chapter 3 – Machine Learning Basics (auto-generated if empty)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Upload Area */}
      {mode === 'pdf' ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">PDF File</label>
          {file ? (
            <div className="card border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={clsx(
                'border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200',
                isDragActive
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-slate-700 hover:border-primary-500/50 hover:bg-slate-800/30'
              )}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <Upload size={24} className={isDragActive ? 'text-primary-400' : 'text-slate-500'} />
                </div>
                <div>
                  <p className="text-slate-300 font-medium">
                    {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">or click to browse — Max 20MB</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Text Content</label>
          <textarea
            placeholder="Paste your lecture notes, article, or any text content here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            className="input-field resize-none"
          />
          <p className="text-slate-600 text-xs">{text.length} characters</p>
        </div>
      )}

      {/* Note Style */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">Note Style</label>
        <div className="grid grid-cols-3 gap-3">
          {styles.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => setStyle(value)}
              className={clsx(
                'card text-left transition-all duration-200 cursor-pointer',
                style === value
                  ? 'border-primary-500/50 bg-primary-500/10'
                  : 'hover:border-slate-600'
              )}
            >
              <p className={clsx('font-semibold text-sm', style === value ? 'text-primary-300' : 'text-white')}>
                {label}
              </p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {loading && progress > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary flex items-center justify-center gap-2 py-3"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating notes with AI...
          </>
        ) : (
          <>
            <Upload size={18} />
            Generate Notes
          </>
        )}
      </button>

      {loading && (
        <p className="text-center text-slate-500 text-sm animate-pulse">
          This may take 15–30 seconds for large documents...
        </p>
      )}
    </div>
  );
}
