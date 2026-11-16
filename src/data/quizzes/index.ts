import { QuizQuestion } from '../../types/lab';
import { OPTICS_QUIZZES } from './optics';
import { CHEMISTRY_QUIZZES } from './chemistry';
import { ELECTRICAL_QUIZZES } from './electrical';
import { ELECTRONICS_QUIZZES } from './electronics';
import { MECHANICAL_QUIZZES } from './mechanical';
import { PROGRAMMING_QUIZZES } from './programming';

export const ALL_QUIZZES: Record<string, QuizQuestion[]> = {
  ...OPTICS_QUIZZES,
  ...CHEMISTRY_QUIZZES,
  ...ELECTRICAL_QUIZZES,
  ...ELECTRONICS_QUIZZES,
  ...MECHANICAL_QUIZZES,
  ...PROGRAMMING_QUIZZES,
};

export function getQuizForExperiment(expId: string): QuizQuestion[] {
  return ALL_QUIZZES[expId] ?? [];
}
