# Tools CLI - Project TODO

## 🚀 Proposed New CLI Tools to Add

The following modern CLI tools have been researched and are recommended to be added to `toolsData.js` with their own interactive builders and cheatsheets.

- [x] **`fzf` (Fuzzy Finder)**
  - *Use Case:* Interactive searching for files, history, and git branches.
- [x] **`zoxide` (Smart `cd`)**
  - *Use Case:* Fast directory navigation based on frequency.
- [x] **`ripgrep` (`rg`)**
  - *Use Case:* Blazing fast regex searching respecting `.gitignore`.
- [x] **`eza` (Modern `ls`)**
  - *Use Case:* Colored directory listings, icons, tree views, and Git integration.
- [x] **`bat` (Modern `cat`)**
  - *Use Case:* File reading with syntax highlighting and Git diffs.
- [x] **`lazygit`**
  - *Use Case:* TUI for complex Git workflows (staging, rebasing).
- [x] **`Starship`**
  - *Use Case:* Cross-shell prompt configuration builder (`starship.toml`).

---

*Note: Assigned to Project Manager / Frontend Developer for future implementation.*

## 🔴 Critical Bugs
- **Lint Errors (Unused Variables):**
  - `src/components/Donate.jsx`: Line 25 - Unused variable `e` in `IS_INDIA` try-catch block.
  - `src/data/tools/fzf.js`: Line 39 - Unused variable `opts` in `simulatedOutput`.

## 🟡 UI/UX Issues
- **Typo in App.jsx Route Handling:**
  - `App.jsx` lines 37 and 42 contain a typo: `cleanPath === "donent"` should be corrected or removed.
- **Unused Assets:**
  - `src/assets/hero.png` exists but is not used (the app uses `hero.webp` from public).
