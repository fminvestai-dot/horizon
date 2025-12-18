'use client';

import { useState } from 'react';
import { TaktBlock } from '@/types/hansei';
import { Horizon } from '@/types/horizon';
import { Plus, X, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TaktTimelineProps {
  blocks: TaktBlock[];
  onChange: (blocks: TaktBlock[]) => void;
  horizons: Horizon[];
}

export default function TaktTimeline({ blocks, onChange, horizons }: TaktTimelineProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBlock, setNewBlock] = useState<Partial<TaktBlock>>({
    startTime: '',
    endTime: '',
    task: '',
    horizonId: undefined,
  });

  const addBlock = () => {
    if (!newBlock.startTime || !newBlock.endTime || !newBlock.task) {
      alert('Please fill in all required fields');
      return;
    }

    const block: TaktBlock = {
      id: uuidv4(),
      startTime: newBlock.startTime,
      endTime: newBlock.endTime,
      task: newBlock.task,
      horizonId: newBlock.horizonId,
    };

    onChange([...blocks, block].sort((a, b) => a.startTime.localeCompare(b.startTime)));

    // Reset form
    setNewBlock({
      startTime: '',
      endTime: '',
      task: '',
      horizonId: undefined,
    });
    setShowAddForm(false);
  };

  const removeBlock = (id: string) => {
    onChange(blocks.filter((b) => b.id !== id));
  };

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return '';
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;
    if (duration <= 0) return 'Invalid';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-zen-black border border-zen-gray rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-zen-accent" />
          <h2 className="text-lg font-bold font-mono">Takt Timeline</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-zen-accent/10 text-zen-accent border border-zen-accent rounded hover:bg-zen-accent/20 transition-colors"
        >
          <Plus size={16} />
          Add Block
        </button>
      </div>

      {/* Add Block Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border border-zen-accent rounded-lg bg-zen-accent/5">
          <h3 className="font-semibold mb-4">New Time Block</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zen-gray mb-2">Start Time</label>
              <input
                type="time"
                value={newBlock.startTime}
                onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                className="w-full bg-zen-black border border-zen-gray rounded px-3 py-2 focus:outline-none focus:border-zen-accent"
              />
            </div>
            <div>
              <label className="block text-sm text-zen-gray mb-2">End Time</label>
              <input
                type="time"
                value={newBlock.endTime}
                onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                className="w-full bg-zen-black border border-zen-gray rounded px-3 py-2 focus:outline-none focus:border-zen-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zen-gray mb-2">Task</label>
              <input
                type="text"
                value={newBlock.task}
                onChange={(e) => setNewBlock({ ...newBlock, task: e.target.value })}
                placeholder="What will you work on?"
                className="w-full bg-zen-black border border-zen-gray rounded px-3 py-2 focus:outline-none focus:border-zen-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zen-gray mb-2">Link to Horizon (Optional)</label>
              <select
                value={newBlock.horizonId || ''}
                onChange={(e) => setNewBlock({ ...newBlock, horizonId: e.target.value || undefined })}
                className="w-full bg-zen-black border border-zen-gray rounded px-3 py-2 focus:outline-none focus:border-zen-accent"
              >
                <option value="">No link</option>
                {horizons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.id}: {h.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addBlock}
              className="flex-1 bg-zen-accent text-zen-black font-medium py-2 rounded hover:opacity-90 transition-opacity"
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 border border-zen-gray py-2 rounded hover:bg-zen-gray/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {blocks.length === 0 ? (
        <div className="text-center py-12 text-zen-gray border-2 border-dashed border-zen-gray rounded-lg">
          <Clock size={40} className="mx-auto mb-4 opacity-50" />
          <p>No time blocks yet. Add your first block to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              className="flex items-center gap-4 p-4 border border-zen-gray rounded-lg hover:border-zen-accent transition-colors group"
            >
              <div className="font-mono text-sm text-zen-gray min-w-[140px]">
                {block.startTime} - {block.endTime}
                <span className="block text-xs text-zen-gray/60">
                  {calculateDuration(block.startTime, block.endTime)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{block.task}</p>
                {block.horizonId && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-zen-accent/10 text-zen-accent rounded">
                    {block.horizonId}
                  </span>
                )}
              </div>
              <button
                onClick={() => removeBlock(block.id)}
                className="opacity-0 group-hover:opacity-100 text-zen-gray hover:text-red-500 transition-all"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
