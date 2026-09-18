export const scrcpy = {
  id: "scrcpy",
  name: "scrcpy",
  category: "Utilities",
  color: "#3ddc84",
  accentClass: "scrcpy-accent",
  github: "https://github.com/Genymobile/scrcpy",
  tagline: "Display and control your Android device from your computer.",
  description: "scrcpy provides high-performance display and control of Android devices connected via USB or over TCP/IP. It focuses on low latency, high quality, and requires no root access.",
  install: {
    windows: "winget install Genymobile.scrcpy",
    mac: "brew install scrcpy",
    linux: "sudo apt install scrcpy"
  },
  visualConcept: {
    title: "scrcpy Architecture",
    steps: [
      { name: "Connect", desc: "Device connected via USB/ADB", status: "staged" },
      { name: "Server Push", desc: "scrcpy-server.jar pushed to device", status: "modified" },
      { name: "Stream", desc: "Raw video/audio frames sent to PC", status: "remote" },
      { name: "Render & Control", desc: "PC renders UI and sends input back", status: "committed" }
    ]
  },
  interactiveBuilder: {
    title: "scrcpy Command Builder",
    description: "Customize resolution, performance, and recording settings for your screen mirroring session.",
    options: [
      { id: "maxSize", label: "Max Resolution (-m)", type: "text", defaultValue: "1024" },
      { id: "bitrate", label: "Bitrate (-b)", type: "text", defaultValue: "2M" },
      { id: "maxFps", label: "Max FPS (--max-fps)", type: "text", defaultValue: "" },
      { id: "record", label: "Record to file (-r)", type: "text", defaultValue: "" },
      { id: "noAudio", label: "Disable Audio (--no-audio)", type: "boolean", defaultValue: false },
      { id: "tcpip", label: "Wireless / TCP-IP (--tcpip)", type: "boolean", defaultValue: false }
    ],
    generator: (opts) => {
      let cmd = `scrcpy`;
      const explanation = [];

      if (opts.tcpip) {
        cmd += ` --tcpip`;
        explanation.push({ part: "--tcpip", desc: "Connects to a device over Wi-Fi (ADB TCP/IP must be enabled)." });
      }

      if (opts.maxSize) {
        cmd += ` -m ${opts.maxSize}`;
        explanation.push({ part: `-m ${opts.maxSize}`, desc: `Limits both width and height to ${opts.maxSize} pixels to save bandwidth.` });
      }

      if (opts.bitrate) {
        cmd += ` -b ${opts.bitrate}`;
        explanation.push({ part: `-b ${opts.bitrate}`, desc: `Sets the video bit-rate to ${opts.bitrate} (default is 8M).` });
      }

      if (opts.maxFps) {
        cmd += ` --max-fps ${opts.maxFps}`;
        explanation.push({ part: `--max-fps ${opts.maxFps}`, desc: `Limits the framerate to ${opts.maxFps} FPS.` });
      }

      if (opts.noAudio) {
        cmd += ` --no-audio`;
        explanation.push({ part: "--no-audio", desc: "Disables audio forwarding (useful for older Android versions or saving bandwidth)." });
      }

      if (opts.record) {
        cmd += ` -r ${opts.record}`;
        explanation.push({ part: `-r ${opts.record}`, desc: `Records the screen mirror session to ${opts.record} (e.g. file.mp4).` });
      }
      
      if (explanation.length === 0) {
        explanation.push({ part: "scrcpy", desc: "Starts mirroring the default connected device with default maximum quality." });
      }

      return { command: cmd, explanation };
    },
    simulatedOutput: () => `INFO: scrcpy 2.x <https://github.com/Genymobile/scrcpy>
INFO: ADB device found: 1234567890abcdef (device)
INFO: Device: Google Pixel 7 (Android 14)
INFO: Start encoder: video, audio
INFO: Texture: 1080x2400
INFO: Audio stream started`
  },
  cheatsheets: [
    {
      title: "Connection",
      icon: "📲",
      commands: [
        { cmd: "scrcpy", desc: "Start mirroring the single connected device." },
        { cmd: "scrcpy -s <serial>", desc: "Connect to a specific device by its ADB serial." },
        { cmd: "scrcpy --tcpip", desc: "Mirror a device connected over Wi-Fi." }
      ]
    },
    {
      title: "Performance & Quality",
      icon: "⚡",
      commands: [
        { cmd: "scrcpy -m 1024 -b 2M", desc: "Limit resolution to 1024 and bitrate to 2 Mbps (good for slow Wi-Fi)." },
        { cmd: "scrcpy --max-fps 30", desc: "Limit framerate to 30 FPS." },
        { cmd: "scrcpy --no-audio", desc: "Mirror video only without audio." }
      ]
    },
    {
      title: "Recording & Interaction",
      icon: "🎥",
      commands: [
        { cmd: "scrcpy -r capture.mp4", desc: "Record the screen while mirroring." },
        { cmd: "scrcpy --no-display -r capture.mp4", desc: "Record the screen without showing the mirror window." },
        { cmd: "scrcpy -K", desc: "Forward keyboard strokes directly (simulate physical keyboard)." },
        { cmd: "scrcpy --turn-screen-off", desc: "Turn off the physical device screen while mirroring." }
      ]
    }
  ]
};
