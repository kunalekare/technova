import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { summarizeMeeting } from './services/ai/meetingSummarizerService.js';

dotenv.config();

const sampleTranscript = `
John: Hey everyone, let's get started. We have a lot to cover today regarding the TechNova redesign.
Sarah: Hi John. Yes, I've prepared the new Figma mockups for the dashboard. I think we should prioritize the user flow for the project escrow.
John: Agreed. How long will the escrow feature take to build?
Mike: Backend-wise, we need to integrate Stripe. I'd say about 2 weeks.
Sarah: And frontend will take 1 week after the backend is ready.
John: Okay, so 3 weeks total for escrow. What about the AI risk scoring?
Mike: That's mostly done, we just need to schedule the cron job. Maybe 2 days.
John: Great. Let's aim to launch both features by the end of next month. Any blockers?
Sarah: No blockers from design.
Mike: None from engineering either.
John: Perfect. Let's wrap up and get back to work!
`;

const runTest = async () => {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Running Meeting Summarizer with a mock transcript...');
    console.log('--------------------------------------------------');
    
    const summary = await summarizeMeeting(null, null, null, sampleTranscript);
    
    console.log('================ SUMMARY RESULT ================');
    console.log(summary);
    console.log('================================================');
    
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

runTest();
