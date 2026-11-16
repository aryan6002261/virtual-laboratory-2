# Virtual Science Laboratory

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faryan6002261%2Fvirtual-laboratory-2)

An interactive, browser-based STEM laboratory simulation suite featuring 38 real-time experiments across 6 scientific disciplines with interactive vector schematics, live telemetry, and 228 mastery quiz questions.

## Features

- **6 Disciplines**: Optics, Chemistry, Electrical Engineering, Electronics, Mechanics, and Computer Science.
- **38 Interactive Practicals**: Real-time canvas simulations running at 60 FPS with responsive parameter controls.
- **Interactive Vector Schematics**: Dynamic apparatus diagrams and circuit views.
- **Live Telemetry & Observation Logging**: Real-time calculations with exportable experimental trial records.
- **228 Mastery Quiz Questions**: Instant evaluation with conceptual explanations and local storage score tracking.
- **Synthesized Web Audio**: Lightweight, procedural audio cues using the native Web Audio API (zero external sound files).
- **100% Client-Side**: Fully self-contained single-page application with no backend dependencies or mandatory API keys.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Bundler**: Vite
- **Icons**: Lucide React
- **Graphics**: HTML5 2D Canvas
- **Audio**: Web Audio API
- **Deployment**: Vercel

## Deployment to Vercel

### One-Click Deploy

Click the deploy button above or connect your GitHub repository directly in [Vercel](https://vercel.com/):

1. Import this repository into Vercel.
2. Vercel automatically detects the project framework via `vercel.json` and `package.json`:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**.

## Local Development

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/aryan6002261/virtual-laboratory-2.git
cd virtual-laboratory-2

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/         # UI components, schematics, and canvas simulations
│   ├── data/               # Curriculum, quiz questions, and lab metadata
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Audio synthesis engine
│   ├── App.tsx             # Root application & routing
│   └── main.tsx            # Application entrypoint
├── vercel.json             # Vercel configuration & SPA rewrite rules
├── vite.config.ts          # Vite build configuration
└── package.json            # Scripts and dependencies
```

## License

This project is open source under the MIT License.
