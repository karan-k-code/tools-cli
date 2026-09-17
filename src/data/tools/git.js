export const git = {
    id: "git",
    name: "Git",
    category: "VCS",
    color: "#F05032",
    accentClass: "git-accent",
    github: "https://github.com/git/git",
    tagline:
      "Distributed version control system to track changes in source code.",
    description:
      "Git is the industry standard for version control. It tracks changes to files, lets you revert to previous states, and makes collaboration seamless via branching and merging.",
    install: {
      windows: "winget install --id Git.Git",
      mac: "brew install git",
      linux: "sudo apt install git-all",
    },
    visualConcept: {
      title: "The Git Lifecycle",
      steps: [
        {
          name: "Working Directory",
          desc: "UnTracked or Modified files you are currently editing.",
          status: "modified",
        },
        {
          name: "Staging Area (Index)",
          desc: "Files marked for the next commit. Cleaned & prepared.",
          status: "staged",
        },
        {
          name: "Local Repository",
          desc: "Committed snapshots of your history stored locally.",
          status: "committed",
        },
        {
          name: "Remote Repository",
          desc: "Hosted history on GitHub/GitLab, shared with others.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Git Command Architect",
      description:
        "Configure files and actions to build Git staging, committing, and branching commands.",
      options: [
        {
          id: "action",
          label: "Select Action",
          type: "select",
          defaultValue: "commit",
          choices: [
            { value: "init", label: "Initialize Repository" },
            { value: "add", label: "Stage Files" },
            { value: "commit", label: "Commit Changes" },
            { value: "branch", label: "Create/Switch Branch" },
            { value: "merge", label: "Merge Branch" },
            { value: "stash", label: "Stash Changes" },
            { value: "undo", label: "Undo Last Commit" },
          ],
        },
        {
          id: "fileName",
          label: "File to Stage",
          type: "text",
          defaultValue: ".",
          condition: (opts) => opts.action === "add",
        },
        {
          id: "commitMsg",
          label: "Commit Message",
          type: "text",
          defaultValue: "feat: add interactive CLI tools website",
          condition: (opts) => opts.action === "commit",
        },
        {
          id: "branchName",
          label: "Branch Name",
          type: "text",
          defaultValue: "main",
          condition: (opts) =>
            opts.action === "branch" || opts.action === "merge",
        },
        {
          id: "branchCreate",
          label: "Create new branch if not existing (-b)",
          type: "boolean",
          defaultValue: true,
          condition: (opts) => opts.action === "branch",
        },
        {
          id: "stashMsg",
          label: "Stash Description",
          type: "text",
          defaultValue: "WIP: working on terminal styling",
          condition: (opts) => opts.action === "stash",
        },
        {
          id: "undoType",
          label: "Reset Mode",
          type: "select",
          defaultValue: "--soft",
          choices: [
            { value: "--soft", label: "Soft (Keep changes in staging)" },
            { value: "--mixed", label: "Mixed (Keep changes in working copy)" },
            {
              value: "--hard",
              label: "Hard (Discard all changes completely!)",
            },
          ],
          condition: (opts) => opts.action === "undo",
        },
      ],
      generator: (opts) => {
        switch (opts.action) {
          case "init":
            return {
              command: "git init",
              explanation: [
                {
                  part: "git init",
                  desc: "Initializes a new empty Git repository in the current folder, creating the hidden .git directory.",
                },
              ],
            };
          case "add":
            return {
              command: `git add ${opts.fileName || "."}`,
              explanation: [
                {
                  part: "git add",
                  desc: "Adds files to the staging area, preparing them to be committed.",
                },
                {
                  part: opts.fileName || ".",
                  desc: "The specific path or file to stage. A dot (.) stages all changed files in the directory.",
                },
              ],
            };
          case "commit":
            return {
              command: `git commit -m "${opts.commitMsg || "update"}"`,
              explanation: [
                {
                  part: "git commit",
                  desc: "Takes a snapshot of your staged files and writes it to repository history.",
                },
                {
                  part: "-m",
                  desc: "Flag indicating that a message string follows, avoiding opening a text editor.",
                },
                {
                  part: `"${opts.commitMsg}"`,
                  desc: "The descriptive message explaining what changes are in this commit.",
                },
              ],
            };
          case "branch": {
            const flag = opts.branchCreate ? "-b " : "";
            return {
              command: `git checkout ${flag}${opts.branchName || "main"}`,
              explanation: [
                {
                  part: "git checkout",
                  desc: "Navigates between branches or restores working tree files.",
                },
                ...(opts.branchCreate
                  ? [
                      {
                        part: "-b",
                        desc: "Creates the new branch if it does not already exist, and immediately switches to it.",
                      },
                    ]
                  : []),
                {
                  part: opts.branchName || "main",
                  desc: "The name of the branch to navigate to.",
                },
              ],
            };
          }
          case "merge":
            return {
              command: `git merge ${opts.branchName || "main"}`,
              explanation: [
                {
                  part: "git merge",
                  desc: "Combines the history of the target branch into your currently checked-out branch.",
                },
                {
                  part: opts.branchName || "main",
                  desc: "The branch containing changes you want to bring in.",
                },
              ],
            };
          case "stash": {
            const desc = opts.stashMsg ? `push -m "${opts.stashMsg}"` : "push";
            return {
              command: `git stash ${desc}`,
              explanation: [
                {
                  part: "git stash",
                  desc: "Saves your current local modifications and reverts the working directory to match the HEAD commit.",
                },
                {
                  part: "push",
                  desc: "Explicitly push a new stash entry onto the stack.",
                },
                ...(opts.stashMsg
                  ? [
                      {
                        part: `-m "${opts.stashMsg}"`,
                        desc: "Adds a custom text message to help identify this stash entry later.",
                      },
                    ]
                  : []),
              ],
            };
          }
          case "undo":
            return {
              command: `git reset ${opts.undoType || "--soft"} HEAD~1`,
              explanation: [
                {
                  part: "git reset",
                  desc: "Resets the current HEAD to the specified state.",
                },
                {
                  part: opts.undoType || "--soft",
                  desc:
                    opts.undoType === "--soft"
                      ? "Soft reset: keeps your changed files staged and ready for re-committing."
                      : opts.undoType === "--mixed"
                        ? "Mixed reset (default): unstages changes but keeps them in your workspace."
                        : "Hard reset: discards ALL changes in staging AND working files! Be extremely careful.",
                },
                {
                  part: "HEAD~1",
                  desc: "Points to one commit before the current one (the commit you want to undo).",
                },
              ],
            };
          default:
            return { command: "git status", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case "init":
            return "\x1b[32mInitialized empty Git repository in C:/projects/tools/.git/\x1b[0m\n";
          case "add":
            return ""; // silent usually
          case "commit":
            return `[main e4a19bc] ${opts.commitMsg || "feat: add interactive CLI tools website"}\n 4 files changed, 256 insertions(+), 12 deletions(-)\n create mode 100644 src/data/toolsData.js\n create mode 100644 src/components/Console.jsx`;
          case "branch":
            return opts.branchCreate
              ? `\x1b[36mSwitched to a new branch '${opts.branchName || "main"}'\x1b[0m`
              : `\x1b[36mSwitched to branch '${opts.branchName || "main"}'\x1b[0m`;
          case "merge":
            return `Updating 7c32bf2..e4a19bc\nFast-forward\n src/App.jsx | 42 ++++++++++++++++++--------\n 1 file changed, 30 insertions(+), 12 deletions(-)`;
          case "stash":
            return `Saved working directory and index state WIP on main: e4a19bc feat: add interactive CLI tools website`;
          case "undo":
            if (opts.undoType === "--hard") {
              return `HEAD is now at 7c32bf2 parent commit description`;
            } else {
              return `Unstaged changes after reset:\nM\tsrc/App.jsx\nM\tpackage.json`;
            }
          default:
            return "On branch main\nnothing to commit, working tree clean";
        }
      },
    },
    cheatsheets: [
      {
        title: "Configuration",
      icon: "⚙️",
        commands: [
          {
            cmd: 'git config --global user.name "Your Name"',
            desc: "Set global username for commits.",
          },
          {
            cmd: 'git config --global user.email "mail@example.com"',
            desc: "Set global email address.",
          },
        ],
      },
      {
        title: "Inspection & Logs",
      icon: "⚙️",
        commands: [
          {
            cmd: "git status",
            desc: "List files modified, staged, or untracked in current tree.",
          },
          {
            cmd: "git log --oneline --graph",
            desc: "Display commit history as a clean, visual ASCII branch tree.",
          },
          {
            cmd: "git diff",
            desc: "Show changes between working directory and the index.",
          },
        ],
      },
      {
        title: "Remote Collaboration",
      icon: "⚙️",
        commands: [
          {
            cmd: "git remote add origin <url>",
            desc: 'Map a remote repository URL to shortname "origin".',
          },
          {
            cmd: "git fetch --all",
            desc: "Download all latest commits from remotes without merging.",
          },
          {
            cmd: "git pull origin main",
            desc: 'Fetch and merge remote changes from "main" into active branch.',
          },
        ],
      },
    ],
  };
