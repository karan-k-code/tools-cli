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

## ✅ Resolved
- **theHarvester Crash - Generator Return Type:**
  - Fixed in `src/data/tools/theHarvester.js`. The `interactiveBuilder.generator` now returns `{ command: cmd, explanation: [] }` like all other tools, so `App.jsx` / `ToolDetail.jsx` no longer crash on `cmdExplanation.length`.
- **theHarvester Builder Schema:**
  - Fixed select options to use `choices` (component reads `opt.choices.map`) instead of `options`, switched `default` → `defaultValue` (used by `App.jsx`), and changed the `limit` field from unsupported `type: "number"` to `text` so it renders. Also replaced the copy-pasted Ollama `visualConcept` with a theHarvester workflow.
- **Cheatsheet Structure:**
  - Already compatible. `ToolDetail.jsx` / `DashboardHome.jsx` read `(sheet.commands || sheet.items)` and `sheet.title`, which theHarvester's `title`/`icon`/`commands` structure satisfies.
- **Missing Category in Sidebar:**
  - Already present. `Sidebar.jsx` includes `"Information Gathering"` in its category filters.
- **Invalid Color format in theHarvester:**
  - Already valid hex (`#a855f7`), no longer breaks `parseInt` in `DashboardHome.jsx`.

## 🟡 UI/UX Issues
- **Wrong Favicon MIME type:**
  - `index.html`: The favicon `<link>` has `href="k.logo.webp"` but incorrectly specifies `type="image/svg+xml"`. It should be `type="image/webp"`.
