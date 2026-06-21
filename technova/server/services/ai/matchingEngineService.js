import { openai, isMockMode } from './aiClient.js';

/**
 * Score and match partners against project requirements.
 * Returns an array of partners with an added AI `matchScore` and `reasoning`.
 */
export const matchPartners = async (projectRequirements, partners) => {
  if (partners.length === 0) return [];

  if (isMockMode) {
    // Mock scoring
    await new Promise(resolve => setTimeout(resolve, 1000));
    return partners.map(p => ({
      ...p.toObject ? p.toObject() : p,
      matchScore: Math.floor(Math.random() * 40) + 60, // 60-100 score
      reasoning: "Based on the mock AI engine, this partner has skills that roughly align with the project needs."
    })).sort((a, b) => b.matchScore - a.matchScore);
  }

  try {
    const partnerList = partners.map(p => ({
      id: p._id,
      type: p.type,
      skills: p.skills.join(', '),
      pastPerformance: p.pastPerformanceScore
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI Matching Engine. Given a project requirements description and a list of available partners, score each partner out of 100 on how well they fit the requirements. Return a JSON object with a 'matches' array containing 'partnerId', 'score', and a brief 'reasoning' (1 sentence).`
        },
        { 
          role: "user", 
          content: `Project Requirements: ${projectRequirements}\n\nPartners: ${JSON.stringify(partnerList)}` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    // Merge scores back into the partner objects
    const scoredPartners = partners.map(p => {
      const match = result.matches?.find(m => m.partnerId === p._id.toString());
      return {
        ...p.toObject ? p.toObject() : p,
        matchScore: match ? match.score : 50,
        reasoning: match ? match.reasoning : "AI engine could not generate a clear score."
      };
    });

    // Sort by descending score
    return scoredPartners.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('AI Matching Engine Error:', error);
    // Fallback if AI fails: just return them sorted by past performance
    return partners.map(p => ({
      ...p.toObject ? p.toObject() : p,
      matchScore: p.pastPerformanceScore > 0 ? p.pastPerformanceScore : 50,
      reasoning: "Fallback scoring used."
    })).sort((a, b) => b.matchScore - a.matchScore);
  }
};
