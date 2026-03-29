"use client";

import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
  selected: boolean;
  dueCount: number;
  totalCount: number;
  onToggle: () => void;
}

export default function CategoryCard({
  category,
  selected,
  dueCount,
  totalCount,
  onToggle,
}: CategoryCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl p-4 transition-all duration-200 border ${
        selected
          ? "bg-[#1a1a2a] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
          : "bg-[#151520] border-[#1e1e2e] hover:border-[#2e2e3e] hover:bg-[#1a1a28]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{category.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#e0e0e0] text-sm">
            {category.name}
          </h3>
          <p className="text-[#888] text-xs mt-1 line-clamp-2">
            {category.description}
          </p>
        </div>
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            selected
              ? "border-[#00e5ff] bg-[#00e5ff]"
              : "border-[#1e1e2e]"
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-[#0a0a0f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#1e1e2e]">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            dueCount > 0
              ? "bg-[#00e5ff]/10 text-[#00e5ff]"
              : "bg-[#1e1e2e] text-[#888]"
          }`}
        >
          {dueCount} due
        </span>
        <span className="text-xs text-[#888]">{totalCount} total</span>
      </div>
    </button>
  );
}
