export const pythonpip = {
    id: "python-pip",
    name: "Python & Pip",
    category: "AI",
    color: "#306998",
    accentClass: "python-accent",
    github: "https://github.com/pypa/pip",
    tagline: "Write advanced applications and manage packages with pip.",
    description:
      "Python is a high-level, general-purpose coding language. Pip is Python's package installer, enabling developers to query, install, resolve dependencies, and manage packages from the PyPI index.",
    install: {
      windows: "winget install Python.Python.3",
      mac: "brew install python",
      linux: "sudo apt install python3 python3-pip",
    },
    visualConcept: {
      title: "Python Environment Isolation",
      steps: [
        {
          name: "System Python",
          desc: "The global interpreter installed on your OS. Modifying this can break system packages.",
          status: "modified",
        },
        {
          name: "Virtual Env (venv)",
          desc: "An isolated box folder containing its own local python interpreter & bin files.",
          status: "staged",
        },
        {
          name: "Pip Install",
          desc: "Downloads packages directly inside your local venv directory instead of globally.",
          status: "committed",
        },
        {
          name: "Safe Execution",
          desc: "Your script executes importing isolated versions without dependency conflicts.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Python Env Architect",
      description:
        "Configure and generate commands to spin up virtual environments, install packages, and manage package manifests.",
      options: [
        {
          id: "action",
          label: "Task Type",
          type: "select",
          defaultValue: "venv",
          choices: [
            { value: "venv", label: "Create Virtual Env" },
            { value: "activate-win", label: "Activate Env (Windows)" },
            { value: "activate-unix", label: "Activate Env (Mac/Linux)" },
            { value: "install", label: "Install Package with Pip" },
            {
              value: "requirements",
              label: "Save / Install Requirements File",
            },
          ],
        },
        {
          id: "envName",
          label: "Venv Name",
          type: "text",
          defaultValue: "venv",
          condition: (opts) =>
            ["venv", "activate-win", "activate-unix"].includes(opts.action),
        },
        {
          id: "packageName",
          label: "Package Name",
          type: "text",
          defaultValue: "numpy pandas requests",
          condition: (opts) => opts.action === "install",
        },
        {
          id: "pipMode",
          label: "Save or Load requirements",
          type: "select",
          defaultValue: "freeze",
          choices: [
            { value: "freeze", label: "Export list of packages (freeze)" },
            {
              value: "load",
              label: "Install list from file (requirements.txt)",
            },
          ],
          condition: (opts) => opts.action === "requirements",
        },
      ],
      generator: (opts) => {
        const ev = opts.envName || "venv";
        switch (opts.action) {
          case "venv":
            return {
              command: `python -m venv ${ev}`,
              explanation: [
                {
                  part: "python",
                  desc: "Invokes the python command line interpreter.",
                },
                {
                  part: "-m venv",
                  desc: 'Executes the built-in library module "venv" used to build isolated virtual environments.',
                },
                {
                  part: ev,
                  desc: "The target folder name where the virtual environment libraries and files will be initialized.",
                },
              ],
            };
          case "activate-win":
            return {
              command: `.\\${ev}\\Scripts\\activate`,
              explanation: [
                {
                  part: `.\\${ev}\\Scripts\\activate`,
                  desc: "Runs the PowerShell/CMD batch script to update your terminal shell environment variables. Your terminal prompt will change to show the environment active.",
                },
              ],
            };
          case "activate-unix":
            return {
              command: `source ${ev}/bin/activate`,
              explanation: [
                {
                  part: "source",
                  desc: "Executes the activate file in the context of the active terminal shell.",
                },
                {
                  part: `${ev}/bin/activate`,
                  desc: "Path to the Unix environment activation shell script.",
                },
              ],
            };
          case "install":
            return {
              command: `pip install ${opts.packageName || "requests"}`,
              explanation: [
                {
                  part: "pip install",
                  desc: "Commands pip to download and install packages from the PyPI index.",
                },
                {
                  part: opts.packageName || "requests",
                  desc: "A space-separated list of packages to download (e.g. numpy, pandas, flask).",
                },
              ],
            };
          case "requirements":
            return {
              command:
                opts.pipMode === "freeze"
                  ? "pip freeze > requirements.txt"
                  : "pip install -r requirements.txt",
              explanation: [
                ...(opts.pipMode === "freeze"
                  ? [
                      {
                        part: "pip freeze",
                        desc: "Lists all packages installed in the current environment in a standardized format.",
                      },
                      {
                        part: ">",
                        desc: "Redirection operator: sends the console output of the previous command into a text file instead of printing to screen.",
                      },
                      {
                        part: "requirements.txt",
                        desc: "Name of the output text manifest.",
                      },
                    ]
                  : [
                      {
                        part: "pip install",
                        desc: "Standard install command.",
                      },
                      {
                        part: "-r requirements.txt",
                        desc: "Instructs pip to read the list of packages and versions from the given requirements file and install all of them.",
                      },
                    ]),
              ],
            };
          default:
            return { command: "python --version", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case "venv":
            return ""; // silent
          case "activate-win":
          case "activate-unix":
            return `(venv) C:\\projects\\tools>`;
          case "install":
            return `Collecting ${opts.packageName || "requests"}\n  Downloading requests-2.31.0-py3-none-any.whl (62 kB)\n  Downloading urllib3-2.0.7-py3-none-any.whl (124 kB)\nInstalling collected packages: urllib3, requests\n\x1b[32mSuccessfully installed requests-2.31.0 urllib3-2.0.7\x1b[0m`;
          case "requirements":
            return opts.pipMode === "freeze"
              ? "numpy==1.26.2\npandas==2.1.3\nrequests==2.31.0"
              : "Installing dependencies from requirements.txt...\n\x1b[32mAll packages up to date.\x1b[0m";
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        section: "Package Management",
        items: [
          {
            cmd: "pip uninstall <package>",
            desc: "Remove a package from the environment.",
          },
          {
            cmd: "pip list",
            desc: "Show all installed packages and versions.",
          },
          {
            cmd: "pip install <package> --upgrade",
            desc: "Upgrade package to the latest version.",
          },
        ],
      },
      {
        section: "Execution & Shell",
        items: [
          { cmd: "python script.py", desc: "Execute a python file." },
          {
            cmd: 'python -c "import os; print(os.getcwd())"',
            desc: "Execute a single-line python code snippet in the shell.",
          },
        ],
      },
    ],
  };
