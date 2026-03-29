import { CardProgress } from "./types";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

export function createNewProgress(): CardProgress {
  return {
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: getToday(),
    lastResult: null,
  };
}

export function processAnswer(
  progress: CardProgress,
  correct: boolean
): CardProgress {
  const today = getToday();

  if (correct) {
    const newReps = progress.repetitions + 1;
    let newInterval: number;

    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(progress.interval * progress.easeFactor);
    }

    const newEF = Math.min(2.5, progress.easeFactor + 0.1);

    return {
      easeFactor: newEF,
      interval: newInterval,
      repetitions: newReps,
      nextReview: addDays(today, newInterval),
      lastResult: true,
    };
  } else {
    const newEF = Math.max(1.3, progress.easeFactor - 0.2);

    return {
      easeFactor: newEF,
      interval: 1,
      repetitions: 0,
      nextReview: addDays(today, 1),
      lastResult: false,
    };
  }
}
