import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TopBarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNavigateHome: (sectionId?: string) => void;
  onOpenQuizOverview: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  soundEnabled,
  onToggleSound,
  onNavigateHome,
  onOpenQuizOverview,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090e1c]/90 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigateHome()}
          className="font-display text-lg font-bold tracking-tight text-[#dee2f6] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Virtual Science Lab
        </button>

        {/* Zone 2: 4 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#bfc7d2]">
          <button
            type="button"
            onClick={() => onNavigateHome('suites')}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Laboratories
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('directory')}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            38 Practicals
          </button>
          <button
            type="button"
            onClick={() => onNavigateHome('pedagogy')}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Architecture
          </button>
          <button
            type="button"
            onClick={onOpenQuizOverview}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Quiz Bank
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Global Web Audio Toggle) */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onToggleSound}
            aria-pressed={soundEnabled}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              soundEnabled
                ? 'bg-[#0284c7]/20 border-[#0284c7]/50 text-[#93ccff] hover:bg-[#0284c7]/30'
                : 'bg-white/5 border-white/15 text-[#89929b] hover:text-[#dee2f6]'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span>Sound: {soundEnabled ? 'On' : 'Off'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
