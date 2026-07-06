import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../lib/notesStore.js';
import { askQuestion, generateSummary } from '../lib/noteGenerator.js';

const router = express.Router();

// GET /api/notes - get all notes
router.get('/', (req, res) => {
  const notes = getAllNotes();
  res.json({ notes, count: notes.length });
});

// GET /api/notes/:id - get single note
router.get('/:id', (req, res) => {
  const note = getNoteById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ note });
});

// POST /api/notes - create manual note
router.post('/', (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const note = createNote({ title, content, tags, source: 'manual' });
  res.status(201).json({ note });
});

// PUT /api/notes/:id - update note
router.put('/:id', (req, res) => {
  const { title, content, tags } = req.body;
  const note = updateNote(req.params.id, { title, content, tags });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json({ note });
});

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  const deleted = deleteNote(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Note not found' });
  res.json({ success: true, message: 'Note deleted' });
});

// POST /api/notes/:id/ask - Q&A on a note
router.post('/:id/ask', async (req, res) => {
  try {
    const note = getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    const context = note.originalText || note.content;
    const answer = await askQuestion(context, question);

    res.json({ answer });
  } catch (error) {
    console.error('Q&A error:', error);
    res.status(500).json({ error: error.message || 'Failed to answer question' });
  }
});

// POST /api/notes/:id/summarize
router.post('/:id/summarize', async (req, res) => {
  try {
    const note = getNoteById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const context = note.originalText || note.content;
    const summary = await generateSummary(context);

    res.json({ summary });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate summary' });
  }
});

export default router;
