export type LabId =
  | 'optics'
  | 'chemistry'
  | 'electrical'
  | 'electronics'
  | 'mechanical'
  | 'programming';

export interface LabSuite {
  id: LabId;
  name: string;
  shortName: string;
  discipline: string;
  accentHex: string;
  accentSoft: string;
  gradientFrom: string;
  gradientTo: string;
  experimentCount: number;
  questionCount: number;
  summary: string;
  coreFocus: string[];
}

export interface ExperimentMeta {
  id: string;
  labId: LabId;
  index: number;
  title: string;
  shortTitle: string;
  formula: string;
  summary: string;
  filePath: string;
  concepts: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface FlowStep {
  step: number;
  title: string;
  detail: string;
  condition?: string;
}

export interface TheoryEquation {
  name: string;
  expression: string;
  notes: string;
}

export interface ExperimentPedagogy {
  id: string;
  flowchart: FlowStep[];
  equations: TheoryEquation[];
  theoryParagraphs: string[];
  realWorldApplications: string[];
  logColumns: string[];
}

export interface TelemetryMetric {
  label: string;
  value: string;
  unit?: string;
  tone?: 'nominal' | 'accent' | 'warning' | 'alert';
}

export interface ObservationEntry {
  trial: number;
  timestamp: string;
  values: Record<string, string>;
}

export type QuizProgressMap = Record<
  string,
  Record<number, { selectedIndex: number; isCorrect: boolean }>
>;
