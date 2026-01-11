/**
 * Shared Constants
 * Application-wide constants
 */

export const RISK_THRESHOLDS = {
  LOW: 40,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 100,
} as const;

export const CRISIS_HOTLINES = {
  US_SUICIDE_LIFELINE: '988',
  US_CRISIS_TEXT: '741741',
  US_TREVOR_PROJECT: '1-866-488-7386',
} as const;

export const API_TIMEOUTS = {
  PERSPECTIVE: 10000,
  OPENAI: 10000,
  DEFAULT: 5000,
} as const;

export const MAX_MESSAGE_LENGTH = 10000;
export const MAX_CONVERSATION_LENGTH = 100;
