import { StudentProfile } from '../types/lab';

const PROFILE_KEY = 'vsl_student_profile_v2';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'STEM Scholar',
  theme: 'dark',
  practiceMode: false,
  completedExperiments: [],
  totalTrialsLogged: 0,
  totalTimeMinutes: 12,
  badges: ['First Discovery'],
  notes: {},
};

export const BADGE_DEFINITIONS: Record<
  string,
  { name: string; icon: string; description: string; req: string }
> = {
  'First Discovery': {
    name: 'First Discovery',
    icon: '🌟',
    description: 'Began exploring the Virtual Science Laboratory.',
    req: 'Launch any practical experiment.',
  },
  'Optical Virtuoso': {
    name: 'Optical Virtuoso',
    icon: '🔬',
    description: 'Completed experiments across Wave & Geometric Optics.',
    req: 'Complete 3+ Optics practicals.',
  },
  'Master Chemist': {
    name: 'Master Chemist',
    icon: '🧪',
    description: 'Mastered acid-base, thermodynamics, and kinetics.',
    req: 'Complete 3+ Chemistry practicals.',
  },
  'Circuit Architect': {
    name: 'Circuit Architect',
    icon: '⚡',
    description: 'Successfully analyzed electrical network behaviors.',
    req: 'Complete 3+ Electrical practicals.',
  },
  'Digital Pioneer': {
    name: 'Digital Pioneer',
    icon: '🔌',
    description: 'Constructed logic gates and semiconductor circuits.',
    req: 'Complete 3+ Electronics practicals.',
  },
  'Newtonian Master': {
    name: 'Newtonian Master',
    icon: '⚙️',
    description: 'Investigated kinematics, friction, and harmonic motions.',
    req: 'Complete 3+ Mechanical practicals.',
  },
  'Algorithm Maestro': {
    name: 'Algorithm Maestro',
    icon: '💻',
    description: 'Traversed trees, recursive stacks, and shortest paths.',
    req: 'Complete 3+ Programming practicals.',
  },
  'Quiz Whiz': {
    name: 'Quiz Whiz',
    icon: '🎯',
    description: 'Achieved a perfect 100% score on a mastery quiz suite.',
    req: 'Score 6/6 on any experiment quiz.',
  },
  'Data Collector': {
    name: 'Data Collector',
    icon: '📊',
    description: 'Recorded 10 or more empirical observation trials.',
    req: 'Log 10+ simulation trials.',
  },
  'Sandbox Creator': {
    name: 'Sandbox Creator',
    icon: '🛠️',
    description: 'Built custom configurations in the free-form laboratory sandbox.',
    req: 'Open and interact with any Lab Sandbox.',
  },
  'Grand Scholar': {
    name: 'Grand Scholar',
    icon: '🏆',
    description: 'Completed comprehensive laboratory requirements across STEM.',
    req: 'Complete 15+ practical experiments.',
  },
};

export function loadStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota
  }
}

export function markExperimentCompleted(expId: string): StudentProfile {
  const current = loadStudentProfile();
  const set = new Set(current.completedExperiments);
  set.add(expId);
  const updatedList = Array.from(set);

  // Check badges
  const badges = new Set(current.badges);
  badges.add('First Discovery');

  if (updatedList.length >= 15) {
    badges.add('Grand Scholar');
  }

  const updated: StudentProfile = {
    ...current,
    completedExperiments: updatedList,
    badges: Array.from(badges),
  };
  saveStudentProfile(updated);
  return updated;
}

export function incrementTrialCount(): StudentProfile {
  const current = loadStudentProfile();
  const nextCount = current.totalTrialsLogged + 1;
  const badges = new Set(current.badges);
  if (nextCount >= 10) {
    badges.add('Data Collector');
  }
  const updated: StudentProfile = {
    ...current,
    totalTrialsLogged: nextCount,
    badges: Array.from(badges),
  };
  saveStudentProfile(updated);
  return updated;
}

export function awardBadge(badgeName: string): StudentProfile {
  const current = loadStudentProfile();
  const badges = new Set(current.badges);
  badges.add(badgeName);
  const updated: StudentProfile = {
    ...current,
    badges: Array.from(badges),
  };
  saveStudentProfile(updated);
  return updated;
}

