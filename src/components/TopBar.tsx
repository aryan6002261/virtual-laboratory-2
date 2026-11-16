import React from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  BookMarked,
  Trophy,
  Bot,
  Zap,
} from 'lucide-react';

interface TopBarProps {
  soundEnabled: boolean;
  theme: 'dark' | 'light';
  completedCount: number;
  totalCount: number;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onOpenQuizOverview: () => void;
  onOpenGlossary: () => void;
  onOpenProgress: () => void;
  onOpenAIAssistant: () => void;
  onOpenSandbox: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  soundEnabled,
  theme,
  completedCount,
  totalCount,
  onToggleSound,
  onToggleTheme,
  onNavigateHome,
  onOpenQuizOverview,
  onOpenGlossary,
  onOpenProgress,
  onOpenAIAssistant,
  onOpenSandbox,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090e1c]/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigateHome()}
            className="font-display text-lg font-bold tracking-tight text-[#dee2f6] hover:text-white transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            Virtual Science Lab
          </button>

          <button
            type="button"
            onClick={onOpenSandbox}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition cursor-pointer"
          >
            <Zap className="w-3 h-3" /> Sandbox
          </button>
        </div>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#bfc7d2]">
          <button
            type="button"
            onClick={() => onNavigateHome('suites')}
            className="hover:text-white transition whitespace-nowrap cursor-pointer"
          >
            Laboratories
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('directory')}
            className="hover:text-white transition whitespace-nowrap cursor-pointer"
          >
            38 Practicals
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('pedagogy')}
            className="hover:text-white transition whitespace-nowrap cursor-pointer"
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={onOpenQuizOverview}
            className="hover:text-white transition whitespace-nowrap cursor-pointer"
          >
            Quiz Bank
          </button>
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Assistant */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-sky-500/15 border border-sky-500/30 text-sky-300 hover:bg-sky-500/25 transition cursor-pointer"
            title="Ask AI Lab Assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Tutor</span>
          </button>

          {/* Scientific Glossary */}
          <button
            type="button"
            onClick={onOpenGlossary}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-white/5 border border-white/10 text-[#dee2f6] hover:bg-white/10 transition cursor-pointer"
            title="Search Scientific Glossary"
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Glossary</span>
          </button>

          {/* Student Progress & Portfolio */}
          <button
            type="button"
            onClick={onOpenProgress}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
            title="View Student Progress & Badges"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{completedCount}/{totalCount}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded text-xs bg-white/5 border border-white/10 text-[#dee2f6] hover:bg-white/10 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-sky-300" />
            )}
          </button>

          {/* Audio Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={`p-2 rounded text-xs border transition cursor-pointer ${
              soundEnabled
                ? 'bg-[#0284c7]/20 border-[#0284c7]/50 text-[#93ccff]'
                : 'bg-white/5 border-white/10 text-[#89929b]'
            }`}
            title={`Sound: ${soundEnabled ? 'On' : 'Off'}`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
