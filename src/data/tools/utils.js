export const utils = {
    id: "utils",
    name: "More CLI Utilities",
    category: "Utilities",
    color: "#eab308",
    accentClass: "utils-accent",
    tagline: "Standard commands that every CLI power user should master.",
    description:
      "A curated collection of essential command line tools for text manipulation, networking, containers, and server multiplexing.",
    install: {
      windows:
        "winget install jqlang.jq BurntSushi.ripgrep Docker.DockerDesktop",
      mac: "brew install jq ripgrep tmux",
      linux: "sudo apt install jq ripgrep tmux curl",
    },
    visualConcept: {
      title: "Pipes & Streams Lifecycle",
      steps: [
        {
          name: "Data Source",
          desc: "An application output, logs, or a text file (e.g. cat server.json).",
          status: "modified",
        },
        {
          name: "Pipe Operator (|)",
          desc: "Redirects stdout of left command into stdin of right command.",
          status: "staged",
        },
        {
          name: "Parser (jq/grep)",
          desc: "Processes, filters, filters regular expressions, or reformats stream.",
          status: "committed",
        },
        {
          name: "Terminal / File",
          desc: "Outputs matching lines or writes new parsed content to disk.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "General Utility Builder",
      description:
        "Configure and test commands for Docker, JSON parsing (jq), regex searching (ripgrep/grep), and curl HTTP requests.",
      options: [
        {
          id: "action",
          label: "Select Tool",
          type: "select",
          defaultValue: "jq",
          choices: [
            { value: "jq", label: "jq - JSON Processor" },
            { value: "ripgrep", label: "ripgrep (rg) - Regex Search" },
            { value: "curl", label: "curl - HTTP Client" },
            { value: "docker", label: "docker - Containers" },
            { value: "tmux", label: "tmux - Terminal Multiplexer" },
          ],
        },
        {
          id: "jqFilter",
          label: "JSON Filter Key",
          type: "text",
          defaultValue: ".users[0].name",
          condition: (opts) => opts.action === "jq",
        },
        {
          id: "rgQuery",
          label: "Search Query",
          type: "text",
          defaultValue: "TODO: fix styles",
          condition: (opts) => opts.action === "ripgrep",
        },
        {
          id: "curlUrl",
          label: "URL Endpoint",
          type: "text",
          defaultValue: "https://api.github.com/repos/facebook/react",
          condition: (opts) => opts.action === "curl",
        },
        {
          id: "dockerImage",
          label: "Docker Image to run",
          type: "select",
          defaultValue: "nginx:alpine",
          choices: [
            { value: "nginx:alpine", label: "Nginx Web Server" },
            { value: "postgres:alpine", label: "PostgreSQL Database" },
            { value: "redis:alpine", label: "Redis Cache" },
          ],
          condition: (opts) => opts.action === "docker",
        },
        {
          id: "tmuxName",
          label: "Session Name",
          type: "text",
          defaultValue: "developer-workspace",
          condition: (opts) => opts.action === "tmux",
        },
      ],
      generator: (opts) => {
        switch (opts.action) {
          case "jq":
            return {
              command: `cat data.json | jq '${opts.jqFilter || "."}'`,
              explanation: [
                {
                  part: "cat data.json",
                  desc: 'Reads and prints the content of "data.json" to standard output.',
                },
                { part: "|", desc: "Pipes stdout into the next command." },
                { part: "jq", desc: "Invokes the jq JSON parser." },
                {
                  part: `'${opts.jqFilter}'`,
                  desc: "The JSON query path filter. Extracts specific items, arrays, or fields.",
                },
              ],
            };
          case "ripgrep":
            return {
              command: `rg "${opts.rgQuery || "TODO"}" --line-number`,
              explanation: [
                {
                  part: "rg",
                  desc: "Invokes ripgrep, a recursive regex search tool that is faster than grep.",
                },
                {
                  part: `"${opts.rgQuery}"`,
                  desc: "The string or regular expression to look for.",
                },
                {
                  part: "--line-number",
                  desc: "Prints the line number matching the text query.",
                },
              ],
            };
          case "curl":
            return {
              command: `curl -i -X GET ${opts.curlUrl || "https://api.github.com"}`,
              explanation: [
                {
                  part: "curl",
                  desc: "Command line tool for transferring data over URLs.",
                },
                {
                  part: "-i",
                  desc: "Prints HTTP response headers along with body.",
                },
                {
                  part: "-X GET",
                  desc: "Designates the HTTP Request method (GET, POST, PUT, DELETE, etc.).",
                },
                {
                  part: opts.curlUrl || "https://api.github.com",
                  desc: "Target endpoint URL to fetch.",
                },
              ],
            };
          case "docker":
            return {
              command: `docker run -d -p 8080:80 --name web-container ${opts.dockerImage || "nginx:alpine"}`,
              explanation: [
                {
                  part: "docker run",
                  desc: "Tells docker to download (if not present) and execute an image inside a container.",
                },
                {
                  part: "-d",
                  desc: "Runs container in detached background mode.",
                },
                {
                  part: "-p 8080:80",
                  desc: "Binds port 8080 on the host machine to port 80 inside the container.",
                },
                {
                  part: "--name web-container",
                  desc: "Sets a readable reference name for this container instance.",
                },
                {
                  part: opts.dockerImage || "nginx:alpine",
                  desc: "The base template image tag to initialize.",
                },
              ],
            };
          case "tmux":
            return {
              command: `tmux new -s ${opts.tmuxName || "work"}`,
              explanation: [
                { part: "tmux new", desc: "Builds a new tmux server session." },
                { part: "-s", desc: "Tells tmux to name the session." },
                {
                  part: opts.tmuxName || "work",
                  desc: "A custom handle to connect back to this multiplexed shell session later.",
                },
              ],
            };
          default:
            return { command: "help", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case "jq":
            return `\x1b[36m{\n  "name": "Jane Doe",\n  "active": true\n}\x1b[0m`;
          case "ripgrep":
            return `src/App.jsx:45:    // \x1b[31m${opts.rgQuery || "TODO: fix styles"}\x1b[0m\nsrc/components/Sidebar.jsx:112:    // \x1b[31m${opts.rgQuery || "TODO: fix styles"}\x1b[0m`;
          case "curl":
            return `HTTP/2 200\nserver: GitHub.com\ndate: Thu, 11 Jun 2026 01:46:00 GMT\ncontent-type: application/json; charset=utf-8\n\n\x1b[32m{"id": 10279, "name": "react", "full_name": "facebook/react"}\x1b[0m`;
          case "docker":
            return `Unable to find image '${opts.dockerImage || "nginx:alpine"}' locally\nlatest: Pulling from library/nginx\nDigest: sha256:d82b4...31b2\nStatus: Downloaded newer image\n\x1b[32mdf27a08b982ac63481bdf9618a804791538bc1a3b4db732890\x1b[0m`;
          case "tmux":
            return `[tmux session created]`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        title: "Docker",
      icon: "🐳",
        commands: [
          { cmd: "docker ps", desc: "List active container processes." },
          {
            cmd: "docker logs <container-id>",
            desc: "View server stdout/stderr output from a container.",
          },
          {
            cmd: "docker stop <container-id>",
            desc: "Halt a running container.",
          },
        ],
      },
      {
        title: "Tmux",
      icon: "🖥️",
        commands: [
          {
            cmd: "tmux attach -t <session>",
            desc: "Connect to an active terminal multiplexer session.",
          },
          { cmd: "Ctrl+B then %", desc: "Split terminal screen vertically." },
          {
            cmd: "Ctrl+B then D",
            desc: "Detach from current tmux session but keep terminal running in background.",
          },
        ],
      },
    ],
  };
