import { CardProgress, UserStats } from "./types";

const PROGRESS_KEY = "geotrainer_progress";
const CATEGORIES_KEY = "geotrainer_categories";
const STATS_KEY = "geotrainer_stats";
const NEW_CARDS_KEY = "geotrainer_new_cards";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

// --- Card Progress ---

export function getAllProgress(): Record<string, CardProgress> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export function getProgress(cardId: string): CardProgress | null {
  const all = getAllProgress();
  return all[cardId] || null;
}

export function saveProgress(cardId: string, progress: CardProgress): void {
  const all = getAllProgress();
  all[cardId] = progress;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
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

  if (stats.lastActiveDate === today) {
    // Already active today, streak unchanged
  } else {
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

// --- New Cards Tracking ---

export function getNewCardsShownToday(category: string): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(NEW_CARDS_KEY);
  const data: Record<string, { date: string; count: number }> = raw
    ? JSON.parse(raw)
    : {};
  const entry = data[category];
  if (!entry || entry.date !== getToday()) return 0;
  return entry.count;
}

export function incrementNewCardsShown(category: string): void {
  const raw = localStorage.getItem(NEW_CARDS_KEY);
  const data: Record<string, { date: string; count: number }> = raw
    ? JSON.parse(raw)
    : {};
  const today = getToday();
  const entry = data[category];
  if (!entry || entry.date !== today) {
    data[category] = { date: today, count: 1 };
  } else {
    data[category] = { date: today, count: entry.count + 1 };
  }
  localStorage.setItem(NEW_CARDS_KEY, JSON.stringify(data));
}
