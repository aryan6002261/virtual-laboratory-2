import React from 'react';
import { LabId } from '../../types/lab';
import { OpticsSim } from './OpticsSim';
import { ChemistrySim } from './ChemistrySim';
import { ElectricalSim } from './ElectricalSim';
import { ElectronicsSim } from './ElectronicsSim';
import { MechanicalSim } from './MechanicalSim';
import { ProgrammingSim } from './ProgrammingSim';

export const SimulationStage: React.FC<{
  labId: LabId;
  expId: string;
  onRecord: (values: Record<string, string>) => void;
}> = ({ labId, expId, onRecord }) => {
  switch (labId) {
    case 'optics':
      return <OpticsSim expId={expId} onRecord={onRecord} />;
    case 'chemistry':
      return <ChemistrySim expId={expId} onRecord={onRecord} />;
    case 'electrical':
      return <ElectricalSim expId={expId} onRecord={onRecord} />;
    case 'electronics':
      return <ElectronicsSim expId={expId} onRecord={onRecord} />;
    case 'mechanical':
      return <MechanicalSim expId={expId} onRecord={onRecord} />;
    case 'programming':
      return <ProgrammingSim expId={expId} onRecord={onRecord} />;
  }
};
