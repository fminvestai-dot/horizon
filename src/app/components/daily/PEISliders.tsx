'use client';

interface PEISlidersProps {
  availability: number;
  performance: number;
  quality: number;
  onAvailabilityChange: (value: number) => void;
  onPerformanceChange: (value: number) => void;
  onQualityChange: (value: number) => void;
}

export default function PEISliders({
  availability,
  performance,
  quality,
  onAvailabilityChange,
  onPerformanceChange,
  onQualityChange,
}: PEISlidersProps) {
  const sliders = [
    {
      label: 'V',
      fullLabel: 'Availability',
      value: availability,
      onChange: onAvailabilityChange,
      color: 'blue',
    },
    {
      label: 'L',
      fullLabel: 'Performance',
      value: performance,
      onChange: onPerformanceChange,
      color: 'purple',
    },
    {
      label: 'Q',
      fullLabel: 'Quality',
      value: quality,
      onChange: onQualityChange,
      color: 'green',
    },
  ];

  return (
    <div className="flex gap-6 flex-1">
      {sliders.map((slider) => (
        <div key={slider.label} className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm">{slider.label}</span>
              <span className="text-xs text-zen-gray">{slider.fullLabel}</span>
            </div>
            <span className="font-mono text-sm font-semibold">
              {Math.round(slider.value * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={slider.value}
            onChange={(e) => slider.onChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-zen-accent"
            style={{
              background: `linear-gradient(to right, var(--zen-accent) 0%, var(--zen-accent) ${slider.value * 100}%, rgb(128, 128, 128) ${slider.value * 100}%, rgb(128, 128, 128) 100%)`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
