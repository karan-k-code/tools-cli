# 💻 Interactive CLI Companion (Tools CLI)

[![Vite Build](https://img.shields.io/badge/Vite-v5.0+-purple.svg?style=flat-square)](https://vite.dev)
[![React](https://img.shields.io/badge/React-v19.0+-blue.svg?style=flat-square)](https://react.dev)
[![Open Source](https://img.shields.io/badge/Open%20Source-Initiative-gradient.svg?style=flat-square)](#open-source-initiative)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

An interactive, high-fidelity developer dashboard designed to help master advanced command line interface (CLI) engines. Configure parameters, preview auto-generated commands, inspect syntax breakdowns, and run simulated shell outputs directly in a sleek, glassmorphic dark-theme browser interface.

---

## 🚀 Supported CLI Engines

The companion currently includes deep configurations, lifecycles, and interactive builders for:

* **Version Control (Git)**: Branching, staging, stashing, and commit rollbacks.
* **Local AI (Ollama)**: Local model pulls, metadata checks, and system prompt parameters.
* **Media Rendering (FFmpeg)**: Video compression (CRF), audio extractions, and resolution crops.
* **Web Scraping (yt-dlp)**: High-speed video, playlist, subtitles, and trimmed segment downloads.
* **Virtual Environments (Python & Pip)**: Environment setups, requirement compiles, and package installs.
* **Package Managers (Node & NPM)**: Dependency resolves, script runs, and `npx` setups.
* **CLI Utilities (jq, ripgrep, curl, docker, tmux)**: Stream processing, HTTP testing, containerization, and terminal multiplexing.
* **Server Deployments (Vercel CLI)**: Project links, preview & production deployments, secrets binding, and rollbacks.

---

## 🎨 Core Features

1. **Interactive Command Generator**: Select goals and tweak variables using text inputs, toggles, and selectors. The command updates dynamically in real-time.
2. **Flags / Arguments Breakdown**: Clickable breakdown sections explaining what each option and flag in the generated command does.
3. **Shell Console Simulator**: Run commands directly in a simulated terminal environment to view mock progress logs and output outputs.
4. **Knowledge Quiz**: Challenge your terminal syntax knowledge with a 5-question mock certification test interface.
5. **Favorites / Bookmark Drawer**: Locally save frequently used config commands into a persistent localStorage favorites list.
6. **Insecure Context Copy Fallback**: Uses a fallback textarea copy utility supporting local area network IP addresses (e.g. `http://10.23.126.23:3000/`) where standard `navigator.clipboard` is blocked by browsers.

---

## 📂 Project Structure

The project has been refactored into a highly clean, modular React component architecture:

```text
src/
├── App.jsx                 # Main entry app layout, routing hooks, and global state
├── App.css                 # Base container styling definitions
├── index.css               # Core CSS variables, color tokens, and animations
├── main.jsx                # DOM mounting entry script
├── components/             # Reusable UI Components
│   ├── Sidebar.jsx         # Sidebar navigation, searches, and category toggles
│   ├── Sidebar.css         # Sidebar component styling
│   ├── DashboardHome.jsx   # Home screen landing grids, statistics, and favorites drawer
│   ├── DashboardHome.css   # Home screen component styling
│   ├── ToolDetail.jsx      # Active builder configurations, flowchart concept map, and cheatsheet lists
│   ├── ToolDetail.css      # Active builder component styling
│   ├── Console.jsx         # Simulated terminal shell screen
│   ├── Console.css         # Console component styling
│   ├── Quiz.jsx            # Interactive syntax test engine
│   ├── Quiz.css            # Quiz component styling
│   └── icons.jsx           # SVG wrappers for non-standard symbols (e.g. GithubIcon)
└── data/
    └── toolsData.js        # The single-source-of-truth file containing all CLI parameters and choices
```

---

## 💻 Local Development

### Prerequisites
Make sure you have Node.js (v18+) and npm installed locally.

### Setup and Running
1. Clone the repository and navigate to the directory:
   ```bash
   git clone <repository-url>
   cd tools
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite hot-reloading development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local host address shown (usually `http://localhost:5173`).

### Production Build
To build the application assets for production delivery:
```bash
npm run dev
# OR if script execution is blocked on Windows:
npm.cmd run build
```

---

## 🌐 Deploying to Vercel

To deploy this project to the Vercel edge network:
1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Navigate to the project root and run deployment:
   ```bash
   vercel
   ```
3. Follow the CLI login and project creation prompts to link and deploy your static build.

---

## 🛠️ Adding a New CLI Engine

To extend the companion dashboard with a new command engine:
1. Open [toolsData.js](src/data/toolsData.js).
2. Append a new tool object structure inside the `toolsData` array:
   ```javascript
   {
     id: 'my-cli-tool',
     name: 'My CLI Tool',
     category: 'Utilities',
     color: '#accent-hex-color',
     accentClass: 'my-cli-accent',
     tagline: 'Short description of what it does.',
     description: 'Detailed description of utility goals.',
     install: {
       windows: 'winget install ...',
       mac: 'brew install ...',
       linux: 'sudo apt install ...'
     },
     visualConcept: { ... },
     interactiveBuilder: {
       title: 'Configurator Title',
       options: [ ... ],
       generator: (opts) => { ... },
       simulatedOutput: (opts) => { ... }
     },
     cheatsheets: [ ... ]
   }
   ```
3. Open [index.css](src/index.css) and append matching accent variables:
   ```css
   .my-cli-accent {
     --accent-color: #accent-hex-color;
     --accent-glow: rgba(red, green, blue, 0.25);
   }
   ```
4. Define your tool icon switch case in [icons mapping](src/components/Sidebar.jsx).

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
