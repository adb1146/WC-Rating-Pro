import { OpenAI } from 'openai';
import { BusinessInfo } from '../../types';
import { getOpenAIClient } from './config';
import { verifyBusinessName } from '../businessNameVerification';
import { suggestBusinessName, validateBusinessName } from './businessNameAssistant';
import { generateBusinessDescription } from './businessDescriptionAssistant';

export async function getContextualHelp(section: string, businessInfo: BusinessInfo): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return 'AI assistance is currently unavailable. Please configure your OpenAI API key.';
    }

    const prompt = `Provide helpful guidance for completing the ${section} section of a workers compensation application for:
      Business Type: ${businessInfo.entityType}
      Description: ${businessInfo.description}
      
      Focus on:
      1. Required information
      2. Common mistakes to avoid
      3. Industry-specific considerations
      4. Best practices`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('AI Help Error:', error);
    return '';
  }
}

export async function getSmartSuggestions(section: string, businessInfo: BusinessInfo): Promise<string[]> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return ['AI assistance is currently unavailable. Please configure your OpenAI API key.'];
    }

    const prompt = `Provide 3-5 smart tips for optimizing the ${section} section of a workers compensation application for:
      Business Type: ${businessInfo.entityType}
      Description: ${businessInfo.description}
      
      Focus on:
      1. Data accuracy
      2. Risk reduction
      3. Premium optimization
      4. Compliance requirements`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7
    });

    return completion.choices[0].message.content?.split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '')) || [];
  } catch (error) {
    console.error('Smart Tips Error:', error);
    return [];
  }
}

export async function getFieldSuggestions(
  field: string,
  currentValue: string,
  businessInfo: BusinessInfo
): Promise<string> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return 'AI assistance is currently unavailable. Please configure your OpenAI API key.';
    }

    // Customize prompt based on field type
    let prompt = '';
    switch (field) {
      case 'businessName':
        // Validate current business name
        const validation = validateBusinessName(currentValue);
        if (!validation.isValid) {
          // Get suggestions for invalid names
          const suggestions = await suggestBusinessName(currentValue, businessInfo.entityType);
          if (suggestions.length > 0) {
            return suggestions[0].name;
          }
        }
        break;
        
      case 'businessDescription':
        // Use specialized business description generator
        return generateBusinessDescription(businessInfo, currentValue);
        break;
        
      case 'contactEmail':
        prompt = `Provide ONLY a valid business email address:
          Current Email: ${currentValue}
          Business Name: ${businessInfo.name}
          
          Requirements:
          - Return ONLY the email address
          - Must be a valid email format
          - No explanations or suggestions
          - No additional text`;
        break;
        
      case 'fein':
        prompt = `Validate and format FEIN number:
          Current FEIN: ${currentValue}
          
          Requirements:
          - Return ONLY the formatted FEIN (XX-XXXXXXX)
          - Must be exactly 9 digits
          - Include hyphen after first 2 digits
          - No additional text`;
        break;
        
      case 'contactPhone':
        prompt = `Format phone number:
          Current Phone: ${currentValue}
          
          Requirements:
          - Return ONLY the formatted phone number
          - Use format: (XXX) XXX-XXXX
          - Must be valid US phone number
          - No additional text`;
        break;
        
      default:
        prompt = `Provide ONLY valid data for the ${field} field:
          Current Value: ${currentValue}
          Business Type: ${businessInfo.entityType}
          Industry Context: ${businessInfo.description}
          
          Requirements:
          - Return ONLY the field value
          - Must match field type requirements
          - No explanations or suggestions
          - No additional text`;
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
      max_tokens: 100
    });

    // Clean the response to ensure only the field value is returned
    const response = completion.choices[0].message.content || '';
    return response.split('\n')[0].trim();
  } catch (error) {
    console.error('AI Suggestion Error:', error);
    return '';
  }
}

export async function getIndustrySpecificGuidance(
  businessInfo: BusinessInfo
): Promise<string[]> {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return ['AI assistance is currently unavailable. Please configure your OpenAI API key.'];
    }

    const prompt = `Provide industry-specific workers compensation guidance for:
      Business Type: ${businessInfo.entityType}
      Description: ${businessInfo.description}
      Employee Count: ${businessInfo.payrollInfo.reduce((sum, info) => sum + info.employeeCount, 0)}
      
      Focus on:
      1. Common risks
      2. Required safety programs
      3. Insurance considerations
      4. Best practices`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7
    });

    return completion.choices[0].message.content?.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim()) || [];
  } catch (error) {
    console.error('AI Guidance Error:', error);
    return [];
  }
}