export const lazygit = {
    id: "lazygit",
    name: "Lazygit",
    category: "VCS",
    color: "#B22222",
    accentClass: "lazygit-accent",
    github: "https://github.com/jesseduffield/lazygit",
    tagline: "A simple terminal UI for git commands.",
    description: "Lazygit is a fast and easy-to-use terminal user interface for Git, designed to simplify workflows.",
    install: { windows: "winget install lazygit", mac: "brew install lazygit", linux: "sudo add-apt-repository ppa:lazygit-team/release && sudo apt-get update && sudo apt-get install lazygit" },
    visualConcept: { title: "Lazygit TUI", steps: [{ name: "Status", desc: "View files", status: "staged" }, { name: "Branch", desc: "Manage branches", status: "remote" }] },
    interactiveBuilder: {
      title: "Lazygit Launcher",
      description: "Launch the Lazygit TUI.",
      options: [],
      generator: () => ({ command: "lazygit", explanation: [] }),
      simulatedOutput: () => "Launching Lazygit TUI interface..."
    },
    cheatsheets: [{ title: "Keybindings",
      icon: "⌨️", commands: [{ cmd: "Space", desc: "Toggle staged/unstaged" }, { cmd: "c", desc: "Commit changes" }, { cmd: "P", desc: "Push to remote" }] }]
  };
