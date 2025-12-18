
"use client";

import { useState, useMemo } from 'react';
import { Horizon } from '@/types/horizon';
import { DailyLog } from '@/types/hansei';
import { Target, ArrowLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import FIREChecklist from './daily/FIREChecklist';
import TaktTimeline from './daily/TaktTimeline';
import PEISliders from './daily/PEISliders';
import MudaInput from './daily/MudaInput';

interface DailyCockpitProps {
  initialLog?: DailyLog | null;
  horizons: Horizon[];
}

const DailyCockpit = ({ initialLog, horizons }: DailyCockpitProps) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Initialize state from existing log or defaults
  const [availability, setAvailability] = useState(initialLog?.pei?.availability ?? 1);
  const [performance, setPerformance] = useState(initialLog?.pei?.performance ?? 1);
  const [quality, setQuality] = useState(initialLog?.pei?.quality ?? 1);
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>(
    initialLog?.horizonSync || []
  );
  const [fireChecklist, setFireChecklist] = useState(
    initialLog?.fireChecklist || {
      focus: false,
      intention: false,
      review: false,
      execution: false,
    }
  );
  const [taktBlocks, setTaktBlocks] = useState(initialLog?.taktTimeline || []);
  const [muda, setMuda] = useState(initialLog?.muda || '');

  const peiTotal = useMemo(() => {
    return (availability * performance * quality * 100).toFixed(0);
  }, [availability, performance, quality]);

  const handleHorizonSelect = (horizonId: string) => {
    setSelectedHorizons((prev) =>
      prev.includes(horizonId)
        ? prev.filter((id) => id !== horizonId)
        : [...prev, horizonId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      const logData = {
        date: today,
        horizon_sync: selectedHorizons,
        fire_checklist: fireChecklist,
        takt_timeline: taktBlocks,
        pei: {
          availability,
          performance,
          quality,
          total: availability * performance * quality,
        },
        muda,
      };

      const { error } = await supabase.from('daily_logs').upsert(logData);

      if (error) throw error;

      alert('Daily log saved successfully!');
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Failed to save: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-dot-pattern bg-dot-pattern-size min-h-screen p-4">
      <div className="max-w-6xl mx-auto pb-32">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-zen-gray hover:text-zen-white mb-2 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold font-mono">{new Date().toLocaleDateString()}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <Target size={16} className="text-zen-accent" />
              <div className="flex flex-wrap gap-2">
                {horizons.map((horizon) => (
                  <button
                    key={horizon.id}
                    onClick={() => handleHorizonSelect(horizon.id)}
                    className={`font-mono text-xs px-3 py-1 border rounded-full transition-colors ${
                      selectedHorizons.includes(horizon.id)
                        ? 'bg-zen-accent text-zen-black border-zen-accent'
                        : 'border-zen-gray hover:border-zen-accent'
                    }`}
                  >
                    {horizon.id}: {horizon.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-zen-accent text-zen-black font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </header>

        {/* FIRE Checklist */}
        <FIREChecklist checklist={fireChecklist} onChange={setFireChecklist} />

        {/* Main Content */}
        <main className="my-8">
          <TaktTimeline blocks={taktBlocks} onChange={setTaktBlocks} horizons={horizons} />
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 p-4 bg-zen-black border-t border-zen-gray">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-6">
              {/* PEI Sliders */}
              <PEISliders
                availability={availability}
                performance={performance}
                quality={quality}
                onAvailabilityChange={setAvailability}
                onPerformanceChange={setPerformance}
                onQualityChange={setQuality}
              />

              {/* PEI Total */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-zen-gray mb-1">PEI</span>
                <div className="font-mono text-4xl">{peiTotal}</div>
              </div>

              {/* Muda Input */}
              <MudaInput value={muda} onChange={setMuda} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DailyCockpit;
      