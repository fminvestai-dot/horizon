'use client';

import { useState } from 'react';
import { Horizon } from '@/types/horizon';
import { Plus, X, ArrowLeft } from 'lucide-react';

interface HorizonSetupStepProps {
  level: 'H3' | 'H2' | 'H1';
  label: string;
  timeframe: string;
  description: string;
  examples: string[];
  parentHorizons?: Partial<Horizon>[];
  onComplete: (horizons: Partial<Horizon>[]) => void;
  onBack: () => void;
}

export default function HorizonSetupStep({
  level,
  label,
  timeframe,
  description,
  examples,
  parentHorizons = [],
  onComplete,
  onBack,
}: HorizonSetupStepProps) {
  const [horizons, setHorizons] = useState<Partial<Horizon>[]>([
    {
      title: '',
      description: '',
      quadrant: 'Business',
      parentHorizonId: undefined,
    },
  ]);

  const quadrants: Array<'Business' | 'Vitality' | 'Mindset' | 'Relations'> = [
    'Business',
    'Vitality',
    'Mindset',
    'Relations',
  ];

  const addHorizon = () => {
    if (horizons.length < 4) {
      setHorizons([
        ...horizons,
        {
          title: '',
          description: '',
          quadrant: 'Business',
          parentHorizonId: undefined,
        },
      ]);
    }
  };

  const removeHorizon = (index: number) => {
    if (horizons.length > 1) {
      setHorizons(horizons.filter((_, i) => i !== index));
    }
  };

  const updateHorizon = (index: number, field: keyof Horizon, value: any) => {
    const updated = [...horizons];
    updated[index] = { ...updated[index], [field]: value };
    setHorizons(updated);
  };

  const handleContinue = () => {
    // Validate that all horizons have titles
    const isValid = horizons.every((h) => h.title?.trim());
    if (!isValid) {
      alert('Please fill in all horizon titles');
      return;
    }
    onComplete(horizons);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={onBack}
        className="flex items-center text-zen-gray hover:text-zen-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono mb-2">
          {label} Horizon ({level})
        </h1>
        <p className="text-zen-gray mb-1">{timeframe}</p>
        <p className="text-lg">{description}</p>
      </div>

      <div className="bg-zen-accent/10 border border-zen-accent rounded-lg p-4 mb-8">
        <p className="text-sm font-medium mb-2">Examples:</p>
        <ul className="text-sm text-zen-gray space-y-1">
          {examples.map((example, i) => (
            <li key={i}>• {example}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        {horizons.map((horizon, index) => (
          <div key={index} className="bg-zen-black border border-zen-gray rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono font-semibold">
                {level}-{String(index + 1).padStart(2, '0')}
              </h3>
              {horizons.length > 1 && (
                <button
                  onClick={() => removeHorizon(index)}
                  className="text-zen-gray hover:text-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={horizon.title || ''}
                  onChange={(e) => updateHorizon(index, 'title', e.target.value)}
                  placeholder="e.g., Build a successful company"
                  className="w-full bg-transparent border border-zen-gray rounded px-4 py-2 focus:outline-none focus:border-zen-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={horizon.description || ''}
                  onChange={(e) => updateHorizon(index, 'description', e.target.value)}
                  placeholder="Add more context about this goal..."
                  rows={2}
                  className="w-full bg-transparent border border-zen-gray rounded px-4 py-2 focus:outline-none focus:border-zen-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quadrant</label>
                <div className="grid grid-cols-2 gap-2">
                  {quadrants.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => updateHorizon(index, 'quadrant', q)}
                      className={`px-4 py-2 rounded border transition-colors ${
                        horizon.quadrant === q
                          ? 'border-zen-accent bg-zen-accent/10 text-zen-accent'
                          : 'border-zen-gray text-zen-gray hover:border-zen-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {parentHorizons.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Link to parent {level === 'H1' ? 'H2' : 'H3'} (optional)
                  </label>
                  <select
                    value={horizon.parentHorizonId || ''}
                    onChange={(e) =>
                      updateHorizon(index, 'parentHorizonId', e.target.value || undefined)
                    }
                    className="w-full bg-zen-black border border-zen-gray rounded px-4 py-2 focus:outline-none focus:border-zen-accent"
                  >
                    <option value="">No parent</option>
                    {parentHorizons.map((parent, i) => (
                      <option
                        key={i}
                        value={`${level === 'H1' ? 'H2' : 'H3'}-${String(i + 1).padStart(2, '0')}`}
                      >
                        {parent.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}

        {horizons.length < 4 && (
          <button
            onClick={addHorizon}
            className="w-full border-2 border-dashed border-zen-gray rounded-lg py-4 flex items-center justify-center text-zen-gray hover:border-zen-accent hover:text-zen-accent transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add another {label} goal
          </button>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 border border-zen-gray text-zen-white py-3 rounded-lg hover:bg-zen-gray/10 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 bg-zen-accent text-zen-black font-medium py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
