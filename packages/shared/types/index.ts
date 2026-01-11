/**
 * Shared TypeScript Types
 * Common types used across frontend and backend
 */

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SafetyFlags {
  toxicity: boolean;
  selfHarm: boolean;
  violence: boolean;
  hate: boolean;
  sexual: boolean;
  mentalHealthConcern: boolean;
}

export interface AnalysisResult {
  timestamp: Date;
  text: string;
  riskScore: number;
  riskLevel: RiskLevel;
  categories: string[];
  flags: SafetyFlags;
  details: {
    perspective: any;
    openai: any;
    keywords: string[];
    sentiment: number;
  };
  requiresAlert: boolean;
  suggestedActions: string[];
}

export interface ConversationAnalysis {
  messageCount: number;
  overallRiskScore: number;
  overallRiskLevel: RiskLevel;
  isEscalating: boolean;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  criticalMessages: AnalysisResult[];
  recommendations: string[];
}

export interface CrisisResource {
  name: string;
  type: 'hotline' | 'text_line' | 'chat' | 'directory';
  phone?: string;
  url?: string;
  description: string;
  available: string;
  languages: string[];
  services: string[];
}
