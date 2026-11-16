import { ExperimentPedagogy } from '../../types/lab';

export const CHEMISTRY_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'acid-base-titration': {
    id: 'acid-base-titration',
    flowchart: [
      { step: 1, title: 'Prepare Analyte & Indicator', detail: 'Select Strong Acid (HCl) or Weak Acid (CH₃COOH) analyte and choose pH indicator.' },
      { step: 2, title: 'Dispense Titrant Increments', detail: 'Open the burette stopcock to add 0.10 M NaOH gradually while magnetic stirring mixes.' },
      { step: 3, title: 'Monitor pH Inflection', detail: 'Track live pH probe curve through buffer zone into the steep equivalence rise.', condition: 'At V_b = (MₐVₐ)/M_b → Equivalence Point' },
      { step: 4, title: 'Capture Endpoint & Log', detail: 'Record exact endpoint volume, equivalence pH, and indicator color transition.' },
    ],
    equations: [
      { name: 'Stoichiometric Equivalence', expression: 'n_H⁺ = n_OH⁻  ⟹  Mₐ Vₐ = M_b V_b', notes: 'Exact molar neutralization point for monoprotic acids and bases.' },
      { name: 'Henderson-Hasselbalch Buffer', expression: 'pH = pKₐ + log₁₀([A⁻] / [HA])', notes: 'Governs the shallow buffer plateau of weak acid titrations; pH = pKₐ at V_eq / 2.' },
      { name: 'Water Auto-Ionization', expression: 'K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (25°C)', notes: 'Links pH and pOH via pH + pOH = 14.00.' },
    ],
    theoryParagraphs: [
      'Volumetric acid-base titration determines an unknown solution concentration by incrementally reacting it with a standardized titrant until stoichiometric equivalence is reached. Plotting pH against added titrant volume reveals a characteristic sigmoidal curve.',
      'Strong-acid / strong-base curves exhibit a dramatic vertical jump centered strictly at pH 7.00. Weak-acid curves begin higher, display a flat Henderson-Hasselbalch buffer region centered at pH = pKₐ, and cross equivalence in the basic regime (pH > 7) due to conjugate-base hydrolysis.',
    ],
    realWorldApplications: [
      'Pharmaceutical assay quality control verifying active acid/alkali purity in tablets.',
      'Environmental water alkalinity testing and acid-rain neutralization monitoring.',
      'Food science determination of citric acid in beverages and lactic acid in dairy.',
    ],
    logColumns: ['Acid Type', 'V_added (mL)', 'Live pH', 'Indicator', 'State'],
  },

  'gas-laws': {
    id: 'gas-laws',
    flowchart: [
      { step: 1, title: 'Initialize Gas Chamber', detail: 'Set number of moles n, piston volume V (L), and thermal bath temperature T (K).' },
      { step: 2, title: 'Simulate Elastic Collisions', detail: 'Track 2D molecular kinematics and impulse exchanges against piston and chamber walls.' },
      { step: 3, title: 'Vary Thermodynamic State', detail: 'Compress volume (Boyle) or heat chamber (Charles/Gay-Lussac) and observe v_rms shift.', condition: 'Constant T → P₁V₁ = P₂V₂' },
      { step: 4, title: 'Record State Variables', detail: 'Log P, V, T, n, and root-mean-square speed v_rms into empirical gas table.' },
    ],
    equations: [
      { name: 'Ideal Gas Law', expression: 'P V = n R T', notes: 'R = 0.08206 L·atm/(mol·K) = 8.314 J/(mol·K).' },
      { name: 'RMS Molecular Speed', expression: 'v_rms = √(3 R T / M)', notes: 'Speed rises with √T and decreases with higher molar mass M.' },
      { name: 'Translational Kinetic Energy', expression: 'KE_avg = (3 / 2) k_B T', notes: 'Temperature directly measures average molecular translational kinetic energy.' },
    ],
    theoryParagraphs: [
      'Kinetic Molecular Theory bridges microscopic particle mechanics with macroscopic thermodynamics. Gas molecules travel in rapid random trajectories, colliding elastically with container walls and transferring normal momentum 2mv_x per bounce.',
      'Reducing volume increases wall collision frequency per unit area (raising pressure inversely with V, Boyle’s Law), while raising temperature accelerates particle speeds (raising pressure linearly with Kelvin T, Gay-Lussac’s Law).',
    ],
    realWorldApplications: [
      'Internal combustion engine compression cycles and pneumatic actuator sizing.',
      'High-altitude weather balloon expansion modeling and SCUBA decompression tables.',
      'Cryogenic liquid-gas storage vessel pressure-relief engineering.',
    ],
    logColumns: ['n (mol)', 'V (L)', 'T (K)', 'P (atm)', 'v_rms (m/s)'],
  },

  'reaction-kinetics': {
    id: 'reaction-kinetics',
    flowchart: [
      { step: 1, title: 'Set Activation Barrier Eₐ', detail: 'Adjust uncatalyzed or catalyzed activation energy threshold Eₐ (kJ/mol).' },
      { step: 2, title: 'Tune Bath Temperature T', detail: 'Control molecular kinetic energy distribution across 250 K – 700 K.' },
      { step: 3, title: 'Observe Reactive Collisions', detail: 'Watch A + B particles collide; only pairs exceeding Eₐ overcome the barrier to form C.', condition: 'If E_collision ≥ Eₐ → Successful Reaction' },
      { step: 4, title: 'Analyze Rate Constant k', detail: 'Inspect Arrhenius curve k(T) and record rate constant & yield progression.' },
    ],
    equations: [
      { name: 'Arrhenius Rate Equation', expression: 'k = A e^(−Eₐ / R T)', notes: 'Exponential sensitivity of rate constant k to activation barrier Eₐ and temperature T.' },
      { name: 'Power-Law Rate Expression', expression: 'Rate = k [A]ᵐ [B]ⁿ', notes: 'Overall reaction order is m + n determined empirically.' },
      { name: 'Linearized Arrhenius Plot', expression: 'ln(k) = ln(A) − (Eₐ / R)(1 / T)', notes: 'Plot of ln k vs 1/T yields straight line of slope −Eₐ/R.' },
    ],
    theoryParagraphs: [
      'For colliding molecules to rearrange chemical bonds, their relative kinetic energy along the line of centers must exceed the activation energy Eₐ needed to stretch existing bonds into the transition state.',
      'Because the Maxwell-Boltzmann tail grows exponentially with temperature, even modest warming dramatically multiplies successful reactive collisions. Catalysts accelerate reactions without being consumed by routing the mechanism through a lower-Eₐ transition complex.',
    ],
    realWorldApplications: [
      'Catalytic converters using platinum/rhodium surfaces to scrub automotive exhaust.',
      'Food refrigeration slowing spoilage enzymes by lowering k exponentially.',
      'Industrial Haber-Bosch ammonia synthesis balancing temperature kinetics and yield.',
    ],
    logColumns: ['T (K)', 'Eₐ (kJ/mol)', 'Catalyst', 'k (s⁻¹)', '% Converted'],
  },

  'flame-test': {
    id: 'flame-test',
    flowchart: [
      { step: 1, title: 'Select Metal Salt Sample', detail: 'Choose Chloride salt of Li⁺, Na⁺, K⁺, Ca²⁺, Cu²⁺, or Ba²⁺.' },
      { step: 2, title: 'Insert Platinum Loop in Flame', detail: 'Introduce sample into the hot non-luminous Bunsen oxidation zone (~1500°C).' },
      { step: 3, title: 'Observe Quantum Emission', detail: 'Excited valence electrons relax downward, emitting characteristic monochromatic lines.', condition: 'ΔE = E_upper − E_lower = hc / λ' },
      { step: 4, title: 'Record Spectrum & Energy', detail: 'Measure dominant wavelength λ (nm) and calculate photon energy in eV.' },
    ],
    equations: [
      { name: 'Planck-Einstein Photon Energy', expression: 'ΔE = h ν = h c / λ', notes: 'h = 6.626 × 10⁻³⁴ J·s; convenient product hc ≈ 1240 eV·nm.' },
      { name: 'Rydberg / Atomic Transition', expression: '1 / λ = ΔE / (h c)', notes: 'Each element’s unique orbital spacing produces an unambiguous spectral signature.' },
    ],
    theoryParagraphs: [
      'Thermal collisions inside a Bunsen flame supply quantized packets of energy to volatilized metal atoms, promoting outer valence electrons into unstable higher-energy orbitals. Within nanoseconds, those electrons cascade back to ground states, releasing photons whose colors correspond strictly to orbital energy gaps.',
      'Passing this flame light through a spectroscope resolves seemingly uniform colors into discrete narrow emission lines—for example, Sodium’s unmistakable 589 nm doublet and Copper’s blue-green 510–522 nm bands.',
    ],
    realWorldApplications: [
      'Inductively Coupled Plasma Atomic Emission Spectroscopy (ICP-AES) for trace heavy-metal forensics.',
      'Pyrotechnic fireworks formulation using Strontium (red), Barium (green), Copper (blue), and Sodium (gold).',
      'Astrophysical spectroscopy identifying elements inside distant stars and exoplanet atmospheres.',
    ],
    logColumns: ['Ion', 'Flame Color', 'Peak λ (nm)', 'Energy (eV)', 'Transition'],
  },

  'electrochemistry': {
    id: 'electrochemistry',
    flowchart: [
      { step: 1, title: 'Configure Half-Cell Molarities', detail: 'Set aqueous [Zn²⁺] anode electrolyte and [Cu²⁺] cathode electrolyte concentrations.' },
      { step: 2, title: 'Complete Salt Bridge Circuit', detail: 'Connect KNO₃ salt bridge and external high-impedance voltmeter.' },
      { step: 3, title: 'Drive Redox & Ion Migration', detail: 'Observe Zn oxidation (e⁻ leaves anode) and Cu²⁺ reduction while K⁺/NO₃⁻ balance charge.', condition: 'E_cell = E°_cell − (0.0592/n) log₁₀([Zn²⁺]/[Cu²⁺])' },
      { step: 4, title: 'Verify Nernst Potential', detail: 'Compare measured cell voltage against theoretical Nernst prediction in log table.' },
    ],
    equations: [
      { name: 'Standard Cell Potential', expression: 'E°_cell = E°_cathode − E°_anode', notes: 'For Daniell cell: +0.34 V − (−0.76 V) = +1.10 V.' },
      { name: 'Nernst Equation (298 K)', expression: 'E_cell = E°_cell − (0.0592 / n) log₁₀(Q)', notes: 'n = 2 electrons transferred; Q = [Zn²⁺] / [Cu²⁺].' },
      { name: 'Gibbs Free Energy Link', expression: 'ΔG = −n F E_cell', notes: 'Positive cell voltage E_cell > 0 guarantees spontaneous ΔG < 0.' },
    ],
    theoryParagraphs: [
      'A galvanic (voltaic) cell harvests spontaneous oxidation-reduction chemistry to perform electrical work. In the classic Daniell cell, metallic zinc oxidizes into Zn²⁺ at the anode, pushing electrons through an external load toward the copper cathode where aqueous Cu²⁺ plates onto the electrode.',
      'A porous KNO₃ salt bridge prevents immediate charge polarization by migrating anions (NO₃⁻) into the anode beaker and cations (K⁺) into the cathode beaker. As reactants are consumed, Q = [Zn²⁺]/[Cu²⁺] rises and cell voltage drops smoothly along the Nernst logarithm.',
    ],
    realWorldApplications: [
      'Lithium-ion electric vehicle batteries, alkaline primary cells, and hydrogen fuel cells.',
      'Potentiometric pH glass electrodes and biological ion-selective sensors operating directly on the Nernst equation.',
      'Sacrificial zinc anodes protecting marine ship hulls and steel pipelines from corrosion.',
    ],
    logColumns: ['[Zn²⁺] (M)', '[Cu²⁺] (M)', 'T (K)', 'Q Ratio', 'E_cell (V)'],
  },
};
