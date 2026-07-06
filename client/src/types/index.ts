export interface Note {
  id: string;
  title: string;
  content: string;
  originalText: string;
  source: 'pdf' | 'text' | 'manual';
  sourceFileName: string | null;
  tags: string[];
  style: 'comprehensive' | 'concise' | 'structured';
  pages: number | null;
  createdAt: string;
  updatedAt: string;
}

export type NoteStyle = 'comprehensive' | 'concise' | 'structured';

export interface UploadState {
  loading: boolean;
  error: string | null;
  progress: number;
}
