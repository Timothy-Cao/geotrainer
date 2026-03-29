"use client";

import { useState, useEffect, useCallback } from "react";
import { CardResult, UserStats } from "@/lib/types";
import {
  getAllResults,
  recordResult,
  getStats,
  updateStats,
} from "@/lib/storage";
import { allCards } from "@/data";

export function useProgress() {
  const [results, setResults] = useState<Record<string, CardResult>>({});
  const [stats, setStats] = useState<UserStats>({
    totalReviewed: 0,
    totalCorrect: 0,
    lastActiveDate: "",
    currentStreak: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setResults(getAllResults());
    setStats(getStats());
    setLoaded(true);
  }, []);

  const answerCard = useCallback(
    (cardId: string, correct: boolean) => {
      recordResult(cardId, correct);
      const updatedStats = updateStats(correct);

      const current = results[cardId] || { correct: 0, wrong: 0 };
      const updated = {
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
      };

      setResults((prev) => ({ ...prev, [cardId]: updated }));
      setStats(updatedStats);
    },
    [results]
  );

  const getAccuracy = useCallback((): number => {
    if (stats.totalReviewed === 0) return 0;
    return Math.round((stats.totalCorrect / stats.totalReviewed) * 100);
  }, [stats]);

  const getCategoryStats = useCallback(
    (categoryId: string) => {
      const categoryCards = allCards.filter((c) => c.category === categoryId);
      let seen = 0;
      let correctCount = 0;

      for (const card of categoryCards) {
        const r = results[card.id];
        if (r) {
          seen++;
          if (r.correct > 0) correctCount++;
        }
      }

      return { total: categoryCards.length, seen, correct: correctCount };
    },
    [results]
  );

  return {
    results,
    stats,
    loaded,
    answerCard,
    getAccuracy,
    getCategoryStats,
  };
}
