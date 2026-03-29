import { CardResult, UserStats } from "./types";

const RESULTS_KEY = "geotrainer_results";
const CATEGORIES_KEY = "geotrainer_categories";
const STATS_KEY = "geotrainer_stats";

// --- Card Results (correct/wrong counts per card) ---

export function getAllResults(): Record<string, CardResult> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(RESULTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function recordResult(cardId: string, correct: boolean): void {
  const all = getAllResults();
  const current = all[cardId] || { correct: 0, wrong: 0 };
  if (correct) {
    current.correct += 1;
  } else {
    current.wrong += 1;
  }
  all[cardId] = current;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
}

// --- Selected Categories ---

export function getSelectedCategories(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CATEGORIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveSelectedCategories(ids: string[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(ids));
}

// --- User Stats ---

function getDefaultStats(): UserStats {
  return {
    totalReviewed: 0,
    totalCorrect: 0,
    lastActiveDate: "",
    currentStreak: 0,
  };
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getStats(): UserStats {
  if (typeof window === "undefined") return getDefaultStats();
  const raw = localStorage.getItem(STATS_KEY);
  return raw ? JSON.parse(raw) : getDefaultStats();
}

export function updateStats(correct: boolean): UserStats {
  const stats = getStats();
  const today = getToday();

  stats.totalReviewed += 1;
  if (correct) stats.totalCorrect += 1;

  if (stats.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (stats.lastActiveDate === yesterdayStr) {
      stats.currentStreak += 1;
    } else if (stats.lastActiveDate === "") {
      stats.currentStreak = 1;
    } else {
      stats.currentStreak = 1;
    }
  }

  stats.lastActiveDate = today;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}
