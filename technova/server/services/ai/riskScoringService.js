import { openai, isMockMode } from './aiClient.js';
import Project from '../../models/Project.js';
import logger from '../../utils/logger.js';

/**
 * Runs a nightly cron job to evaluate risk scores for all in-progress projects.
 */
export const runNightlyRiskScoring = async () => {
  try {
    logger.info('Starting nightly AI risk scoring job...');
    
    // Find all projects that are active/in-progress
    const activeProjects = await Project.find({ status: { $in: ['new', 'in_progress'] } });
    
    if (activeProjects.length === 0) {
      logger.info('No active projects to score. Risk scoring complete.');
      return;
    }

    for (const project of activeProjects) {
      try {
        let riskScore = 0; // 0 = low risk, 100 = critical risk
        
        if (isMockMode) {
          // Calculate a random mock score
          riskScore = Math.floor(Math.random() * 100);
        } else {
          // Construct prompt for AI
          const projectContext = `
            Project Title: ${project.title}
            Deadline: ${project.deadline || 'None'}
            Milestones: ${JSON.stringify(project.milestones)}
            Status: ${project.status}
          `;

          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a project risk analysis AI. Analyze the project details and determine a risk score from 0 (very low risk) to 100 (critical risk of failure/delay).
                Return a JSON object:
                {
                  "score": 45
                }`
              },
              { role: "user", content: projectContext }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
          });

          const aiResult = JSON.parse(response.choices[0].message.content);
          riskScore = aiResult.score || 0;
        }

        // Save score to DB
        project.riskScore = riskScore;
        await project.save();
        
      } catch (projectError) {
        // Log error but continue loop for other projects
        logger.error(`Error scoring project ${project._id}:`, projectError.message);
      }
    }

    logger.info(`Nightly AI risk scoring completed for ${activeProjects.length} projects.`);
  } catch (error) {
    // Top level error catch, must not crash the node process
    logger.error('Critical failure in runNightlyRiskScoring:', error);
  }
};
