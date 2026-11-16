import React from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { QuizProgressMap, QuizQuestion } from '../types/lab';
import { labAudio } from '../utils/audio';

interface QuizSuiteProps {
  expId: string;
  questions: QuizQuestion[];
  progress: QuizProgressMap;
  onAnswer: (expId: string, qIndex: number, selectedIndex: number, isCorrect: boolean) => void;
  onResetQuiz: (expId: string) => void;
}

export const QuizSuite: React.FC<QuizSuiteProps> = ({
  expId,
  questions,
  progress,
  onAnswer,
  onResetQuiz,
}) => {
  const expProgress = progress[expId] ?? {};
  const answeredCount = Object.keys(expProgress).length;
  const correctCount = Object.values(expProgress).filter((a) => a.isCorrect).length;
  const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const progressWidth = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <section className="glass-panel rounded-md p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#dee2f6]">
            05. Mastery Quiz Suite
          </h2>
          <p className="text-sm text-[#bfc7d2] mt-1">
            6 targeted conceptual and mathematical problems with immediate Web Audio feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            id="suiteScoreBadge"
            className="quiz-score-badge px-3.5 py-1.5 rounded bg-[#090e1c] border border-white/15 font-mono text-xs tabular-nums text-[#dee2f6]"
          >
            Score: {correctCount} / {questions.length} · {pct}%
          </div>
          <button
            type="button"
            onClick={() => {
              labAudio.playClick();
              onResetQuiz(expId);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 border border-white/15 text-[#bfc7d2] hover:text-white hover:border-white/30 transition cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Quiz
          </button>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2 rounded bg-[#090e1c] overflow-hidden border border-white/10">
        <div
          id="quizProgressBar"
          className="quiz-progress-bar h-full bg-[var(--lab-accent)] transition-all duration-300"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* 6 Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {questions.map((q, qIdx) => {
          const entry = expProgress[qIdx];
          const isAnswered = entry !== undefined;

          return (
            <div
              key={q.id}
              className="rounded-md bg-[#090e1c]/80 border border-white/10 p-5 flex flex-col gap-3.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-[var(--lab-accent)]">
                  Question {qIdx + 1} of {questions.length}
                </span>
                {isAnswered && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs ${
                      entry.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {entry.isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Review
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-[#dee2f6] leading-relaxed">
                {q.prompt}
              </p>

              <div className="flex flex-col gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = isAnswered && entry.selectedIndex === oIdx;
                  const isRightChoice = oIdx === q.correctIndex;

                  let btnStyle =
                    'bg-white/[0.03] border-white/10 text-[#bfc7d2] hover:bg-white/[0.07] hover:border-white/25';

                  if (isAnswered) {
                    if (isRightChoice) {
                      btnStyle =
                        'bg-emerald-500/15 border-emerald-400/60 text-emerald-200';
                    } else if (isSelected && !entry.isCorrect) {
                      btnStyle =
                        'bg-rose-500/15 border-rose-400/60 text-rose-200';
                    } else {
                      btnStyle =
                        'bg-white/[0.02] border-white/5 text-[#89929b]';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => {
                        const isCorrect = oIdx === q.correctIndex;
                        if (isCorrect) {
                          labAudio.playCorrectChord();
                        } else {
                          labAudio.playWrongBuzzer();
                        }
                        onAnswer(expId, qIdx, oIdx, isCorrect);
                      }}
                      className={`text-left px-3.5 py-2.5 rounded text-xs sm:text-sm border transition-colors cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="font-mono text-xs opacity-75 shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}.
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div
                  className={`mt-1 p-3 rounded text-xs leading-relaxed border ${
                    entry.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  }`}
                >
                  <span className="font-mono font-semibold mr-1.5">
                    {entry.isCorrect ? 'Verified:' : 'Explanation:'}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
