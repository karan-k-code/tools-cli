export const gh = {
  id: "gh",
  name: "GitHub CLI (gh)",
  category: "VCS",
  color: "#2ea043",
  accentClass: "gh-accent",
  github: "https://github.com/cli/cli",
  tagline: "Take GitHub to the command line.",
  description: "GitHub CLI brings pull requests, issues, and other GitHub concepts to your terminal next to where you are already working with git and your code.",
  install: {
    windows: "winget install GitHub.cli",
    mac: "brew install gh",
    linux: "sudo apt install gh"
  },
  visualConcept: {
    title: "GitHub CLI Workflow",
    steps: [
      { name: "Auth", desc: "Authenticate with GitHub", status: "modified" },
      { name: "Code", desc: "Write code and commit locally", status: "staged" },
      { name: "PR", desc: "Create a Pull Request from terminal", status: "remote" },
      { name: "Merge", desc: "Review and merge the PR", status: "committed" }
    ]
  },
  interactiveBuilder: {
    title: "Pull Request Builder",
    description: "Generate a command to create a new Pull Request.",
    options: [
      { id: "title", label: "PR Title", type: "text", defaultValue: "Fix bug in authentication" },
      { id: "body", label: "PR Body (Optional)", type: "text", defaultValue: "" },
      { id: "draft", label: "Create as Draft (-d)", type: "boolean", defaultValue: false },
      { id: "web", label: "Open in Browser (-w)", type: "boolean", defaultValue: false }
    ],
    generator: (opts) => {
      let cmd = `gh pr create`;
      if (opts.title) cmd += ` --title "${opts.title}"`;
      if (opts.body) cmd += ` --body "${opts.body}"`;
      if (opts.draft) cmd += ` --draft`;
      if (opts.web) cmd += ` --web`;
      
      const explanation = [
        { part: "gh pr create", desc: "Initiates the creation of a Pull Request on GitHub for the current branch." }
      ];
      if (opts.title) explanation.push({ part: `--title "${opts.title}"`, desc: "Sets the title of the Pull Request." });
      if (opts.body) explanation.push({ part: `--body "${opts.body}"`, desc: "Sets the description/body of the Pull Request." });
      if (opts.draft) explanation.push({ part: "--draft", desc: "Marks the Pull Request as a draft." });
      if (opts.web) explanation.push({ part: "--web", desc: "Opens the PR creation page in your default web browser." });
      
      return { command: cmd, explanation };
    },
    simulatedOutput: () => "Creating pull request for my-feature into main in karan-k-code/tools-cli\n\nhttps://github.com/karan-k-code/tools-cli/pull/42"
  },
  cheatsheets: [
    {
      title: "Authentication",
      icon: "🔐",
      commands: [
        { cmd: "gh auth login", desc: "Authenticate with your GitHub account." },
        { cmd: "gh auth status", desc: "Check your authentication status." }
      ]
    },
    {
      title: "Pull Requests",
      icon: "🔀",
      commands: [
        { cmd: "gh pr list", desc: "List open pull requests in the current repository." },
        { cmd: "gh pr checkout <number>", desc: "Check out a pull request locally by its number." },
        { cmd: "gh pr create -d", desc: "Create a draft pull request." },
        { cmd: "gh pr merge <number>", desc: "Merge a pull request." },
        { cmd: "gh pr view -w", desc: "Open the current branch's PR in the web browser." }
      ]
    },
    {
      title: "Issues",
      icon: "🐞",
      commands: [
        { cmd: "gh issue list", desc: "List open issues." },
        { cmd: "gh issue create", desc: "Create a new issue interactively." },
        { cmd: "gh issue view <number>", desc: "View an issue's details." }
      ]
    },
    {
      title: "Repositories",
      icon: "📦",
      commands: [
        { cmd: "gh repo clone <owner>/<repo>", desc: "Clone a repository locally." },
        { cmd: "gh repo create <name>", desc: "Create a new repository." },
        { cmd: "gh repo view -w", desc: "Open the repository in a web browser." }
      ]
    }
  ]
};
