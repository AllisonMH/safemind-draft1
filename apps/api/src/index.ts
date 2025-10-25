/**
 * SafeMind API Server
 * Main entry point for the backend API
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze';
import { rateLimiter } from './middleware/rate-limit';
import { errorHandler } from './middleware/error-handler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting
const rateLimitWindow = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');
const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
app.use(rateLimiter({
  windowMs: rateLimitWindow,
  maxRequests: rateLimitMax,
}));

// Request logging (simple version)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/analyze', analyzeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.path,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                      SafeMind API                        ║
║          Youth Guardrails for AI Interactions            ║
╚══════════════════════════════════════════════════════════╝

🚀 Server running on port ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
⏰ Started at: ${new Date().toISOString()}

📝 API Endpoints:
   GET  /health                    - Server health check
   GET  /api/analyze/health        - Analysis services status
   POST /api/analyze/message       - Analyze single message
   POST /api/analyze/conversation  - Analyze conversation

🔑 API Keys Status:
   Perspective API: ${process.env.PERSPECTIVE_API_KEY ? '✅ Configured' : '❌ Missing'}
   OpenAI API:      ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}

Ready to protect youth in AI spaces! 🛡️
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
