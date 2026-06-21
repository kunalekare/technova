import { generateChatResponse, generateProjectScope } from '../services/ai/openaiService.js';
import { summarizeMeeting } from '../services/ai/meetingSummarizerService.js';

// @desc    Chat with AI assistant
// @route   POST /api/v1/ai/chat
// @access  Public
export const handleChat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400);
      throw new Error('Please provide an array of messages');
    }

    const aiResponse = await generateChatResponse(messages);

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate a project scope from description
// @route   POST /api/v1/ai/scope
// @access  Private
export const generateScope = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description) {
      res.status(400);
      throw new Error('Please provide a project description');
    }

    const scope = await generateProjectScope(description);

    res.status(200).json({
      success: true,
      data: scope,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Summarize a meeting transcript or audio
// @route   POST /api/v1/ai/meetings/summarize
// @access  Private
export const handleMeetingSummarize = async (req, res, next) => {
  try {
    const { textTranscript } = req.body;
    let filePath = null;
    let mimeType = null;

    if (req.file) {
      filePath = req.file.path;
      mimeType = req.file.mimetype;
    }

    if (!textTranscript && !filePath) {
      res.status(400);
      throw new Error('Please provide either a text transcript or an audio file');
    }

    const summary = await summarizeMeeting(null, filePath, mimeType, textTranscript);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
