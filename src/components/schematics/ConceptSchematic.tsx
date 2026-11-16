import React from 'react';
import { LabId } from '../../types/lab';
import { OpticsSchematic } from './OpticsSchematics';
import { ChemistrySchematic } from './ChemistrySchematics';
import { ElectricalSchematic } from './ElectricalSchematics';
import { ElectronicsSchematic } from './ElectronicsSchematics';
import { MechanicalSchematic } from './MechanicalSchematics';
import { ProgrammingSchematic } from './ProgrammingSchematics';

export const ConceptSchematic: React.FC<{ labId: LabId; expId: string }> = ({
  labId,
  expId,
}) => {
  switch (labId) {
    case 'optics':
      return <OpticsSchematic expId={expId} />;
    case 'chemistry':
      return <ChemistrySchematic expId={expId} />;
    case 'electrical':
      return <ElectricalSchematic expId={expId} />;
    case 'electronics':
      return <ElectronicsSchematic expId={expId} />;
    case 'mechanical':
      return <MechanicalSchematic expId={expId} />;
    case 'programming':
      return <ProgrammingSchematic expId={expId} />;
  }
};
