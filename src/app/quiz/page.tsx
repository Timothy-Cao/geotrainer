"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FlashCard from "@/components/FlashCard";
import { useProgress } from "@/hooks/useProgress";
import { getSelectedCategories } from "@/lib/storage";
import { allCards } from "@/data";
import { Card } from "@/lib/types";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage() {
  const router = useRouter();
  const { answerCard, loaded, stats } = useProgress();
  const [queue, setQueue] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loaded || initialized) return;
    const selectedIds = getSelectedCategories();
    if (selectedIds.length === 0) {
      router.push("/");
      return;
    }

    const cards = allCards.filter((c) => selectedIds.includes(c.category));
    setQueue(shuffleArray(cards));
    setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const handleAnswer = (correct: boolean) => {
    const card = queue[currentIndex];
    answerCard(card.id, correct);
    setSessionTotal((p) => p + 1);
    if (correct) setSessionCorrect((p) => p + 1);
  };

  const handleNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      setCurrentIndex(queue.length);
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-[#888]">Loading...</div>
      </div>
    );
  }

  // All done state
  if (queue.length === 0 || currentIndex >= queue.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold mb-2">
          {queue.length === 0 ? "No cards available!" : "Session Complete!"}
        </h2>
        {sessionTotal > 0 && (
          <p className="text-[#888] mb-2">
            {sessionCorrect}/{sessionTotal} correct this session (
            {Math.round((sessionCorrect / sessionTotal) * 100)}%)
          </p>
        )}
        <p className="text-[#888] mb-6">
          Great work! Select categories and go again for more practice.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-lg bg-[#151520] border border-[#1e1e2e] text-[#e0e0e0] hover:bg-[#1a1a2e] transition-colors"
          >
            &larr; Back to Categories
          </button>
          {stats.currentStreak > 0 && (
            <div className="px-4 py-2 rounded-lg bg-[#1e1e2e] text-[#00e5ff] text-sm flex items-center gap-2">
              {stats.currentStreak} day streak
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentCard = queue[currentIndex];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-[#888] hover:text-[#e0e0e0] transition-colors"
        >
          &larr; Exit
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#888]">
            Card {currentIndex + 1} of {queue.length}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-[#1e1e2e] text-[#00e5ff]">
            {currentCard.category}
          </span>
          {stats.currentStreak > 0 && (
            <span className="text-xs text-[#888]">
              {stats.currentStreak} day streak
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#1e1e2e] rounded-full mb-8">
        <div
          className="h-1 bg-[#00e5ff] rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / queue.length) * 100}%`,
          }}
        />
      </div>

      {/* Card */}
      <FlashCard
        key={currentCard.id}
        card={currentCard}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
