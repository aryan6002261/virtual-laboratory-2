import React, { useState } from 'react';
import { LabId } from '../../types/lab';
import { CircuitBuilderSandbox } from './CircuitBuilderSandbox';
import { OpticsSandbox } from './OpticsSandbox';
import { ChemistrySandbox } from './ChemistrySandbox';
import { PhysicsSandbox } from './PhysicsSandbox';
import { ProgrammingSandbox } from './ProgrammingSandbox';
import { ArrowLeft, Sparkles, Atom, Zap, Cpu, Cog, Code2, FlaskConical } from 'lucide-react';
import { labAudio } from '../../utils/audio';

interface Props {
  initialDiscipline?: LabId;
  onBackHome: () => void;
}

export const SandboxView: React.FC<Props> = ({
  initialDiscipline = 'electrical',
  onBackHome,
}) => {
  const [activeTab, setActiveTab] = useState<LabId>(initialDiscipline);

  const tabs: Array<{ id: LabId; label: string; icon: React.ReactNode }> = [
    { id: 'electrical', label: 'Circuit Builder', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'electronics', label: 'Digital Logic', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
    { id: 'optics', label: 'Optical Bench', icon: <Sparkles className="w-4 h-4 text-sky-400" /> },
    { id: 'chemistry', label: 'Chemical Reactions', icon: <FlaskConical className="w-4 h-4 text-emerald-400" /> },
    { id: 'mechanical', label: 'Physics Playground', icon: <Cog className="w-4 h-4 text-blue-400" /> },
    { id: 'programming', label: 'Algorithm Scratchpad', icon: <Code2 className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <main className="max-w-[1440px] mx-auto px-5 sm:px-10 py-8 flex flex-col gap-6">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#89929b] hover:text-white transition w-fit cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Laboratory Hub
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#dee2f6]">
              Free-Form Laboratory Sandbox
            </h1>
            <p className="text-xs sm:text-sm text-[#bfc7d2] mt-1">
              Unconstrained experimental playgrounds with drag-and-drop components across STEM disciplines
            </p>
          </div>
        </div>
      </div>

      {/* Discipline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                labAudio.playClick();
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-md'
                  : 'bg-white/5 border border-white/5 text-[#bfc7d2] hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sandbox View */}
      <div className="mt-2">
        {(activeTab === 'electrical' || activeTab === 'electronics') && (
          <CircuitBuilderSandbox />
        )}
        {activeTab === 'optics' && <OpticsSandbox />}
        {activeTab === 'chemistry' && <ChemistrySandbox />}
        {activeTab === 'mechanical' && <PhysicsSandbox />}
        {activeTab === 'programming' && <ProgrammingSandbox />}
      </div>
    </main>
  );
};

