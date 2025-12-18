
// qlm-hansei-os/src/types/hansei.d.ts

import { Horizon, HorizonConfig, UserPreferences } from './horizon';
import { BeltProgress } from './belt';

/**
 * User Profile
 * Root data structure for each user
 */
export interface UserProfile {
  id: string; // UUID from Supabase auth
  email: string;
  displayName: string;
  createdAt: string; // ISO timestamp
  horizonConfig: HorizonConfig;
  beltProgress: BeltProgress;
  preferences: UserPreferences;
}

// Legacy: Kept for backward compatibility during migration
export interface Hoshin {
  id: string; // e.g., H-01
  quadrant: 'Business' | 'Vitality' | 'Mindset' | 'Relations';
  goal: string;
  quarterlyGoals: QuarterlyGoalRef[];
}

export interface QuarterlyGoalRef {
  id: string; // e.g., Q1-01
  hoshinId: string;
}

export interface PEI {
  availability: number; // 0-1
  performance: number; // 0-1
  quality: number; // 0-1
  total: number; // V * L * Q
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  horizonSync: string[]; // Array of Horizon IDs (H1, H2, H3)
  hoshinSync?: string[]; // Legacy: kept for migration
  fireChecklist: {
    focus: boolean;
    intention: boolean;
    review: boolean;
    execution: boolean;
  };
  taktTimeline: TaktBlock[];
  pei: PEI;
  muda: string; // Daily waste reflection
}

export interface TaktBlock {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  task: string;
  horizonId?: string; // Link to Horizon goal
  hoshinId?: string; // Legacy: kept for migration
}

export interface WeeklyReview {
  week: number; // Week number of the year
  year: number;
  peiTrend: PEI[]; // Daily PEI scores for the week
  ishikawaAnalysis?: Ishikawa;
  fiveWhys: string[]; // Array of 5 why answers
  pokaYoke: string; // System change for next week
}

export interface Ishikawa {
  problem: string;
  causes: {
    methods: string[];
    machines: string[];
    manpower: string[];
    materials: string[];
    measurements: string[];
    environment: string[];
  };
}

export interface MonthlyReview {
  month: number;
  year: number;
  // ... other monthly review metrics
}

export interface QuarterlyReview {
  quarter: number;
  year: number;
  hoshinProgress: any; // ...
}

export interface YearlyReview {
  year: number;
  hoshinReview: any; // ...
}

export interface HanseiData {
  years: { [year: number]: YearData };
}

export interface YearData {
  horizons: Horizon[]; // User-defined horizons for this year
  hoshinPlan?: Hoshin[]; // Legacy: kept for migration
  quarters: { [quarter: number]: QuarterData };
  yearlyReview: YearlyReview;
}

export interface QuarterData {
  quarterlyReview: QuarterlyReview;
  months: { [month: number]: MonthData };
}

export interface MonthData {
  monthlyReview: MonthlyReview;
  weeks: { [week: number]: WeekData };
}

export interface WeekData {
  weeklyReview: WeeklyReview;
  days: { [day: string]: DailyLog }; // YYYY-MM-DD
}
      