import { OpenAI } from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
let openaiInstance: OpenAI | null = null;

export function initializeOpenAI(apiKey: string) {
  try {
    if (!apiKey) {
      console.warn('Missing VITE_OPENAI_API_KEY environment variable');
      return;
    }

    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
  }
}

export function getOpenAIClient(): OpenAI | null {
  if (!openaiInstance) {
    if (OPENAI_API_KEY) {
      initializeOpenAI(OPENAI_API_KEY);
    } else {
      console.warn('Missing VITE_OPENAI_API_KEY environment variable');
    }
  }
  return openaiInstance;
}