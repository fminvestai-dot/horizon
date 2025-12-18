// src/types/horizon.d.ts

/**
 * Flexible Horizon System for QLM Hansei OS
 * Enables users to define their own vision, strategy, and tactical goals
 */

export interface Horizon {
  id: string; // H3-01, H2-01, H1-01
  userId: string;
  level: 'H3' | 'H2' | 'H1';
  title: string; // User-defined goal title
  description: string;
  quadrant: 'Business' | 'Vitality' | 'Mindset' | 'Relations';
  createdAt: string; // ISO timestamp
  updatedAt: string;
  status: 'active' | 'achieved' | 'archived';
  achievedAt?: string;
  parentHorizonId?: string; // Links H1 → H2 → H3
}

export interface HorizonConfig {
  h3: {
    label: string; // "Vision" (default)
    timeframe: string; // "10+ years" (default)
    userDefinedLabel?: string;
  };
  h2: {
    label: string; // "Strategy" (default)
    timeframe: string; // "3-4 years" (default)
    userDefinedLabel?: string;
  };
  h1: {
    label: string; // "Tactics" (default)
    timeframe: string; // "1 year" (default)
    userDefinedLabel?: string;
  };
}

export interface UserPreferences {
  peiThresholdIshikawa: number; // Auto-trigger Ishikawa when PEI drops below this (0-1)
  fireReminders: boolean; // Enable daily FIRE checklist reminders
  timezone: string; // User's timezone for daily streak calculations
  language?: string; // UI language preference
}
