import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    CLIENT_URL: process.env.CLIENT_URL,
    CLIENT_URL_LENGTH: process.env.CLIENT_URL ? process.env.CLIENT_URL.length : 0,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS_LENGTH: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    MONGO_URI_EXISTS: !!process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV
  });
});

export default router;
