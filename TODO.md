# Tools CLI - Project TODO

## 🚀 Proposed New CLI Tools to Add

The following modern CLI tools have been researched and are recommended to be added to `toolsData.js` with their own interactive builders and cheatsheets.

- [x] **`fzf` (Fuzzy Finder)**
- [x] **`zoxide` (Smart `cd`)**
- [x] **`ripgrep` (`rg`)**
- [x] **`eza` (Modern `ls`)**
- [x] **`bat` (Modern `cat`)**
- [x] **`lazygit`**
- [x] **`Starship`**

---

*Note: Assigned to Project Manager / Frontend Developer for future implementation.*

## 🔴 Critical Bugs
- **theHarvester Crash - Generator Return Type:**
  - `src/data/tools/theHarvester.js`: The `interactiveBuilder.generator` returns a string. It must return an object `{ command: cmd, explanation: [] }` to prevent `App.jsx` from crashing on `cmdExplanation.length`.
- **theHarvester Crash - Cheatsheet Structure:**
  - `src/data/tools/theHarvester.js`: The `cheatsheets` array uses `title` and `commands` keys instead of the expected `section` and `items` keys, which crashes `ToolDetail.jsx` during `sheet.items.map`.

## 🟡 UI/UX Issues
- **Missing Category in Sidebar:**
  - `theHarvester.js` uses category `"Information Gathering"`, but `Sidebar.jsx` hardcodes category filters. Add `"Information Gathering"` to the categories array in `Sidebar.jsx`.
- **Invalid Color format in theHarvester:**
  - `theHarvester.js` defines `color: "--adb-color"`. This breaks the hex parsing (`parseInt`) in `DashboardHome.jsx`. It should be a valid hex code (e.g., `#3ddc84`).
- **Wrong Favicon MIME type:**
  - `index.html`: The favicon `<link>` has `href="k.logo.webp"` but incorrectly specifies `type="image/svg+xml"`. It should be `type="image/webp"`.
