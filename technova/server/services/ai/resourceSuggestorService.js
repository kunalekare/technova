import { openai, isMockMode } from './aiClient.js';
import Project from '../../models/Project.js';
import User from '../../models/User.js';

/**
 * Suggests team members for a specific project based on requirements and skills.
 */
export const suggestTeamAllocation = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');

  // We fetch potential team members (role: 'team' or similar, here we just fetch all non-clients with a profile)
  // In a real app, you might query specific roles. We'll grab users that could be assigned.
  const potentialTeam = await User.find({ 'role': { $ne: null } })
    .populate('role')
    .limit(50); // Hard limit for AI token context

  // Filter to just staff/team roles
  const staff = potentialTeam.filter(u => u.role?.name === 'admin' || u.role?.name === 'team_member' || u.role?.name === 'manager');

  const staffContext = staff.map(s => ({
    id: s._id,
    name: s.name,
    email: s.email,
    role: s.role?.name
  }));

  if (isMockMode) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Just return the first two staff members if available
    const suggestedIds = staffContext.slice(0, 2).map(s => s.id);
    return {
      suggestedTeam: suggestedIds,
      reasoning: "These members have availability and the required skills for mock development."
    };
  }

  try {
    const promptContext = `
      Project Requirements: ${project.requirements}
      Available Staff: ${JSON.stringify(staffContext)}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a resource manager AI. Review the project requirements and select the best team members from the Available Staff array.
          Return a JSON object:
          {
            "suggestedTeam": ["<id_1>", "<id_2>"],
            "reasoning": "1 sentence explanation of why they were chosen."
          }`
        },
        { role: "user", content: promptContext }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiResult = JSON.parse(response.choices[0].message.content);
    return {
      suggestedTeam: aiResult.suggestedTeam || [],
      reasoning: aiResult.reasoning || "AI Suggestion complete."
    };

  } catch (error) {
    console.error('Resource Suggestor Error:', error);
    throw new Error('Failed to suggest team allocation');
  }
};
