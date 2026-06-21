import { generateChatResponse, generateProjectScope, generateClientAssistantResponse } from '../services/ai/openaiService.js';
import { summarizeMeeting } from '../services/ai/meetingSummarizerService.js';
import CustomRequest from '../models/CustomRequest.js';
import OpenAI from 'openai';

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
export const generateProposal = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    
    const customReq = await CustomRequest.findById(requestId);
    if (!customReq) {
      return res.status(404).json({ success: false, message: 'Custom request not found' });
    }

    // --- MOCK AI GENERATOR ---
    // Simulates an AI response without requiring paid API keys
    
    // Attempt to parse a numeric budget if provided
    let estimatedPrice = 2500; // Default base price
    if (customReq.budget) {
      const parsed = parseInt(customReq.budget.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        estimatedPrice = parsed;
      }
    }

    // Determine timeline based on price
    let timeline = "2-4 weeks";
    if (estimatedPrice > 5000) timeline = "4-8 weeks";
    if (estimatedPrice > 10000) timeline = "2-3 months";

    const proposal = {
      price: estimatedPrice,
      timeline: timeline,
      scopeSummary: `We will deliver a comprehensive solution for "${customReq.serviceName}", tailored precisely to the requirements outlined in your request. This includes end-to-end development, quality assurance, and final deployment.`,
      milestones: [
        {
          title: "Phase 1: Discovery & Planning",
          description: "Requirement analysis, architecture design, and project planning."
        },
        {
          title: "Phase 2: Core Development",
          description: "Implementation of the primary features and functionalities."
        },
        {
          title: "Phase 3: Testing & Delivery",
          description: "Quality assurance, user acceptance testing, and final handover."
        }
      ]
    };
    
    // Add an artificial delay to simulate AI thinking time (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));


    res.status(200).json({ success: true, data: proposal });
  } catch (error) {
    next(error);
  }
};

// @desc    Client Assistant Chat (RAG)
// @route   POST /api/v1/ai/client-assistant
// @access  Private
export const chatWithClientAssistant = async (req, res, next) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400);
      throw new Error('Please provide an array of messages');
    }

    // 1. Context Gathering (RAG Data Retrieval)
    const Project = (await import('../models/Project.js')).default;
    const Invoice = (await import('../models/Invoice.js')).default;
    const Order = (await import('../models/Order.js')).default;

    // Fetch active projects
    const projects = await Project.find({ client: req.user._id })
      .select('title status budget deadline milestones');
    
    // Fetch pending or paid invoices
    const invoices = await Invoice.find({ client: req.user._id })
      .select('amount status dueDate paidAt');
      
    // Fetch recent orders
    const orders = await Order.find({ user: req.user._id })
      .select('amount status createdAt');

    const contextData = {
      clientName: req.user.name,
      projects,
      invoices,
      orders,
    };

    // 2. Call OpenAI Service with context
    // Assuming generateClientAssistantResponse is imported at the top
    const { generateClientAssistantResponse } = await import('../services/ai/openaiService.js');
    const aiResponse = await generateClientAssistantResponse(messages, contextData);

    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};
