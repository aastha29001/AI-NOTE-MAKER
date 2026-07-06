import { ChatGroq } from '@langchain/groq';
import dotenv from 'dotenv';

dotenv.config();

export const createGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }

  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.1-8b-instant', // Free model on Groq
    temperature: 0.3,
    maxTokens: 4096,
  });
};
