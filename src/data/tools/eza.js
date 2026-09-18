export const eza = {
    id: "eza",
    name: "eza (Modern ls)",
    category: "Utilities",
    color: "#4A90E2",
    accentClass: "eza-accent",
    github: "https://github.com/eza-community/eza",
    tagline: "A modern, maintained replacement for ls.",
    description: "eza is a modern, maintained replacement for the venerable file-listing command-line program ls that ships with Unix and Linux operating systems, giving it more features and better defaults.",
    install: { windows: "winget install eza", mac: "brew install eza", linux: "sudo apt install eza" },
    visualConcept: { title: "eza Output", steps: [{ name: "Icons", desc: "File type icons", status: "staged" }, { name: "Git", desc: "Git integration and statuses", status: "remote" }] },
    interactiveBuilder: {
      title: "eza Builder",
      description: "Configure eza directory listings.",
      options: [
        { id: "long", label: "Long view (-l)", type: "boolean", defaultValue: true },
        { id: "icons", label: "Show Icons (--icons)", type: "boolean", defaultValue: true },
        { id: "tree", label: "Tree view (-T)", type: "boolean", defaultValue: false }
      ],
      generator: (opts) => {
        let cmd = `eza`;
        if (opts.long) cmd += ` -l`;
        if (opts.icons) cmd += ` --icons`;
        if (opts.tree) cmd += ` -T`;
        return { command: cmd, explanation: [] };
      },
      simulatedOutput: () => "Permissions  Size  Date    Name\n.rw-r--r--   1.0K  Jan 1   📄 index.js"
    },
    cheatsheets: [{ title: "Usage",
      icon: "📁", commands: [{ cmd: "eza -l", desc: "Long format" }, { cmd: "eza -la", desc: "Long format including hidden" }, { cmd: "eza --tree", desc: "View as a tree" }] }]
  };
