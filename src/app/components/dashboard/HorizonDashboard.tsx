'use client';

import { Horizon } from '@/types/horizon';
import { Target, Plus } from 'lucide-react';

interface HorizonDashboardProps {
  horizons: Horizon[];
}

const quadrantColors = {
  Business: 'text-blue-400 border-blue-400',
  Vitality: 'text-green-400 border-green-400',
  Mindset: 'text-purple-400 border-purple-400',
  Relations: 'text-orange-400 border-orange-400',
};

export default function HorizonDashboard({ horizons }: HorizonDashboardProps) {
  const h3Horizons = horizons.filter((h) => h.level === 'H3');
  const h2Horizons = horizons.filter((h) => h.level === 'H2');
  const h1Horizons = horizons.filter((h) => h.level === 'H1');

  const HorizonCard = ({ horizon }: { horizon: Horizon }) => (
    <div className="group relative backdrop-blur-xl bg-gradient-to-br from-zen-dark/60 to-zen-black/60 border border-zen-gray/20 rounded-xl p-5 hover:border-zen-accent/50 hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-glass opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-xs font-semibold text-zen-accent px-2 py-1 bg-zen-accent/10 rounded-md">{horizon.id}</span>
          <span
            className={`text-xs px-3 py-1 border rounded-full backdrop-blur-sm ${
              quadrantColors[horizon.quadrant]
            } bg-black/20`}
          >
            {horizon.quadrant}
          </span>
        </div>
        <h3 className="font-semibold mb-2 group-hover:text-zen-accent transition-colors">{horizon.title}</h3>
        {horizon.description && (
          <p className="text-sm text-zen-gray-light line-clamp-2">{horizon.description}</p>
        )}
        {horizon.status === 'achieved' && (
          <span className="inline-flex items-center gap-1 mt-3 text-xs text-belt-green bg-belt-green/10 px-2 py-1 rounded-full">
            <span>✓</span> Achieved
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* H3: Vision */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Target size={20} className="text-zen-accent" />
              HORIZON 3: Vision
            </h2>
            <p className="text-sm text-zen-gray">10+ years</p>
          </div>
          <button className="text-zen-gray hover:text-zen-accent transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {h3Horizons.length > 0 ? (
            h3Horizons.map((horizon) => <HorizonCard key={horizon.id} horizon={horizon} />)
          ) : (
            <div className="col-span-2 border-2 border-dashed border-zen-gray rounded-lg p-8 text-center text-zen-gray">
              <p>No H3 horizons yet</p>
            </div>
          )}
        </div>
      </div>

      {/* H2: Strategy */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Target size={20} className="text-zen-accent" />
              HORIZON 2: Strategy
            </h2>
            <p className="text-sm text-zen-gray">3-4 years</p>
          </div>
          <button className="text-zen-gray hover:text-zen-accent transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {h2Horizons.length > 0 ? (
            h2Horizons.map((horizon) => <HorizonCard key={horizon.id} horizon={horizon} />)
          ) : (
            <div className="col-span-2 border-2 border-dashed border-zen-gray rounded-lg p-8 text-center text-zen-gray">
              <p>No H2 horizons yet</p>
            </div>
          )}
        </div>
      </div>

      {/* H1: Tactics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-mono flex items-center gap-2">
              <Target size={20} className="text-zen-accent" />
              HORIZON 1: Tactics
            </h2>
            <p className="text-sm text-zen-gray">1 year</p>
          </div>
          <button className="text-zen-gray hover:text-zen-accent transition-colors">
            <Plus size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {h1Horizons.length > 0 ? (
            h1Horizons.map((horizon) => <HorizonCard key={horizon.id} horizon={horizon} />)
          ) : (
            <div className="col-span-2 border-2 border-dashed border-zen-gray rounded-lg p-8 text-center text-zen-gray">
              <p>No H1 horizons yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
