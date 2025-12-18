'use client';

import { BeltProgress, BELT_REQUIREMENTS, getBeltIndex } from '@/types/belt';

interface BeltProgressTrackerProps {
  beltProgress: BeltProgress;
}

const beltColors = {
  white: 'belt-white',
  yellow: 'belt-yellow',
  orange: 'belt-orange',
  green: 'belt-green',
  black: 'belt-black',
};

const beltEmojis = {
  white: '⚪',
  yellow: '🟡',
  orange: '🟠',
  green: '🟢',
  black: '⚫',
};

export default function BeltProgressTracker({ beltProgress }: BeltProgressTrackerProps) {
  if (!beltProgress) return null;

  const currentBeltReq = BELT_REQUIREMENTS[getBeltIndex(beltProgress.currentBelt)];
  const nextBeltReq = beltProgress.nextBelt
    ? BELT_REQUIREMENTS[getBeltIndex(beltProgress.nextBelt)]
    : null;

  const progressPercent = nextBeltReq
    ? Math.min(
        100,
        ((beltProgress.daysConsecutive / nextBeltReq.minDaysConsecutive) +
          ((beltProgress.progressToNext.peiAverage || 0) / (nextBeltReq.peiThreshold || 1))) /
          2 *
          100
      )
    : 100;

  return (
    <div className="relative backdrop-blur-xl bg-gradient-to-br from-zen-dark/80 to-zen-black/80 border border-zen-gray/20 rounded-2xl p-6 shadow-glass hover:shadow-glow-lg transition-all duration-500">
      <div className="absolute inset-0 bg-glass rounded-2xl opacity-50" />
      <h2 className="relative text-xl font-bold font-mono mb-6 bg-gradient-to-r from-zen-white to-zen-gray-light bg-clip-text text-transparent">Belt Progress</h2>

      {/* Current Belt */}
      <div className="relative mb-6 p-4 rounded-xl bg-gradient-to-br from-zen-accent/10 to-transparent border border-zen-accent/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zen-accent/20 to-zen-accent/5 flex items-center justify-center">
            <span className="text-3xl">{beltEmojis[beltProgress.currentBelt]}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{currentBeltReq.displayName}</h3>
            <p className="text-sm text-zen-gray-light">{currentBeltReq.description}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zen-gray">Consecutive Days</span>
            <span className="font-mono font-semibold">{beltProgress.daysConsecutive}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zen-gray">Total Days Logged</span>
            <span className="font-mono font-semibold">{beltProgress.totalDaysLogged}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zen-gray">90-Day PEI Average</span>
            <span className="font-mono font-semibold">
              {Math.round((beltProgress.progressToNext.peiAverage || 0) * 100)}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-zen-gray">Goals Achieved</span>
            <span className="font-mono font-semibold">{beltProgress.achievedGoals?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Next Belt Progress */}
      {nextBeltReq && (
        <div className="border-t border-zen-gray pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Next: {nextBeltReq.displayName}</h3>
            <span className="text-2xl">{beltEmojis[beltProgress.nextBelt!]}</span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-zen-gray mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 bg-zen-gray rounded-full overflow-hidden">
              <div
                className="h-full bg-zen-accent transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zen-gray">Consecutive Days</span>
              <span className={beltProgress.progressToNext.daysRemaining === 0 ? 'text-green-500' : ''}>
                {beltProgress.daysConsecutive}/{nextBeltReq.minDaysConsecutive}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zen-gray">Months Elapsed</span>
              <span className={beltProgress.progressToNext.monthsRemaining === 0 ? 'text-green-500' : ''}>
                {nextBeltReq.minMonths - beltProgress.progressToNext.monthsRemaining}/{nextBeltReq.minMonths}
              </span>
            </div>

            {nextBeltReq.requiredGoals.h1 && (
              <div className="flex items-center justify-between">
                <span className="text-zen-gray">H1 Goals</span>
                <span className={beltProgress.progressToNext.goalsRemaining.h1 === 0 ? 'text-green-500' : ''}>
                  {(nextBeltReq.requiredGoals.h1 || 0) - beltProgress.progressToNext.goalsRemaining.h1}/{nextBeltReq.requiredGoals.h1}
                </span>
              </div>
            )}

            {nextBeltReq.requiredGoals.h2 && (
              <div className="flex items-center justify-between">
                <span className="text-zen-gray">H2 Goals</span>
                <span className={beltProgress.progressToNext.goalsRemaining.h2 === 0 ? 'text-green-500' : ''}>
                  {(nextBeltReq.requiredGoals.h2 || 0) - beltProgress.progressToNext.goalsRemaining.h2}/{nextBeltReq.requiredGoals.h2}
                </span>
              </div>
            )}

            {nextBeltReq.peiThreshold && (
              <div className="flex items-center justify-between">
                <span className="text-zen-gray">PEI Average</span>
                <span className={
                  (beltProgress.progressToNext.peiAverage || 0) >= nextBeltReq.peiThreshold
                    ? 'text-green-500'
                    : ''
                }>
                  {Math.round((beltProgress.progressToNext.peiAverage || 0) * 100)}%/{Math.round(nextBeltReq.peiThreshold * 100)}%
                </span>
              </div>
            )}
          </div>

          {beltProgress.progressToNext.isEligible && (
            <div className="mt-4 bg-green-900/20 border border-green-500 text-green-500 px-4 py-3 rounded text-sm">
              ✅ You're eligible for {nextBeltReq.displayName}!
            </div>
          )}
        </div>
      )}

      {!nextBeltReq && (
        <div className="border-t border-zen-gray pt-6">
          <div className="bg-zen-accent/10 border border-zen-accent text-zen-accent px-4 py-3 rounded text-sm text-center">
            ⚫ Black Belt Master! You've achieved the highest rank.
          </div>
        </div>
      )}
    </div>
  );
}
