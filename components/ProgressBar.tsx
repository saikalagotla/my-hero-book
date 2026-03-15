'use client';

interface ProgressBarProps {
  value: number;
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="w-full">
      {label && <p className="font-body text-sm text-gray-500 mb-2">{label}</p>}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-book-coral h-4 rounded-full transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="font-body text-xs text-gray-400 mt-1 text-right">{clamped}%</p>
    </div>
  );
}
