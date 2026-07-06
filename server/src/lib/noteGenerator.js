import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createGroqClient } from './groqClient.js';
import { chunkText } from './pdfParser.js';

const SYSTEM_PROMPT = `You are an expert academic note-taker and summarizer. 
Your job is to transform raw text content into well-structured, comprehensive study notes.

When generating notes:
- Use clear markdown formatting with headers (##, ###)
- Highlight key concepts in **bold**
- Create bullet points for important facts
- Include a summary section at the top
- Add a "Key Takeaways" section at the end
- Keep the language clear and concise
- Preserve all important technical terms and definitions`;

export const generateNotes = async (text, options = {}) => {
  const llm = createGroqClient();
  const { title = 'Document', style = 'comprehensive' } = options;

  const styleGuide = {
    comprehensive: 'Create detailed, comprehensive notes covering all major points.',
    concise: 'Create brief, bullet-point style notes focusing only on the most critical information.',
    structured: 'Create highly structured notes with clear hierarchy and sections.',
  };

  // If text is large, chunk and summarize first
  if (text.length > 6000) {
    return await generateNotesFromChunks(llm, text, title, styleGuide[style]);
  }

  const messages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(
      `Please create ${style} study notes for the following content titled "${title}".\n\n${styleGuide[style]}\n\nContent:\n${text}`
    ),
  ];

  const response = await llm.invoke(messages);
  return response.content;
};

const generateNotesFromChunks = async (llm, text, title, styleGuide) => {
  const chunks = chunkText(text, 4000, 300);
  const chunkSummaries = [];

  // Summarize each chunk
  for (let i = 0; i < chunks.length; i++) {
    const messages = [
      new SystemMessage('You are a concise summarizer. Extract the key points from the following text chunk. Be thorough but concise.'),
      new HumanMessage(`Chunk ${i + 1} of ${chunks.length}:\n\n${chunks[i]}`),
    ];
    const response = await llm.invoke(messages);
    chunkSummaries.push(response.content);
  }

  // Combine summaries into final notes
  const combinedSummary = chunkSummaries.join('\n\n---\n\n');
  const finalMessages = [
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(
      `Create well-structured study notes for "${title}" from these summaries.\n\n${styleGuide}\n\nSummaries:\n${combinedSummary}`
    ),
  ];

  const finalResponse = await llm.invoke(finalMessages);
  return finalResponse.content;
};

export const generateSummary = async (text) => {
  const llm = createGroqClient();

  const messages = [
    new SystemMessage('You are an expert summarizer. Create a clear, concise summary in 3-5 sentences.'),
    new HumanMessage(`Summarize this content:\n\n${text.slice(0, 4000)}`),
  ];

  const response = await llm.invoke(messages);
  return response.content;
};

export const askQuestion = async (text, question) => {
  const llm = createGroqClient();

  const messages = [
    new SystemMessage(
      'You are a helpful assistant. Answer questions based on the provided document content. Be accurate and cite relevant parts of the document when possible.'
    ),
    new HumanMessage(`Document content:\n${text.slice(0, 5000)}\n\nQuestion: ${question}`),
  ];

  const response = await llm.invoke(messages);
  return response.content;
};
