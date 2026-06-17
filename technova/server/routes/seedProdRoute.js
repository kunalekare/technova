import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  const seedPath = path.join(__dirname, '../seeds/index.js');
  
  exec(`node ${seedPath}`, { env: process.env }, (error, stdout, stderr) => {
    if (error) {
      console.error('Seed error:', error);
      console.error('Stderr:', stderr);
      return res.status(500).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1 style="color: #EF4444;">❌ Seeding Failed</h1>
          <pre style="text-align: left; background: #f4f4f4; padding: 20px;">${error.message}\n${stderr}</pre>
        </div>
      `);
    }

    res.status(200).send(`
      <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1 style="color: #10B981;">✅ Production Database Seeded Successfully!</h1>
        <p>Your MongoDB Atlas database has been populated with all Services, Categories, Jobs, and Internships.</p>
        <p>You can now close this tab and refresh your main website.</p>
        <pre style="text-align: left; background: #f4f4f4; padding: 20px; color: #333; font-size: 12px;">${stdout}</pre>
      </div>
    `);
  });
});

export default router;
