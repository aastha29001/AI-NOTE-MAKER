import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="text-center py-4 text-slate-600 text-sm border-t border-slate-800">
        NoteAI — Powered by Groq &amp; LangChain
      </footer>
    </div>
  );
}
