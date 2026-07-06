import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const chunkText = (text, chunkSize = 3000, overlap = 200) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
};
