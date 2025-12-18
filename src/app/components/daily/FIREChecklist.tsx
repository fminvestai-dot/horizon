'use client';

import { Flame } from 'lucide-react';

interface FIREChecklistProps {
  checklist: {
    focus: boolean;
    intention: boolean;
    review: boolean;
    execution: boolean;
  };
  onChange: (checklist: FIREChecklistProps['checklist']) => void;
}

export default function FIREChecklist({ checklist, onChange }: FIREChecklistProps) {
  const toggleItem = (item: keyof typeof checklist) => {
    onChange({ ...checklist, [item]: !checklist[item] });
  };

  const fireItems = [
    {
      key: 'focus' as const,
      label: 'Focus',
      description: 'Define your primary focus for today',
    },
    {
      key: 'intention' as const,
      label: 'Intention',
      description: 'Set your mindset and intention',
    },
    {
      key: 'review' as const,
      label: 'Review',
      description: 'Reflect on what went well and what could improve',
    },
    {
      key: 'execution' as const,
      label: 'Execution',
      description: 'Assess your follow-through and commitment',
    },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = (completedCount / 4) * 100;

  return (
    <div className="bg-zen-black border border-zen-gray rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame size={20} className="text-orange-500" />
          <h2 className="text-lg font-bold font-mono">FIRE Checklist</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zen-gray">
            {completedCount}/4 Complete
          </span>
          <div className="w-32 h-2 bg-zen-gray rounded-full overflow-hidden">
            <div
              className="h-full bg-zen-accent transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fireItems.map((item) => (
          <button
            key={item.key}
            onClick={() => toggleItem(item.key)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              checklist[item.key]
                ? 'border-zen-accent bg-zen-accent/10'
                : 'border-zen-gray hover:border-zen-accent/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  checklist[item.key]
                    ? 'border-zen-accent bg-zen-accent'
                    : 'border-zen-gray'
                }`}
              >
                {checklist[item.key] && (
                  <svg
                    className="w-3 h-3 text-zen-black"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.label}</h3>
                <p className="text-sm text-zen-gray">{item.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
