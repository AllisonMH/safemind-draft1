/**
 * OpenAI Moderation API Integration Example
 *
 * This demonstrates how to use OpenAI's Moderation API to detect
 * harmful content across multiple categories.
 *
 * Setup:
 * 1. Get API key: https://platform.openai.com/
 * 2. Set OPENAI_API_KEY in .env
 */

interface ModerationCategory {
  sexual: boolean;
  hate: boolean;
  harassment: boolean;
  'self-harm': boolean;
  'sexual/minors': boolean;
  'hate/threatening': boolean;
  'violence/graphic': boolean;
  'self-harm/intent': boolean;
  'self-harm/instructions': boolean;
  'harassment/threatening': boolean;
  violence: boolean;
}

interface ModerationCategoryScores {
  sexual: number;
  hate: number;
  harassment: number;
  'self-harm': number;
  'sexual/minors': number;
  'hate/threatening': number;
  'violence/graphic': number;
  'self-harm/intent': number;
  'self-harm/instructions': number;
  'harassment/threatening': number;
  violence: number;
}

interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategory;
  category_scores: ModerationCategoryScores;
}

interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

class OpenAIModerator {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/moderations';

  // Critical categories that require immediate attention
  private criticalCategories = [
    'self-harm/intent',
    'self-harm/instructions',
    'violence/graphic',
    'harassment/threatening',
    'sexual/minors'
  ];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Moderate a single text message
   */
  async moderateText(text: string): Promise<{
    flagged: boolean;
    categories: string[];
    scores: ModerationCategoryScores;
    criticalFlags: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: ModerationResponse = await response.json();
      const result = data.results[0];

      // Get flagged categories
      const categories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category, _]) => category);

      // Identify critical flags
      const criticalFlags = categories.filter((cat) =>
        this.criticalCategories.includes(cat)
      );

      // Determine risk level
      const riskLevel = this.calculateRiskLevel(
        result.category_scores,
        criticalFlags
      );

      return {
        flagged: result.flagged,
        categories,
        scores: result.category_scores,
        criticalFlags,
        riskLevel,
      };
    } catch (error) {
      console.error('OpenAI Moderation Error:', error);
      throw error;
    }
  }

  /**
   * Moderate multiple messages (batch processing)
   */
  async moderateConversation(messages: string[]): Promise<{
    results: Array<{
      message: string;
      flagged: boolean;
      categories: string[];
      criticalFlags: string[];
      riskLevel: 'low' | 'medium' | 'high' | 'critical';
    }>;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    hasCriticalFlags: boolean;
    categoryFrequency: Record<string, number>;
  }> {
    // OpenAI supports up to 32 inputs in a single request
    const results = await Promise.all(
      messages.map(async (message) => {
        const moderation = await this.moderateText(message);
        return {
          message,
          flagged: moderation.flagged,
          categories: moderation.categories,
          criticalFlags: moderation.criticalFlags,
          riskLevel: moderation.riskLevel,
        };
      })
    );

    // Calculate overall metrics
    const hasCriticalFlags = results.some((r) => r.criticalFlags.length > 0);

    // Track category frequency
    const categoryFrequency: Record<string, number> = {};
    results.forEach((r) => {
      r.categories.forEach((cat) => {
        categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
      });
    });

    // Determine overall risk level
    const overallRiskLevel = this.determineOverallRisk(results);

    return {
      results,
      overallRiskLevel,
      hasCriticalFlags,
      categoryFrequency,
    };
  }

  /**
   * Calculate risk level based on scores and critical flags
   */
  private calculateRiskLevel(
    scores: ModerationCategoryScores,
    criticalFlags: string[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical if any critical category is flagged
    if (criticalFlags.length > 0) {
      return 'critical';
    }

    // Get highest score
    const maxScore = Math.max(...Object.values(scores));

    if (maxScore > 0.8) return 'high';
    if (maxScore > 0.5) return 'medium';
    return 'low';
  }

  /**
   * Determine overall conversation risk
   */
  private determineOverallRisk(
    results: Array<{ riskLevel: string; criticalFlags: string[] }>
  ): 'low' | 'medium' | 'high' | 'critical' {
    // Critical if any message is critical
    if (results.some((r) => r.riskLevel === 'critical')) {
      return 'critical';
    }

    // High if multiple high-risk messages
    const highRiskCount = results.filter((r) => r.riskLevel === 'high').length;
    if (highRiskCount >= 2) {
      return 'high';
    }

    // Medium if any high or multiple medium
    if (highRiskCount === 1) {
      return 'high';
    }

    const mediumRiskCount = results.filter(
      (r) => r.riskLevel === 'medium'
    ).length;
    if (mediumRiskCount >= 3) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Check for self-harm indicators specifically
   */
  async checkSelfHarmRisk(text: string): Promise<{
    hasSelfHarmIntent: boolean;
    hasSelfHarmInstructions: boolean;
    score: number;
    requiresIntervention: boolean;
  }> {
    const result = await this.moderateText(text);

    const hasSelfHarmIntent = result.categories.includes('self-harm/intent');
    const hasSelfHarmInstructions = result.categories.includes('self-harm/instructions');

    const score = Math.max(
      result.scores['self-harm/intent'],
      result.scores['self-harm/instructions'],
      result.scores['self-harm']
    );

    // Require intervention if intent or instructions detected
    const requiresIntervention = hasSelfHarmIntent || hasSelfHarmInstructions || score > 0.7;

    return {
      hasSelfHarmIntent,
      hasSelfHarmInstructions,
      score,
      requiresIntervention,
    };
  }
}

// Example usage
async function example() {
  const moderator = new OpenAIModerator(process.env.OPENAI_API_KEY!);

  // Single message moderation
  const result = await moderator.moderateText(
    "I'm thinking about hurting myself"
  );

  console.log('Moderation Result:', {
    flagged: result.flagged,
    categories: result.categories,
    criticalFlags: result.criticalFlags,
    riskLevel: result.riskLevel,
  });

  // Self-harm specific check
  const selfHarmCheck = await moderator.checkSelfHarmRisk(
    "I'm thinking about hurting myself"
  );

  console.log('Self-Harm Check:', selfHarmCheck);

  // Conversation moderation
  const conversation = [
    "I'm having a bad day",
    "I hate everyone",
    "I'm thinking about hurting myself",
  ];

  const conversationResult = await moderator.moderateConversation(conversation);
  console.log('Conversation Moderation:', {
    overallRiskLevel: conversationResult.overallRiskLevel,
    hasCriticalFlags: conversationResult.hasCriticalFlags,
    categoryFrequency: conversationResult.categoryFrequency,
  });
}

export { OpenAIModerator };
export type { ModerationResult, ModerationCategory, ModerationCategoryScores };
