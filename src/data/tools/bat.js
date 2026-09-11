export const bat = {
    id: "bat",
    name: "Bat (Modern cat)",
    category: "Utilities",
    color: "#F6C915",
    accentClass: "bat-accent",
    github: "https://github.com/sharkdp/bat",
    tagline: "A cat(1) clone with syntax highlighting and Git integration.",
    description: "bat supports syntax highlighting for a large number of programming and markup languages, as well as git integration to show modifications.",
    install: { windows: "winget install sharkdp.bat", mac: "brew install bat", linux: "sudo apt install bat" },
    visualConcept: { title: "Bat Features", steps: [{ name: "Syntax", desc: "Highlighting based on extension", status: "modified" }, { name: "Paging", desc: "Automatic paging for long files", status: "staged" }] },
    interactiveBuilder: {
      title: "Bat Builder",
      description: "Read files with syntax highlighting.",
      options: [
        { id: "file", label: "File to read", type: "text", defaultValue: "README.md" },
        { id: "numbers", label: "Hide line numbers (-n)", type: "boolean", defaultValue: false }
      ],
      generator: (opts) => {
        let cmd = `bat`;
        if (opts.numbers) cmd += ` -n`;
        cmd += ` ${opts.file}`;
        return { command: cmd, explanation: [] };
      },
      simulatedOutput: () => "   1   console.log('Hello world');"
    },
    cheatsheets: [{ section: "Basic Usage", items: [{ cmd: "bat file.txt", desc: "Display a file" }, { cmd: "bat -A file.txt", desc: "Show all non-printable characters" }] }]
  };
