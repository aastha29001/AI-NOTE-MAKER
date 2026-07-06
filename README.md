# NoteAI – AI-Powered Notetaking App

A full-stack AI notetaking web app built with **React + Vite + Tailwind CSS** on the frontend and **Node.js + Express + LangChain + Groq** on the backend.

## Features
- 📄 Upload PDFs and auto-generate structured notes
- ✍️ Paste text to generate notes
- 🧠 Three note styles: Comprehensive, Concise, Structured
- 💬 Ask questions about your documents (Q&A)
- 📝 Quick AI summaries
- 📥 Download notes as Markdown
- 🎨 Dark glassmorphism UI

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 19, Vite, TypeScript, Tailwind CSS |
| Backend   | Node.js, Express                  |
| AI        | LangChain + Groq (LLaMA 3 8B — Free) |
| PDF       | pdf-parse                         |

## Setup

### 1. Get a free Groq API Key
Go to [https://console.groq.com](https://console.groq.com) → sign up → API Keys → Create Key

### 2. Backend setup
```bash
cd server
# Rename .env.example to .env and paste your key
# GROQ_API_KEY=your_key_here
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

### 4. Open the app
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure
```
Ai Note Maker/
├── server/
│   ├── src/
│   │   ├── index.js
│   │   ├── lib/
│   │   │   ├── groqClient.js
│   │   │   ├── pdfParser.js
│   │   │   ├── noteGenerator.js
│   │   │   └── notesStore.js
│   │   └── routes/
│   │       ├── notes.js
│   │       └── upload.js
│   ├── .env
│   └── package.json
└── client/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   └── types/
    └── package.json
```
