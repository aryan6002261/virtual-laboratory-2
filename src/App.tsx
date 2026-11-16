import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { PortalHub } from './components/PortalHub';
import { LabPortalView } from './components/LabPortalView';
import { PracticalWorkbench } from './components/PracticalWorkbench';
import { getExperimentById } from './data/labs';
import { LabId, QuizProgressMap } from './types/lab';
import { labAudio } from './utils/audio';

type RouteState =
  | { view: 'hub' }
  | { view: 'lab'; labId: LabId }
  | { view: 'practical'; labId: LabId; expId: string };

const PROGRESS_STORAGE_KEY = 'vsl_quiz_progress_v1';

function parseHash(): RouteState {
  if (typeof window === 'undefined') return { view: 'hub' };
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { view: 'hub' };
  const parts = hash.split('/');
  if (parts[0] === 'lab' && parts[1]) {
    const labId = parts[1] as LabId;
    if (parts[2]) {
      const exp = getExperimentById(parts[2]);
      if (exp && exp.labId === labId) {
        return { view: 'practical', labId, expId: exp.id };
      }
    }
    return { view: 'lab', labId };
  }
  return { view: 'hub' };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHash());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => labAudio.isEnabled());
  const [quizProgress, setQuizProgress] = useState<QuizProgressMap>(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as QuizProgressMap) : {};
    } catch {
      return {};
    }
  });

  // Sync body[data-lab] attribute for discipline CSS custom properties
  useEffect(() => {
    if (route.view === 'hub') {
      document.body.setAttribute('data-lab', 'optics');
    } else {
      document.body.setAttribute('data-lab', route.labId);
    }
  }, [route]);

  // Listen to browser back/forward hash navigation
  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const persistProgress = (next: QuizProgressMap) => {
    setQuizProgress(next);
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage quota
    }
  };

  const navigateHub = (sectionId?: string) => {
    window.location.hash = '';
    setRoute({ view: 'hub' });
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateLab = (labId: LabId) => {
    labAudio.playClick();
    window.location.hash = `#/lab/${labId}`;
    setRoute({ view: 'lab', labId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigatePractical = (labId: LabId, expId: string) => {
    labAudio.playClick();
    window.location.hash = `#/lab/${labId}/${expId}`;
    setRoute({ view: 'practical', labId, expId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerQuiz = (
    expId: string,
    qIndex: number,
    selectedIndex: number,
    isCorrect: boolean
  ) => {
    const next: QuizProgressMap = {
      ...quizProgress,
      [expId]: {
        ...(quizProgress[expId] ?? {}),
        [qIndex]: { selectedIndex, isCorrect },
      },
    };
    persistProgress(next);
  };

  const handleResetQuiz = (expId: string) => {
    const next = { ...quizProgress };
    delete next[expId];
    persistProgress(next);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1321] text-[#dee2f6] lab-grid-backdrop">
      <TopBar
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(labAudio.toggle())}
        onNavigateHome={navigateHub}
        onOpenQuizOverview={() => navigateHub('directory')}
      />

      <div className="flex-1">
        {route.view === 'hub' && (
          <PortalHub
            quizProgress={quizProgress}
            onSelectLab={navigateLab}
            onSelectExperiment={navigatePractical}
          />
        )}

        {route.view === 'lab' && (
          <LabPortalView
            labId={route.labId}
            quizProgress={quizProgress}
            onBackHome={() => navigateHub()}
            onSelectExperiment={navigatePractical}
          />
        )}

        {route.view === 'practical' && (
          <PracticalWorkbench
            labId={route.labId}
            expId={route.expId}
            quizProgress={quizProgress}
            onAnswerQuiz={handleAnswerQuiz}
            onResetQuiz={handleResetQuiz}
            onBackHome={() => navigateHub()}
            onBackToLab={navigateLab}
            onSelectExperiment={navigatePractical}
          />
        )}
      </div>

      <footer className="border-t border-white/10 bg-[#090e1c]/80 mt-16">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89929b]">
          <span>Virtual Science Laboratory · Interactive STEM Education Platform (MIT License)</span>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => navigateLab('optics')} className="hover:text-white cursor-pointer">Optics</button>
            <button type="button" onClick={() => navigateLab('chemistry')} className="hover:text-white cursor-pointer">Chemistry</button>
            <button type="button" onClick={() => navigateLab('electrical')} className="hover:text-white cursor-pointer">Electrical</button>
            <button type="button" onClick={() => navigateLab('electronics')} className="hover:text-white cursor-pointer">Electronics</button>
            <button type="button" onClick={() => navigateLab('mechanical')} className="hover:text-white cursor-pointer">Mechanical</button>
            <button type="button" onClick={() => navigateLab('programming')} className="hover:text-white cursor-pointer">Programming</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
