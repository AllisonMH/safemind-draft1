/**
 * Perspective API Integration
 * Google's Perspective API for toxicity detection
 */

export interface PerspectiveScore {
  value: number;
  type: string;
}

export interface PerspectiveResponse {
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

export class PerspectiveAnalyzer {
  private apiKey: string;
  private apiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

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
      languages: ['en'],
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

      const scores: Record<string, number> = {};
      let highestScore = 0;
      const flaggedCategories: string[] = [];

      for (const [attribute, result] of Object.entries(data.attributeScores)) {
        const score = result.summaryScore.value;
        scores[attribute] = score;

        if (score > highestScore) {
          highestScore = score;
        }

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

    const overallRisk =
      analyses.reduce((sum, a) => sum + a.highestScore, 0) / analyses.length;

    const trendingUp = this.isTrendingUp(
      analyses.map((a) => a.highestScore)
    );

    return {
      overallRisk,
      messageAnalyses: analyses,
      trendingUp,
    };
  }

  private isTrendingUp(scores: number[]): boolean {
    if (scores.length < 3) return false;

    const recentScores = scores.slice(-3);
    const olderScores = scores.slice(-6, -3);

    if (olderScores.length === 0) return false;

    const recentAvg =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg =
      olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    return recentAvg > olderAvg * 1.2;
  }
}
