
"use client";

import { useState, useMemo } from 'react';
import { Hoshin } from '@/types/hansei';
import { mockHoshinPlan } from '../mock/hoshin';
import { Target, CheckSquare } from 'lucide-react';

const DailyCockpit = () => {
  const [availability, setAvailability] = useState(1);
  const [performance, setPerformance] = useState(1);
  const [quality, setQuality] = useState(1);
  const [selectedHoshin, setSelectedHoshin] = useState<string[]>([]);

  const peiTotal = useMemo(() => {
    return (availability * performance * quality * 100).toFixed(0);
  }, [availability, performance, quality]);

  const handleHoshinSelect = (hoshinId: string) => {
    setSelectedHoshin((prev) =>
      prev.includes(hoshinId)
        ? prev.filter((id) => id !== hoshinId)
        : [...prev, hoshinId]
    );
  };

  return (
    <div className="bg-dot-pattern bg-dot-pattern-size min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-mono">{new Date().toLocaleDateString()}</h1>
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-zen-accent" />
              <div className="flex space-x-2">
                {mockHoshinPlan.map((hoshin) => (
                  <button
                    key={hoshin.id}
                    onClick={() => handleHoshinSelect(hoshin.id)}
                    className={`font-mono text-xs px-2 py-1 border-hairline rounded-full ${
                      selectedHoshin.includes(hoshin.id)
                        ? 'bg-zen-accent text-zen-black'
                        : 'border-zen-gray'
                    }`}
                  >
                    {hoshin.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <CheckSquare size={20} />
            <CheckSquare size={20} />
            <CheckSquare size={20} />
            <CheckSquare size={20} />
          </div>
        </header>

        {/* Main Content */}
        <main>
          {/* Takt Timeline Placeholder */}
          <div className="h-96 border-l border-hairline border-zen-gray my-8"></div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-zen-black">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex-grow flex items-center space-x-4">
              {/* PEI Sliders */}
              <div className="w-1/3">
                <label className="font-mono text-xs">V</label>
                <input type="range" min="0" max="1" step="0.01" value={availability} onChange={(e) => setAvailability(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="w-1/3">
                <label className="font-mono text-xs">L</label>
                <input type="range" min="0" max="1" step="0.01" value={performance} onChange={(e) => setPerformance(parseFloat(e.target.value))} className="w-full" />
              </div>
              <div className="w-1/3">
                <label className="font-mono text-xs">Q</label>
                <input type="range" min="0" max="1" step="0.01" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="font-mono text-4xl">{peiTotal}</div>
            <input type="text" placeholder="Muda..." className="ml-4 bg-transparent border-b border-hairline border-zen-gray w-1/4"/>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DailyCockpit;
      