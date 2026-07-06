import axios from 'axios';
import type { Note } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 120000, // 2 min for AI generation
});

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    const { data } = await api.get('/notes');
    return data.notes;
  },

  getById: async (id: string): Promise<Note> => {
    const { data } = await api.get(`/notes/${id}`);
    return data.note;
  },

  create: async (note: { title: string; content: string; tags?: string[] }): Promise<Note> => {
    const { data } = await api.post('/notes', note);
    return data.note;
  },

  update: async (id: string, updates: Partial<Note>): Promise<Note> => {
    const { data } = await api.put(`/notes/${id}`, updates);
    return data.note;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  },

  askQuestion: async (id: string, question: string): Promise<string> => {
    const { data } = await api.post(`/notes/${id}/ask`, { question });
    return data.answer;
  },

  getSummary: async (id: string): Promise<string> => {
    const { data } = await api.post(`/notes/${id}/summarize`);
    return data.summary;
  },
};

export const uploadApi = {
  uploadPDF: async (
    file: File,
    style: string,
    title: string,
    onProgress?: (pct: number) => void
  ): Promise<Note> => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('style', style);
    formData.append('title', title);

    const { data } = await api.post('/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total && onProgress) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });
    return data.note;
  },

  generateFromText: async (text: string, title: string, style: string): Promise<Note> => {
    const { data } = await api.post('/upload/text', { text, title, style });
    return data.note;
  },
};
