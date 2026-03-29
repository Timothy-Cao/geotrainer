"use client";

interface ProgressBarProps {
  value: number;
  label: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[#e0e0e0] text-sm font-medium">{label}</span>
        <span className="text-[#00e5ff] text-sm font-mono font-medium">
          {Math.round(clamped)}%
        </span>
      </div>
      <div className="w-full h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00e5ff] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
