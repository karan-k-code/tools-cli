export const starship = {
    id: "starship",
    name: "Starship",
    category: "Utilities",
    color: "#DD0B78",
    accentClass: "starship-accent",
    github: "https://github.com/starship/starship",
    tagline: "The minimal, blazing-fast, and infinitely customizable prompt for any shell!",
    description: "Starship is a cross-shell prompt that shows information you need while you're working, dynamically.",
    install: { windows: "winget install starship", mac: "brew install starship", linux: "curl -sS https://starship.rs/install.sh | sh" },
    visualConcept: { title: "Starship Prompt", steps: [{ name: "Context", desc: "Git branch, language version", status: "modified" }, { name: "Display", desc: "Render prompt cleanly", status: "staged" }] },
    interactiveBuilder: {
      title: "Starship Config",
      description: "Edit starship.toml configuration.",
      options: [
        { id: "preset", label: "Setup preset", type: "select", defaultValue: "pure", choices: [{ value: "pure", label: "Pure Preset" }, { value: "nerd", label: "Nerd Font Preset" }] }
      ],
      generator: (opts) => {
        return { command: `starship preset ${opts.preset} -o ~/.config/starship.toml`, explanation: [] };
      },
      simulatedOutput: () => "Configuration applied successfully."
    },
    cheatsheets: [{ title: "Setup",
      icon: "⚙️", commands: [{ cmd: "starship init bash", desc: "Initialize in bash" }, { cmd: "starship init zsh", desc: "Initialize in zsh" }] }]
  };
