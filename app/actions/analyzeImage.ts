'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function analyzeImageAction(formData: FormData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }

  const file = formData.get('image') as File;
  if (!file) {
    return { success: false, error: 'No image provided' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const mimeType = file.type;

    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const prompt = `
      You are an AI assistant designed to extract actionable tasks from screenshots.
      Look at this screenshot and identify any tasks, reminders, or actionable items the user might want to do later.
      This could be an event to attend, a product to buy, an article to read, a message to reply to, or any clear action.

      For each actionable item found, return a JSON object with:
      - title: A short, catchy title (max 5 words)
      - description: A brief explanation of the task
      - xpReward: A number between 100 and 500 based on the estimated difficulty or importance of the task (e.g., reading a long article = 300, replying = 100).
      
      Respond explicitly and ONLY with a valid JSON Array of these objects. Do not include markdown formatting or backticks around the JSON.
    `;

    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    // Clean up potential markdown formatting
    const cleanedText = responseText.replace(/```json/i, '').replace(/```/i, '').trim();
    
    const tasks = JSON.parse(cleanedText);
    return { success: true, tasks };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return { success: false, error: 'Failed to analyze image' };
  }
}
