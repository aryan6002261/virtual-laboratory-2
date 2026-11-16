import { ExperimentPedagogy } from '../../types/lab';

export const ELECTRONICS_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'logic-gates': {
    id: 'logic-gates',
    flowchart: [
      { step: 1, title: 'Select Digital Gate Primitive', detail: 'Choose AND, OR, NOT, NAND, NOR, XOR, or XNOR.' },
      { step: 2, title: 'Toggle Binary Inputs A & B', detail: 'Switch input lines between Logic LOW (0 V / 0) and Logic HIGH (5 V / 1).' },
      { step: 3, title: 'Trace Gate Signal Path', detail: 'Inspect glowing signal propagation and corresponding Truth Table row.', condition: 'NAND & NOR can synthesize any Boolean circuit' },
      { step: 4, title: 'Record Truth Table Row', detail: 'Log input combinations and verified Boolean output Y.' },
    ],
    equations: [
      { name: 'Boolean Primitives', expression: 'AND: A·B  |  OR: A+B  |  XOR: A⊕B', notes: 'Fundamental binary logic operators over {0, 1}.' },
      { name: "De Morgan's Theorems", expression: '¬(A·B) = ¬A + ¬B  ·  ¬(A+B) = ¬A · ¬B', notes: 'Allows seamless conversion between NAND/NOR and AND/OR topologies.' },
    ],
    theoryParagraphs: [
      'Digital electronics encodes computation using discrete voltage levels representing Boolean truth values 0 (LOW) and 1 (HIGH). Primitive logic gates built from CMOS transistor pairs implement deterministic Boolean algebra operations.',
      'NAND and NOR are functionally complete universal gates: every combinational or sequential processor block—from adders to entire ALUs—can be constructed solely by wiring NAND or NOR cells.',
    ],
    realWorldApplications: [
      'CPU Arithmetic Logic Units (ALUs) and hardware instruction decoders.',
      'Industrial safety interlocks requiring multi-sensor AND/NOR gating.',
      'Parity error-checking circuits in ECC server memory using XOR trees.',
    ],
    logColumns: ['Gate', 'Input A', 'Input B', 'Output Y', 'Expression'],
  },

  'half-adder': {
    id: 'half-adder',
    flowchart: [
      { step: 1, title: 'Choose Adder Stage', detail: 'Select 2-input Half Adder or 3-input Full Adder topology.' },
      { step: 2, title: 'Set Operand Bits', detail: 'Toggle binary inputs A, B (and C_in for Full Adder).' },
      { step: 3, title: 'Observe Gate Propagation', detail: 'Follow signals through XOR sum stage and AND/OR carry generation.', condition: '1 + 1 = 0 (Sum) with Carry = 1' },
      { step: 4, title: 'Verify Binary Sum', detail: 'Check combined 2-bit output (C_out, Sum) against arithmetic value and log.' },
    ],
    equations: [
      { name: 'Half Adder Equations', expression: 'Sum = A ⊕ B  ·  Carry = A · B', notes: 'Adds two 1-bit operands without incoming carry.' },
      { name: 'Full Adder Equations', expression: 'Sum = A ⊕ B ⊕ C_in  ·  C_out = (A·B) + C_in(A⊕B)', notes: 'Supports chaining across arbitrary N-bit ripple-carry or lookahead adders.' },
    ],
    theoryParagraphs: [
      'Binary arithmetic inside every microcontroller begins with combinational adder cells. A Half Adder adds two single bits using an XOR gate for the least-significant Sum bit and an AND gate to detect the 1+1 overflow Carry.',
      'Because multi-bit addition must incorporate the carry bit propagated from the preceding column, a Full Adder combines two Half Adders and an OR gate to accept three inputs (A, B, C_in) and output (Sum, C_out).',
    ],
    realWorldApplications: [
      '64-bit integer addition and subtraction units inside modern CPU cores.',
      'Program Counter (PC + 4) address incrementers and memory offset calculators.',
      'Digital Signal Processing (DSP) multiply-accumulate (MAC) pipelines.',
    ],
    logColumns: ['Mode', 'A', 'B', 'C_in', 'C_out Sum'],
  },

  'digital-circuits': {
    id: 'digital-circuits',
    flowchart: [
      { step: 1, title: 'Select Combinational Block', detail: 'Switch between 4:1 Multiplexer (Data Selector) and 2:4 Binary Decoder.' },
      { step: 2, title: 'Set Address / Select Lines', detail: 'Toggle S₁, S₀ (or A₁, A₀ + Enable) to specify binary channel index.' },
      { step: 3, title: 'Configure Data Inputs', detail: 'Drive D₀–D₃ lines (in MUX mode) and watch internal active routing path highlight.', condition: 'MUX: Y = D_addr  |  Decoder: Y_addr = 1' },
      { step: 4, title: 'Log Channel Output', detail: 'Record active address, routed bit or one-hot vector, and Enable state.' },
    ],
    equations: [
      { name: '4:1 Multiplexer Output', expression: 'Y = S̄₁S̄₀D₀ + S̄₁S₀D₁ + S₁S̄₀D₂ + S₁S₀D₃', notes: 'Selects one of 4 input streams onto a single shared output bus.' },
      { name: '2:4 Decoder Minterms', expression: 'Yᵢ = EN · mᵢ(A₁, A₀)', notes: 'Activates strictly one one-hot output line matching the binary address.' },
    ],
    theoryParagraphs: [
      'Multiplexers (MUX) act as high-speed solid-state rotary switches: a n-bit select code routes one of 2ⁿ parallel data channels onto a single output wire, conserving physical bus traces and implementing programmable lookup tables.',
      'Decoders perform the complementary expansion: translating an n-bit compact binary address into 2ⁿ mutually exclusive one-hot enable lines for selecting memory banks, seven-segment displays, or peripheral registers.',
    ],
    realWorldApplications: [
      'Time-division multiplexing in telecommunications and multi-channel ADC sampling.',
      'DRAM row/column address decoders and CPU register-file read/write ports.',
      'FPGA Configurable Logic Blocks (CLBs) implementing arbitrary Boolean functions via LUT MUXes.',
    ],
    logColumns: ['Block', 'Select (S₁S₀)', 'Enable', 'Inputs/Data', 'Output'],
  },

  'flip-flops': {
    id: 'flip-flops',
    flowchart: [
      { step: 1, title: 'Select Flip-Flop Type', detail: 'Choose SR, D (Data), JK, or T (Toggle) bistable sequential cell.' },
      { step: 2, title: 'Set Control Inputs', detail: 'Configure S/R, D, J/K, or T pins before the clock transition.' },
      { step: 3, title: 'Trigger Clock Pulse', detail: 'Click Rising Clock Pulse (↑ CLK) or enable Auto-Clock and watch timing waveforms update.', condition: 'Edge-triggered memory samples strictly at ↑ CLK' },
      { step: 4, title: 'Inspect State & Log', detail: 'Verify Q, Q̄, Hold/Set/Reset/Toggle transition, and invalid SR=11 guard.' },
    ],
    equations: [
      { name: 'D Flip-Flop Characteristic', expression: 'Q_next = D', notes: 'Captures input bit at active clock edge; ideal 1-bit register.' },
      { name: 'JK Flip-Flop Characteristic', expression: 'Q_next = J Q̄ + K̄ Q', notes: 'J=K=0 Holds; J=1,K=0 Sets; J=0,K=1 Resets; J=K=1 Toggles.' },
      { name: 'T Flip-Flop Characteristic', expression: 'Q_next = T ⊕ Q', notes: 'Divides input clock frequency by 2 when T = 1.' },
    ],
    theoryParagraphs: [
      'Unlike combinational gates whose outputs change immediately with inputs, sequential circuits possess memory. Cross-coupled feedback loops inside a bistable flip-flop store one stable bit (Q = 0 or Q = 1) indefinitely until commanded by a clock edge.',
      'Edge-triggered D flip-flops synchronize digital systems against timing race glitches, while JK and T flip-flops power binary counters, frequency dividers, and finite-state machine controllers.',
    ],
    realWorldApplications: [
      'CPU SRAM caches, pipeline registers, and SPI/UART serial shift registers.',
      'Hardware frequency dividers and digital wristwatch seconds counters.',
      'Button synchronizer chains preventing metastability in FPGA designs.',
    ],
    logColumns: ['Type', 'Inputs', 'Prev Q', 'CLK', 'Next Q'],
  },

  'binary-logic': {
    id: 'binary-logic',
    flowchart: [
      { step: 1, title: 'Toggle 8-Bit Register', detail: 'Click individual bit cells (b₇..b₀) to flip between 0 and 1.' },
      { step: 2, title: 'Choose Signed Interpretation', detail: "Switch between Unsigned [0..255] and Two's Complement [−128..+127]." },
      { step: 3, title: 'Inspect Multi-Radix Values', detail: 'Read synchronized Binary, Octal, Decimal, and Hexadecimal representations.', condition: "Two's Comp −X = (~X) + 1" },
      { step: 4, title: 'Test Binary Addition & Log', detail: 'Add a second operand to observe Carry-Out and Signed Overflow flags.' },
    ],
    equations: [
      { name: 'Positional Weighting', expression: 'N = ∑ bᵢ · 2ⁱ  (i = 0..7)', notes: 'Unsigned 8-bit integer range spans 0 to 255.' },
      { name: "Two's Complement Value", expression: 'N_signed = −b₇·2⁷ + ∑ bᵢ·2ⁱ  (i = 0..6)', notes: 'MSB acts as −128 weight, giving unique zero and range −128 to +127.' },
    ],
    theoryParagraphs: [
      'Because digital hardware stores information as high/low voltage states, all numbers, text, and instructions reduce to base-2 binary strings. Hexadecimal (base-16) and Octal (base-8) serve as human-friendly shorthand grouping 4 or 3 bits per digit.',
      "Two's Complement is the universal encoding for signed integers because negating a number (~X + 1) turns subtraction A − B into pure addition A + (−B) using the exact same hardware adder circuit.",
    ],
    realWorldApplications: [
      'Memory addressing, RGB hex color codes (#0284C7), and IPv4/IPv6 bitmasks.',
      'Microprocessor ALU status flags (Carry, Zero, Negative, Overflow).',
      'Embedded sensor register bit-packing and bitwise protocol framing.',
    ],
    logColumns: ['Binary (8-bit)', 'Hex', 'Octal', 'Unsigned', 'Signed'],
  },

  'diode-characteristics': {
    id: 'diode-characteristics',
    flowchart: [
      { step: 1, title: 'Select Semiconductor Material', detail: 'Choose Silicon (V_k ≈ 0.7 V), Germanium (V_k ≈ 0.3 V), or Zener (V_Z = 5.1 V).' },
      { step: 2, title: 'Sweep Bias Voltage V_D', detail: 'Slide bias from Reverse (−8 V) across 0 V into Forward Bias (+1.2 V).' },
      { step: 3, title: 'Observe Junction & I-V Curve', detail: 'Watch depletion layer shrink/widen as Shockley current turns on sharply above V_k.', condition: 'V_D ≥ V_k → Exponential Conduction' },
      { step: 4, title: 'Record Operating Point', detail: 'Log bias polarity, V_D, junction current I_D, and depletion width.' },
    ],
    equations: [
      { name: 'Shockley Diode Equation', expression: 'I_D = I_s (e^(V_D / ηV_T) − 1)', notes: 'V_T = kT/q ≈ 25.85 mV at 300 K; ideality factor η ∈ [1, 2].' },
      { name: 'Piecewise Linear Approximation', expression: 'I_D ≈ (V_s − V_k) / R_series  (for V_D > V_k)', notes: 'Practical circuit analysis treats conducting silicon diodes as a ~0.7 V drop.' },
    ],
    theoryParagraphs: [
      'Joining p-type (hole-rich) and n-type (electron-rich) silicon crystals causes carriers to diffuse across the interface, leaving behind charged immobile dopant ions that create a built-in depletion barrier (~0.7 V for Si).',
      'Applying forward bias opposes this internal field, shrinking the depletion zone and permitting exponential majority-carrier conduction once V_D exceeds the knee voltage V_k. Reverse bias widens the barrier, blocking current until Zener/avalanche breakdown occurs.',
    ],
    realWorldApplications: [
      'AC-to-DC bridge rectifiers inside power supplies and phone chargers.',
      'LED solid-state lighting, laser diodes, and photovoltaic solar cells.',
      'ESD/flyback clamping diodes and Zener voltage reference regulators.',
    ],
    logColumns: ['Diode', 'Bias (V)', 'Current (mA)', 'Depletion', 'State'],
  },

  'operational-amplifier': {
    id: 'operational-amplifier',
    flowchart: [
      { step: 1, title: 'Choose Op-Amp Topology', detail: 'Select Inverting (A_v = −R_f/R_in) or Non-Inverting (A_v = 1 + R_f/R₁) configuration.' },
      { step: 2, title: 'Tune Feedback & Input Resistors', detail: 'Adjust R_in / R₁ and R_f to set closed-loop voltage gain A_v.' },
      { step: 3, title: 'Drive AC Input & Rails', detail: 'Vary input amplitude V_in and power supply rails ±V_sat on the dual-trace oscilloscope.', condition: 'If |A_v · V_in| > V_sat → Output Clips at Rail' },
      { step: 4, title: 'Log Gain & Saturation', detail: 'Record theoretical gain, peak V_out, phase inversion, and clipping status.' },
    ],
    equations: [
      { name: 'Inverting Closed-Loop Gain', expression: 'A_v = V_out / V_in = − R_f / R_in', notes: '180° phase inversion; inverting pin held at virtual ground (0 V).' },
      { name: 'Non-Inverting Closed-Loop Gain', expression: 'A_v = V_out / V_in = 1 + (R_f / R₁)', notes: '0° phase shift (in-phase) with ultra-high input impedance.' },
    ],
    theoryParagraphs: [
      'An ideal Operational Amplifier has colossal open-loop gain (>10⁵), near-infinite input impedance, and near-zero output impedance. Wrapping an external resistor divider from output back to the inverting (−) input forces V₋ ≈ V₊.',
      'Under this negative feedback equilibrium, voltage gain depends purely on precision external resistor ratios rather than internal transistor variability, though V_out can never exceed the ±V_sat power rails.',
    ],
    realWorldApplications: [
      'Microphone preamplifiers, active audio equalizers, and ECG biomedical instrumentation amps.',
      'Analog integrators, differentiators, and active Sallen-Key low-pass filters.',
      'DAC current-to-voltage transimpedance stages in optical receivers.',
    ],
    logColumns: ['Topology', 'V_in (V)', 'Gain A_v', 'V_out Peak', 'Clipping'],
  },
};
