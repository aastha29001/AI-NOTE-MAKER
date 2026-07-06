import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../lib/pdfParser.js';
import { generateNotes } from '../lib/noteGenerator.js';
import { createNote } from '../lib/notesStore.js';

const router = express.Router();

// Use memory storage - no files saved to disk
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// POST /api/upload/pdf
router.post('/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const { style = 'comprehensive', title } = req.body;
    const fileName = req.file.originalname;
    const noteTitle = title || fileName.replace('.pdf', '');

    // Extract text from PDF
    const { text, pages } = await extractTextFromPDF(req.file.buffer);

    if (!text || text.trim().length < 50) {
      return res.status(400).json({ error: 'PDF appears to be empty or unreadable (scanned image PDFs are not supported)' });
    }

    // Generate AI notes
    const generatedContent = await generateNotes(text, { title: noteTitle, style });

    // Save note
    const note = createNote({
      title: noteTitle,
      content: generatedContent,
      originalText: text.slice(0, 10000), // store first 10k chars
      source: 'pdf',
      sourceFileName: fileName,
      style,
      pages,
    });

    res.status(201).json({
      success: true,
      note,
      message: `Notes generated from ${pages} page(s)`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to process PDF' });
  }
});

// POST /api/upload/text - generate notes from raw text
router.post('/text', async (req, res) => {
  try {
    const { text, title = 'Text Note', style = 'comprehensive' } = req.body;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Text content is too short' });
    }

    const generatedContent = await generateNotes(text, { title, style });

    const note = createNote({
      title,
      content: generatedContent,
      originalText: text.slice(0, 10000),
      source: 'text',
      style,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate notes' });
  }
});

export default router;
