export const fzf = {
    id: "fzf",
    name: "Fuzzy Finder (fzf)",
    category: "Utilities",
    color: "#FF00FF",
    accentClass: "fzf-accent",
    github: "https://github.com/junegunn/fzf",
    tagline: "A general-purpose command-line fuzzy finder.",
    description: "fzf is an interactive Unix filter for command-line that can be used with any list; files, command history, processes, hostnames, bookmarks, git commits, etc.",
    install: {
      windows: "winget install fzf",
      mac: "brew install fzf",
      linux: "sudo apt install fzf"
    },
    visualConcept: {
      title: "How fzf works",
      steps: [
        { name: "Input Source", desc: "A command that generates a list (e.g. find, history)", status: "modified" },
        { name: "fzf Filter", desc: "Interactive fuzzy search prompt in the terminal", status: "staged" },
        { name: "Selection", desc: "User picks one or multiple items", status: "committed" },
        { name: "Output Action", desc: "Selected item is passed to the next command", status: "remote" }
      ]
    },
    interactiveBuilder: {
      title: "fzf Command Builder",
      description: "Build common fzf pipelines and commands.",
      options: [
        { id: "source", label: "Input Source", type: "select", defaultValue: "files", choices: [{ value: "files", label: "Files in directory" }, { value: "history", label: "Command History" }, { value: "git_log", label: "Git Commits" }] },
        { id: "multi", label: "Allow Multiple Selection (-m)", type: "boolean", defaultValue: false }
      ],
      generator: (opts) => {
        let cmd = "";
        if (opts.source === "files") cmd = `find . -type f | fzf`;
        else if (opts.source === "history") cmd = `history | fzf`;
        else if (opts.source === "git_log") cmd = `git log --oneline | fzf`;
        if (opts.multi) cmd += " -m";
        return { command: cmd, explanation: [] };
      },
      simulatedOutput: () => "Simulating fzf interactive prompt...\n> result"
    },
    cheatsheets: [
      { title: "Basic Usage",
      icon: "⚙️", commands: [{ cmd: "find * -type f | fzf", desc: "Fuzzy find files" }, { cmd: "history | fzf", desc: "Fuzzy search command history" }] }
    ]
  };
