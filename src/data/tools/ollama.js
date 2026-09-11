export const ollama = {
    id: "ollama",
    name: "Ollama",
    category: "AI",
    color: "#a855f7",
    accentClass: "ollama-accent",
    github: "https://github.com/ollama/ollama",
    tagline: "Run large language models locally on your system.",
    description:
      "Ollama is a lightweight, extensible framework for building and running large language models (LLMs) locally. It packages model weights, configuration, and dependencies into a single Modelfile.",
    install: {
      windows: "winget install Ollama.Ollama",
      mac: "brew install ollama",
      linux: "curl -fsSL https://ollama.com/install.sh | sh",
    },
    visualConcept: {
      title: "Local LLM Architecture",
      steps: [
        {
          name: "CLI Command",
          desc: "Type command to load models locally.",
          status: "modified",
        },
        {
          name: "Ollama Server",
          desc: "A background service running on port 11434 serving models.",
          status: "staged",
        },
        {
          name: "GGUF Models",
          desc: "Quantized LLM files loaded in RAM/VRAM for prompt processing.",
          status: "committed",
        },
        {
          name: "Local Output",
          desc: "Model response streamed back over local sockets. 100% private.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Ollama CLI Companion",
      description:
        "Configure models and options to run, pull, manage, or query offline artificial intelligence models.",
      options: [
        {
          id: "action",
          label: "Select Action",
          type: "select",
          defaultValue: "run",
          choices: [
            { value: "run", label: "Run a Model (Interactive)" },
            { value: "pull", label: "Pull/Download Model" },
            { value: "list", label: "List Installed Models" },
            { value: "show", label: "Show Model Info" },
            { value: "rm", label: "Remove Model" },
          ],
        },
        {
          id: "modelName",
          label: "Select Model",
          type: "select",
          defaultValue: "llama3",
          choices: [
            { value: "llama3", label: "Llama 3 (Meta, 8B params)" },
            { value: "mistral", label: "Mistral (7B params)" },
            { value: "phi3", label: "Phi-3 (Microsoft, 3.8B params)" },
            {
              value: "deepseek-coder",
              label: "DeepSeek Coder (Coding expert)",
            },
            { value: "gemma2", label: "Gemma 2 (Google, 9B params)" },
          ],
          condition: (opts) =>
            ["run", "pull", "show", "rm"].includes(opts.action),
        },
      ],
      generator: (opts) => {
        switch (opts.action) {
          case "run":
            return {
              command: `ollama run ${opts.modelName || "llama3"}`,
              explanation: [
                {
                  part: "ollama run",
                  desc: "Runs a model. If the model is not downloaded, it pulls it automatically first, then starts an interactive chat terminal.",
                },
                {
                  part: opts.modelName || "llama3",
                  desc: "The name of the local model repository to load.",
                },
              ],
            };
          case "pull":
            return {
              command: `ollama pull ${opts.modelName || "llama3"}`,
              explanation: [
                {
                  part: "ollama pull",
                  desc: "Downloads a model from the Ollama library without starting a chat session.",
                },
                {
                  part: opts.modelName || "llama3",
                  desc: "The specific model tag to fetch.",
                },
              ],
            };
          case "list":
            return {
              command: "ollama list",
              explanation: [
                {
                  part: "ollama list",
                  desc: "Lists all models currently stored locally on your hard drive and available to run.",
                },
              ],
            };
          case "show":
            return {
              command: `ollama show ${opts.modelName || "llama3"}`,
              explanation: [
                {
                  part: "ollama show",
                  desc: "Displays detailed metadata, license information, system prompt details, and parameters of a model.",
                },
                {
                  part: opts.modelName || "llama3",
                  desc: "The model whose details you wish to view.",
                },
              ],
            };
          case "rm":
            return {
              command: `ollama rm ${opts.modelName || "llama3"}`,
              explanation: [
                {
                  part: "ollama rm",
                  desc: "Deletes the selected local model file, freeing up storage space.",
                },
                {
                  part: opts.modelName || "llama3",
                  desc: "The target model to delete.",
                },
              ],
            };
          default:
            return { command: "ollama --help", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const m = opts.modelName || "llama3";
        switch (opts.action) {
          case "run":
            return `\x1b[32m>>>\x1b[0m \x1b[37mHello, who are you?\x1b[0m\nI am a large language model trained by Meta, running locally on your hardware via Ollama. How can I help you today?\n\x1b[32m>>>\x1b[0m \x1b[37m[Press Ctrl+D to exit]\x1b[0m`;
          case "pull":
            return `pulling manifest\ndownloading f02422.. (4.7 GB) [====================>] 100% 45.2 MB/s\nverifying sha256 digest\nwriting manifest\nsuccess`;
          case "list":
            return `NAME                 ID           SIZE      MODIFIED\n${m}:latest       e4a19bc451b2 4.7 GB    2 minutes ago\nmistral:latest       9c8a41753ba0 4.1 GB    1 day ago\ngemma2:latest        c92ea84b01e2 5.5 GB    3 days ago`;
          case "show":
            return `Model Details\n  family:             llama\n  parameter size:     8.0B\n  quantization level: Q4_K_M\n\nParameters\n  stop:               "<|start_header_id|>"\n  stop:               "<|end_header_id|>"\n  stop:               "<|eot_id|>"`;
          case "rm":
            return `deleted '${m}'`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        section: "Server & Control",
        items: [
          {
            cmd: "ollama serve",
            desc: "Start the Ollama background server manually.",
          },
          {
            cmd: "ollama --version",
            desc: "Check the currently installed Ollama client and server versions.",
          },
        ],
      },
      {
        section: "Model Customization",
        items: [
          {
            cmd: "ollama create mymodel -f ./Modelfile",
            desc: "Build a custom model from a definition File.",
          },
          {
            cmd: 'ollama run gemma2 "Why is the sky blue?"',
            desc: "Run a one-off prompt command and print output directly.",
          },
        ],
      },
    ],
  };
