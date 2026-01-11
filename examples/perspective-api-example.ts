/**
 * Perspective API Integration Example
 *
 * This demonstrates how to use Google's Perspective API to analyze text
 * for toxicity, threats, insults, and other harmful content.
 *
 * Setup:
 * 1. Get API key: https://developers.perspectiveapi.com/s/
 * 2. Set PERSPECTIVE_API_KEY in .env
 */

interface PerspectiveScore {
  value: number;
  type: string;
}

interface PerspectiveResponse {
  attributeScores: {
    [key: string]: {
      summaryScore: PerspectiveScore;
      spanScores?: Array<{
        begin: number;
        end: number;
        score: PerspectiveScore;
      }>;
    };
  };
  languages: string[];
}

class PerspectiveAnalyzer {
  private apiKey: string;
  private apiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

  // Attributes to analyze
  private attributes = [
    'TOXICITY',
    'SEVERE_TOXICITY',
    'IDENTITY_ATTACK',
    'INSULT',
    'PROFANITY',
    'THREAT',
    'SEXUALLY_EXPLICIT',
    'FLIRTATION'
  ];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Analyze text for harmful content
   */
  async analyzeText(text: string): Promise<{
    scores: Record<string, number>;
    highestScore: number;
    flaggedCategories: string[];
  }> {
    const requestBody = {
      comment: { text },
      requestedAttributes: this.attributes.reduce((acc, attr) => {
        acc[attr] = {};
        return acc;
      }, {} as Record<string, {}>),
      languages: ['en'], // Add more languages as needed
    };

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Perspective API error: ${response.statusText}`);
      }

      const data: PerspectiveResponse = await response.json();

      // Extract scores
      const scores: Record<string, number> = {};
      let highestScore = 0;
      const flaggedCategories: string[] = [];

      for (const [attribute, result] of Object.entries(data.attributeScores)) {
        const score = result.summaryScore.value;
        scores[attribute] = score;

        if (score > highestScore) {
          highestScore = score;
        }

        // Flag if score > 0.7 (70% confidence)
        if (score > 0.7) {
          flaggedCategories.push(attribute);
        }
      }

      return {
        scores,
        highestScore,
        flaggedCategories,
      };
    } catch (error) {
      console.error('Perspective API Error:', error);
      throw error;
    }
  }

  /**
   * Batch analyze multiple messages
   */
  async analyzeConversation(messages: string[]): Promise<{
    overallRisk: number;
    messageAnalyses: Array<{
      message: string;
      scores: Record<string, number>;
      highestScore: number;
      flaggedCategories: string[];
    }>;
    trendingUp: boolean;
  }> {
    const analyses = await Promise.all(
      messages.map(async (message) => {
        const result = await this.analyzeText(message);
        return {
          message,
          ...result,
        };
      })
    );

    // Calculate overall risk (average of highest scores)
    const overallRisk =
      analyses.reduce((sum, a) => sum + a.highestScore, 0) / analyses.length;

    // Check if toxicity is trending upward
    const trendingUp = this.isTrendingUp(
      analyses.map((a) => a.highestScore)
    );

    return {
      overallRisk,
      messageAnalyses: analyses,
      trendingUp,
    };
  }

  /**
   * Check if scores are trending upward (escalation detection)
   */
  private isTrendingUp(scores: number[]): boolean {
    if (scores.length < 3) return false;

    const recentScores = scores.slice(-3);
    const olderScores = scores.slice(-6, -3);

    if (olderScores.length === 0) return false;

    const recentAvg =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg =
      olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    return recentAvg > olderAvg * 1.2; // 20% increase
  }
}

// Example usage
async function example() {
  const analyzer = new PerspectiveAnalyzer(process.env.PERSPECTIVE_API_KEY!);

  // Single message analysis
  const result = await analyzer.analyzeText(
    "I'm feeling really hopeless and don't know what to do anymore"
  );

  console.log('Analysis Result:', {
    scores: result.scores,
    highestScore: result.highestScore,
    flaggedCategories: result.flaggedCategories,
  });

  // Conversation analysis
  const conversation = [
    "I'm having a tough day",
    "Things keep getting worse",
    "I don't think anyone would care if I was gone",
  ];

  const conversationResult = await analyzer.analyzeConversation(conversation);
  console.log('Conversation Analysis:', {
    overallRisk: conversationResult.overallRisk,
    trendingUp: conversationResult.trendingUp,
  });
}

export { PerspectiveAnalyzer };
export type { PerspectiveResponse, PerspectiveScore };
