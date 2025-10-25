/**
 * OpenAI Moderation API Integration
 * Comprehensive content safety detection
 */

export interface ModerationCategory {
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

export interface ModerationCategoryScores {
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

export interface ModerationResult {
  flagged: boolean;
  categories: ModerationCategory;
  category_scores: ModerationCategoryScores;
}

export interface ModerationResponse {
  id: string;
  model: string;
  results: ModerationResult[];
}

export class OpenAIModerator {
  private apiKey: string;
  private apiUrl = 'https://api.openai.com/v1/moderations';

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

      const categories = Object.entries(result.categories)
        .filter(([_, flagged]) => flagged)
        .map(([category, _]) => category);

      const criticalFlags = categories.filter((cat) =>
        this.criticalCategories.includes(cat)
      );

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

    const hasCriticalFlags = results.some((r) => r.criticalFlags.length > 0);

    const categoryFrequency: Record<string, number> = {};
    results.forEach((r) => {
      r.categories.forEach((cat) => {
        categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
      });
    });

    const overallRiskLevel = this.determineOverallRisk(results);

    return {
      results,
      overallRiskLevel,
      hasCriticalFlags,
      categoryFrequency,
    };
  }

  private calculateRiskLevel(
    scores: ModerationCategoryScores,
    criticalFlags: string[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (criticalFlags.length > 0) {
      return 'critical';
    }

    const maxScore = Math.max(...Object.values(scores));

    if (maxScore > 0.8) return 'high';
    if (maxScore > 0.5) return 'medium';
    return 'low';
  }

  private determineOverallRisk(
    results: Array<{ riskLevel: string; criticalFlags: string[] }>
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (results.some((r) => r.riskLevel === 'critical')) {
      return 'critical';
    }

    const highRiskCount = results.filter((r) => r.riskLevel === 'high').length;
    if (highRiskCount >= 2) {
      return 'high';
    }

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

    const requiresIntervention = hasSelfHarmIntent || hasSelfHarmInstructions || score > 0.7;

    return {
      hasSelfHarmIntent,
      hasSelfHarmInstructions,
      score,
      requiresIntervention,
    };
  }
}
