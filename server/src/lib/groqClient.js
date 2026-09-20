import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

export const createGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'qwen/qwen3.8-27b', // Free model on Groq
    temperature: 0.3,
    maxTokens: 4096,
    // Disable thinking mode for clean output (no <think> tags)
    modelKwargs: {
      thinking: { type: 'disabled' },
    },
  });
};
