import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { PortalHub } from './components/PortalHub';
import { LabPortalView } from './components/LabPortalView';
import { PracticalWorkbench } from './components/PracticalWorkbench';
import { SandboxView } from './components/sandboxes/SandboxView';
import { StudentProgressModal } from './components/StudentProgressModal';
import { CertificateModal } from './components/CertificateModal';
import { GlossaryModal } from './components/GlossaryModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { getExperimentById, EXPERIMENTS } from './data/labs';
import { LabId, QuizProgressMap, StudentProfile } from './types/lab';
import { labAudio } from './utils/audio';
import { loadStudentProfile, saveStudentProfile } from './utils/studentProfile';

type RouteState =
  | { view: 'hub' }
  | { view: 'lab'; labId: LabId }
  | { view: 'practical'; labId: LabId; expId: string }
  | { view: 'sandbox'; discipline?: LabId };

const PROGRESS_STORAGE_KEY = 'vsl_quiz_progress_v1';

function parseHash(): RouteState {
  if (typeof window === 'undefined') return { view: 'hub' };
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { view: 'hub' };
  const parts = hash.split('/');

  if (parts[0] === 'sandbox') {
    return { view: 'sandbox', discipline: (parts[1] as LabId) || 'electrical' };
  }

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
  const [profile, setProfile] = useState<StudentProfile>(() => loadStudentProfile());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => profile.theme || 'dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => labAudio.isEnabled());
  const [quizProgress, setQuizProgress] = useState<QuizProgressMap>(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as QuizProgressMap) : {};
    } catch {
      return {};
    }
  });

  // Global modals
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [certificateDiscipline, setCertificateDiscipline] = useState('General STEM Laboratory Mastery');

  // Synchronize Dark / Light mode classes on html and body
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);
  }, [theme]);

  // Sync body[data-lab] attribute for discipline CSS custom properties
  useEffect(() => {
    if (route.view === 'hub' || route.view === 'sandbox') {
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

  const handleToggleTheme = () => {
    const next: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    const updated: StudentProfile = { ...profile, theme: next };
    setProfile(updated);
    saveStudentProfile(updated);
    labAudio.playClick();
  };

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

  const navigateSandbox = (discipline: LabId = 'electrical') => {
    labAudio.playClick();
    window.location.hash = `#/sandbox/${discipline}`;
    setRoute({ view: 'sandbox', discipline });
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
    <div className={`min-h-screen flex flex-col lab-grid-backdrop ${theme === 'dark' ? 'bg-[#0e1321] text-[#dee2f6]' : 'bg-[#f8fafc] text-[#0f172a]'}`}>
      <TopBar
        soundEnabled={soundEnabled}
        theme={theme}
        completedCount={profile.completedExperiments.length}
        totalCount={EXPERIMENTS.length}
        onToggleSound={() => setSoundEnabled(labAudio.toggle())}
        onToggleTheme={handleToggleTheme}
        onNavigateHome={navigateHub}
        onOpenQuizOverview={() => navigateHub('directory')}
        onOpenGlossary={() => setShowGlossaryModal(true)}
        onOpenProgress={() => setShowProgressModal(true)}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenSandbox={() => navigateSandbox('electrical')}
      />

      {/* Global Modals */}
      {showProgressModal && (
        <StudentProgressModal
          profile={profile}
          quizProgress={quizProgress}
          onUpdateProfile={(p) => setProfile(p)}
          onOpenCertificate={(disc) => {
            if (disc) setCertificateDiscipline(disc);
            setShowCertificateModal(true);
          }}
          onClose={() => setShowProgressModal(false)}
        />
      )}

      {showCertificateModal && (
        <CertificateModal
          studentName={profile.name}
          disciplineTitle={certificateDiscipline}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {showGlossaryModal && (
        <GlossaryModal onClose={() => setShowGlossaryModal(false)} />
      )}

      {showAIAssistant && (
        <AIAssistantDrawer onClose={() => setShowAIAssistant(false)} />
      )}

      {/* View Routers */}
      <div className="flex-1">
        {route.view === 'hub' && (
          <PortalHub
            quizProgress={quizProgress}
            onSelectLab={navigateLab}
            onSelectExperiment={navigatePractical}
            onOpenSandbox={navigateSandbox}
          />
        )}

        {route.view === 'lab' && (
          <LabPortalView
            labId={route.labId}
            quizProgress={quizProgress}
            onBackHome={() => navigateHub()}
            onSelectExperiment={navigatePractical}
            onOpenSandbox={navigateSandbox}
          />
        )}

        {route.view === 'practical' && (
          <PracticalWorkbench
            labId={route.labId}
            expId={route.expId}
            studentName={profile.name}
            quizProgress={quizProgress}
            onAnswerQuiz={handleAnswerQuiz}
            onResetQuiz={handleResetQuiz}
            onBackHome={() => navigateHub()}
            onBackToLab={navigateLab}
            onSelectExperiment={navigatePractical}
            onOpenSandbox={navigateSandbox}
          />
        )}

        {route.view === 'sandbox' && (
          <SandboxView
            initialDiscipline={route.discipline || 'electrical'}
            onBackHome={() => navigateHub()}
          />
        )}
      </div>

      <footer className="border-t border-white/10 bg-[#090e1c]/80 mt-16 no-print">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89929b]">
          <span>Virtual Science Laboratory · Interactive STEM Education Platform (MIT License)</span>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => navigateLab('optics')} className="hover:text-white cursor-pointer">Optics</button>
            <button type="button" onClick={() => navigateLab('chemistry')} className="hover:text-white cursor-pointer">Chemistry</button>
            <button type="button" onClick={() => navigateLab('electrical')} className="hover:text-white cursor-pointer">Electrical</button>
            <button type="button" onClick={() => navigateLab('electronics')} className="hover:text-white cursor-pointer">Electronics</button>
            <button type="button" onClick={() => navigateLab('mechanical')} className="hover:text-white cursor-pointer">Mechanical</button>
            <button type="button" onClick={() => navigateLab('programming')} className="hover:text-white cursor-pointer">Programming</button>
            <button type="button" onClick={() => navigateSandbox('electrical')} className="text-amber-300 hover:text-white font-mono cursor-pointer">Sandbox</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
