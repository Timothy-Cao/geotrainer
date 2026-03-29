export interface Card {
  id: string;
  category: string;
  question: string;
  hint: string;
  image: string;
  correctAnswer: string;
  wrongAnswers: string[];
  explanation: string;
  wrongAnswerSamples?: Record<string, string>;
}

export interface CardProgress {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string; // ISO date string YYYY-MM-DD
  lastResult: boolean | null;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  mode: "srs" | "random";
}

export interface UserStats {
  totalReviewed: number;
  totalCorrect: number;
  lastActiveDate: string;
  currentStreak: number;
}
