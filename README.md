# Sentinel

**An aesthetic, real-time uptime monitoring solution.**

Sentinel combines beautiful data visualizations with intelligent incident analysis to keep track of your services in style.

## Features

- **Incident Analysis**: Detailed insights into service disruptions.
- **Visualizations**: Stunning, real-time charts powered by Recharts.
- **Real-time Tracking**: Live status updates for all your monitors.
- **Aesthetic Design**: A warm, organic color palette with smooth Framer Motion animations.

## Project Structure

```text
sentinel/
├── components/
│   ├── AnimatedBeam.tsx
│   ├── AuthPages.tsx
│   ├── IncidentAnalysisModal.tsx
│   ├── ProfileModal.tsx
│   ├── ThresholdSettingsModal.tsx
│   └── UptimeChart.tsx
├── services/
│   └── geminiService.ts
├── App.tsx
├── index.html
├── index.tsx
├── package.json
├── tsconfig.json
├── types.ts
└── vite.config.ts
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: [React](https://react.dev) + [Vite](https://vitejs.dev)
- **Styling**: Tailwind CSS / CSS Modules
- **Icons**: Lucide React

## Getting Started

### Prerequisites

Make sure you have [Bun](https://bun.sh) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/4wadia/Up-Time-Moniter.git
   cd Up-Time-Moniter
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory and add your API keys (if applicable):
   ```env
   # Add necessary environment variables here
   ```

4. **Run the App**
   ```bash
   bun dev
   ```
