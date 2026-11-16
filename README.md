# Virtual Science Laboratory

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faryan6002261%2Fvirtual-laboratory-2)

An interactive, browser-based STEM laboratory simulation and scientific inquiry platform featuring **38 comprehensive experiments** across 6 scientific disciplines, 5 open-ended sandbox environments, dynamic graph plotting with linear regression, statistical error analysis, voice-guided instructions, an AI lab tutor, and local student progress tracking with verifiable completion certificates.

---

## 🌟 Key Highlights & Features

### 🔬 38 Interactive Laboratory Practicals
- **6 Disciplines**: Optics, Chemistry, Electrical Engineering, Electronics, Mechanics, and Computer Science.
- **Difficulty Tiers**: Clearly categorized as **Beginner**, **Intermediate**, or **Advanced** for scaffolded learning.
- **60 FPS Real-Time Canvas Physics**: Smooth interactive simulations responding dynamically to parameter modifications.
- **Analytical Formulas & Derivations**: Complete mathematical models, variable definitions, and SI units for every experiment.
- **Precautions & Common Errors**: Real-world laboratory safety procedures and analytical error diagnostics.
- **Real-World Applications**: Engineering, industrial, and clinical contexts connecting theory to practice.

### 🧪 5 Interactive Free-Form Sandboxes
- **⚡ Circuit Builder Sandbox**: Drag-and-place DC circuit simulator with batteries, resistors, light bulbs, capacitors, switches, ammeters, and voltmeters with an analytical nodal solver.
- **🔭 Optical Bench Sandbox**: Laser emitters, convex/concave lenses, planar/curved mirrors, and refractive prisms with real-time ray tracing and focal point calculations.
- **⚗️ Chemistry Reaction Sandbox**: Interactive beaker station to mix acids, bases, indicators (phenolphthalein, universal, bromothymol blue), and metal salts over a Bunsen burner with real-time pH and color changes.
- **🪐 Kinematics & Physics Playground**: 2D projectile and ballistics launcher with planetary gravity presets (Earth $9.81\,\text{m/s}^2$, Moon $1.62\,\text{m/s}^2$, Mars $3.71\,\text{m/s}^2$, Jupiter $24.79\,\text{m/s}^2$, Zero-G) and air drag.
- **💻 Algorithm & Data Structures Visualizer**: Interactive sorting algorithm step-throughs and dynamic Binary Search Tree (BST) visual node insertion and traversal.

### 📊 Scientific Data Analysis & Telemetry Suite
- **📈 Dynamic Graph Plotter**: 2D canvas scatter and line plotting with automated linear regression ($y = mx + c$), slope calculation, $y$-intercept, and $R^2$ coefficient of determination.
- **⚖️ Multi-Trial Comparator**: Side-by-side comparison across multiple experimental runs with absolute difference ($\Delta$) and percentage variance calculations.
- **📐 Uncertainty & Error Analysis**: Rigorous statistical calculations including Mean ($\bar{x}$), Sample Standard Deviation ($s$), Standard Error of the Mean ($\text{SE}$), Coefficient of Variation ($\text{CV}\%$), and Percentage Error against theoretical literature values.
- **💾 Save & Load Sessions**: Save snapshots to browser local storage presets or export/import portable `.json` experiment session files.
- **📥 Multi-Format Data Export**: Export observation tables instantly to CSV, Microsoft Excel (`.xls`), or TSV.
- **📓 Virtual Lab Notebook**: Record observations, calculate values, add custom notes, and export formatted Markdown records.
- **📄 Printable Lab Manuals**: Formatted academic lab protocol with `@media print` styling for clean, 1-click browser "Print to PDF".

### 🎓 Student Progress & Gamification
- **👤 Local Student Profile**: Browser-persisted profile tracking total experiments completed, trials conducted, quiz accuracy, and discipline-specific mastery bars.
- **🏆 Unlockable Badges**: 8 achievements including *First Observation*, *Century Observer*, *Circuit Master*, *Quantum Optician*, *Lab Scholar*, and *Master Scientist*.
- **📜 Verified Completion Certificate**: High-resolution 1200×840px HTML5 Canvas certificate renderer with student name, date, verification code, gold seal, and 1-click PNG download or direct printing.

### 🤖 Intelligent Learning Tools & Accessibility
- **🧠 In-App AI Lab Assistant**: Context-aware science tutor providing hints, theoretical explanations, safety advice, and troubleshooting guidance.
- **💡 Progressive Hint System**: Multi-stage hints for all 228 mastery quiz questions without spoiling answers immediately.
- **🔀 Randomized Quizzes**: Option shuffling and question randomization for robust knowledge validation.
- **🎯 Practice Mode Toggle**: Leaderboard-free mode with unlimited retries and risk-free experimentation.
- **🔊 Voice-Guided Instructions**: Native Web Speech API step-by-step narration with synchronized active-step highlights.
- **📖 Scientific Glossary**: 100+ searchable definitions, mathematical equations, and SI units across all disciplines.
- **🌓 Dark / Light Mode Toggle**: Seamless theme switching with high-contrast scientific color palettes.
- **📱 Responsive & Mobile-Friendly**: Touch-optimized range sliders, collapsible sidebars, and fluid layouts for tablets and phones.

---

## 🛠️ Tech Stack

- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS Variables (Dark & Light themes)
- **Bundler**: Vite
- **Icons**: Lucide React
- **Graphics**: HTML5 2D Canvas (60 FPS interactive physics, optics, ray tracing, graph plotting, certificate rendering)
- **Audio**: Web Audio API (procedural synthesis) & Web Speech API (voice narration)
- **Persistence**: LocalStorage API & JSON file export/import (100% private, client-side)
- **Deployment**: Vercel

---

## 🚀 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faryan6002261%2Fvirtual-laboratory-2)

1. Import this repository into [Vercel](https://vercel.com/).
2. Vercel automatically detects the configuration via `vercel.json` and `pnpm-lock.yaml` / `package.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build` or `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**.

---

## 💻 Local Development

### Prerequisites

- Node.js (v18+)
- npm, pnpm, or yarn

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/aryan6002261/virtual-laboratory-2.git
cd virtual-laboratory-2

# 2. Install dependencies
pnpm install
# or: npm install

# 3. Start development server
pnpm run dev
# or: npm run dev

# 4. Build for production
pnpm run build
# or: npm run build

# 5. Type-check & lint
pnpm run lint
# or: npx tsc --noEmit
```

---

## 📁 Project Structure

```text
├── public/                     # Static icons and assets
├── src/
│   ├── components/             # Core UI, simulations, and lab tools
│   │   ├── sandboxes/          # Free-form exploratory sandboxes
│   │   │   ├── CircuitBuilderSandbox.tsx   # Interactive DC circuit breadboard
│   │   │   ├── OpticsSandbox.tsx           # Optical ray tracing bench
│   │   │   ├── ChemistrySandbox.tsx        # Beaker reaction & burner station
│   │   │   ├── PhysicsSandbox.tsx          # Kinematics & gravity ballistics
│   │   │   ├── ProgrammingSandbox.tsx      # Array sort & BST visualizer
│   │   │   └── SandboxView.tsx             # Sandbox router & tab interface
│   │   ├── AIAssistantDrawer.tsx           # Context-aware AI lab tutor
│   │   ├── CertificateModal.tsx            # HTML5 Canvas certificate generator
│   │   ├── DataAnalysisPlotter.tsx         # Canvas graph plotter & linear regression
│   │   ├── FormulaSheetModal.tsx           # Mathematical formula reference sheet
│   │   ├── GlossaryModal.tsx               # Scientific glossary search dialog
│   │   ├── LabManualModal.tsx              # Printable academic lab protocols (Print to PDF)
│   │   ├── LabNotebookModal.tsx            # Observation notes & Markdown export
│   │   ├── SaveLoadSessionModal.tsx        # Preset & JSON session manager
│   │   ├── StudentProgressModal.tsx        # Student portfolio, badges & statistics
│   │   ├── TrialComparator.tsx             # Multi-trial differential analysis
│   │   ├── UncertaintyAnalysisModal.tsx    # Statistical error analysis & variance
│   │   ├── QuizSuite.tsx                   # Randomized quiz with progressive hints
│   │   ├── PracticalWorkbench.tsx          # Master experiment workbench & controls
│   │   ├── PortalHub.tsx                   # Filterable curriculum explorer
│   │   └── TopBar.tsx                      # Header with theme toggle & global modals
│   ├── data/
│   │   ├── labs.ts                         # 38 experiments with metadata, formulas, precautions
│   │   └── glossary.ts                     # 100+ scientific terms, definitions, and SI units
│   ├── types/
│   │   └── lab.ts                          # Comprehensive TypeScript type definitions
│   ├── utils/
│   │   ├── audio.ts                        # Web Audio API procedural sound engine
│   │   ├── speech.ts                       # Web Speech API narration controller
│   │   └── studentProfile.ts               # LocalStorage student tracking & badge engine
│   ├── App.tsx                             # App shell, routing & theme synchronization
│   ├── main.tsx                            # React root mount
│   └── index.css                           # Tailwind CSS v4 & theme definitions
├── vercel.json                         # Vercel SPA routing and header configuration
├── vite.config.ts                      # Optimized Vite build configuration
├── pnpm-lock.yaml                      # Deterministic package lockfile
└── package.json                        # Project metadata and dependencies
```

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
