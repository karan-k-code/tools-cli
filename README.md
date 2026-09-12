# 💻 Interactive CLI Companion (Tools CLI)

[![Vite Build](https://img.shields.io/badge/Vite-v5.0+-purple.svg?style=flat-square)](https://vite.dev)
[![React](https://img.shields.io/badge/React-v19.0+-blue.svg?style=flat-square)](https://react.dev)
[![Open Source](https://img.shields.io/badge/Open%20Source-Initiative-gradient.svg?style=flat-square)](#open-source-initiative)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](./LICENSE)

An interactive, high-fidelity developer dashboard designed to help master advanced command line interface (CLI) engines. Configure parameters, preview auto-generated commands, inspect syntax breakdowns, and run simulated shell outputs directly in a sleek, glassmorphic dark-theme browser interface.

---

## 🚀 Supported CLI Engines

The companion currently includes deep configurations, lifecycles, and interactive builders for:

* **Version Control**: Git, GitHub CLI (gh), Lazygit.
* **Local AI**: Ollama, Gemini CLI.
* **Media Rendering**: FFmpeg, ImageMagick.
* **Web Scraping**: yt-dlp.
* **Virtual Environments & Packages**: Python & Pip, Node & NPM.
* **Modern Shell Utilities**: fzf, zoxide, ripgrep, eza, bat, starship.
* **Network & DevOps**: Nmap, Vercel CLI, ADB, docker, tmux.

---

## 🎨 Core Features

1. **Interactive Command Generator**: Select goals and tweak variables using text inputs, toggles, and selectors. The command updates dynamically in real-time.
2. **Flags / Arguments Breakdown**: Clickable breakdown sections explaining what each option and flag in the generated command does.
3. **Shell Console Simulator**: Run commands directly in a simulated terminal environment to view mock progress logs and output outputs.
4. **Knowledge Quiz**: Challenge your terminal syntax knowledge with a 5-question mock certification test interface.
5. **Favorites / Bookmark Drawer**: Locally save frequently used config commands into a persistent localStorage favorites list.
6. **Insecure Context Copy Fallback**: Uses a fallback textarea copy utility supporting local area network IP addresses (e.g. `http://10.23.126.23:3000/`) where standard `navigator.clipboard` is blocked by browsers.
7. **GitHub Repository Integration**: Instant redirection links to official tool GitHub repositories built right into the hero layouts.
8. **Dynamic Modular SEO**: Dynamic titles, descriptions, and structured JSON-LD schemas managed independently within each page using the custom `useSEO` hook.
9. **Clean Path Routing**: Path-based routing structure (no hashes like `/#/`) powered by React Router `BrowserRouter`.

---

## 📂 Project Structure

The project has been refactored into a highly clean, modular React component architecture:

```text
src/
├── App.jsx                 # Main entry app layout, routing, and global state
├── App.css                 # Base container styling definitions
├── index.css               # Core CSS variables, color tokens, and animations
├── main.jsx                # DOM mounting entry script wrapped in BrowserRouter
├── hooks/                  # Reusable Custom React Hooks
│   └── useSEO.js           # Reusable custom hook for modular page-specific SEO
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
    ├── tools/              # Individual modular JS files for each CLI tool (e.g. git.js, ollama.js)
    ├── quizQuestions.js    # Trivia questions array
    └── toolsData.js        # The aggregated entry point exporting the `toolsData` array
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
npm run build
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
2. Make sure the `vercel.json` SPA rewrite rules configuration is in place to support path-based history routing:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
3. Navigate to the project root and run deployment:
   ```bash
   vercel
   ```
4. Follow the CLI login and project creation prompts to link and deploy your static build.

---

## 🛠️ Adding a New CLI Engine

To extend the companion dashboard with a new command engine:
1. Create a new file in `src/data/tools/` (e.g., `mycli.js`) and export your tool object:
   ```javascript
   export const mycli = {
     id: 'my-cli',
     name: 'My CLI Tool',
     category: 'Utilities',
     color: '#accent-hex-color',
     accentClass: 'my-cli-accent',
     github: 'https://github.com/username/project',
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
   };
   ```
2. Open `src/data/toolsData.js`, import your new object, and append it to the `toolsData` array.
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
