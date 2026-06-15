# 💻 Console Simulator System (`Console.jsx`)

The **Console Simulator** is a high-fidelity client-side interactive shell emulator integrated directly into the Tools CLI Dashboard. It mimics a live POSIX-compliant terminal in style and responsiveness, allowing users to type standard commands or trigger auto-typed commands directly from interactive UI builders.

---

## 📂 Component Map & Files

The terminal simulator is implemented across two key files:
1. **Logic & Markup**: [Console.jsx](file:///C:/projects/tools/src/components/Console.jsx) - Handles CLI inputs, command matching, state history, character-by-character simulation, and ANSI sequence parsing.
2. **Styles**: [Console.css](file:///C:/projects/tools/src/components/Console.css) - Defines the terminal viewport, matrix-green scanlines, cursor blink animations, and scrollbars.

---

## ⚙️ How It Works (Core Mechanics)

```mermaid
flowchart TD
    A[User Action / Option Build] -->|Trigger "Run in Terminal"| B(Props Received: activeCommand & simulatedOutput)
    B -->|Start Timer Loop| C[Auto-Typing Animation 25ms/char]
    C -->|Complete Typing| D[Append cmd to History & Clear Temp Input]
    D -->|Process Output| E[Run ANSI Color Parser]
    E -->|Render Viewport| F[Scroll terminal-body to bottom]
    
    G[Manual Command Typed in Form] -->|Press Enter| H[Append input to History]
    H -->|Match Case Engine| I[Resolve Mock output]
    I -->|Run ANSI Color Parser| E
```

### 1. Auto-Typing Animation Loop
When a user clicks "Run in Terminal" on any interactive tool detail page, the command is passed via the `activeCommand` prop. The console takes control:
- Sets `isTyping` to `true` to temporarily disable manual typing inputs.
- Spawns an interval (`setInterval` running every `25ms`) that slices and appends characters one-by-one to create a natural visual typing speed.
- Once completed, it clears the timer, appends the final command text to the shell history, prints the simulated output logs, and fires `onCommandRunComplete()` to tell the parent window it is done.

### 2. ANSI Escape Code Parser
True terminals output ANSI color codes (e.g. `\x1b[32m` for Green) to format terminal logging. The component contains a custom regex parser (`renderAnsiText` function) that parses these string segments:
- It splits the output content string by escape sequence tags: `/(\x1b\[\d+(?:;\d+)?m)/g`.
- Maps standard terminal color codes into corresponding dynamic inline CSS styling objects.
- **Supported Colors**:
  | ANSI Code | Terminal Color | Inline Color Hex | CSS Class Equivalent |
  | :--- | :--- | :--- | :--- |
  | `\x1b[31m` | Red | `#f87171` | `text-red-500` |
  | `\x1b[32m` | Green | `#34d399` | `text-emerald-400` |
  | `\x1b[33m` | Yellow | `#fbbf24` | `text-yellow-400` |
  | `\x1b[34m` | Blue | (Prompt custom) | `text-sky-400` |
  | `\x1b[35m` | Magenta | `#c084fc` | `text-purple-400` |
  | `\x1b[36m` | Cyan | `#22d3ee` | `text-cyan-400` |
  | `\x1b[37m` | White | `#ffffff` | `text-white` |
  | `\x1b[30;107m`| Inverted Tmux | `#000000` (bg `#ffffff`) | `text-black bg-white` |
  | `\x1b[0m` | Reset | Inherited | (Clear styling) |

### 3. State Management & Input Handling
* **Terminal History**: Managed in a `history` state array. Each line is an object format: `{ type: 'input' | 'output' | 'info', content: 'string text' }`.
* **Auto-Scrolling Hook**: An effect fires on every history, typing status, or character addition, ensuring the terminal container's `scrollTop` matches its total `scrollHeight`.
* **Caret & Input Focus**: Clicking anywhere inside the terminal body automatically refocuses the hidden CLI `<input>` wrapper using a React `ref`.

---

## 📥 Component Interface (Props)

```javascript
import Console from './components/Console';

<Console 
  activeCommand={activeCommand} 
  simulatedOutput={simulatedOutput} 
  onCommandRunComplete={handleResetCommandSignal} 
/>
```

* **`activeCommand`** (String): Command string to type out in the simulator.
* **`simulatedOutput`** (String): Standard/Error output log to print immediately after typing finishes.
* **`onCommandRunComplete`** (Function): Callback function invoked to clear the current running command flag in parent state.

---

## 🛠️ CLI Mock Command Directory

You can type the following commands manually into the simulator command prompt to test responses:

| Command | Subcommands / Flags | Mock Behavior / Output |
| :--- | :--- | :--- |
| **`help`** | None | Prints the list of available mock CLI commands and formatting examples. |
| **`clear`** | None | Wipes the entire screen buffer (wipes the `history` state array). |
| **`git`** | `init`, `status`, `log` | Simulates localized repository initialization, tracked changes, or commit history logs. |
| **`ollama`**| `list`, `run <model>` | Simulates querying local AI models list or launching a chat conversation shell. |
| **`gemini`**| `configure`, `--list-models`, `<prompt>` | Simulates Gemini configuration, listing models, or generating AI answers. |
| **`ffmpeg`**| `-i input.mp4 ...` | Simulates high-speed video/audio conversion status progress loops. |
| **`yt-dlp`**| `<url>` | Prints mock logs of web page downloading, file packaging, and completion status. |
| **`python`**| `--version`, `-V` | Simulates Python runtime version checks. |
| **`pip`** | `list` | Lists mock Python libraries and dependency versions (e.g. `requests`, `urllib3`). |
| **`docker`**| `ps` | Displays active container IDs, images, uptimes, and port mappings. |
| **`tmux`**  | None | Renders a terminal-multiplexer footer bar status bar with inverse black-on-white formatting. |
| **`curl`**  | None | Outputs a simulated mock HTTP/2 response structure. |

---

## 💅 Styling Details (`Console.css`)

* **Glassmorphic Theme**: Integrated dark background color `#05060b` with a fine-dot radial background pattern (`background-image: radial-gradient(rgba(0,255,102,0.03) 1px, transparent 0)`).
* **Matrix Terminal Color**: Primary line colors render in CRT-inspired phosphor green `#00ff66`.
* **Animated Terminal Cursor**: Built-in CSS keyframe animation mimicking a flashing block cursor:
  ```css
  .terminal-cursor {
    display: inline-block;
    width: 10px;
    height: 15px;
    background-color: #00ff66;
    animation: blink 1s step-end infinite;
    box-shadow: 0 0 8px rgba(0, 255, 102, 0.7);
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  ```
