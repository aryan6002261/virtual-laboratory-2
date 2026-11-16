import { ExperimentPedagogy } from '../../types/lab';
import { OPTICS_CURRICULUM } from './optics';
import { CHEMISTRY_CURRICULUM } from './chemistry';
import { ELECTRICAL_CURRICULUM } from './electrical';
import { ELECTRONICS_CURRICULUM } from './electronics';
import { MECHANICAL_CURRICULUM } from './mechanical';
import { PROGRAMMING_CURRICULUM } from './programming';

export const ALL_CURRICULUM: Record<string, ExperimentPedagogy> = {
  ...OPTICS_CURRICULUM,
  ...CHEMISTRY_CURRICULUM,
  ...ELECTRICAL_CURRICULUM,
  ...ELECTRONICS_CURRICULUM,
  ...MECHANICAL_CURRICULUM,
  ...PROGRAMMING_CURRICULUM,
};

export function getPedagogyForExperiment(expId: string): ExperimentPedagogy | undefined {
  return ALL_CURRICULUM[expId];
}
