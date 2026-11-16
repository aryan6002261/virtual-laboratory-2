import { ExperimentPedagogy } from '../../types/lab';

export const MECHANICAL_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'projectile-motion': {
    id: 'projectile-motion',
    flowchart: [
      { step: 1, title: 'Configure Cannon Parameters', detail: 'Set launch speed v₀ (m/s), elevation angle θ (°), and gravity g.' },
      { step: 2, title: 'Toggle Aerodynamic Drag', detail: 'Compare ideal vacuum parabola against realistic quadratic air resistance.' },
      { step: 3, title: 'Fire & Trace Flight Vectors', detail: 'Observe independent horizontal v_x and gravity-accelerated vertical v_y components.', condition: 'Max level-ground range occurs at θ = 45° (no drag)' },
      { step: 4, title: 'Log Range & Apex Height', detail: 'Record θ, v₀, peak height H, horizontal range R, and flight duration T.' },
    ],
    equations: [
      { name: 'Horizontal Range (Level)', expression: 'R = (v₀² sin 2θ) / g', notes: 'Symmetric complementary angles θ and 90°−θ yield identical vacuum range.' },
      { name: 'Maximum Apex Height', expression: 'H = (v₀² sin²θ) / (2g)', notes: 'Occurs when vertical velocity crosses v_y = 0 at t = v₀ sin θ / g.' },
      { name: 'Total Flight Time', expression: 'T = (2 v₀ sin θ) / g', notes: 'Depends strictly on initial vertical velocity v₀ sin θ.' },
    ],
    theoryParagraphs: [
      'Galileo’s principle of independence of orthogonal motions states that in uniform gravity without drag, horizontal motion proceeds at constant velocity v_x = v₀ cos θ while vertical motion experiences constant downward acceleration −g.',
      'Combining x(t) and y(t) eliminates time t to reveal a symmetric parabolic trajectory. Enabling quadratic air drag introduces velocity-coupled deceleration along both axes, shortening range and steepening the descent.',
    ],
    realWorldApplications: [
      'Orbital launch pitch profiles, artillery ballistics, and firefighting water-stream targeting.',
      'Sports biomechanics optimizing basketball free-throw, javelin, and golf launch angles.',
      'Automated warehouse parcel-chute and fountain nozzle trajectory engineering.',
    ],
    logColumns: ['v₀ (m/s)', 'θ (°)', 'Drag', 'Height H (m)', 'Range R (m)'],
  },

  'newtons-laws': {
    id: 'newtons-laws',
    flowchart: [
      { step: 1, title: 'Set Cart Mass & Applied Force', detail: 'Configure mass m (kg) and horizontal thrust F_app (N).' },
      { step: 2, title: 'Adjust Kinetic Friction μ_k', detail: 'Dial surface friction from 0.00 (ice/air-track) up to 0.50 (rough wood).' },
      { step: 3, title: 'Inspect Free-Body Vectors', detail: 'Compare Weight mg, Normal N, Thrust F_app, and Friction f_k during live acceleration.', condition: 'a = (F_app − f_k) / m  when F_app > f_k' },
      { step: 4, title: 'Record Kinematics Trial', detail: 'Log F_net, acceleration a, instantaneous velocity v, and displacement x.' },
    ],
    equations: [
      { name: "Newton's Second Law", expression: 'F_net = ∑ F = m a', notes: 'Acceleration vector points strictly along net unbalanced force.' },
      { name: "Newton's Third Law", expression: 'F_AB = − F_BA', notes: 'Interaction pairs act with equal magnitude and opposite direction on two distinct bodies.' },
    ],
    theoryParagraphs: [
      'Isaac Newton unified terrestrial and celestial mechanics in three axioms: inertia preserves constant velocity when F_net = 0; net force scales proportionally with mass times acceleration (F_net = ma); and forces always arise as equal-and-opposite mutual interaction pairs.',
      'Constructing a Free-Body Diagram (FBD) isolates a single object and resolves every contact and field force along orthogonal axes so net acceleration can be solved unambiguously.',
    ],
    realWorldApplications: [
      'Automotive crash-test impulse modeling, airbag deployment, and traction control.',
      'Rocket thrust-to-weight staging calculations and elevator counterweight design.',
      'Robotic industrial actuator torque sizing for precision pick-and-place arms.',
    ],
    logColumns: ['Mass (kg)', 'F_app (N)', 'Friction (N)', 'F_net (N)', 'a (m/s²)'],
  },

  'friction': {
    id: 'friction',
    flowchart: [
      { step: 1, title: 'Set Friction Coefficients', detail: 'Configure static μ_s and kinetic μ_k (with μ_k ≤ μ_s) and block mass m.' },
      { step: 2, title: 'Tilt Incline Angle θ', detail: 'Slowly raise ramp angle from 0° upward while monitoring down-slope pull mg sin θ.' },
      { step: 3, title: 'Cross Angle of Repose θ_c', detail: 'Observe the exact breakaway threshold where mg sin θ > μ_s mg cos θ.', condition: 'θ_c = arctan(μ_s) triggers sliding' },
      { step: 4, title: 'Log Static vs Sliding Dynamics', detail: 'Record ramp angle, Normal force N, friction force, and down-slope acceleration a.' },
    ],
    equations: [
      { name: 'Static Friction Bound', expression: 'f_s ≤ μ_s N = μ_s m g cos θ', notes: 'Self-adjusting force opposing incipient slip up to threshold μ_s N.' },
      { name: 'Angle of Repose', expression: 'tan θ_c = μ_s  ⟹  θ_c = arctan(μ_s)', notes: 'Critical slip angle is completely independent of block mass m.' },
      { name: 'Sliding Acceleration', expression: 'a = g (sin θ − μ_k cos θ)', notes: 'Applies once breakaway transitions from static to kinetic friction.' },
    ],
    theoryParagraphs: [
      'Tilting an inclined plane splits gravitational weight mg into a parallel down-slope component (mg sin θ) and a perpendicular normal component (mg cos θ). Below the critical angle of repose θ_c = arctan(μ_s), static friction matches mg sin θ identically and holds the block motionless.',
      'Once θ exceeds θ_c, surface micro-welds shear and friction drops to the lower kinetic value μ_k N, producing sustained down-slope acceleration.',
    ],
    realWorldApplications: [
      'Geotechnical landslide stability and grain-silo hopper angle of repose engineering.',
      'Roadway superelevation banking and anti-lock braking (ABS) preserving static tire grip.',
      'Conveyor chute tilt calibration in automated sorting warehouses.',
    ],
    logColumns: ['Angle θ (°)', 'θ_c (°)', 'N (N)', 'f (N)', 'a (m/s²)'],
  },

  'simple-pendulum': {
    id: 'simple-pendulum',
    flowchart: [
      { step: 1, title: 'Select Length L & Gravity g', detail: 'Set pendulum string length L (m) and choose Earth, Moon, Mars, or Jupiter gravity.' },
      { step: 2, title: 'Set Initial Angle & Damping', detail: 'Pull bob to release angle θ₀ and toggle optional air damping.' },
      { step: 3, title: 'Observe Swing & Phase Space', detail: 'Watch real-time harmonic arc alongside live (θ, ω) phase-space trajectory.', condition: 'Period T = 2π√(L/g) is independent of bob mass' },
      { step: 4, title: 'Verify Isochronism & Log', detail: 'Record L, g, theoretical period T, and peak angular velocity ω_max.' },
    ],
    equations: [
      { name: 'Small-Angle Pendulum Period', expression: 'T = 2π √(L / g)', notes: 'Valid within ~1% for release angles θ₀ ≤ 15°.' },
      { name: 'Exact Equation of Motion', expression: 'd²θ/dt² + (g/L) sin θ + b(dθ/dt) = 0', notes: 'Solved numerically via 4th-order Runge-Kutta (RK4) in the simulator.' },
    ],
    theoryParagraphs: [
      'For small angular displacements where sin θ ≈ θ (radians), the tangential restoring component −mg sin θ pulls proportionally to arc displacement s = Lθ, creating Simple Harmonic Motion whose period depends solely on length L and local gravitational acceleration g.',
      'Inspecting the Phase Space portrait (angular speed ω vs angle θ) reveals a closed energy-conserving ellipse when undamped, or an inward-decaying spiral when viscous air damping dissipates mechanical energy.',
    ],
    realWorldApplications: [
      'Foucault pendulums demonstrating Earth’s axial rotation and gravimeters mapping subsurface density.',
      'Precision mechanical escapement clocks and tuned-mass dampers stabilizing skyscrapers (e.g., Taipei 101).',
      'Seismometer inertial reference pendulums.',
    ],
    logColumns: ['Length L (m)', 'g (m/s²)', 'θ₀ (°)', 'Period T (s)', 'ω_max (rad/s)'],
  },

  'work-energy': {
    id: 'work-energy',
    flowchart: [
      { step: 1, title: 'Pick Roller-Coaster Profile', detail: 'Select Parabolic Valley, Double-Hill Loop, or Ski-Jump track geometry.' },
      { step: 2, title: 'Set Start Height & Friction', detail: 'Choose initial release height h₀ and toggle friction damping.' },
      { step: 3, title: 'Watch Energy Exchange Bars', detail: 'Track live Potential (U = mgh), Kinetic (K = ½mv²), and Thermal (E_th) bars.', condition: 'No friction → K + U = Constant Total Energy' },
      { step: 4, title: 'Log Conservation Data', detail: 'Record elevation h, speed v = √(2gΔh), K, U, and total energy.' },
    ],
    equations: [
      { name: 'Mechanical Energy Conservation', expression: 'E_mech = m g h + ½ m v² = const', notes: 'Holds strictly whenever only conservative forces (gravity/springs) do net work.' },
      { name: 'Work-Energy Theorem', expression: 'W_nc = ΔK + ΔU = − E_thermal', notes: 'Non-conservative friction drains mechanical energy into heat.' },
    ],
    theoryParagraphs: [
      'Energy conservation converts complex curved-path kinematics into effortless scalar bookkeeping. Because gravity is a conservative force, the speed gained dropping through vertical elevation Δh depends strictly on Δh rather than the shape of the track.',
      'At peaks, energy is stored as gravitational potential U = mgh; at valleys, U converts cleanly into kinetic energy K = ½mv². Friction steadily converts mechanical energy into thermal energy while keeping total universe energy conserved.',
    ],
    realWorldApplications: [
      'Pumped-storage hydroelectric power plants and regenerative EV braking recovery.',
      'Roller-coaster launch hills and safety block-brake deceleration zones.',
      'Orbital slingshot gravity-assist trajectories and pendulum kinetic batteries.',
    ],
    logColumns: ['Track', 'Height h (m)', 'Speed v (m/s)', 'U (J)', 'K (J)'],
  },

  'hookes-law': {
    id: 'hookes-law',
    flowchart: [
      { step: 1, title: 'Tune Stiffness k & Mass m', detail: 'Adjust spring constant k (N/m) and suspended/attached block mass m (kg).' },
      { step: 2, title: 'Displace Spring from Equilibrium', detail: 'Pull or compress spring to initial amplitude x₀ and release.' },
      { step: 3, title: 'Observe SHM & Energy Parabola', detail: 'Inspect restoring vector F = −kx alongside live parabolic U_s = ½kx² plot.', condition: 'T = 2π√(m/k)  |  Max force at extremes ±A' },
      { step: 4, title: 'Record Spring Telemetry', detail: 'Log k, displacement x, restoring force F, and elastic potential energy U_s.' },
    ],
    equations: [
      { name: "Hooke's Restoring Law", expression: 'F = − k x', notes: 'Restoring force acts opposite to displacement x within the elastic limit.' },
      { name: 'Elastic Potential Energy', expression: 'U_s = ½ k x²', notes: 'Area under the linear F-vs-x triangle equals stored spring energy.' },
      { name: 'Natural Frequency & Period', expression: 'T = 2π √(m / k)  ·  ω₀ = √(k / m)', notes: 'Stiffer springs oscillate faster; heavier masses oscillate slower.' },
    ],
    theoryParagraphs: [
      'Within a material’s linear elastic regime, Robert Hooke discovered that deformation stretch x is strictly proportional to applied load, creating a linear restoring force F = −kx.',
      'Coupled to an inertial mass m, this linear force generates sinusoidal Simple Harmonic Motion at natural angular frequency ω₀ = √(k/m), trading kinetic energy at equilibrium x = 0 for elastic potential energy ½kx² at the turnaround extremes.',
    ],
    realWorldApplications: [
      'Automotive coilover suspension struts and seismic base-isolation springs.',
      'MEMS smartphone accelerometers measuring micro-cantilever spring deflection.',
      'Atomic Force Microscope (AFM) cantilevers probing single molecules via Hooke stiffness.',
    ],
    logColumns: ['k (N/m)', 'm (kg)', 'x (m)', 'Force F (N)', 'U_s (J)'],
  },

  'collisions': {
    id: 'collisions',
    flowchart: [
      { step: 1, title: 'Configure Cart Masses & Velocities', detail: 'Set m₁, initial v₁ and m₂, initial v₂ on the frictionless 1D air track.' },
      { step: 2, title: 'Set Elasticity (Restitution e)', detail: 'Slide e from 0.00 (Perfectly Inelastic stick) to 1.00 (Perfectly Elastic bounce).' },
      { step: 3, title: 'Run Collision Impact', detail: 'Launch carts and observe post-collision velocities and momentum bars.', condition: 'Total Momentum p₁ + p₂ conserved for ALL e' },
      { step: 4, title: 'Compare Kinetic Energy Loss', detail: 'Verify Δp = 0 and inspect % KE retained vs e in observation log.' },
    ],
    equations: [
      { name: 'Momentum Conservation', expression: "m₁ v₁ + m₂ v₂ = m₁ v₁' + m₂ v₂'", notes: 'Holds universally for all isolated collisions regardless of elasticity.' },
      { name: 'Coefficient of Restitution', expression: "e = (v₂' − v₁') / (v₁ − v₂)", notes: 'e = 1 (elastic, ΔK = 0); e = 0 (perfectly inelastic, carts lock together).' },
    ],
    theoryParagraphs: [
      'During a brief collision between two carts, internal contact forces act in equal and opposite Newton’s-Third-Law pairs over identical impact duration Δt, guaranteeing exact zero change in total linear momentum P = m₁v₁ + m₂v₂.',
      'Kinetic energy, however, is conserved only when e = 1 (elastic spring/magnetic bumpers). For inelastic impacts (e < 1), part of the relative kinetic energy dissipates into sound, heat, and plastic deformation—reaching maximum allowable loss at e = 0 when carts coalesce.',
    ],
    realWorldApplications: [
      'Vehicle crumple-zone safety engineering maximizing impact duration Δt and inelastic energy absorption.',
      'Particle accelerator collider kinematics and billiard/cue-ball scattering physics.',
      'Railway coupler shock absorbers and spacecraft docking mechanism dampers.',
    ],
    logColumns: ['e', 'm₁ / m₂', 'v₁, v₂ (m/s)', "v₁', v₂' (m/s)", 'KE Retained %'],
  },
};
