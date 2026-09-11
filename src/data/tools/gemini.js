export const gemini = {
    id: "gemini",
    name: "Gemini CLI",
    category: "AI",
    color: "#38bdf8",
    accentClass: "gemini-accent",
    github: "https://github.com/google/generative-ai",
    tagline:
      "Google's Gemini LLM wrapper for prompt engineering and file queries directly in the terminal.",
    description:
      "Google Gemini CLI lets you prompt, analyze files, customize temperatures, and stream responses directly from your command line. Leverage Gemini Flash and Pro models natively.",
    install: {
      windows: "npm install -g @google/gemini-cli",
      mac: "npm install -g @google/gemini-cli",
      linux: "npm install -g @google/gemini-cli",
    },
    visualConcept: {
      title: "Generative AI Request Flow",
      steps: [
        {
          name: "User Prompt",
          desc: "User feeds prompt text and/or file parameters in terminal.",
          status: "modified",
        },
        {
          name: "System Role",
          desc: "Custom agent instruction sets behavior constraint.",
          status: "staged",
        },
        {
          name: "API Gateway",
          desc: "Resolves model selection and fetches from Google Gemini API.",
          status: "committed",
        },
        {
          name: "Markdown Render",
          desc: "Streams and prints formatted markdown response directly to terminal.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Gemini Command Builder",
      description:
        "Configure and test commands for text prompts, custom models, system instructions, and multimodal file analysis.",
      options: [
        {
          id: "action",
          label: "Select Action",
          type: "select",
          defaultValue: "prompt",
          choices: [
            { value: "prompt", label: "Prompt with Custom Options" },
            { value: "multimodal", label: "Multimodal File Query" },
            { value: "config", label: "Setup & API Authentication" },
          ],
        },
        {
          id: "promptText",
          label: "Prompt Query",
          type: "text",
          defaultValue: "Explain quantum computing in simple terms.",
          condition: (opts) => opts.action !== "config",
        },
        {
          id: "modelName",
          label: "Gemini Model",
          type: "select",
          defaultValue: "gemini-2.5-flash",
          choices: [
            {
              value: "gemini-2.5-flash",
              label: "Gemini 2.5 Flash (Fast & Multimodal)",
            },
            {
              value: "gemini-2.5-pro",
              label: "Gemini 2.5 Pro (Deep Reasoning & Coding)",
            },
            {
              value: "gemini-1.5-flash",
              label: "Gemini 1.5 Flash (Legacy lightweight)",
            },
          ],
          condition: (opts) => opts.action !== "config",
        },
        {
          id: "systemInstruction",
          label: "System Instruction",
          type: "text",
          defaultValue: "You are a helpful coding assistant.",
          condition: (opts) => opts.action === "prompt",
        },
        {
          id: "temperature",
          label: "Temperature (Creativity)",
          type: "select",
          defaultValue: "0.7",
          choices: [
            { value: "0.2", label: "0.2 (Focused & Deterministic)" },
            { value: "0.7", label: "0.7 (Balanced & Creative)" },
            { value: "1.0", label: "1.0 (Highly Creative)" },
          ],
          condition: (opts) => opts.action === "prompt",
        },
        {
          id: "filePath",
          label: "Input File Path",
          type: "text",
          defaultValue: "data.csv",
          condition: (opts) => opts.action === "multimodal",
        },
      ],
      generator: (opts) => {
        switch (opts.action) {
          case "prompt":
            return {
              command: `gemini --model ${opts.modelName || "gemini-2.5-flash"} --system "${opts.systemInstruction || "You are a helpful coding assistant."}" --temp ${opts.temperature || "0.7"} "${opts.promptText || "Explain quantum computing in simple terms."}"`,
              explanation: [
                { part: "gemini", desc: "Invokes the Google Gemini CLI." },
                {
                  part: `--model ${opts.modelName || "gemini-2.5-flash"}`,
                  desc: "Specifies which version of Gemini to route the prompt to.",
                },
                {
                  part: `--system "${opts.systemInstruction || "You are a helpful coding assistant."}"`,
                  desc: "Defines the behavioral persona or instructions for the LLM.",
                },
                {
                  part: `--temp ${opts.temperature || "0.7"}`,
                  desc: "Controls randomness. Lower values are analytical; higher values are creative.",
                },
                {
                  part: `"${opts.promptText || "Explain quantum computing in simple terms."}"`,
                  desc: "The prompt query or question sent to the model.",
                },
              ],
            };
          case "multimodal":
            return {
              command: `gemini --model ${opts.modelName || "gemini-2.5-flash"} --file ${opts.filePath || "data.csv"} "${opts.promptText || "Explain quantum computing in simple terms."}"`,
              explanation: [
                { part: "gemini", desc: "Invokes the Google Gemini CLI." },
                {
                  part: `--model ${opts.modelName || "gemini-2.5-flash"}`,
                  desc: "Specifies the target model (typically Gemini 2.5 Flash).",
                },
                {
                  part: `--file ${opts.filePath || "data.csv"}`,
                  desc: "Paths of files (images, audio, csv) to attach to the query context.",
                },
                {
                  part: `"${opts.promptText || "Explain quantum computing in simple terms."}"`,
                  desc: "The instructions or questions based on the attached file context.",
                },
              ],
            };
          case "config":
            return {
              command: "gemini configure",
              explanation: [
                {
                  part: "gemini configure",
                  desc: "Launches the interactive setup prompt to securely store your Google Gemini API Key locally.",
                },
              ],
            };
          default:
            return { command: "gemini", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case "prompt":
            return `gemini --model ${opts.modelName || "gemini-2.5-flash"} --temp ${opts.temperature || "0.7"}...\n\x1b[35m[Gemini AI Response]\x1b[0m\nQuantum computing uses qubits instead of classical bits. While classical bits can represent 0 or 1, qubits can exist in a superposition of both states simultaneously, allowing complex computations to be solved exponentially faster.\n\n\x1b[32m[Tokens: 124 input, 68 output]\x1b[0m`;
          case "multimodal":
            return `gemini --model ${opts.modelName || "gemini-2.5-flash"} --file ${opts.filePath || "data.csv"}...\n\x1b[35m[Gemini Multimodal Parser]\x1b[0m\nReading file ${opts.filePath || "data.csv"}...\nAnalysis: The uploaded dataset contains 150 rows. Key trend reveals a 12% increase in developer activity during weekends. Recommended action: optimize server capacity on Saturdays.\n\n\x1b[32m[Finished Processing]\x1b[0m`;
          case "config":
            return `? Enter your Google Gemini API Key: ****************************************\n\x1b[32m✔ Configuration saved to ~/.geminirc\x1b[0m`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        section: "Basic Queries",
        items: [
          {
            cmd: 'gemini "write a python quicksort"',
            desc: "Quick prompt run and output response.",
          },
          {
            cmd: 'gemini --stream "explain recursion"',
            desc: "Stream Gemini response token by token in real-time.",
          },
        ],
      },
      {
        section: "Model & Config",
        items: [
          {
            cmd: "gemini --list-models",
            desc: "List all available Gemini models and metadata.",
          },
          { cmd: "gemini configure", desc: "Interactive setup for API keys." },
        ],
      },
      {
        section: "Multimodal Inputs",
        items: [
          {
            cmd: 'gemini --file logs.txt "find the error"',
            desc: "Attach a text file to your Gemini prompt.",
          },
          {
            cmd: 'gemini --image chart.png "summarize chart"',
            desc: "Attach an image file to analyze structure/content.",
          },
        ],
      },
    ],
  };
