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

export interface CardResult {
  correct: number;
  wrong: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserStats {
  totalReviewed: number;
  totalCorrect: number;
  lastActiveDate: string;
  currentStreak: number;
}
