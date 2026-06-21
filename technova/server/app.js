import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes, { adminCategoryRouter } from './routes/categoryRoutes.js';
import serviceRoutes, { adminServiceRouter } from './routes/serviceRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import customRequestRoutes from './routes/customRequestRoutes.js';
import seedProdRoute from './routes/seedProdRoute.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import configurePassport from './config/passport.js';

import contractRoutes from './routes/contractRoutes.js';
import escrowRoutes from './routes/escrowRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import brandingRoutes from './routes/brandingRoutes.js';
import teamInviteRoutes from './routes/teamInviteRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import retainerRoutes from './routes/retainerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import annotationRoutes from './routes/annotationRoutes.js';
import referralRoutes from './routes/referralRoutes.js';
import industryPageRoutes from './routes/industryPageRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import commissionRoutes from './routes/commissionRoutes.js';

const app = express();

// ---- Middleware ----
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https://*", "wss://*", "http://localhost:*", "ws://localhost:*"],
      imgSrc: ["'self'", "data:", "blob:", "https://*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://*"],
      fontSrc: ["'self'", "data:", "https://*"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.trim() : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Passport Initialization
configurePassport(passport);
app.use(passport.initialize());

// Apply rate limiting to all requests
app.use('/api', apiLimiter);

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---- API Routes ----
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/admin/services', adminServiceRouter);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/admin/categories', adminCategoryRouter);
app.use('/api/v1/internships', internshipRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/custom-requests', customRequestRoutes);
app.use('/api/v1/contracts', contractRoutes);
app.use('/api/v1/escrow', escrowRoutes);
app.use('/api/v1/verifications', verificationRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/branding', brandingRoutes);
app.use('/api/v1/team-invites', teamInviteRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/retainers', retainerRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/annotations', annotationRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/industries', industryPageRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/commissions', commissionRoutes);

// Temporary production seeding route
app.use('/api/v1/seed-production', seedProdRoute);

// ---- Static Files for Production ----
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// ---- 404 Handler ----
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ---- Error Handler ----
app.use(errorHandler);

export default app;
