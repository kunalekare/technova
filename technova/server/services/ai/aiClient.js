import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Shared OpenAI client and configuration for all AI services.
 * This prevents duplicate instantiation and centralizes mock mode logic.
 */

// Determine if we should use mock responses (no API key provided)
export const isMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder';

// The shared OpenAI instance
// If in mock mode, this might fail to initialize if the key is literally missing or 'placeholder', 
// so we only instantiate if not in mock mode, or provide a dummy key so it doesn't crash on import.
export const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-mock-mode' 
});

export default {
  openai,
  isMockMode
};
