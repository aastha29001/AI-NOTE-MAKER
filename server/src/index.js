import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    /\.vercel\.app$/,      // any vercel deployment
    /\.onrender\.com$/,    // render frontend if needed
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/upload', uploadRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Notemaker API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
