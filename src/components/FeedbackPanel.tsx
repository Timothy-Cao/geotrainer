"use client";

interface FeedbackPanelProps {
  isCorrect: boolean;
  explanation: string;
  correctAnswer: string;
  wrongAnswerSamples?: Record<string, string>;
  correctSample?: string;
}

export default function FeedbackPanel({
  isCorrect,
  explanation,
  correctAnswer,
  wrongAnswerSamples,
  correctSample,
}: FeedbackPanelProps) {
  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        className={`rounded-lg px-4 py-3 border ${
          isCorrect
            ? "bg-[#00e54d]/10 border-[#00e54d]/30"
            : "bg-[#ff3d5a]/10 border-[#ff3d5a]/30"
        }`}
      >
        <p
          className={`font-semibold text-sm ${
            isCorrect ? "text-[#00e54d]" : "text-[#ff3d5a]"
          }`}
        >
          {isCorrect
            ? "Correct!"
            : `Incorrect \u2014 Answer: ${correctAnswer}`}
        </p>
        {explanation && (
          <p className="text-[#e0e0e0] text-sm mt-2 leading-relaxed opacity-90">
            {explanation}
          </p>
        )}
      </div>

      {wrongAnswerSamples && Object.keys(wrongAnswerSamples).length > 0 && (
        <div className="mt-3 rounded-lg border border-[#1e1e2e] bg-[#0e0e18] px-4 py-3">
          <p className="text-xs text-[#888] font-semibold uppercase tracking-wider mb-3">
            Compare the languages
          </p>
          <div className="space-y-2.5">
            {correctSample && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-[#00e5ff] font-medium">
                  {correctAnswer} ✓
                </span>
                <span className="text-sm text-[#e0e0e0]">{correctSample}</span>
              </div>
            )}
            {Object.entries(wrongAnswerSamples).map(([lang, sample]) => (
              <div key={lang} className="flex flex-col gap-0.5">
                <span className="text-xs text-[#888] font-medium">{lang}</span>
                <span className="text-sm text-[#e0e0e0] opacity-70">
                  {sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
