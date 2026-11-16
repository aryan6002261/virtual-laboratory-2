import React, { useState } from 'react';
import { StudentProfile, QuizProgressMap } from '../types/lab';
import { LAB_SUITES, EXPERIMENTS } from '../data/labs';
import { BADGE_DEFINITIONS, saveStudentProfile } from '../utils/studentProfile';
import { Trophy, Award, CheckCircle2, User, X, Sparkles, RefreshCw } from 'lucide-react';
import { labAudio } from '../utils/audio';

interface Props {
  profile: StudentProfile;
  quizProgress: QuizProgressMap;
  onUpdateProfile: (next: StudentProfile) => void;
  onOpenCertificate: (disciplineName?: string) => void;
  onClose: () => void;
}

export const StudentProgressModal: React.FC<Props> = ({
  profile,
  quizProgress,
  onUpdateProfile,
  onOpenCertificate,
  onClose,
}) => {
  const [studentName, setStudentName] = useState(profile.name);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSaveName = () => {
    const updated = { ...profile, name: studentName.trim() || 'STEM Scholar' };
    onUpdateProfile(updated);
    saveStudentProfile(updated);
    setIsEditingName(false);
    labAudio.playClick();
  };

  // Compute quiz stats
  const totalQuestions = EXPERIMENTS.length * 6;
  let totalCorrect = 0;
  let totalAnswered = 0;

  Object.values(quizProgress).forEach((expMap) => {
    Object.values(expMap).forEach((ans) => {
      totalAnswered++;
      if (ans.isCorrect) totalCorrect++;
    });
  });

  const accuracyPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const overallCompletionPct = Math.round((profile.completedExperiments.length / EXPERIMENTS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass-panel-elevated rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/15 bg-[#0e1321]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#090e1c]">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#dee2f6]">
                Student Progress & Mastery Portfolio
              </h2>
              <p className="text-xs text-[#89929b]">
                Empirical records, skill certifications, and achievement badges
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#89929b] hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Profile Card & Certificate Trigger */}
          <div className="p-5 rounded-lg bg-gradient-to-r from-sky-950/60 to-purple-950/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--lab-accent)]/20 border border-[var(--lab-accent)]/40 flex items-center justify-center text-[var(--lab-accent)] font-bold text-lg font-display">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="bg-[#090e1c] border border-white/20 rounded px-2.5 py-1 text-sm text-[#dee2f6] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="px-2.5 py-1 rounded bg-[var(--lab-accent)] text-xs text-white cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-[#dee2f6]">
                      {profile.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="text-[11px] text-[#89929b] hover:text-white underline cursor-pointer"
                    >
                      Edit Name
                    </button>
                  </div>
                )}
                <p className="text-xs text-[#bfc7d2] mt-0.5">
                  Virtual Science Laboratory Student ID: VSL-{Math.abs(profile.name.length * 1337 + 42)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenCertificate()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition cursor-pointer shrink-0"
            >
              <Award className="w-4 h-4" />
              Generate Official Certificate
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Completed Labs</span>
              <span className="text-xl font-bold text-[#93ccff]">
                {profile.completedExperiments.length} / {EXPERIMENTS.length}
              </span>
              <span className="text-[10px] text-[#89929b] mt-1 block">
                {overallCompletionPct}% syllabus finished
              </span>
            </div>

            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Quiz Questions</span>
              <span className="text-xl font-bold text-emerald-400">
                {totalCorrect} / {totalQuestions}
              </span>
              <span className="text-[10px] text-emerald-300 mt-1 block">
                {accuracyPct}% accuracy rate
              </span>
            </div>

            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Logged Trials</span>
              <span className="text-xl font-bold text-amber-300">
                {profile.totalTrialsLogged}
              </span>
              <span className="text-[10px] text-[#89929b] mt-1 block">
                Empirical data points
              </span>
            </div>

            <div className="bg-[#090e1c] p-3.5 rounded border border-white/10">
              <span className="text-[#89929b] block text-[11px]">Badges Unlocked</span>
              <span className="text-xl font-bold text-purple-300">
                {profile.badges.length} / {Object.keys(BADGE_DEFINITIONS).length}
              </span>
              <span className="text-[10px] text-[#89929b] mt-1 block">
                Mastery awards
              </span>
            </div>
          </div>

          {/* Discipline Breakdown */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-[#dee2f6]">
              Discipline Progress & Subject Mastery
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LAB_SUITES.map((suite) => {
                const suiteExps = EXPERIMENTS.filter((e) => e.labId === suite.id);
                const doneCount = suiteExps.filter((e) =>
                  profile.completedExperiments.includes(e.id)
                ).length;
                const pct = suiteExps.length > 0 ? Math.round((doneCount / suiteExps.length) * 100) : 0;

                return (
                  <div
                    key={suite.id}
                    className="p-3.5 rounded bg-[#090e1c] border border-white/10 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-[#dee2f6]">
                        {suite.name}
                      </span>
                      <span className="font-mono text-xs text-[#93ccff]">
                        {doneCount} / {suiteExps.length} ({pct}%)
                      </span>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-[var(--lab-accent)] rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Gallery */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-[#dee2f6] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Achievements & Specialization Badges
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(BADGE_DEFINITIONS).map(([badgeKey, b]) => {
                const isUnlocked = profile.badges.includes(badgeKey);

                return (
                  <div
                    key={badgeKey}
                    className={`p-3.5 rounded border transition-all ${
                      isUnlocked
                        ? 'bg-[#090e1c] border-amber-500/30'
                        : 'bg-white/[0.01] border-white/5 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <h4 className="font-display text-xs font-bold text-[#dee2f6]">
                          {b.name}
                        </h4>
                        <span className="text-[10px] text-[#89929b] font-mono">
                          {isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#bfc7d2] leading-relaxed">
                      {b.description}
                    </p>
                    <p className="text-[10px] text-[#89929b] font-mono mt-1">
                      Target: {b.req}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#090e1c] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all progress and quiz records? This cannot be undone.')) {
                window.localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
          >
            Reset Progress
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

