"use client";

import { useState, useMemo } from "react";
import { Card } from "@/lib/types";
import { countryToFlagUrl } from "@/lib/flags";
import FeedbackPanel from "./FeedbackPanel";

interface FlashCardProps {
  card: Card;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function FlashCard({ card, onAnswer, onNext }: FlashCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const choices = useMemo(
    () => shuffleArray([card.correctAnswer, ...card.wrongAnswers]),
    [card]
  );

  const handleChoice = (choice: string) => {
    if (selectedAnswer !== null) return;
    const correct = choice === card.correctAnswer;
    setSelectedAnswer(choice);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  const getButtonClasses = (choice: string): string => {
    const base =
      "w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200";

    if (selectedAnswer === null) {
      return `${base} bg-[#151520] border-[#1e1e2e] text-[#e0e0e0] hover:border-[#00e5ff]/50 hover:bg-[#1a1a2a] cursor-pointer`;
    }

    if (choice === card.correctAnswer) {
      return `${base} bg-[#00e54d]/10 border-[#00e54d] text-[#00e54d]`;
    }

    if (choice === selectedAnswer && !isCorrect) {
      return `${base} bg-[#ff3d5a]/10 border-[#ff3d5a] text-[#ff3d5a]`;
    }

    return `${base} bg-[#151520] border-[#1e1e2e] text-[#888] opacity-50`;
  };

  // Extract inline sample text from language questions (text between « »)
  const sampleMatch = card.question.match(/[«""](.+?)[»""]/);
  const sampleText = sampleMatch ? sampleMatch[1] : null;
  const questionText = sampleText
    ? card.question.replace(/[«""].+?[»""]/, "").trim()
    : card.question;

  const isLanguageToText = card.category === "language-to-text";
  const isFlags = card.category === "flags";
  const isFlagsReverse = card.category === "flags-reverse";
  const isShapes = card.category === "country-shapes";
  const isShapesReverse = card.category === "shapes-reverse";

  // Render the visual area based on card type
  const renderVisual = () => {
    // Language-to-text: show the sample sentence prominently
    if (isLanguageToText && sampleText) {
      return (
        <div className="w-full py-10 px-6 bg-[#0e0e18] flex items-center justify-center">
          <p className="text-2xl md:text-3xl font-medium text-[#e0e0e0] text-center leading-relaxed">
            {sampleText}
          </p>
        </div>
      );
    }

    // Flags: show flag image from CDN
    if (isFlags) {
      const flagUrl = countryToFlagUrl(card.correctAnswer);
      return (
        <div className="w-full py-8 bg-[#0e0e18] flex items-center justify-center">
          {flagUrl ? (
            <img
              src={flagUrl}
              alt="Flag"
              className="h-32 md:h-40 object-contain rounded shadow-lg"
            />
          ) : (
            <span className="text-8xl">🏴</span>
          )}
        </div>
      );
    }

    // Flags reverse: show country name prominently
    if (isFlagsReverse) {
      return (
        <div className="w-full py-10 px-6 bg-[#0e0e18] flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl mb-3 block opacity-40">🏳️</span>
            <p className="text-2xl md:text-3xl font-bold text-[#e0e0e0]">
              {card.correctAnswer}
            </p>
          </div>
        </div>
      );
    }

    // Shapes reverse: show country name prominently
    if (isShapesReverse) {
      return (
        <div className="w-full py-10 px-6 bg-[#0e0e18] flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl mb-3 block opacity-40">🌍</span>
            <p className="text-2xl md:text-3xl font-bold text-[#e0e0e0]">
              {card.correctAnswer}
            </p>
          </div>
        </div>
      );
    }

    // Country shapes: show the hint as the prominent visual clue
    if (isShapes) {
      return (
        <div className="w-full py-10 px-6 bg-[#0e0e18] flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block opacity-40">🗺️</span>
            <p className="text-lg md:text-xl text-[#e0e0e0] leading-relaxed max-w-md">
              {card.hint}
            </p>
          </div>
        </div>
      );
    }

    // Default: image or globe placeholder
    return (
      <div className="w-full h-48 bg-[#0e0e18] flex items-center justify-center overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt="Question"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-30">🌍</span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-[#151520] border border-[#1e1e2e] rounded-2xl overflow-hidden">
        {renderVisual()}

        <div className="p-5">
          {/* Question */}
          <h2 className="text-[#e0e0e0] font-semibold text-lg leading-snug">
            {questionText}
          </h2>

          {/* Hint (skip for shapes since hint is already shown in visual) */}
          {card.hint && !isShapes && (
            <p className="text-[#888] text-sm mt-2">{card.hint}</p>
          )}

          {/* Choices */}
          <div className={`grid gap-2.5 mt-5 ${isFlagsReverse ? "grid-cols-2" : ""}`}>
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                disabled={selectedAnswer !== null}
                className={getButtonClasses(choice)}
              >
                {isFlagsReverse ? (
                  <div className="flex flex-col items-center py-2">
                    <img
                      src={countryToFlagUrl(choice)}
                      alt={selectedAnswer ? choice : `Option ${String.fromCharCode(65 + i)}`}
                      className="h-16 md:h-20 object-contain rounded shadow mb-2"
                    />
                    {selectedAnswer && (
                      <span className="text-xs">{choice}</span>
                    )}
                  </div>
                ) : (
                  <>
                    <span className="text-[#888] mr-2 text-xs font-mono">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {choice}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Feedback + Next */}
          {selectedAnswer !== null && isCorrect !== null && (
            <div className="mt-5">
              <FeedbackPanel
                isCorrect={isCorrect}
                explanation={card.explanation}
                correctAnswer={card.correctAnswer}
                wrongAnswerSamples={card.wrongAnswerSamples}
                correctSample={sampleText || undefined}
              />
              <button
                onClick={onNext}
                className="w-full mt-4 px-5 py-3 rounded-lg bg-[#00e5ff] text-[#0a0a0f] font-semibold text-sm hover:bg-[#00c8e0] transition-colors"
              >
                Next Card &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
