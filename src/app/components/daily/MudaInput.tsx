'use client';

interface MudaInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MudaInput({ value, onChange }: MudaInputProps) {
  return (
    <div className="flex-1">
      <label className="block text-xs text-zen-gray mb-2">Daily Muda (Waste)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What waste did you identify today?"
        className="w-full bg-transparent border border-zen-gray rounded px-4 py-2 text-sm focus:outline-none focus:border-zen-accent transition-colors"
      />
    </div>
  );
}
