import { openai, isMockMode } from './aiClient.js';
import fs from 'fs';

/**
 * Parses an audio file (using Whisper API) or raw text transcript,
 * and generates a structured summary.
 */
export const summarizeMeeting = async (fileBuffer, filePath, mimeType, textTranscript) => {
  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      summary: "This was a productive mock meeting.",
      actionItems: ["Finalize mock design", "Send mock invoice"],
      keyDecisions: ["We will proceed with the mock architecture."]
    };
  }

  let transcript = textTranscript;

  // If a file was uploaded, transcribe it using Whisper
  if (filePath && !transcript) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: 'whisper-1',
      });
      transcript = transcription.text;
    } catch (error) {
      console.error('Whisper API Error:', error);
      throw new Error('Failed to transcribe audio file.');
    }
  }

  if (!transcript) {
    throw new Error('No transcript or audio provided.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an executive assistant. Summarize the following meeting transcript.
          Return a JSON object:
          {
            "summary": "1-2 paragraphs summarizing the meeting",
            "actionItems": ["Task 1", "Task 2"],
            "keyDecisions": ["Decision 1", "Decision 2"]
          }`
        },
        { role: "user", content: transcript }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Meeting Summarization Error:', error);
    throw new Error('Failed to summarize meeting.');
  }
};
