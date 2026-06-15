import OpenAI from 'openai';

// OpenAI client will be initialized dynamically inside functions

/**
 * Generate a response from the AI assistant
 */
export const generateChatResponse = async (messages) => {
  const isMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder';
  
  if (isMockMode) {
    // Return a mock response after a short delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      role: 'assistant',
      content: "Hello! I am the TechNova mock assistant. Please add your OPENAI_API_KEY to the .env file to enable real AI responses. How can I help you with your project today?",
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const systemPrompt = {
      role: 'system',
      content: "You are Nova, an expert technology consultant and project manager at TechNova Solutions. Your job is to help clients understand tech services (web dev, mobile apps, AI, marketing) and guide them to submit their project requirements. Be professional, concise, and helpful."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message;
  } catch (error) {
    console.error('OpenAI Chat Error:', error);
    return {
      role: 'assistant',
      content: `❌ OpenAI API Error: ${error.message}. If this says "Insufficient Quota" or "429", your OpenAI account has a $0 balance.`
    };
  }
};

/**
 * AI Project Scoping - Generates structured milestones and technical stack suggestions
 */
export const generateProjectScope = async (projectDescription) => {
  const isMockMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder';

  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      summary: "A modern web application built for scalability.",
      suggestedTechStack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
      milestones: [
        { title: "UI/UX Design", description: "Wireframes and high-fidelity mockups.", duration: "1-2 weeks" },
        { title: "Frontend Development", description: "Building the client interface.", duration: "2-3 weeks" },
        { title: "Backend Integration", description: "API and database setup.", duration: "2 weeks" },
        { title: "Testing & Launch", description: "QA and deployment.", duration: "1 week" }
      ],
      estimatedTimeline: "6-8 weeks",
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert technical architect. The user will provide a project description. 
          Return a JSON object with the following structure:
          {
            "summary": "Brief 1-2 sentence summary of the architecture",
            "suggestedTechStack": ["Tech1", "Tech2"],
            "milestones": [{"title": "Phase Name", "description": "What happens", "duration": "Estimated time"}],
            "estimatedTimeline": "Total time estimate"
          }`
        },
        { role: "user", content: projectDescription }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Scoping Error:', error);
    throw new Error('Failed to generate project scope');
  }
};
