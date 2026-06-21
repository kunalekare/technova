import { openai, isMockMode } from './aiClient.js';
import SentimentFlag from '../../models/SentimentFlag.js';
import logger from '../../utils/logger.js';

/**
 * Analyzes the sentiment of a message and saves a flag if applicable.
 * This runs asynchronously as a fire-and-forget promise so it never blocks the main thread.
 * 
 * @param {string} text - The content of the message.
 * @param {string} context - 'ticket', 'chat', etc.
 * @param {string} messageId - The ID of the saved message.
 */
export const analyzeMessage = async (text, context, messageId) => {
  try {
    let sentiment = 'neutral';
    let score = 50;

    if (isMockMode) {
      // Basic heuristic for mock mode
      const lowerText = text.toLowerCase();
      if (lowerText.includes('angry') || lowerText.includes('bad') || lowerText.includes('terrible') || lowerText.includes('hate')) {
        sentiment = 'negative';
        score = 80;
      } else if (lowerText.includes('great') || lowerText.includes('good') || lowerText.includes('thanks') || lowerText.includes('happy')) {
        sentiment = 'positive';
        score = 10;
      }
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Analyze the sentiment of the following message. 
            Return a JSON object:
            {
              "sentiment": "positive", // or "negative", or "neutral"
              "score": 85 // 0-100 where 100 is extremely negative/angry
            }`
          },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const aiResult = JSON.parse(response.choices[0].message.content);
      sentiment = aiResult.sentiment || 'neutral';
      score = aiResult.score || 50;
    }

    // Always create a record so we can track sentiment trends, or we could only save negative ones.
    // The requirement says: "small sentiment indicator icon next to flagged messages"
    // We'll save all of them, and the frontend will filter/display based on the 'sentiment' field.
    await SentimentFlag.create({
      messageId,
      context,
      sentiment,
      score
    });

  } catch (error) {
    // Fail silently so we don't break the parent request
    logger.error(`Sentiment Analysis failed for message ${messageId}:`, error.message);
  }
};
