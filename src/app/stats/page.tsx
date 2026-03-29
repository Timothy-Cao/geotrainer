"use client";

import { categories, allCards } from "@/data";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ProgressBar";

export default function StatsPage() {
  const { stats, getAccuracy, getCategoryMastery, loaded } = useProgress();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#888]">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        Your <span className="text-[#00e5ff]">Progress</span>
      </h1>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-[#151520] border border-[#1e1e2e] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#00e5ff]">
            {stats.totalReviewed}
          </div>
          <div className="text-xs text-[#888] mt-1">Cards Reviewed</div>
        </div>
        <div className="bg-[#151520] border border-[#1e1e2e] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#00e5ff]">
            {stats.totalReviewed > 0 ? `${Math.round(getAccuracy())}%` : "—"}
          </div>
          <div className="text-xs text-[#888] mt-1">Accuracy</div>
        </div>
        <div className="bg-[#151520] border border-[#1e1e2e] rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-[#00e5ff]">
            {stats.currentStreak > 0 ? stats.currentStreak : "—"}
          </div>
          <div className="text-xs text-[#888] mt-1">Day Streak</div>
        </div>
      </div>

      {/* Category mastery */}
      <h2 className="text-lg font-semibold mb-4">Category Mastery</h2>
      <div className="space-y-4">
        {categories.map((cat) => {
          const mastery = getCategoryMastery(cat.id);
          const total = allCards.filter((c) => c.category === cat.id).length;
          return (
            <div
              key={cat.id}
              className="bg-[#151520] border border-[#1e1e2e] rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
                <span className="text-xs text-[#888] ml-auto">
                  {total} cards
                </span>
              </div>
              <ProgressBar value={mastery} label="Mastered" />
            </div>
          );
        })}
      </div>

      {stats.totalReviewed === 0 && (
        <div className="text-center mt-10 text-[#555]">
          <p>No reviews yet. Start practicing to see your progress!</p>
        </div>
      )}
    </div>
  );
}
