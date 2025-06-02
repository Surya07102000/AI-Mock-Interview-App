import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const initializeGemini = () => {
  return new GoogleGenerativeAI(API_KEY);
};

export const generateInterviewQuestions = async (
  type: string,
  jobTitle: string,
  experience: string,
  industry: string,
  count: number = 5
) => {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    
    const prompt = `Generate ${count} realistic interview questions for a ${experience} ${jobTitle} in the ${industry} industry. 
    The interview type is ${type} (technical, behavioral, or industry-specific). 
    Format the response as a JSON array of strings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON array from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback
    return [
      "Tell me about yourself and your background.",
      "What are your greatest strengths and weaknesses?",
      "Describe a challenging situation you faced at work and how you handled it.",
      "Why are you interested in this position?",
      "Where do you see yourself in 5 years?"
    ];
  } catch (error) {
    console.error('Error generating interview questions:', error);
    // Fallback questions
    return [
      "Tell me about yourself and your background.",
      "What are your greatest strengths and weaknesses?",
      "Describe a challenging situation you faced at work and how you handled it.",
      "Why are you interested in this position?",
      "Where do you see yourself in 5 years?"
    ];
  }
};

export const generateFeedback = async (
  question: string,
  answer: string,
  jobTitle: string,
  experience: string
) => {
  try {
    const genAI = initializeGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    
    const prompt = `You are an expert interviewer for ${jobTitle} positions.
    
    The candidate has ${experience} of experience and provided the following answer to this interview question:
    
    Question: "${question}"
    
    Answer: "${answer}"
    
    Please provide constructive feedback on the candidate's response. Consider:
    1. Relevance to the question
    2. Clarity and structure
    3. Use of specific examples
    4. Areas of strength
    5. Areas for improvement
    
    Provide your feedback in a helpful, constructive tone in 3-5 sentences.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating feedback:', error);
    return "Thank you for your response. It addressed the key points of the question. For future interviews, consider providing more specific examples to strengthen your answer. Overall, good communication skills demonstrated.";
  }
};