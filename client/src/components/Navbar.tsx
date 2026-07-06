import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Upload, FileText, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const navLinks = [
  { to: '/', label: 'Home', icon: Sparkles },
  { to: '/notes', label: 'My Notes', icon: FileText },
  { to: '/upload', label: 'Generate', icon: Upload },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700/50 shadow-lg shadow-slate-950/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-200">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              NoteAI
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  )}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
