export const zoxide = {
    id: "zoxide",
    name: "Zoxide (Smart cd)",
    category: "Utilities",
    color: "#FF5F00",
    accentClass: "zoxide-accent",
    github: "https://github.com/ajeetdsouza/zoxide",
    tagline: "A smarter cd command, inspired by z and autojump.",
    description: "zoxide is a blazing fast alternative to cd that remembers which directories you use most frequently, so you can jump to them in just a few keystrokes.",
    install: { windows: "winget install zoxide", mac: "brew install zoxide", linux: "curl -sS https://raw.githubusercontent.com/ajeetdsouza/zoxide/main/install.sh | bash" },
    visualConcept: { title: "Zoxide Workflow", steps: [{ name: "Learn", desc: "Zoxide records the directories you visit", status: "staged" }, { name: "Jump", desc: "Type 'z <hint>' to jump to the highest ranked match", status: "remote" }] },
    interactiveBuilder: {
      title: "Zoxide Builder",
      description: "Generate zoxide navigation commands.",
      options: [
        { id: "query", label: "Directory hint", type: "text", defaultValue: "proj" },
        { id: "interactive", label: "Interactive selection (-i)", type: "boolean", defaultValue: false }
      ],
      generator: (opts) => {
        let cmd = `z ${opts.query}`;
        if (opts.interactive) cmd += ` -i`;
        return { command: cmd, explanation: [] };
      },
      simulatedOutput: () => "Navigating to /path/to/project"
    },
    cheatsheets: [{ title: "Usage",
      icon: "⚙️", commands: [{ cmd: "z foo", desc: "cd into highest ranked directory matching foo" }, { cmd: "z foo bar", desc: "cd into highest ranked directory matching foo and bar" }, { cmd: "zi foo", desc: "cd with interactive selection (using fzf)" }] }]
  };
