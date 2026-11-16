import { ExperimentPedagogy } from '../../types/lab';

export const ELECTRICAL_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'ohms-law': {
    id: 'ohms-law',
    flowchart: [
      { step: 1, title: 'Set Resistance R', detail: 'Select test resistor value (10 Ω to 500 Ω) in the DC loop.' },
      { step: 2, title: 'Sweep Supply Voltage V', detail: 'Adjust DC source from 0 V up to 24 V and watch electron drift accelerate.' },
      { step: 3, title: 'Sample I-V Operating Point', detail: 'Plot (V, I) coordinates on the live I-V characteristic trace.', condition: 'Linear slope dI/dV = 1/R confirms Ohmic behavior' },
      { step: 4, title: 'Log Voltage, Current & Power', detail: 'Record V, I, calculated R = V/I, and thermal power P = VI.' },
    ],
    equations: [
      { name: "Ohm's Law", expression: 'V = I R', notes: 'Linear proportionality between potential difference V and current I at constant temperature.' },
      { name: 'Joule Power Dissipation', expression: 'P = V I = I² R = V² / R', notes: 'Electrical energy converted to heat per unit time (Watts).' },
    ],
    theoryParagraphs: [
      'In metallic conductors at constant temperature, electric field strength drives free conduction electrons at a drift velocity proportional to applied potential difference V. Georg Simon Ohm formalized this linear ratio V/I = R (Ohms).',
      'Plotting current I against voltage V produces a straight line passing through the origin whose slope equals conductance G = 1/R. Comparing the power dissipated (P = I²R) ensures components stay safely within wattage ratings.',
    ],
    realWorldApplications: [
      'Current-limiting LED dropper resistors and PCB power-rail current-sense shunts.',
      'Precision heating elements in laboratory incubators, 3D printer hotends, and toasters.',
      'Fuse sizing and cable gauge selection to minimize I²R transmission line losses.',
    ],
    logColumns: ['V (V)', 'R (Ω)', 'I (mA)', 'P (W)', 'G (mS)'],
  },

  'kirchhoffs-laws': {
    id: 'kirchhoffs-laws',
    flowchart: [
      { step: 1, title: 'Set Dual EMF Sources', detail: 'Adjust left battery V₁ and right battery V₂ across the two-loop network.' },
      { step: 2, title: 'Tune Branch Resistors', detail: 'Configure R₁, R₂ (shared center branch), and R₃.' },
      { step: 3, title: 'Solve Nodal & Loop Equations', detail: 'Compute node potential V_A and branch currents I₁, I₂, I₃ simultaneously.', condition: 'Check KCL: I₁ + I₃ − I₂ = 0 at top node' },
      { step: 4, title: 'Verify Loop Sums', detail: 'Confirm ∑ΔV = 0 around both left and right closed meshes and record trial.' },
    ],
    equations: [
      { name: "Kirchhoff's Current Law (KCL)", expression: '∑ I_in = ∑ I_out', notes: 'Conservation of electric charge at every circuit junction node.' },
      { name: "Kirchhoff's Voltage Law (KVL)", expression: '∑ ΔV_loop = 0', notes: 'Conservative electrostatic field requires zero net potential change around any closed loop.' },
    ],
    theoryParagraphs: [
      'Complex multi-source networks cannot always be collapsed into simple series-parallel equivalents. Gustav Kirchhoff formulated two universal conservation laws that solve any lumped-element linear circuit.',
      'KCL enforces charge continuity at every node (no charge piles up at a junction), while KVL enforces energy conservation around every closed loop (the sum of EMF rises equals the sum of IR potential drops).',
    ],
    realWorldApplications: [
      'SPICE circuit simulators solving millions of nodal KCL equations for modern microprocessor chips.',
      'Automotive dual-battery charging systems and solar microgrid power distribution.',
      'Analog bridge balancing and multi-channel audio mixer summing buses.',
    ],
    logColumns: ['V₁ (V)', 'V₂ (V)', 'I₁ (mA)', 'I₂ (mA)', 'I₃ (mA)'],
  },

  'series-parallel': {
    id: 'series-parallel',
    flowchart: [
      { step: 1, title: 'Choose Network Topology', detail: 'Switch between Pure Series, Pure Parallel, or Mixed Series-Parallel configuration.' },
      { step: 2, title: 'Configure R₁, R₂, R₃ & V_s', detail: 'Adjust individual resistor values and DC bus voltage.' },
      { step: 3, title: 'Compute Equivalent R_eq', detail: 'Collapse branches mathematically and observe power glow across each resistor.', condition: 'Series: same I  |  Parallel: same V' },
      { step: 4, title: 'Log Branch Telemetry', detail: 'Verify voltage division (Series) or current division (Parallel) in the log table.' },
    ],
    equations: [
      { name: 'Series Equivalent Resistance', expression: 'R_eq = R₁ + R₂ + R₃', notes: 'Total resistance always exceeds the largest individual resistor.' },
      { name: 'Parallel Equivalent Resistance', expression: '1 / R_eq = 1 / R₁ + 1 / R₂ + 1 / R₃', notes: 'Total resistance is always smaller than the smallest branch resistor.' },
      { name: 'Voltage Divider Rule', expression: 'V_k = V_total · (R_k / R_eq)', notes: 'In series strings, voltage divides proportionally to resistance.' },
    ],
    theoryParagraphs: [
      'Connecting resistors end-to-end (series) forces identical current through every element, stacking their resistances additively and dividing the supply voltage proportionally.',
      'Connecting resistors across shared rail nodes (parallel) exposes every branch to the full supply voltage while opening additional conduction pathways, lowering equivalent resistance and dividing total current inversely with branch resistance.',
    ],
    realWorldApplications: [
      'Resistive voltage dividers feeding analog sensor signals into microcontroller ADC pins.',
      'Household AC mains branch wiring keeping appliances independent at constant 120V/230V.',
      'Precision resistor ladder DACs (R-2R networks) converting binary words to analog voltages.',
    ],
    logColumns: ['Topology', 'V_s (V)', 'R_eq (Ω)', 'I_total (mA)', 'P_total (W)'],
  },

  'rc-circuits': {
    id: 'rc-circuits',
    flowchart: [
      { step: 1, title: 'Configure R, C & Supply V₀', detail: 'Set series resistance R (kΩ) and capacitance C (μF) to establish τ = RC.' },
      { step: 2, title: 'Toggle Charge / Discharge', detail: 'Throw the SPDT switch to Charge (connect V₀) or Discharge (short through R).' },
      { step: 3, title: 'Observe Exponential Curve', detail: 'Watch oscilloscope trace V_C(t) and I(t) cross 1τ (63.2%) through 5τ (99.3%).', condition: 'τ = R · C governs transient speed' },
      { step: 4, title: 'Log Time Constant Data', detail: 'Record τ, instantaneous V_C(t), I(t), and stored electrostatic energy ½CV².' },
    ],
    equations: [
      { name: 'RC Time Constant', expression: 'τ = R C', notes: 'Time for capacitor voltage to cover 63.2% of its remaining change.' },
      { name: 'Charging Transient', expression: 'V_C(t) = V₀ (1 − e^(−t / τ))', notes: 'Current decays exponentially as I(t) = (V₀/R) e^(−t/τ).' },
      { name: 'Stored Electrostatic Energy', expression: 'U_C = ½ C V_C²', notes: 'Energy stored inside the capacitor dielectric electric field.' },
    ],
    theoryParagraphs: [
      'Unlike purely resistive circuits that respond instantaneously, capacitors store charge Q = C V_C and oppose abrupt voltage jumps. Driving a capacitor through resistor R creates a first-order differential equation whose solution is a smooth exponential curve.',
      'At t = τ = RC during charging from zero, capacitor voltage reaches 1 − 1/e ≈ 63.2% of V₀; by t = 5τ, the transient has settled within 0.7% of final steady state.',
    ],
    realWorldApplications: [
      'Low-pass / high-pass analog RC audio filters and hardware switch debouncers.',
      'Camera xenon flash capacitor banks and defibrillator energy storage stages.',
      '555 timer oscillators and RC reset-delay supervisor circuits on digital PCBs.',
    ],
    logColumns: ['Mode', 'R (kΩ)', 'C (μF)', 'τ (ms)', 'V_C (V)'],
  },

  'electrical-measurements': {
    id: 'electrical-measurements',
    flowchart: [
      { step: 1, title: 'Select Meter Function', detail: 'Switch rotary dial between DC Ammeter, DC Voltmeter, and Ohmmeter modes.' },
      { step: 2, title: 'Set Target Full-Scale Range', detail: 'Adjust target range and inspect internal coil parameters (I_g, R_g).' },
      { step: 3, title: 'Inspect Shunt / Multiplier Network', detail: 'Observe how parallel R_sh (Ammeter) or series R_m (Voltmeter) protects the movement.', condition: 'Ammeter → Parallel R_sh  |  Voltmeter → Series R_m' },
      { step: 4, title: 'Verify Loading & Log', detail: 'Compare ideal vs actual measured reading and log internal resistance & error %.' },
    ],
    equations: [
      { name: 'Ammeter Shunt Resistance', expression: 'R_sh = (I_g R_g) / (I_max − I_g)', notes: 'Low-ohm parallel bypass carrying excess current around the moving coil.' },
      { name: 'Voltmeter Multiplier Resistance', expression: 'R_m = (V_max / I_g) − R_g', notes: 'High-ohm series resistor limiting coil current at maximum full-scale voltage.' },
    ],
    theoryParagraphs: [
      'A classic D’Arsonval moving-coil galvanometer deflects proportionally to tiny microampere/milliampere currents I_g flowing through a fine copper coil of resistance R_g. Clever external resistor networks transform this single delicate core into a multi-range multimeter.',
      'Connecting a tiny precision shunt resistor R_sh in parallel expands current capacity into Amps with minimal voltage drop, while placing a megaohm-class multiplier R_m in series converts it into a high-impedance Voltmeter that avoids loading the node under test.',
    ],
    realWorldApplications: [
      'Handheld digital and analog multimeters for field electronics diagnostics.',
      'Current-sense shunt amplifiers monitoring electric vehicle battery packs.',
      'Wheatstone and Kelvin four-wire resistance bridges eliminating lead-resistance error.',
    ],
    logColumns: ['Mode', 'Range', 'R_internal', 'Measured', 'Loading Err'],
  },

  'rlc-circuits': {
    id: 'rlc-circuits',
    flowchart: [
      { step: 1, title: 'Configure R, L, C & V_rms', detail: 'Set resistance R (Ω), inductance L (mH), and capacitance C (μF).' },
      { step: 2, title: 'Sweep AC Drive Frequency f', detail: 'Vary sinusoidal source frequency across the resonant peak f₀.' },
      { step: 3, title: 'Inspect Impedance & Phase', detail: 'Compare X_L = 2πfL against X_C = 1/(2πfC) on dual oscilloscope and phasor plots.', condition: 'At f = f₀ → X_L = X_C, Z = R, φ = 0°' },
      { step: 4, title: 'Log Resonance Sweep', detail: 'Capture f, Z, I_rms, phase angle φ, and Quality Factor Q.' },
    ],
    equations: [
      { name: 'Series RLC Impedance', expression: 'Z = √(R² + (X_L − X_C)²)', notes: 'X_L = 2πfL (leads voltage by −90° current) and X_C = 1/(2πfC).' },
      { name: 'Resonant Frequency', expression: 'f₀ = 1 / (2π √(L C))', notes: 'Frequency where inductive and capacitive reactances exactly cancel.' },
      { name: 'Phase Angle & Quality Factor', expression: 'tan φ = (X_L − X_C) / R  ·  Q = (1/R)√(L/C)', notes: 'Q governs peak sharpness and reactive voltage magnification.' },
    ],
    theoryParagraphs: [
      'In an AC series RLC loop, the inductor resists rapid current changes (voltage leads current by 90°) while the capacitor resists voltage changes (current leads voltage by 90°). Because their phase shifts are 180° opposed, their reactive voltages continuously cancel partially or completely.',
      'At the unique resonant frequency f₀ = 1/(2π√LC), energy trades seamlessly back and forth between the inductor’s magnetic field and the capacitor’s electric field. Net impedance drops to pure resistance R, maximizing loop current and locking phase angle to 0°.',
    ],
    realWorldApplications: [
      'AM/FM radio frequency tuners and bandpass RF filters isolating a single station carrier.',
      'Wireless Qi inductive charging coils tuned to resonance for maximum power transfer.',
      'Power-factor correction capacitor banks in industrial AC motor plants.',
    ],
    logColumns: ['f (Hz)', 'X_L (Ω)', 'X_C (Ω)', 'Z (Ω)', 'φ (°)'],
  },

  'wheatstone-bridge': {
    id: 'wheatstone-bridge',
    flowchart: [
      { step: 1, title: 'Set Known Ratio Arms', detail: 'Choose precision fixed arms R₁ and R₂ and unknown target resistor R_x.' },
      { step: 2, title: 'Adjust Decade Standard R₃', detail: 'Sweep calibrated variable resistor R₃ while watching the central galvanometer needle.' },
      { step: 3, title: 'Seek Null Deflection', detail: 'Tune R₃ until bridge potential V_B − V_D drops to 0.000 V and I_g = 0.', condition: 'Null when R₁ / R₂ = R₃ / R_x' },
      { step: 4, title: 'Compute & Log Unknown R_x', detail: 'Calculate R_x = R₃ (R₂ / R₁) and verify precision against actual value.' },
    ],
    equations: [
      { name: 'Bridge Null Balance', expression: 'R_x = R₃ · (R₂ / R₁)', notes: 'Exact ratio condition yielding zero current through the central detector.' },
      { name: 'Bridge Differential Voltage', expression: 'V_BD = V_s [ R₂/(R₁+R₂) − R_x/(R₃+R_x) ]', notes: 'Open-circuit bridge imbalance voltage before detector loading.' },
    ],
    theoryParagraphs: [
      'Invented by Samuel Hunter Christie and popularized by Charles Wheatstone, the bridge compares two parallel voltage dividers against each other. When both dividers share identical resistance ratios, their midpoint nodes sit at the exact same electric potential.',
      'Because balance is detected by a null (zero current) reading rather than needle deflection magnitude, measurements are immune to battery voltage sag and meter nonlinearity, enabling sub-percent resistance metrology.',
    ],
    realWorldApplications: [
      'Load-cell strain gauge scales converting micro-strain resistance shifts into weight.',
      'Platinum RTD precision industrial thermometers across chemical reactors.',
      'Automated optical/gas leak detectors sensing tiny resistance drifts.',
    ],
    logColumns: ['R₁ (Ω)', 'R₂ (Ω)', 'R₃ (Ω)', 'V_BD (mV)', 'Calc R_x (Ω)'],
  },
};
