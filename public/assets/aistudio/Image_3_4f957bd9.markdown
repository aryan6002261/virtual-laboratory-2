---
name: Synthetix Lab Portal
colors:
  surface: '#0e1321'
  surface-dim: '#0e1321'
  surface-bright: '#343948'
  surface-container-lowest: '#090e1c'
  surface-container-low: '#161b2a'
  surface-container: '#1a1f2e'
  surface-container-high: '#252a39'
  surface-container-highest: '#303444'
  on-surface: '#dee2f6'
  on-surface-variant: '#bfc7d2'
  inverse-surface: '#dee2f6'
  inverse-on-surface: '#2b303f'
  outline: '#89929b'
  outline-variant: '#3f4850'
  surface-tint: '#93ccff'
  primary: '#93ccff'
  on-primary: '#003351'
  primary-container: '#3198dc'
  on-primary-container: '#002c47'
  inverse-primary: '#006398'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#d0bcff'
  on-tertiary: '#3c0091'
  tertiary-container: '#a078ff'
  on-tertiary-container: '#340080'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d0bcff'
  on-tertiary-fixed: '#23005c'
  on-tertiary-fixed-variant: '#5516be'
  background: '#0e1321'
  on-background: '#dee2f6'
  surface-variant: '#303444'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-performance, futuristic STEM research and experimental laboratory portal. It serves advanced students, researchers, and technical educators operating precision simulations, digital telemetry consoles, and virtual lab equipment.

The aesthetic fuses **Futuristic Glassmorphism** with **Technical Instrumentation**:
- **Deep Void Surfaces:** Atmospheric slate-navy layers that replicate the focused, low-light ambiance of a quantum optical laboratory or mission control center.
- **Luminescent Discipline Accents:** Glowing, chromatic signatures representing fundamental STEM disciplines against dark field backdrops.
- **Instrument Precision:** Crisp, luminous metric readouts, linear gauges, vector schematics, and interactive control toggles designed to simulate physical workbench controls in digital space.
- **Refined Translucency:** Frosted glassmorphic panels engineered with micro-borders and localized light refraction rather than generic heavy blurs.

## Colors

The color architecture is built for strict dark-field immersion, utilizing spectral luminous accents to categorize disciplinary laboratory modules without compromising visual hierarchy:

- **Primary (`#0284c7` - Prism Cyan / Optics):** Focus states, active beam telemetry, primary simulation triggers, and precision measurement indicators.
- **Secondary (`#10b981` - Emerald Neon / Electronics & Circuitry):** Logic high nodes, signal continuity, power buses, and stable status readouts.
- **Tertiary (`#8b5cf6` - Royal Purple / Programming & Quantum Compute):** Algorithm runtimes, code syntax highlights, script triggers, and logic gates.
- **Disciplinary Accents:**
  - *Chemistry:* Synthesis Teal (`#059669`) and Molecular Violet (`#a855f7`).
  - *Electrical Engineering:* Ion Amber (`#f59e0b`).
  - *Mechanical & Kinematics:* Electric Vector Blue (`#3b82f6`).
  - *Safety & Hazard Alert:* Radiant Crimson (`#ef4444`).
- **Base & Neutral Tones:**
  - *Canvas Absolute:* Deep Dark Void (`#0a0f1d`).
  - *Surface Elevated:* Sub-orbital Slate (`#0f172a`).
  - *Surface Container:* Translucent Slate (`rgba(15, 23, 42, 0.70)`).
  - *Glass Borders / Dividers:* Ghost Luminescence (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.15)` on hover).

## Typography

The typographic hierarchy coordinates three functional type systems:

1. **Space Grotesk (Headlines & Workbench Titles):** Infuses structural, mathematical geometry with high-tech personality into section headers and lab station titles.
2. **Geist (Body & Documentation):** Delivers clean readability for experimental steps, curriculum procedures, and observational logs.
3. **JetBrains Mono (Telemetry, Schematics & Code):** Operates on instrumentation panels, sensor value readouts, coordinate systems, and integrated simulation scripts.

Labels and parameter units must always be rendered in monospaced uppercase (e.g., `FREQ: 142.80 MHz`, `STATE: RESONANT`).

## Layout & Spacing

The portal deploys a fluid 12-column engineering grid optimized for multi-pane experimental control surfaces:

- **Desktop (>= 1280px):** 12-column layout with 24px (`1.5rem`) gutters and 40px (`2.5rem`) outer margin. Enables side-by-side simulation viewports, real-time code terminals, and parameter racks.
- **Tablet (768px - 1279px):** 8-column layout. Viewport panes collapse into stacked tabbed interfaces; inspector drawers slide over the secondary workspace.
- **Mobile (< 768px):** 4-column layout with 16px (`1rem`) gutters and 20px (`1.25rem`) margins. Telemetry gauges condense to compact horizontal strips; interactive canvas viewports expand to full bleed with docked slide-up toolbars.

## Elevation & Depth

Visual hierarchy is constructed through dark surface luminance, backdrop diffusion, and optical glow states:

- **Level 0 (Canvas Base):** Deep, non-reflective background (`#0a0f1d`) overlaid with an optional micro-grid or radial coordinate pattern (`rgba(255, 255, 255, 0.02)`).
- **Level 1 (Docked Racks & Workbenches):** Dark navy slate (`rgba(15, 23, 42, 0.65)`) with `backdrop-filter: blur(16px)` and subtle outer rim border (`rgba(255, 255, 255, 0.08)`).
- **Level 2 (Active Experiment Cards & Modals):** Semi-opaque composite (`rgba(15, 23, 42, 0.85)`) with `backdrop-filter: blur(24px)`, elevated by ambient perimeter glow keyed to the active discipline color (e.g., `0 0 24px rgba(2, 132, 199, 0.15)` for Optics).
- **Level 3 (Tooltips & Floating Telemetry HUDs):** Solid contrast slate (`#1e293b`) with intense micro-rim lighting (`rgba(255, 255, 255, 0.20)`) and drop shadow (`0 12px 32px rgba(0, 0, 0, 0.6)`).

## Shapes

The interface embraces a **Soft / Precision Engineering** shape language (`roundedness: 1`):

- **Standard Containers & Cards:** `0.25rem` (4px) to `0.5rem` (8px). Maintains the crisp, disciplined architecture of scientific instrumentation and CAD interfaces.
- **Interactive Toggles & Data Tags:** `0.25rem` (4px) with chamfered or tight-radius corners. Avoids playful or overly rounded forms to retain professional analytical integrity.
- **Control Dials & Radial Meters:** Pure circular geometry (`50%` radius) reserved strictly for functional dials, oscilloscope nodes, and status indicators.

## Components

### Buttons
- **Primary / Fire Action:** Background gradient from Prism Cyan to Electric Blue (`#0284c7` to `#2563eb`), high-contrast white text, `0.25rem` radius, subtle neon halo (`box-shadow: 0 0 14px rgba(2, 132, 199, 0.35)`). Active click depresses by `1px` with increased saturation.
- **Secondary / Workbench Utility:** Transparent glass surface (`rgba(255, 255, 255, 0.04)`), `1px` solid border (`rgba(255, 255, 255, 0.12)`), text in neutral light slate. Hover elevates border to discipline accent with faint backdrop glow.
- **Monospace Code/Run Trigger:** JetBrains Mono font, dark container with active left status bar colored according to simulation state.

### Laboratory Cards & Panes
- Glassmorphic panels featuring dual-layer borders: outer 1px stroke of `rgba(255, 255, 255, 0.08)` and inner top highlight of `rgba(255, 255, 255, 0.04)`.
- Card headers feature technical subtext, module status dots (green = active runtime, amber = calibrating, violet = computing), and discipline icon badges.

### Telemetry Gauges & Switches
- **Toggle Switches:** Recessed track (`rgba(2, 6, 23, 0.8)`) with `1px` internal shadow. Switch thumb snaps into place with a vivid glow indicator corresponding to the active discipline color.
- **Rotary Dials & Sliders:** Stepped linear rail with fluorescent progress fill. Sliders display floating monospaced value chips on drag.

### Input Fields
- Dark slate recessed fill (`rgba(10, 15, 29, 0.8)`), border in `rgba(255, 255, 255, 0.1)`. Focus shifts border to Optics Cyan (`#0284c7`) with a 3px diffused outer ring (`rgba(2, 132, 199, 0.2)`). Monospaced numeric entries feature integrated step buttons and unit indicators.

### Status Chips & Lab Badges
- Semi-transparent pills (`rgba(discipline_color, 0.12)`) bounded by matching `1px` border (`rgba(discipline_color, 0.35)`). Typography set in JetBrains Mono (`label-sm`), prepended with a 6px pulsing dot.

### Specialized Schematics & Simulation Displays
- SVG schematics rendered with vector stroke width of `1.5px`. Active flow lines animate via CSS dash-offset animations.
- Oscilloscope and vector canvas frames feature crosshair tick marks at container corners (`L`-shaped registration marks) to reinforce precision instrumentation aesthetics.