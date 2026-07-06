// In-memory store for notes (acts like a simple DB for college project)
import { v4 as uuidv4 } from 'uuid';

let notes = [];

export const getAllNotes = () => {
  return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getNoteById = (id) => {
  return notes.find((note) => note.id === id) || null;
};

export const createNote = (data) => {
  const note = {
    id: uuidv4(),
    title: data.title || 'Untitled Note',
    content: data.content || '',
    originalText: data.originalText || '',
    source: data.source || 'manual', // 'pdf' | 'text' | 'manual'
    sourceFileName: data.sourceFileName || null,
    tags: data.tags || [],
    style: data.style || 'comprehensive',
    pages: data.pages || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  notes.push(note);
  return note;
};

export const updateNote = (id, data) => {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return null;

  notes[index] = {
    ...notes[index],
    ...data,
    id, // prevent id override
    updatedAt: new Date().toISOString(),
  };

  return notes[index];
};

export const deleteNote = (id) => {
  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return false;
  notes.splice(index, 1);
  return true;
};
