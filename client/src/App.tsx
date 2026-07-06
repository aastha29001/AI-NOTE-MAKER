import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import UploadPage from './pages/UploadPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="notes/:id" element={<NoteDetailPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
    </Routes>
  );
}

export default App;
