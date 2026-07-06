import { Link } from 'react-router-dom';
import { FileText, FileUp, Pencil, Trash2, Clock, File } from 'lucide-react';
import type { Note } from '../types';
import clsx from 'clsx';

interface Props {
  note: Note;
  onDelete: (id: string) => void;
}

const sourceIcons = {
  pdf: FileUp,
  text: FileText,
  manual: Pencil,
};

const sourceBadgeColors = {
  pdf: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  text: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  manual: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function NoteCard({ note, onDelete }: Props) {
  const Icon = sourceIcons[note.source];
  const timeAgo = formatRelative(note.createdAt);
  const preview = note.content.replace(/[#*`_>]/g, '').slice(0, 120) + '...';

  return (
    <div className="glass glass-hover rounded-2xl p-5 flex flex-col gap-3 group animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/notes/${note.id}`} className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate group-hover:text-primary-300 transition-colors">
            {note.title}
          </h3>
        </Link>
        <button
          onClick={() => onDelete(note.id)}
          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all duration-200 p-1 rounded-lg hover:bg-red-500/10 shrink-0"
          title="Delete note"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{preview}</p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className={clsx('flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border', sourceBadgeColors[note.source])}>
            <Icon size={11} />
            {note.source.toUpperCase()}
          </span>
          {note.pages && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <File size={11} />
              {note.pages}p
            </span>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={11} />
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
