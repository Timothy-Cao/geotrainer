import { Card, CardProgress } from "./types";
import { getNewCardsShownToday } from "./storage";

const NEW_CARDS_PER_DAY = 5;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function buildQueue(
  allCards: Card[],
  progress: Record<string, CardProgress>,
  selectedCategories: string[]
): Card[] {
  const today = getToday();
  const filtered = allCards.filter((c) =>
    selectedCategories.includes(c.category)
  );

  const dueCards: Card[] = [];
  const newCards: Card[] = [];

  for (const card of filtered) {
    const p = progress[card.id];
    if (!p) {
      newCards.push(card);
    } else if (p.nextReview <= today) {
      dueCards.push(card);
    }
  }

  // Sort due cards: most overdue first
  dueCards.sort((a, b) => {
    const pa = progress[a.id];
    const pb = progress[b.id];
    return pa.nextReview.localeCompare(pb.nextReview);
  });

  // Cap new cards per category
  const cappedNewCards: Card[] = [];
  const newCountByCategory: Record<string, number> = {};

  for (const card of newCards) {
    const cat = card.category;
    const alreadyShown = getNewCardsShownToday(cat);
    const addedInQueue = newCountByCategory[cat] || 0;

    if (alreadyShown + addedInQueue < NEW_CARDS_PER_DAY) {
      cappedNewCards.push(card);
      newCountByCategory[cat] = addedInQueue + 1;
    }
  }

  return [...dueCards, ...cappedNewCards];
}
