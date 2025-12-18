// src/lib/belt/calculateProgress.ts
/**
 * Belt progression calculation logic
 */

import { BeltLevel, BeltProgress, BELT_REQUIREMENTS, getNextBelt, getBeltIndex } from '@/types/belt';
import { calculate90DayPEI, getTotalDaysLogged } from '../api/dailyLogs';
import { countAchievedGoalsByLevel } from '../api/goalProofs';
import { differenceInMonths, differenceInDays } from 'date-fns';

/**
 * Calculate months since user's first log
 */
function getMonthsSinceStart(firstLogDate: string): number {
  return differenceInMonths(new Date(), new Date(firstLogDate));
}

/**
 * Calculate progress toward next belt
 */
export async function calculateBeltProgress(currentProgress: BeltProgress): Promise<BeltProgress> {
  const nextBelt = getNextBelt(currentProgress.currentBelt);

  // Already at Black Belt
  if (!nextBelt) {
    return {
      ...currentProgress,
      nextBelt: undefined,
      progressToNext: {
        daysRemaining: 0,
        monthsRemaining: 0,
        goalsRemaining: { h1: 0, h2: 0 },
        peiAverage: await calculate90DayPEI(),
        isEligible: true,
      },
    };
  }

  // Get next belt requirements
  const nextBeltIndex = getBeltIndex(nextBelt);
  const requirements = BELT_REQUIREMENTS[nextBeltIndex];

  // Calculate days remaining
  const daysRemaining = Math.max(0, requirements.minDaysConsecutive - currentProgress.daysConsecutive);

  // Calculate months remaining
  const monthsSinceStart = getMonthsSinceStart(currentProgress.firstLogDate);
  const monthsRemaining = Math.max(0, requirements.minMonths - monthsSinceStart);

  // Calculate goals remaining
  const achievedGoals = await countAchievedGoalsByLevel();
  const goalsRemaining = {
    h1: Math.max(0, (requirements.requiredGoals.h1 || 0) - achievedGoals.h1),
    h2: Math.max(0, (requirements.requiredGoals.h2 || 0) - achievedGoals.h2),
  };

  // Calculate current PEI average
  const peiAverage = await calculate90DayPEI();

  // Check eligibility
  const meetsTime = daysRemaining === 0;
  const meetsMonths = monthsRemaining === 0;
  const meetsPEI = requirements.peiThreshold ? peiAverage >= requirements.peiThreshold : true;
  const meetsGoals = goalsRemaining.h1 === 0 && goalsRemaining.h2 === 0;

  const isEligible = meetsTime && meetsMonths && meetsPEI && meetsGoals;

  return {
    ...currentProgress,
    nextBelt,
    progressToNext: {
      daysRemaining,
      monthsRemaining,
      goalsRemaining,
      peiAverage,
      isEligible,
    },
  };
}

/**
 * Check if user is eligible for next belt
 */
export async function checkBeltEligibility(currentProgress: BeltProgress): Promise<BeltLevel | null> {
  const updated = await calculateBeltProgress(currentProgress);

  if (updated.progressToNext.isEligible && updated.nextBelt) {
    return updated.nextBelt;
  }

  return null;
}

/**
 * Update daily streak
 * Called by background cron job or on daily log creation
 */
export async function updateDailyStreak(
  currentProgress: BeltProgress,
  hasLoggedToday: boolean,
  hasLoggedYesterday: boolean
): Promise<BeltProgress> {
  let daysConsecutive = currentProgress.daysConsecutive;

  if (hasLoggedToday) {
    // Continue or start streak
    if (hasLoggedYesterday || daysConsecutive === 0) {
      daysConsecutive++;
    } else {
      // Streak broken, reset to 1
      daysConsecutive = 1;
    }
  } else if (!hasLoggedYesterday) {
    // Streak broken
    daysConsecutive = 0;
  }

  // Update total days logged
  const totalDaysLogged = await getTotalDaysLogged();

  return {
    ...currentProgress,
    daysConsecutive,
    totalDaysLogged,
  };
}

/**
 * Award next belt to user
 * Updates user profile with new belt level
 */
export async function awardBelt(newBelt: BeltLevel): Promise<BeltProgress> {
  const now = new Date().toISOString();

  // Get current progress from user profile (via API)
  // This would be implemented in the actual API route

  const newProgress: BeltProgress = {
    currentBelt: newBelt,
    currentBeltAwardedAt: now,
    daysConsecutive: 0, // Will be updated by updateDailyStreak
    totalDaysLogged: await getTotalDaysLogged(),
    firstLogDate: '', // Preserve from existing progress
    achievedGoals: [], // Will be populated from goal_proofs
    progressToNext: {
      daysRemaining: 0,
      monthsRemaining: 0,
      goalsRemaining: { h1: 0, h2: 0 },
      peiAverage: 0,
      isEligible: false,
    },
  };

  return calculateBeltProgress(newProgress);
}

/**
 * Calculate estimated date to reach next belt
 */
export function estimateNextBeltDate(progress: BeltProgress): Date | null {
  if (!progress.nextBelt) return null;

  const { daysRemaining, monthsRemaining } = progress.progressToNext;

  // Use the larger of days or months remaining
  const daysToAdd = Math.max(daysRemaining, monthsRemaining * 30);

  const estimated = new Date();
  estimated.setDate(estimated.getDate() + daysToAdd);

  return estimated;
}

/**
 * Get progress percentage toward next belt
 */
export function getBeltProgressPercentage(progress: BeltProgress): number {
  if (!progress.nextBelt) return 100; // Already at max

  const nextBeltIndex = getBeltIndex(progress.nextBelt);
  const requirements = BELT_REQUIREMENTS[nextBeltIndex];

  // Calculate percentage based on multiple factors
  const timeProgress = Math.min(100, (progress.daysConsecutive / requirements.minDaysConsecutive) * 100);

  const monthsSinceStart = getMonthsSinceStart(progress.firstLogDate);
  const monthProgress = Math.min(100, (monthsSinceStart / requirements.minMonths) * 100);

  const achievedGoals = progress.achievedGoals.length;
  const requiredGoals = (requirements.requiredGoals.h1 || 0) + (requirements.requiredGoals.h2 || 0);
  const goalProgress = requiredGoals > 0 ? Math.min(100, (achievedGoals / requiredGoals) * 100) : 100;

  const peiProgress = requirements.peiThreshold
    ? Math.min(100, (progress.progressToNext.peiAverage / requirements.peiThreshold) * 100)
    : 100;

  // Average all factors
  return (timeProgress + monthProgress + goalProgress + peiProgress) / 4;
}
