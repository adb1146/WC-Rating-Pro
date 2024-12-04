import { OpenAI } from 'openai';
import { handleAIError } from './errorHandling';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
let openaiInstance: OpenAI | null = null;

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function initializeOpenAI(apiKey: string) {
  try {
    if (!apiKey) {
      console.warn('Missing OpenAI API key');
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

export async function retryOpenAIRequest<T>(
  requestFn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0) {
      const aiError = handleAIError(error);
      
      // Only retry on specific errors
      if (aiError.code === 'AI_RATE_LIMIT' || aiError.code === 'AI_API_ERROR') {
        console.warn(`Retrying OpenAI request, ${retries} attempts remaining`);
        await delay(RETRY_DELAY);
        return retryOpenAIRequest(requestFn, retries - 1);
      }
      
      throw error;
    }
    
    console.error('Max retries exceeded for OpenAI request');
    throw error;
  }
}

export function getOpenAIClient(): OpenAI | null {
  try {
    if (!openaiInstance && OPENAI_API_KEY) {
      initializeOpenAI(OPENAI_API_KEY);
    }
    return openaiInstance;
  } catch (error) {
    const aiError = handleAIError(error);
    console.error('OpenAI client error:', aiError);
    return null;
  }
}