/**
 * Analysis Routes
 * Endpoints for content analysis
 */

import { Router } from 'express';
import { z } from 'zod';
import { CombinedContentAnalyzer } from '../services/content-analyzer';

const router = Router();

// Validation schemas
const analyzeMessageSchema = z.object({
  text: z.string().min(1, 'Text is required').max(10000, 'Text too long'),
});

const analyzeConversationSchema = z.object({
  messages: z.array(z.string().min(1).max(10000)).min(1).max(100),
});

// Initialize analyzer (in production, this should be a singleton or injected)
const getAnalyzer = () => {
  const perspectiveKey = process.env.PERSPECTIVE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!perspectiveKey || !openaiKey) {
    throw new Error('API keys not configured');
  }

  return new CombinedContentAnalyzer(perspectiveKey, openaiKey);
};

/**
 * POST /api/analyze/message
 * Analyze a single message
 */
router.post('/message', async (req, res) => {
  try {
    const { text } = analyzeMessageSchema.parse(req.body);

    const analyzer = getAnalyzer();
    const result = await analyzer.analyzeMessage(text);

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

/**
 * POST /api/analyze/conversation
 * Analyze an entire conversation
 */
router.post('/conversation', async (req, res) => {
  try {
    const { messages } = analyzeConversationSchema.parse(req.body);

    const analyzer = getAnalyzer();
    const result = await analyzer.analyzeConversation(messages);

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Conversation analysis error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Analysis failed',
    });
  }
});

/**
 * GET /api/analyze/health
 * Check if analysis services are available
 */
router.get('/health', async (req, res) => {
  try {
    const hasKeys = !!(process.env.PERSPECTIVE_API_KEY && process.env.OPENAI_API_KEY);

    res.json({
      success: true,
      status: hasKeys ? 'ready' : 'missing_keys',
      services: {
        perspective: !!process.env.PERSPECTIVE_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

export default router;
