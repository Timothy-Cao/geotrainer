"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categories, allCards } from "@/data";
import CategoryCard from "@/components/CategoryCard";
import { useProgress } from "@/hooks/useProgress";
import {
  getSelectedCategories,
  saveSelectedCategories,
} from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();
  const { getDueCount, loaded } = useProgress();
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected(getSelectedCategories());
  }, []);

  const toggleCategory = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((c) => c !== id)
        : [...prev, id];
      saveSelectedCategories(next);
      return next;
    });
  };

  const handleStart = () => {
    if (selected.length > 0) {
      router.push("/quiz");
    }
  };

  const getCardCount = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (cat?.mode === "random") {
      return allCards.filter((c) => c.category === catId).length;
    }
    return getDueCount(catId);
  };

  const totalCards = selected.reduce((sum, catId) => sum + getCardCount(catId), 0);

  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Train Your <span className="text-[#00e5ff]">World Knowledge</span>
        </h1>
        <p className="text-[#888]">
          Select categories and start practicing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            selected={selected.includes(cat.id)}
            dueCount={loaded ? getCardCount(cat.id) : 0}
            totalCount={allCards.filter((c) => c.category === cat.id).length}
            onToggle={() => toggleCategory(cat.id)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleStart}
          disabled={selected.length === 0}
          className={`px-8 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all ${
            selected.length > 0
              ? "bg-[#00e5ff] text-[#0a0a0f] hover:bg-[#00c4dd] shadow-[0_0_20px_#00e5ff33]"
              : "bg-[#1e1e2e] text-[#555] cursor-not-allowed"
          }`}
        >
          {selected.length === 0
            ? "Select categories to begin"
            : `Start Practice${totalCards > 0 ? ` (${totalCards} cards)` : ""}`}
        </button>
      </div>
    </div>
  );
}
