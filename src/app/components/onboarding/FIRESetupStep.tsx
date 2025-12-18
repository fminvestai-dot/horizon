'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface FIRESetupStepProps {
  onComplete: (peiThreshold: number) => void;
  onBack: () => void;
  loading?: boolean;
}

export default function FIRESetupStep({ onComplete, onBack, loading }: FIRESetupStepProps) {
  const [peiThreshold, setPeiThreshold] = useState(0.7);

  const handleComplete = () => {
    onComplete(peiThreshold);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={onBack}
        className="flex items-center text-zen-gray hover:text-zen-white mb-6 transition-colors"
        disabled={loading}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono mb-2">FIRE Routine</h1>
        <p className="text-zen-gray mb-4">
          Configure your daily Hansei practice preferences
        </p>
      </div>

      <div className="space-y-8">
        {/* FIRE Checklist Explanation */}
        <div className="bg-zen-black border border-zen-gray rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">What is FIRE?</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-zen-accent">F - Focus</h3>
              <p className="text-sm text-zen-gray">
                Start your day by defining your primary focus. What's the most important thing today?
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zen-accent">I - Intention</h3>
              <p className="text-sm text-zen-gray">
                Set your intention. How do you want to show up today? What mindset will serve you?
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zen-accent">R - Review</h3>
              <p className="text-sm text-zen-gray">
                End your day with reflection. What went well? What could be improved?
              </p>
            </div>
            <div>
              <h3 className="font-medium text-zen-accent">E - Execution</h3>
              <p className="text-sm text-zen-gray">
                Did you execute on your focus? Assess your follow-through and commitment.
              </p>
            </div>
          </div>
        </div>

        {/* PEI Threshold */}
        <div className="bg-zen-black border border-zen-gray rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">PEI Auto-Analysis Threshold</h2>
          <p className="text-sm text-zen-gray mb-6">
            When your weekly PEI average drops below this threshold, the system will automatically
            prompt you to complete an Ishikawa analysis (fishbone diagram) to identify root causes.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Threshold</label>
              <span className="font-mono text-xl text-zen-accent">
                {Math.round(peiThreshold * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              value={peiThreshold}
              onChange={(e) => setPeiThreshold(parseFloat(e.target.value))}
              className="w-full accent-zen-accent"
            />

            <div className="flex justify-between text-xs text-zen-gray">
              <span>50%</span>
              <span>70% (Recommended)</span>
              <span>90%</span>
            </div>
          </div>

          <div className="mt-4 text-sm text-zen-gray">
            <p>
              <strong>Recommended: 70%</strong> — A balanced threshold that catches performance
              dips without being overly sensitive.
            </p>
          </div>
        </div>

        {/* Timezone Info */}
        <div className="bg-zen-accent/10 border border-zen-accent rounded-lg p-4">
          <p className="text-sm">
            <strong>Timezone:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
          <p className="text-xs text-zen-gray mt-1">
            Your timezone will be used for daily streak calculations and reminders.
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 border border-zen-gray text-zen-white py-3 rounded-lg hover:bg-zen-gray/10 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="flex-1 bg-zen-accent text-zen-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Completing setup...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
