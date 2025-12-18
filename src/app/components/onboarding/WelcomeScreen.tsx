'use client';

import { Target } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="max-w-3xl mx-auto py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-zen-accent/10 rounded-full mb-6">
          <Target size={40} className="text-zen-accent" />
        </div>
        <h1 className="text-4xl font-bold font-mono mb-4">Welcome to QLM Hansei OS</h1>
        <p className="text-xl text-zen-gray">
          A personal operating system for high-performers
        </p>
      </div>

      <div className="bg-zen-black border border-zen-gray rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">What is Hansei OS?</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-zen-accent mb-2">
              🎯 Flexible Horizon System
            </h3>
            <p className="text-zen-gray">
              Define your own goals across three time horizons: Vision (10+ years), Strategy (3-4 years), and Tactics (1 year). No predefined goals — you're in control.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zen-accent mb-2">
              📊 PEI Tracking
            </h3>
            <p className="text-zen-gray">
              Track your daily Performance Effectiveness Index (Availability × Performance × Quality) to measure consistency and identify areas for improvement.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zen-accent mb-2">
              🥋 Belt Progression System
            </h3>
            <p className="text-zen-gray">
              Progress from White Belt to Black Belt over 4 years by maintaining daily practice and achieving your goals. Your journey to mastery starts today.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zen-accent mb-2">
              🔄 Continuous Improvement (Kaizen)
            </h3>
            <p className="text-zen-gray">
              Use weekly Hansei (reflection), Ishikawa analysis, 5-Whys, and Poka-Yoke to continuously improve your systems and eliminate waste (Muda).
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zen-accent/10 border border-zen-accent rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-2">Your First Step</h3>
        <p className="text-sm text-zen-gray">
          In the next few steps, you'll define your personal horizons. This is the foundation of your Hansei practice. Take your time — you can always refine these later.
        </p>
      </div>

      <button
        onClick={onContinue}
        className="w-full bg-zen-accent text-zen-black font-medium py-4 rounded-lg text-lg hover:opacity-90 transition-opacity"
      >
        Begin Your Journey
      </button>
    </div>
  );
}
