export const nodenpm = {
    id: "node-npm",
    name: "Node.js & npm",
    category: "Utilities",
    color: "#339933",
    accentClass: "node-accent",
    github: "https://github.com/npm/cli",
    tagline: "JavaScript runtime & package manager engine.",
    description:
      "Node.js is an open-source cross-platform JavaScript runtime environment. npm is the default package manager for Node.js, and npx is its package execution helper.",
    install: {
      windows: "winget install OpenJS.NodeJS",
      mac: "brew install node",
      linux:
        "curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs",
    },
    visualConcept: {
      title: "Node.js Package Lifecycle",
      steps: [
        {
          name: "npm init",
          desc: "Creates package.json file to track your project specifications and packages.",
          status: "modified",
        },
        {
          name: "npm install",
          desc: "Downloads modules into the node_modules folder and registers them in package.json.",
          status: "staged",
        },
        {
          name: "node app.js",
          desc: "Starts the Node.js V8 execution loop to run your application.",
          status: "committed",
        },
        {
          name: "npx runner",
          desc: "Downloads and executes single-use binary tools (like Vite) without local installation.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Node & npm Architect",
      description:
        "Generate package setups, dependencies installers, test runners, and npx commands.",
      options: [
        {
          id: "action",
          label: "Operation",
          type: "select",
          defaultValue: "install",
          choices: [
            { value: "init", label: "Initialize package.json" },
            { value: "install", label: "Install Packages (Dependencies)" },
            { value: "install-dev", label: "Install Dev-Dependencies (-D)" },
            { value: "run-script", label: "Run NPM Script (npm run)" },
            { value: "npx-exec", label: "Execute with NPX" },
          ],
        },
        {
          id: "pkgName",
          label: "Package Name(s) / Libraries",
          type: "text",
          defaultValue: "lodash express cors",
          condition: (opts) =>
            opts.action === "install" || opts.action === "install-dev",
        },
        {
          id: "scriptName",
          label: "Script name (defined in package.json)",
          type: "text",
          defaultValue: "dev",
          condition: (opts) => opts.action === "run-script",
        },
        {
          id: "npxCommand",
          label: "NPX Script Runner",
          type: "select",
          defaultValue: "create-vite@latest",
          choices: [
            {
              value: "create-vite@latest",
              label: "create-vite (Scaffold Vite app)",
            },
            {
              value: "create-next-app@latest",
              label: "create-next-app (Scaffold Next.js)",
            },
            { value: "prisma db push", label: "Prisma (Database sync)" },
            { value: "eslint --init", label: "ESLint (Linter initialization)" },
          ],
          condition: (opts) => opts.action === "npx-exec",
        },
      ],
      generator: (opts) => {
        switch (opts.action) {
          case "init":
            return {
              command: "npm init -y",
              explanation: [
                {
                  part: "npm init",
                  desc: "Runs the NPM interactive initializer wizard.",
                },
                {
                  part: "-y",
                  desc: "Bypasses questionnaire prompts, filling in standard package defaults automatically.",
                },
              ],
            };
          case "install":
            return {
              command: `npm install ${opts.pkgName || "express"}`,
              explanation: [
                {
                  part: "npm install",
                  desc: "Instructs package manager to query registry and resolve dependencies.",
                },
                {
                  part: opts.pkgName || "express",
                  desc: "Names of libraries to download and append inside package.json dependencies.",
                },
              ],
            };
          case "install-dev":
            return {
              command: `npm install -D ${opts.pkgName || "nodemon"}`,
              explanation: [
                { part: "npm install", desc: "Downloads specified packages." },
                {
                  part: "-D",
                  desc: "DevDependencies flag. Saves package for dev environment checks only (ignored in production builds).",
                },
              ],
            };
          case "run-script":
            return {
              command: `npm run ${opts.scriptName || "dev"}`,
              explanation: [
                {
                  part: "npm run",
                  desc: "Tells npm to lookup and run custom terminal scripts mapped inside package.json.",
                },
                {
                  part: opts.scriptName || "dev",
                  desc: "The script label to start (e.g. dev, test, build, start).",
                },
              ],
            };
          case "npx-exec":
            return {
              command: `npx ${opts.npxCommand || "create-vite@latest"}`,
              explanation: [
                {
                  part: "npx",
                  desc: "NPM package execution utility. Runs binary packages from registry without global installations.",
                },
                {
                  part: opts.npxCommand || "create-vite@latest",
                  desc: "The package name and run options.",
                },
              ],
            };
          default:
            return { command: "node -v", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case "init":
            return `Wrote to C:\\projects\\tools\\package.json:\n{\n  "name": "tools",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "dependencies": {}\n}`;
          case "install":
            return `added 14 packages, and audited 15 packages in 2s\nfound 0 vulnerabilities\n\x1b[32m[Installed libraries successfully]\x1b[0m`;
          case "install-dev":
            return `added 8 packages, and audited 9 packages in 1s\nfound 0 vulnerabilities\n\x1b[32m[Installed devDependencies successfully]\x1b[0m`;
          case "run-script":
            if (opts.scriptName === "dev") {
              return `> tools@1.0.0 dev\n> vite\n\n  VITE v5.0.0  ready in 200 ms\n  ➜  Local: \x1b[36mhttp://localhost:5173/\x1b[0m`;
            }
            return `> tools@1.0.0 ${opts.scriptName}\n\x1b[32m[Script Ran Successfully]\x1b[0m`;
          case "npx-exec":
            return `Need to install the following packages:\n  ${opts.npxCommand}\nOk to proceed? (y)\n\x1b[36m✔ Scaffolding project completed.\x1b[0m`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        section: "Version Control & Clean",
        items: [
          {
            cmd: "npm install --production",
            desc: "Install production dependencies only (ignores devDependencies).",
          },
          {
            cmd: "npm prune",
            desc: "Remove unused packages from node_modules that are not declared in package.json.",
          },
          {
            cmd: "npm update",
            desc: "Update all installed packages to their latest safe version within semantic bounds.",
          },
        ],
      },
      {
        section: "Global Packages",
        items: [
          {
            cmd: "npm list -g --depth=0",
            desc: "List all globally installed npm modules.",
          },
          {
            cmd: "npm install -g <package>",
            desc: "Install a library globally (e.g. pm2, vercel, wrangler).",
          },
        ],
      },
    ],
  };
