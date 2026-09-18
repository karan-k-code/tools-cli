export const ripgrep = {
    id: "ripgrep",
    name: "Ripgrep (rg)",
    category: "Utilities",
    color: "#E2A900",
    accentClass: "ripgrep-accent",
    github: "https://github.com/BurntSushi/ripgrep",
    tagline: "Recursively searches directories for a regex pattern.",
    description: "ripgrep is a line-oriented search tool that recursively searches your current directory for a regex pattern while respecting your gitignore rules.",
    install: { windows: "winget install BurntSushi.ripgrep.MSVC", mac: "brew install ripgrep", linux: "sudo apt-get install ripgrep" },
    visualConcept: { title: "Ripgrep Search", steps: [{ name: "Regex", desc: "Define search pattern", status: "modified" }, { name: "Search", desc: "Fast parallel search through files", status: "staged" }] },
    interactiveBuilder: {
      title: "Ripgrep Builder",
      description: "Build rg regex searches.",
      options: [
        { id: "pattern", label: "Search Pattern", type: "text", defaultValue: "TODO" },
        { id: "ignoreCase", label: "Ignore Case (-i)", type: "boolean", defaultValue: true },
        { id: "hidden", label: "Search Hidden Files (-. )", type: "boolean", defaultValue: false }
      ],
      generator: (opts) => {
        let cmd = `rg`;
        if (opts.ignoreCase) cmd += ` -i`;
        if (opts.hidden) cmd += ` -.`;
        cmd += ` "${opts.pattern}"`;
        return { command: cmd, explanation: [] };
      },
      simulatedOutput: () => "src/main.js:15: // TODO: refactor this"
    },
    cheatsheets: [{ title: "Basic Usage",
      icon: "🔍", commands: [{ cmd: "rg 'fast'", desc: "Search for 'fast' in current directory" }, { cmd: "rg -i 'fast'", desc: "Case-insensitive search" }, { cmd: "rg -t py 'import'", desc: "Search only Python files" }] }]
  };
