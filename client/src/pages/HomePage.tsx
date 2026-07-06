import { Link } from 'react-router-dom';
import { Upload, FileText, Brain, Sparkles, Zap, BookOpen, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'PDF Upload',
    desc: 'Drop any PDF and let AI extract and structure key information into clean notes.',
    color: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-500/10 border-rose-500/20',
  },
  {
    icon: Brain,
    title: 'AI Note Generation',
    desc: 'Powered by Groq\'s LLaMA 3 model — fast, accurate, and completely free.',
    color: 'from-primary-500 to-cyan-400',
    bg: 'bg-primary-500/10 border-primary-500/20',
  },
  {
    icon: FileText,
    title: 'Smart Summaries',
    desc: 'Get concise summaries, key takeaways, and structured outlines automatically.',
    color: 'from-accent-500 to-pink-400',
    bg: 'bg-accent-500/10 border-accent-500/20',
  },
  {
    icon: Zap,
    title: 'Ask Questions',
    desc: 'Chat with your notes — ask anything about the document and get instant answers.',
    color: 'from-amber-500 to-yellow-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
];

const steps = [
  { step: '01', title: 'Upload or Paste', desc: 'Upload a PDF or paste your text content' },
  { step: '02', title: 'AI Processes', desc: 'LLaMA 3 via Groq reads and understands the content' },
  { step: '03', title: 'Get Notes', desc: 'Receive beautifully structured notes instantly' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 animate-fade-in">
      {/* Hero */}
      <section className="text-center pt-12 pb-4 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium px-4 py-1.5 rounded-full">
          <Sparkles size={14} />
          Powered by Groq + LLaMA 3 — 100% Free
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
          <span className="text-white">Turn any document into</span>
          <br />
          <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-pink-400 bg-clip-text text-transparent">
            smart study notes
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
          Upload PDFs or paste text and let AI generate structured, comprehensive notes in seconds. Perfect for students and researchers.
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <Upload size={17} />
            Start Generating Notes
          </Link>
          <Link to="/notes" className="btn-secondary flex items-center gap-2">
            <BookOpen size={17} />
            View My Notes
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-center text-white mb-8">Everything you need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className={`card border ${bg} hover:scale-[1.02] transition-transform duration-200`}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="text-center">
        <h2 className="text-2xl font-bold text-white mb-10">How it works</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {steps.map(({ step, title, desc }, i) => (
            <div key={step} className="flex items-center gap-4">
              <div className="card text-left w-56 hover:border-primary-500/40 transition-colors duration-200">
                <span className="text-4xl font-black bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                  {step}
                </span>
                <h3 className="font-semibold text-white mt-2 mb-1">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={20} className="text-slate-600 hidden sm:block shrink-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-accent-500/5 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to study smarter?</h2>
        <p className="text-slate-400 mb-6">Upload your first document and see the magic happen.</p>
        <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
          <Sparkles size={17} />
          Generate Notes Now
        </Link>
      </section>
    </div>
  );
}
