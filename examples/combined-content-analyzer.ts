/**
 * Combined Content Analyzer
 *
 * This integrates multiple detection APIs and custom rules to provide
 * comprehensive safety analysis for youth AI interactions.
 *
 * Combines:
 * - Perspective API (toxicity)
 * - OpenAI Moderation API (safety categories)
 * - Custom keyword detection (mental health)
 * - Pattern analysis (escalation, trends)
 */

import { PerspectiveAnalyzer } from './perspective-api-example';
import { OpenAIModerator } from './openai-moderation-example';

interface AnalysisResult {
  timestamp: Date;
  text: string;
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: string[];
  flags: {
    toxicity: boolean;
    selfHarm: boolean;
    violence: boolean;
    hate: boolean;
    sexual: boolean;
    mentalHealthConcern: boolean;
  };
  details: {
    perspective: any;
    openai: any;
    keywords: string[];
    sentiment: number; // -1 to 1
  };
  requiresAlert: boolean;
  suggestedActions: string[];
}

interface ConversationAnalysis {
  messageCount: number;
  overallRiskScore: number;
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  isEscalating: boolean;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  criticalMessages: AnalysisResult[];
  recommendations: string[];
}

class CombinedContentAnalyzer {
  private perspective: PerspectiveAnalyzer;
  private openai: OpenAIModerator;
  private mentalHealthKeywords: Set<string>;
  private suicidalIdeationKeywords: Set<string>;

  constructor(perspectiveApiKey: string, openaiApiKey: string) {
    this.perspective = new PerspectiveAnalyzer(perspectiveApiKey);
    this.openai = new OpenAIModerator(openaiApiKey);

    // Mental health concern keywords
    this.mentalHealthKeywords = new Set([
      'depressed', 'depression', 'anxious', 'anxiety', 'hopeless',
      'worthless', 'lonely', 'isolated', 'empty', 'numb',
      'tired of living', 'can\'t go on', 'give up', 'no point',
      'burden', 'better off without me', 'end it all', 'done with life'
    ]);

    // Critical suicidal ideation keywords
    this.suicidalIdeationKeywords = new Set([
      'kill myself', 'suicide', 'end my life', 'want to die',
      'wish i was dead', 'wouldn\'t miss me', 'goodbye forever',
      'final message', 'take my own life', 'self harm', 'cut myself',
      'overdose', 'jump off', 'hang myself'
    ]);
  }

  /**
   * Analyze a single message with all detection methods
   */
  async analyzeMessage(text: string): Promise<AnalysisResult> {
    // Run all analyses in parallel for speed
    const [perspectiveResult, openaiResult, keywordMatches, sentiment] =
      await Promise.all([
        this.perspective.analyzeText(text),
        this.openai.moderateText(text),
        this.detectKeywords(text),
        this.analyzeSentiment(text),
      ]);

    // Calculate composite risk score (0-100)
    const riskScore = this.calculateRiskScore({
      perspective: perspectiveResult,
      openai: openaiResult,
      keywords: keywordMatches,
      sentiment,
    });

    // Determine risk level
    const riskLevel = this.determineRiskLevel(riskScore, openaiResult.criticalFlags);

    // Identify flags
    const flags = {
      toxicity: perspectiveResult.highestScore > 0.7,
      selfHarm: openaiResult.categories.includes('self-harm/intent') ||
                openaiResult.categories.includes('self-harm/instructions'),
      violence: openaiResult.categories.includes('violence') ||
                openaiResult.categories.includes('violence/graphic'),
      hate: openaiResult.categories.includes('hate') ||
            openaiResult.categories.includes('hate/threatening'),
      sexual: openaiResult.categories.includes('sexual') ||
              openaiResult.categories.includes('sexual/minors'),
      mentalHealthConcern: keywordMatches.length > 0,
    };

    // Combine all flagged categories
    const categories = [
      ...perspectiveResult.flaggedCategories,
      ...openaiResult.categories,
    ];

    // Determine if alert is required
    const requiresAlert = riskLevel === 'critical' ||
                         riskLevel === 'high' ||
                         flags.selfHarm;

    // Generate suggested actions
    const suggestedActions = this.generateSuggestedActions(flags, riskLevel);

    return {
      timestamp: new Date(),
      text,
      riskScore,
      riskLevel,
      categories,
      flags,
      details: {
        perspective: perspectiveResult,
        openai: openaiResult,
        keywords: keywordMatches,
        sentiment,
      },
      requiresAlert,
      suggestedActions,
    };
  }

  /**
   * Analyze an entire conversation for patterns
   */
  async analyzeConversation(messages: string[]): Promise<ConversationAnalysis> {
    // Analyze all messages
    const analyses = await Promise.all(
      messages.map((msg) => this.analyzeMessage(msg))
    );

    // Calculate overall risk
    const overallRiskScore =
      analyses.reduce((sum, a) => sum + a.riskScore, 0) / analyses.length;

    const overallRiskLevel = this.determineRiskLevel(overallRiskScore, []);

    // Detect escalation
    const isEscalating = this.detectEscalation(
      analyses.map((a) => a.riskScore)
    );

    // Analyze sentiment trend
    const sentimentTrend = this.analyzeSentimentTrend(
      analyses.map((a) => a.details.sentiment)
    );

    // Identify critical messages
    const criticalMessages = analyses.filter(
      (a) => a.riskLevel === 'critical' || a.riskLevel === 'high'
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      overallRiskLevel,
      isEscalating,
      sentimentTrend,
      criticalMessages,
    });

    return {
      messageCount: messages.length,
      overallRiskScore,
      overallRiskLevel,
      isEscalating,
      sentimentTrend,
      criticalMessages,
      recommendations,
    };
  }

  /**
   * Detect mental health and suicidal ideation keywords
   */
  private async detectKeywords(text: string): Promise<string[]> {
    const normalizedText = text.toLowerCase();
    const matches: string[] = [];

    // Check mental health keywords
    this.mentalHealthKeywords.forEach((keyword) => {
      if (normalizedText.includes(keyword)) {
        matches.push(keyword);
      }
    });

    // Check suicidal ideation keywords (critical)
    this.suicidalIdeationKeywords.forEach((keyword) => {
      if (normalizedText.includes(keyword)) {
        matches.push(`[CRITICAL] ${keyword}`);
      }
    });

    return matches;
  }

  /**
   * Simple sentiment analysis (-1 to 1)
   */
  private async analyzeSentiment(text: string): Promise<number> {
    // This is a simplified version. In production, use a proper sentiment analysis library
    const positiveWords = ['happy', 'good', 'great', 'better', 'hope', 'love', 'joy'];
    const negativeWords = ['sad', 'bad', 'worse', 'hate', 'hurt', 'pain', 'terrible'];

    const normalized = text.toLowerCase();
    let score = 0;

    positiveWords.forEach((word) => {
      if (normalized.includes(word)) score += 0.1;
    });

    negativeWords.forEach((word) => {
      if (normalized.includes(word)) score -= 0.1;
    });

    return Math.max(-1, Math.min(1, score));
  }

  /**
   * Calculate composite risk score from all sources
   */
  private calculateRiskScore(data: {
    perspective: any;
    openai: any;
    keywords: string[];
    sentiment: number;
  }): number {
    // Weighted scoring
    const perspectiveWeight = 0.3;
    const openaiWeight = 0.4;
    const keywordWeight = 0.2;
    const sentimentWeight = 0.1;

    // Perspective score (0-100)
    const perspectiveScore = data.perspective.highestScore * 100;

    // OpenAI score (0-100)
    const openaiScore = Math.max(...Object.values(data.openai.scores)) * 100;

    // Keyword score (0-100)
    const hasCriticalKeyword = data.keywords.some((k) => k.includes('[CRITICAL]'));
    const keywordScore = hasCriticalKeyword ? 100 : data.keywords.length * 20;

    // Sentiment score (0-100, inverted so negative = high score)
    const sentimentScore = (1 - data.sentiment) * 50;

    // Composite score
    const composite =
      perspectiveScore * perspectiveWeight +
      openaiScore * openaiWeight +
      keywordScore * keywordWeight +
      sentimentScore * sentimentWeight;

    return Math.min(100, Math.max(0, composite));
  }

  /**
   * Determine risk level from score
   */
  private determineRiskLevel(
    score: number,
    criticalFlags: string[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (criticalFlags.length > 0 || score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  /**
   * Detect if conversation is escalating
   */
  private detectEscalation(scores: number[]): boolean {
    if (scores.length < 3) return false;

    const recentScores = scores.slice(-3);
    const olderScores = scores.slice(-6, -3);

    if (olderScores.length === 0) return false;

    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;

    return recentAvg > olderAvg * 1.3; // 30% increase
  }

  /**
   * Analyze sentiment trend
   */
  private analyzeSentimentTrend(
    sentiments: number[]
  ): 'improving' | 'declining' | 'stable' {
    if (sentiments.length < 3) return 'stable';

    const recentAvg =
      sentiments.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg =
      sentiments.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;

    if (recentAvg > olderAvg * 1.2) return 'improving';
    if (recentAvg < olderAvg * 0.8) return 'declining';
    return 'stable';
  }

  /**
   * Generate suggested actions based on flags
   */
  private generateSuggestedActions(
    flags: AnalysisResult['flags'],
    riskLevel: string
  ): string[] {
    const actions: string[] = [];

    if (flags.selfHarm) {
      actions.push('IMMEDIATE: Contact crisis intervention services');
      actions.push('Notify parent/guardian immediately');
      actions.push('Provide crisis hotline resources');
    }

    if (flags.violence) {
      actions.push('Assess immediate danger to self or others');
      actions.push('Notify appropriate authorities if threat detected');
    }

    if (flags.mentalHealthConcern) {
      actions.push('Consider reaching out to mental health resources');
      actions.push('Monitor conversation closely');
    }

    if (riskLevel === 'critical' || riskLevel === 'high') {
      actions.push('Send alert to trusted contacts');
      actions.push('Increase monitoring frequency');
    }

    return actions;
  }

  /**
   * Generate conversation-level recommendations
   */
  private generateRecommendations(data: {
    overallRiskLevel: string;
    isEscalating: boolean;
    sentimentTrend: string;
    criticalMessages: AnalysisResult[];
  }): string[] {
    const recommendations: string[] = [];

    if (data.criticalMessages.length > 0) {
      recommendations.push(
        `${data.criticalMessages.length} critical message(s) detected - immediate review required`
      );
    }

    if (data.isEscalating) {
      recommendations.push('Conversation risk is escalating - increase monitoring');
    }

    if (data.sentimentTrend === 'declining') {
      recommendations.push('Sentiment is declining - user may need support');
    }

    if (data.overallRiskLevel === 'critical' || data.overallRiskLevel === 'high') {
      recommendations.push('High overall risk - consider intervention');
    }

    return recommendations;
  }
}

// Example usage
async function example() {
  const analyzer = new CombinedContentAnalyzer(
    process.env.PERSPECTIVE_API_KEY!,
    process.env.OPENAI_API_KEY!
  );

  // Analyze a single message
  const messageResult = await analyzer.analyzeMessage(
    "I'm feeling really depressed and don't know what to do"
  );

  console.log('Message Analysis:', {
    riskScore: messageResult.riskScore,
    riskLevel: messageResult.riskLevel,
    flags: messageResult.flags,
    requiresAlert: messageResult.requiresAlert,
    suggestedActions: messageResult.suggestedActions,
  });

  // Analyze a conversation
  const conversation = [
    "I'm having a bad day",
    "Nothing seems to matter anymore",
    "I'm so tired of feeling this way",
    "I don't think I can keep going",
  ];

  const conversationResult = await analyzer.analyzeConversation(conversation);

  console.log('Conversation Analysis:', {
    overallRiskScore: conversationResult.overallRiskScore,
    overallRiskLevel: conversationResult.overallRiskLevel,
    isEscalating: conversationResult.isEscalating,
    sentimentTrend: conversationResult.sentimentTrend,
    recommendations: conversationResult.recommendations,
  });
}

export { CombinedContentAnalyzer };
export type { AnalysisResult, ConversationAnalysis };
