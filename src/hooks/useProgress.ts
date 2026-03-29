"use client";

import { useState, useEffect, useCallback } from "react";
import { CardProgress, UserStats } from "@/lib/types";
import { processAnswer, createNewProgress } from "@/lib/sm2";
import {
  getAllProgress,
  saveProgress,
  getStats,
  updateStats,
  incrementNewCardsShown,
  getNewCardsShownToday,
} from "@/lib/storage";
import { buildQueue } from "@/lib/scheduler";
import { allCards } from "@/data";

const NEW_CARDS_PER_DAY = 5;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, CardProgress>>({});
  const [stats, setStats] = useState<UserStats>({
    totalReviewed: 0,
    totalCorrect: 0,
    lastActiveDate: "",
    currentStreak: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedProgress = getAllProgress();
    const savedStats = getStats();
    setProgress(savedProgress);
    setStats(savedStats);
    setLoaded(true);
  }, []);

  const answerCard = useCallback(
    (cardId: string, correct: boolean) => {
      const current = progress[cardId] || createNewProgress();
      const isNew = !progress[cardId];

      const updated = processAnswer(current, correct);
      saveProgress(cardId, updated);

      if (isNew) {
        const card = allCards.find((c) => c.id === cardId);
        if (card) {
          incrementNewCardsShown(card.category);
        }
      }

      const updatedStats = updateStats(correct);

      setProgress((prev) => ({ ...prev, [cardId]: updated }));
      setStats(updatedStats);
    },
    [progress]
  );

  const getDueCount = useCallback(
    (categoryId: string): number => {
      const today = getToday();
      const categoryCards = allCards.filter((c) => c.category === categoryId);

      let dueCount = 0;
      let newCount = 0;
      const newCardsShown = getNewCardsShownToday(categoryId);

      for (const card of categoryCards) {
        const p = progress[card.id];
        if (!p) {
          if (newCardsShown + newCount < NEW_CARDS_PER_DAY) {
            newCount++;
          }
        } else if (p.nextReview <= today) {
          dueCount++;
        }
      }

      return dueCount + newCount;
    },
    [progress]
  );

  const getQueue = useCallback(
    (selectedCategories: string[]) => {
      return buildQueue(allCards, progress, selectedCategories);
    },
    [progress]
  );

  const getAccuracy = useCallback((): number => {
    if (stats.totalReviewed === 0) return 0;
    return Math.round((stats.totalCorrect / stats.totalReviewed) * 100);
  }, [stats]);

  const getCategoryMastery = useCallback(
    (categoryId: string): number => {
      const categoryCards = allCards.filter((c) => c.category === categoryId);
      if (categoryCards.length === 0) return 0;

      const mastered = categoryCards.filter((card) => {
        const p = progress[card.id];
        return p && p.interval > 21;
      }).length;

      return Math.round((mastered / categoryCards.length) * 100);
    },
    [progress]
  );

  return {
    progress,
    stats,
    loaded,
    answerCard,
    getDueCount,
    getQueue,
    getAccuracy,
    getCategoryMastery,
  };
}
