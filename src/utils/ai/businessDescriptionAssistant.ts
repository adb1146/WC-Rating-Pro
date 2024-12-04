import { OpenAI } from 'openai';
import { getOpenAIClient } from './config';
import { BusinessInfo } from '../../types';

interface WebSearchResult {
  title: string;
  description: string;
  url: string;
}

async function searchBusinessInfo(businessName: string): Promise<WebSearchResult[]> {
  // Simulated web search results - in production, integrate with a real search API
  return [
    {
      title: businessName,
      description: `Company profile and business information for ${businessName}`,
      url: `https://www.example.com/${businessName.toLowerCase().replace(/\s+/g, '-')}`
    }
  ];
}

export async function generateBusinessDescription(
  businessInfo: BusinessInfo,
  currentDescription: string
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return 'AI assistance unavailable';
    }

    // Search for business information
    const searchResults = await searchBusinessInfo(businessInfo.name);

    const prompt = `As an insurance industry expert, create a concise business description for workers compensation coverage based on:

Business Name: ${businessInfo.name}
Entity Type: ${businessInfo.entityType}
Current Description: ${currentDescription}
Web Search Results: ${JSON.stringify(searchResults)}

Requirements:
1. Focus on operations relevant to workers compensation risk
2. Include key business activities and employee roles
3. Mention safety-critical aspects of operations
4. Keep length appropriate for insurance applications
5. Use industry-standard terminology
6. Return ONLY the description without any additional text or commentary

Example Format:
"Technology consulting firm specializing in enterprise software development with 50 employees primarily engaged in office-based software engineering, quality assurance, and project management activities."`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      max_tokens: 200
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Error generating business description:', error);
    return '';
  }
}