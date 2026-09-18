export const nmap = {
  id: "nmap",
  name: "Nmap",
  category: "Utilities",
  color: "#2a628f",
  accentClass: "nmap-accent",
  github: "https://github.com/nmap/nmap",
  tagline: "The Network Mapper for network discovery and security auditing.",
  description: "Nmap is a free and open-source utility for network discovery and security auditing. It is widely used by system administrators to inventory network devices, monitor host uptime, and perform security checks.",
  install: {
    windows: "winget install Insecure.Nmap",
    mac: "brew install nmap",
    linux: "sudo apt install nmap"
  },
  visualConcept: {
    title: "Nmap Scanning Process",
    steps: [
      { name: "Target", desc: "Define IP or Domain (e.g., scanme.nmap.org)", status: "staged" },
      { name: "Discovery", desc: "Ping sweep to find live hosts", status: "modified" },
      { name: "Port Scan", desc: "Probe specific ports (TCP/UDP)", status: "remote" },
      { name: "Analysis", desc: "Detect OS and Service versions", status: "committed" }
    ]
  },
  interactiveBuilder: {
    title: "Nmap Scan Builder",
    description: "Generate Nmap commands for network exploration (Note: Only scan networks you have permission to test).",
    options: [
      { id: "target", label: "Target (IP/Domain)", type: "text", defaultValue: "scanme.nmap.org" },
      { id: "scanType", label: "Scan Type", type: "select", defaultValue: "syn", choices: [
        { value: "syn", label: "SYN Scan (-sS)" },
        { value: "tcp", label: "Connect Scan (-sT)" },
        { value: "udp", label: "UDP Scan (-sU)" },
        { value: "ping", label: "Ping Sweep (-sn)" }
      ]},
      { id: "serviceDetection", label: "Service Version Detection (-sV)", type: "boolean", defaultValue: true },
      { id: "osDetection", label: "OS Detection (-O)", type: "boolean", defaultValue: false },
      { id: "ports", label: "Specific Ports (-p)", type: "text", defaultValue: "" }
    ],
    generator: (opts) => {
      let cmd = `nmap`;
      
      const explanation = [];
      
      if (opts.scanType === "syn") {
        cmd += ` -sS`;
        explanation.push({ part: "-sS", desc: "Performs a stealthy TCP SYN scan (requires root/admin)." });
      } else if (opts.scanType === "tcp") {
        cmd += ` -sT`;
        explanation.push({ part: "-sT", desc: "Performs a full TCP connect scan." });
      } else if (opts.scanType === "udp") {
        cmd += ` -sU`;
        explanation.push({ part: "-sU", desc: "Performs a UDP scan." });
      } else if (opts.scanType === "ping") {
        cmd += ` -sn`;
        explanation.push({ part: "-sn", desc: "Performs a ping sweep (disables port scanning)." });
      }

      if (opts.serviceDetection && opts.scanType !== "ping") {
        cmd += ` -sV`;
        explanation.push({ part: "-sV", desc: "Probes open ports to determine service/version info." });
      }
      
      if (opts.osDetection && opts.scanType !== "ping") {
        cmd += ` -O`;
        explanation.push({ part: "-O", desc: "Enables OS detection." });
      }
      
      if (opts.ports && opts.scanType !== "ping") {
        cmd += ` -p ${opts.ports}`;
        explanation.push({ part: `-p ${opts.ports}`, desc: `Scans only the specified ports.` });
      }
      
      const target = opts.target || "scanme.nmap.org";
      cmd += ` ${target}`;
      explanation.push({ part: target, desc: "The target IP address, hostname, or network range." });
      
      return { command: cmd, explanation };
    },
    simulatedOutput: (opts) => `Starting Nmap 7.93 ( https://nmap.org )
Nmap scan report for ${opts.target || "scanme.nmap.org"}
Host is up (0.042s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1
80/tcp open  http    Apache httpd 2.4.41

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`
  },
  cheatsheets: [
    {
      title: "Basic Scanning",
      icon: "🎯",
      commands: [
        { cmd: "nmap 192.168.1.1", desc: "Scan a single IP." },
        { cmd: "nmap example.com", desc: "Scan a hostname." },
        { cmd: "nmap 192.168.1.0/24", desc: "Scan an entire subnet." }
      ]
    },
    {
      title: "Discovery & Ports",
      icon: "🚪",
      commands: [
        { cmd: "nmap -sn 192.168.1.0/24", desc: "Ping sweep a network to find live hosts without port scanning." },
        { cmd: "nmap -p 80,443 example.com", desc: "Scan only specific ports (HTTP and HTTPS)." },
        { cmd: "nmap -p- 127.0.0.1", desc: "Scan all 65535 ports on localhost." }
      ]
    },
    {
      title: "Advanced Scanning",
      icon: "🔬",
      commands: [
        { cmd: "nmap -sV scanme.nmap.org", desc: "Detect versions of services running on open ports." },
        { cmd: "nmap -O 192.168.1.1", desc: "Attempt to identify the operating system of the target." },
        { cmd: "nmap -A example.com", desc: "Aggressive scan (Enables OS detection, version detection, script scanning, and traceroute)." }
      ]
    }
  ]
};
