// src/types/belt.d.ts

/**
 * Belt Progression System for QLM Hansei OS
 * 4-year mastery path: White → Yellow → Orange → Green → Black
 */

export type BeltLevel = 'white' | 'yellow' | 'orange' | 'green' | 'black';

export interface BeltRequirements {
  level: BeltLevel;
  displayName: string;
  minDaysConsecutive: number; // Minimum consecutive days of practice
  minMonths: number; // Minimum months since first log
  requiredGoals: {
    h1?: number; // Number of H1 goals achieved
    h2?: number; // Number of H2 milestones achieved
  };
  peiThreshold?: number; // Minimum 90-day average PEI (0-1)
  description: string;
}

export interface BeltProgress {
  currentBelt: BeltLevel;
  currentBeltAwardedAt: string; // ISO timestamp
  daysConsecutive: number; // Current streak of consecutive days
  totalDaysLogged: number; // All-time total days with logs
  firstLogDate: string; // User's journey start date (ISO timestamp)
  nextBelt?: BeltLevel;
  progressToNext: {
    daysRemaining: number; // Days of consecutive practice needed
    monthsRemaining: number; // Months until eligible
    goalsRemaining: {
      h1: number; // H1 goals still needed
      h2: number; // H2 goals still needed
    };
    peiAverage: number; // Current 90-day PEI average (0-1)
    isEligible: boolean; // Whether all requirements are met
  };
  achievedGoals: string[]; // Array of GoalProof IDs
}

/**
 * Belt requirements matrix
 * Used to calculate progression eligibility
 */
export const BELT_REQUIREMENTS: BeltRequirements[] = [
  {
    level: 'white',
    displayName: 'White Belt',
    minDaysConsecutive: 0,
    minMonths: 0,
    requiredGoals: {},
    description: 'Begin your Hansei journey. Focus on establishing the FIRE routine.'
  },
  {
    level: 'yellow',
    displayName: 'Yellow Belt',
    minDaysConsecutive: 180, // ~6 months of daily practice
    minMonths: 12,
    requiredGoals: { h1: 1 },
    peiThreshold: 0.7, // 70% average PEI
    description: '1 year of consistency + first H1 goal achieved'
  },
  {
    level: 'orange',
    displayName: 'Orange Belt',
    minDaysConsecutive: 365, // ~12 months of daily practice
    minMonths: 24,
    requiredGoals: { h1: 2, h2: 1 },
    peiThreshold: 0.75, // 75% average PEI
    description: '2 years stability + significant H2 progress'
  },
  {
    level: 'green',
    displayName: 'Green Belt',
    minDaysConsecutive: 730, // ~24 months of daily practice
    minMonths: 36,
    requiredGoals: { h1: 3, h2: 1 },
    peiThreshold: 0.8, // 80% average PEI
    description: '3 years stability + major H2 milestone achieved'
  },
  {
    level: 'black',
    displayName: 'Black Belt',
    minDaysConsecutive: 1095, // ~36 months of daily practice
    minMonths: 48,
    requiredGoals: { h1: 4, h2: 2 },
    peiThreshold: 0.85, // 85% average PEI
    description: '4 years of consistent Hansei culture + primary H2 goals achieved'
  }
];

/**
 * Get belt level index for comparison
 */
export function getBeltIndex(belt: BeltLevel): number {
  const levels: BeltLevel[] = ['white', 'yellow', 'orange', 'green', 'black'];
  return levels.indexOf(belt);
}

/**
 * Get next belt level
 */
export function getNextBelt(currentBelt: BeltLevel): BeltLevel | null {
  const levels: BeltLevel[] = ['white', 'yellow', 'orange', 'green', 'black'];
  const currentIndex = levels.indexOf(currentBelt);
  if (currentIndex >= levels.length - 1) return null; // Already Black Belt
  return levels[currentIndex + 1];
}
