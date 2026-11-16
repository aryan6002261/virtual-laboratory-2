import { ExperimentPedagogy } from '../../types/lab';

export const OPTICS_CURRICULUM: Record<string, ExperimentPedagogy> = {
  'snells-law': {
    id: 'snells-law',
    flowchart: [
      { step: 1, title: 'Select Optical Media', detail: 'Choose upper medium index n₁ and lower medium index n₂ (e.g., Glass → Air or Air → Water).' },
      { step: 2, title: 'Set Incident Angle θ₁', detail: 'Sweep the laser pointer from 0° normal incidence toward grazing 85°.' },
      { step: 3, title: 'Evaluate Critical Condition', detail: 'Compute sin θ₂ = (n₁ / n₂) sin θ₁.', condition: 'If n₁ > n₂ and θ₁ > arcsin(n₂/n₁) → Trigger TIR' },
      { step: 4, title: 'Trace & Log Boundary Rays', detail: 'Record θ₁, θ₂, critical threshold θ_c, and reflected intensity in the observation log.' },
    ],
    equations: [
      { name: "Snell's Law of Refraction", expression: 'n₁ sin θ₁ = n₂ sin θ₂', notes: 'Relates incidence angle θ₁ and refraction angle θ₂ measured from the interface normal.' },
      { name: 'Critical Angle', expression: 'θ_c = arcsin(n₂ / n₁)  (for n₁ > n₂)', notes: 'Above θ_c, no real solution exists for θ₂ and 100% of incident energy reflects.' },
      { name: 'Phase Velocity in Medium', expression: 'v = c / n', notes: 'Optical index n is the ratio of vacuum light speed c to phase velocity v inside the medium.' },
    ],
    theoryParagraphs: [
      'When an electromagnetic wavefront crosses a smooth boundary between two dielectric media of refractive indices n₁ and n₂, its temporal frequency f remains invariant while its spatial wavelength λ = v/f scales inversely with n. Continuity of tangential electric and magnetic field phases along the interface forces the propagation vector to pivot according to Snell’s Law.',
      'When light propagates from a denser medium into a rarer medium (n₁ > n₂), the refracted ray bends away from the normal. Increasing θ₁ brings θ₂ to 90° at the critical angle θ_c; beyond θ_c, Total Internal Reflection (TIR) confines the entire optical beam inside the first medium with near-zero transmission loss.',
    ],
    realWorldApplications: [
      'Single-mode and multi-mode fiber-optic telecommunications carrying terabits per second across oceans via TIR.',
      'Medical endoscopes and laparoscopic optical bundles guiding illumination and imaging around tight anatomical bends.',
      'Prismatic binoculars, retroreflectors, and diamond faceting engineered around low critical angles.',
    ],
    logColumns: ['n₁', 'n₂', 'θ₁ (°)', 'θ₂ (°)', 'Regime'],
  },

  'thin-lenses': {
    id: 'thin-lenses',
    flowchart: [
      { step: 1, title: 'Choose Lens Geometry', detail: 'Select Converging Convex (f > 0) or Diverging Concave (f < 0) thin lens.' },
      { step: 2, title: 'Position Luminous Object', detail: 'Adjust object distance d₀ and object height h₀ along the principal optical bench.' },
      { step: 3, title: 'Trace Three Principal Rays', detail: 'Construct Parallel→Focal, Central undeviated, and Focal→Parallel rays through the thin-lens plane.' },
      { step: 4, title: 'Locate Image & Magnification', detail: 'Compute dᵢ from 1/f = 1/d₀ + 1/dᵢ and classify Real/Virtual and Upright/Inverted.', condition: 'If d₀ < f (Convex) → Virtual Upright Image' },
    ],
    equations: [
      { name: 'Gaussian Thin-Lens Equation', expression: '1 / f = 1 / d₀ + 1 / dᵢ', notes: 'Sign convention: d₀ > 0 for real object; dᵢ > 0 real (right), dᵢ < 0 virtual (left).' },
      { name: 'Lateral Magnification', expression: 'm = hᵢ / h₀ = − dᵢ / d₀', notes: 'Negative m indicates an inverted image; |m| > 1 indicates enlargement.' },
      { name: 'Optical Power (Diopters)', expression: 'P = 1 / f(meters)', notes: 'Positive diopters converge wavefronts; negative diopters diverge them.' },
    ],
    theoryParagraphs: [
      'Under the paraxial thin-lens approximation, spherical refracting surfaces deflect light rays proportionally to their height from the optical axis without introducing thickness offset. Three canonical principal rays uniquely locate the conjugate image plane for any object position.',
      'For a convex lens, objects beyond 2f form diminished inverted real images; at 2f they form unit-magnified inverted images; between f and 2f they project enlarged real images; and inside the focal length (d₀ < f) the diverging exit rays trace backward to a magnified upright virtual image.',
    ],
    realWorldApplications: [
      'Eyeglass and contact lens prescriptions correcting myopia (concave, negative diopters) and hyperopia (convex).',
      'Compound optical microscopes, Keplerian astronomical telescopes, and multi-element DSLR camera objectives.',
      'Laser beam expanders and fiber-coupling collimators.',
    ],
    logColumns: ['Type', 'f (cm)', 'd₀ (cm)', 'dᵢ (cm)', 'Mag (m)'],
  },

  'double-slit': {
    id: 'double-slit',
    flowchart: [
      { step: 1, title: 'Tune Laser Wavelength λ', detail: 'Sweep monochromatic wavelength across the visible spectrum (380 nm – 740 nm).' },
      { step: 2, title: 'Adjust Slit Pitch & Screen', detail: 'Set slit separation d (mm) and detector screen distance L (m).' },
      { step: 3, title: 'Compute Path Difference', detail: 'Evaluate Δr = d sin θ across screen elevation y.' },
      { step: 4, title: 'Map Intensity Fringes', detail: 'Plot I(y) = I₀ cos²(π d y / λL) and log fringe spacing Δx.', condition: 'Δr = mλ → Bright  |  Δr = (m+½)λ → Dark' },
    ],
    equations: [
      { name: 'Constructive Maxima Position', expression: 'y_m = m λ L / d', notes: 'Integer order m = 0, ±1, ±2... marks peak intensity fringes.' },
      { name: 'Fringe Spacing', expression: 'Δx = λ L / d', notes: 'Uniform spacing between adjacent bright fringes in the small-angle regime.' },
      { name: 'Interference Intensity Profile', expression: 'I(θ) = I₀ cos²(π d sin θ / λ)', notes: 'Pure double-slit cosine-squared irradiance modulation.' },
    ],
    theoryParagraphs: [
      'Thomas Young’s 1801 double-slit experiment provided decisive proof of the wave nature of light. When a coherent planar wavefront illuminates two narrow parallel slits, Huygens’ principle treats each slit as an in-phase cylindrical secondary source.',
      'At any screen point y, waves from the two slits travel slightly different distances Δr ≈ d(y/L). Whenever Δr equals an integer multiple of λ, electric field amplitudes add constructively (4× single-slit intensity); when Δr is a half-integer multiple of λ, they cancel completely.',
    ],
    realWorldApplications: [
      'Michelson and LIGO laser interferometers detecting sub-proton gravitational wave strain.',
      'Optical coherence tomography (OCT) for non-invasive retinal cross-section imaging.',
      'Radio-astronomy phased-array interferometry synthesizing Earth-sized telescope apertures.',
    ],
    logColumns: ['λ (nm)', 'd (mm)', 'L (m)', 'Δx (mm)', '1st Max θ'],
  },

  'prism-dispersion': {
    id: 'prism-dispersion',
    flowchart: [
      { step: 1, title: 'Select Glass & Apex Angle', detail: 'Choose Crown, Flint, or Fused Silica dispersion constants and prism angle A.' },
      { step: 2, title: 'Aim Incident Beam', detail: 'Set incidence angle i₁ onto the left prism face (monochromatic or broadband white).' },
      { step: 3, title: 'Apply Double Snell Refraction', detail: 'Compute spectral indices n(λ) = A_c + B_c/λ² and refract at both entry and exit faces.' },
      { step: 4, title: 'Measure Angular Spread', detail: 'Record total deviation δ and chromatic angular separation Δδ = δ_violet − δ_red.', condition: 'If r₂ > θ_c → Internal Exit TIR' },
    ],
    equations: [
      { name: "Cauchy's Dispersion Equation", expression: 'n(λ) = A + B / λ²', notes: 'Empirical dispersion model showing higher refractive index for shorter wavelengths.' },
      { name: 'Total Prism Deviation', expression: 'δ = i₁ + i₂ − A', notes: 'Net angular deflection between entering and emerging rays.' },
      { name: 'Minimum Deviation Relation', expression: 'n = sin((A + δ_min)/2) / sin(A/2)', notes: 'Occurs when the internal ray travels symmetrically parallel to the prism base.' },
    ],
    theoryParagraphs: [
      'Because bound electrons in optical glass have resonant ultraviolet absorption frequencies, light at shorter visible wavelengths (blue/violet) interacts more strongly with the atomic dipole oscillators than red light. This slows violet phase velocity further, increasing n(λ).',
      'As polychromatic white light traverses a triangular prism, both entry and exit refractions deflect shorter wavelengths through steeper angles, fanning the beam into a continuous visible spectrum.',
    ],
    realWorldApplications: [
      'Achromatic doublet camera lenses pairing Crown and Flint glass to cancel chromatic aberration.',
      'Ultrafast femtosecond laser pulse compressors using prism pairs for group-delay dispersion compensation.',
      'Analytical prism spectrophotometers and gemstone refractometers.',
    ],
    logColumns: ['Glass', 'Apex A (°)', 'Incidence i₁ (°)', 'δ_red (°)', 'δ_violet (°)'],
  },

  'diffraction-grating': {
    id: 'diffraction-grating',
    flowchart: [
      { step: 1, title: 'Select Emission Lamp', detail: 'Pick atomic gas source (Hydrogen, Helium, Sodium, Mercury, or Continuous White).' },
      { step: 2, title: 'Configure Grating Ruling', detail: 'Adjust groove density (lines/mm) to set grating pitch d.' },
      { step: 3, title: 'Solve Grating Orders', detail: 'Evaluate sin θ = mλ / d for orders m = 0, ±1, ±2 while |sin θ| ≤ 1.' },
      { step: 4, title: 'Inspect Spectrometer Arc', detail: 'Verify discrete emission line angles and resolving power R = mN.', condition: 'm = 0 transmits all λ undeviated (white)' },
    ],
    equations: [
      { name: 'Diffraction Grating Equation', expression: 'd sin θ_m = m λ', notes: 'Condition for sharp principal maxima across N periodic rulings.' },
      { name: 'Angular Dispersion', expression: 'dθ / dλ = m / (d cos θ)', notes: 'Higher diffraction orders and finer rulings spread spectral lines wider apart.' },
      { name: 'Chromatic Resolving Power', expression: 'R = λ / Δλ = m N', notes: 'Proportional to order m times total illuminated grooves N.' },
    ],
    theoryParagraphs: [
      'A transmission diffraction grating replaces two slits with thousands of uniformly spaced micro-grooves separated by pitch d. Constructive interference occurs at identical angles θ_m = arcsin(mλ/d) as a double slit, but interference across N slits narrows each peak width by 1/N.',
      'When viewing excited low-pressure atomic vapor lamps, only quantized emission wavelengths satisfy the element’s atomic energy differences ΔE = hc/λ, creating razor-sharp spectral fingerprints used in astrophysics and analytical chemistry.',
    ],
    realWorldApplications: [
      'Astronomical spectrographs measuring stellar elemental composition and cosmological redshift.',
      'Wavelength-division multiplexing (WDM) optical demultiplexers in fiber networks.',
      'UV-Vis laboratory spectrophotometers and Raman spectrometers.',
    ],
    logColumns: ['Source', 'Lines/mm', 'Pitch d (nm)', 'Order m', 'Dominant θ (°)'],
  },
};
