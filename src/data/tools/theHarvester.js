export const theHarvester = {
  id: "theharvester",
  name: "theHarvester",
  category: "Information Gathering",
  color: "#a855f7",
  accentClass: "ollama-accent",
  github: "https://github.com/laramies/theHarvester",
  tagline:
    "OSINT reconnaissance tool for emails, subdomains, hosts, and open ports.",
  description:
    "theHarvester is a Python-based OSINT (Open-Source Intelligence) gathering tool used during the reconnaissance phase of red team assessments and penetration testing. It collects publicly available information from 50+ sources including search engines, PGP key servers, and specialized databases like Shodan, VirusTotal, and HaveIBeenPwned. Use it to discover email addresses, subdomains, hosts, employee names, open ports, and banners — all from the command line.",
  install: {
    windows:
      "git clone https://github.com/laramies/theHarvester.git && cd theHarvester && python -m venv venv && venv\\Scripts\\activate && pip install .",
    mac: "git clone https://github.com/laramies/theHarvester.git && cd theHarvester && python3 -m venv venv && source venv/bin/activate && pip install .",
    linux: "sudo apt update && sudo apt install theharvester -y",
  },
  visualConcept: {
    title: "infrometion gedering tools",
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
    title: "theHarvester Command Builder",
    description:
      "Configure options to run theHarvester for OSINT reconnaissance.",
    options: [
      {
        id: "domain",
        label: "Target Domain",
        type: "text",
        placeholder: "example.com",
        required: true,
        help: "The domain you want to gather information about",
      },
      {
        id: "source",
        label: "Data Source",
        type: "select",
        options: [
          { value: "all", label: "All Sources (Recommended)" },
          { value: "duckduckgo", label: "DuckDuckGo" },
          { value: "bing", label: "Bing" },
          { value: "crtsh", label: "CRT.sh (Certificate Transparency)" },
          { value: "certspotter", label: "CertSpotter" },
          { value: "urlscan", label: "URLScan.io" },
          { value: "haveibeenpwned", label: "HaveIBeenPwned (Breaches)" },
          { value: "shodan", label: "Shodan (API Key Required)" },
          { value: "virustotal", label: "VirusTotal (API Key Required)" },
          { value: "hunter", label: "Hunter.io (API Key Required)" },
          { value: "github-code", label: "GitHub Code (API Key Required)" },
        ],
        default: "all",
        help: "Choose which source(s) to query for information",
      },
      {
        id: "limit",
        label: "Result Limit",
        type: "number",
        placeholder: "500",
        default: 500,
        min: 1,
        max: 5000,
        help: "Maximum results per source (default: 500)",
      },
      {
        id: "output",
        label: "Output File",
        type: "text",
        placeholder: "report",
        help: "Base filename for saving results (creates .jsonl, .json, .xml)",
      },
      {
        id: "outputFormat",
        label: "Output Format",
        type: "select",
        options: [
          { value: "jsonl", label: "JSONL (Best for automation)" },
          { value: "json", label: "JSON" },
          { value: "xml", label: "XML" },
        ],
        default: "jsonl",
        help: "Format for the saved output file",
      },
    ],
    generator: (opts) => {
      let cmd = "theHarvester";

      if (opts.domain) {
        cmd += ` -d ${opts.domain}`;
      }

      if (opts.source) {
        cmd += ` -b ${opts.source}`;
      }

      if (opts.limit) {
        cmd += ` -l ${opts.limit}`;
      }

      if (opts.output) {
        cmd += ` -f ${opts.output}`;
      }

      return cmd;
    },
    simulatedOutput: (opts) => {
      const domain = opts.domain || "example.com";
      const source = opts.source || "all";
      const limit = opts.limit || 500;

      return `
[+] Target: ${domain}
[+] Source: ${source}
[+] Limit: ${limit}

[*] Searching ${source}...

[+] Emails found:
security@${domain}
admin@${domain}
contact@${domain}
support@${domain}

[+] Hosts found:
api.${domain}
mail.${domain}
dev.${domain}
staging.${domain}
blog.${domain}

[+] IPs found:
192.0.2.10
192.0.2.11
198.51.100.5

[+] URLs found:
https://api.${domain}/v1
https://dev.${domain}/login

[+] Shodan results:
192.0.2.10:22 (SSH)
192.0.2.10:80 (HTTP)
192.0.2.11:443 (HTTPS)

[+] Scan complete. Results saved to ${opts.output || "report"}.${opts.outputFormat || "jsonl"}
      `.trim();
    },
  },
  cheatsheets: [
    {
      title: "Basic Usage",
      icon: "🚀",
      commands: [
        {
          cmd: "theHarvester -d example.com -b duckduckgo -l 100",
          desc: "Simple scan using DuckDuckGo",
        },
        {
          cmd: "theHarvester -d example.com -b all -l 100",
          desc: "Scan all available sources",
        },
        {
          cmd: "theHarvester -d example.com -b all -l 100 -f report",
          desc: "Scan and save results to file",
        },
      ],
    },
    {
      title: "Email Enumeration",
      icon: "📧",
      commands: [
        {
          cmd: "theHarvester -d example.com -b duckduckgo -l 200",
          desc: "Find up to 200 email addresses",
        },
        {
          cmd: "theHarvester -d example.com -b haveibeenpwned",
          desc: "Check for breached emails",
        },
        {
          cmd: "theHarvester -d example.com -b hunter",
          desc: "Hunter.io source (API key required)",
        },
      ],
    },
    {
      title: "Subdomain Discovery",
      icon: "🌐",
      commands: [
        {
          cmd: "theHarvester -d example.com -b bing -l 100",
          desc: "Find subdomains via Bing",
        },
        {
          cmd: "theHarvester -d example.com -b crtsh",
          desc: "Certificate Transparency logs se subdomains",
        },
        {
          cmd: "theHarvester -d example.com -b certspotter",
          desc: "CertSpotter se subdomains",
        },
      ],
    },
    {
      title: "API Enrichment",
      icon: "🔑",
      commands: [
        {
          cmd: "theHarvester -d example.com -b shodan -l 100",
          desc: "Shodan se hosts, ports, banners",
        },
        {
          cmd: "theHarvester -d example.com -b virustotal",
          desc: "VirusTotal se subdomains",
        },
        {
          cmd: "theHarvester -d example.com -b github-code",
          desc: "GitHub code search se emails",
        },
      ],
    },
    {
      title: "Output & Automation",
      icon: "⚙️",
      commands: [
        {
          cmd: "theHarvester -d example.com -b all -f report",
          desc: "Save to report.jsonl, report.json, report.xml",
        },
        {
          cmd: "jq -r 'select(.type == \"email\") | .value' report.jsonl",
          desc: "Extract emails from JSONL output",
        },
        {
          cmd: "jq -r 'select(.type == \"hostname\") | .value' report.jsonl",
          desc: "Extract subdomains from JSONL output",
        },
      ],
    },
    {
      title: "Pro Tips",
      icon: "💡",
      commands: [
        {
          cmd: "theHarvester -d example.com -b all -l 500 -f full_recon",
          desc: "Complete reconnaissance with all sources",
        },
        {
          cmd: "theHarvester -d example.com -b google,bing,duckduckgo -l 200",
          desc: "Multiple specific sources",
        },
        {
          cmd: "theHarvester -d example.com -b urlscan -l 100",
          desc: "URLScan.io se comprehensive data",
        },
      ],
    },
  ],
};
