import { Link } from "react-router-dom";
import {
  Terminal,
  ArrowLeft,
  Cpu,
  Sparkles,
  BookOpen,
  Heart,
  Code,
  Zap,
  HelpCircle,
  Gift
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { GithubIcon } from "./icons";
import "./css/About.css";

export default function About() {
  useSEO({
    title: "About Tools CLI - Interactive Command Line Companion",
    description: "Learn more about Tools CLI, a modern developer dashboard featuring command generators, syntax breakdowns, and interactive simulators.",
    path: "about"
  });

  return (
    <div className="about-page-container">
      {/* Hero Header */}
      <header className="about-hero">
        <div className="about-logo-wrapper">
          <Terminal size={32} />
        </div>
        <h1>About Tools CLI</h1>
        <p className="about-tagline">
          An interactive, high-fidelity developer dashboard designed to help you master and configure advanced command line interface (CLI) engines.
        </p>
      </header>

      {/* Main Core Features Grid */}
      <section className="about-grid">
        <div className="about-card">
          <div className="about-card-icon">
            <Cpu size={28} />
          </div>
          <h3>Command Generator</h3>
          <p>
            Tweak settings, toggle options, and customize variables through clean sliders and dropdowns. The CLI commands dynamically regenerate in real-time.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <BookOpen size={28} />
          </div>
          <h3>Syntax Breakdown</h3>
          <p>
            Understand the 'why' behind every command. Get instant, clickable flag breakdowns and detailed inline documentation explaining parameter rules.
          </p>
        </div>

        <div className="about-card">
          <div className="about-card-icon">
            <Terminal size={28} />
          </div>
          <h3>Interactive Simulator</h3>
          <p>
            Test your generated syntax immediately. Run the simulated command in a custom browser terminal container with mock progress outputs.
          </p>
        </div>
      </section>

      {/* Why Master the Command Line Section */}
      <section className="about-section">
        <h2>
          <Zap size={24} style={{ color: "var(--accent-color)" }} />
          Why Master the Command Line?
        </h2>
        <p>
          The command line interface is one of the most powerful and enduring tools in computer science. Mastering it unlocks deep developer productivity benefits:
        </p>
        <div className="about-row-3col" style={{ marginBottom: 0, gap: "1.5rem" }}>
          <div className="about-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ color: "#fff", marginTop: 0, marginBottom: "0.5rem", fontWeight: 700 }}>⚡ 10x Efficiency</h4>
            <p style={{ fontSize: "0.9rem" }}>
              Typing a command is significantly faster than navigating multiple menus in a graphical user interface (GUI).
            </p>
          </div>
          <div className="about-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ color: "#fff", marginTop: 0, marginBottom: "0.5rem", fontWeight: 700 }}>⚙️ Workflows Automation</h4>
            <p style={{ fontSize: "0.9rem" }}>
              CLI tools are easily chained together in pipelines (e.g. using `|` or script files) to fully automate repetitive tasks.
            </p>
          </div>
          <div className="about-card" style={{ padding: "1.5rem" }}>
            <h4 style={{ color: "#fff", marginTop: 0, marginBottom: "0.5rem", fontWeight: 700 }}>🔒 Total Power & Access</h4>
            <p style={{ fontSize: "0.9rem" }}>
              GUIs hide 90% of a tool's parameters. The CLI exposes every micro-setting and configuration option of the core engine.
            </p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="about-section">
        <h2>
          <HelpCircle size={24} style={{ color: "var(--accent-color)" }} />
          How It Works
        </h2>
        <p>
          Tools CLI leverages client-side React logic to map parameters directly to command line options. Here is our three-step learning lifecycle:
        </p>
        <div className="about-timeline">
          <div className="about-timeline-item">
            <div className="about-timeline-badge">1</div>
            <div className="about-timeline-content">
              <h4>Configure Options</h4>
              <p>Adjust inputs, toggle switches, or select options on the GUI panel matching your specific development goal.</p>
            </div>
          </div>
          <div className="about-timeline-item">
            <div className="about-timeline-badge">2</div>
            <div className="about-timeline-content">
              <h4>Analyze Generated Syntax</h4>
              <p>Watch the syntax generator dynamically compile options into clean commands, and click on individual flags to inspect their breakdown definitions.</p>
            </div>
          </div>
          <div className="about-timeline-item">
            <div className="about-timeline-badge">3</div>
            <div className="about-timeline-content">
              <h4>Simulate Execution</h4>
              <p>Click "Run Command" to run a safe, mock terminal session inside the dashboard, outputting realistic shell logs for interactive learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / Technical Stack Section */}
      <section className="about-section">
        <h2>
          <Sparkles size={24} style={{ color: "var(--accent-color)" }} />
          The Philosophy
        </h2>
        <p>
          Configuring complex tools like Git, FFmpeg, Ollama, Docker, or yt-dlp usually requires digging through hundreds of pages of raw man pages and documentation. Tools CLI aims to bridge this gap by providing an interactive visual companion. We believe learning command tools should be visual, safe (local simulations), and modular.
        </p>

        <h2>
          <Code size={24} style={{ color: "var(--accent-color)" }} />
          Built With Modern Tech
        </h2>
        <p style={{ marginBottom: "1.5rem" }}>
          This dashboard is constructed with highly optimized, modern React architecture, utilizing stable state hooks, custom context, and performance-oriented structures.
        </p>
        <div className="tech-tags">
          <span className="tech-tag">React 19</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">React Router v7</span>
          <span className="tech-tag">Lucide Icons</span>
          <span className="tech-tag">Glassmorphic CSS</span>
          <span className="tech-tag">Single-Page Architecture</span>
        </div>
      </section>

      {/* Open Source Initiative Section */}
      <section className="about-section">
        <h2>
          <GithubIcon size={24} style={{ color: "var(--accent-color)" }} />
          Open Source Initiative
        </h2>
        <p style={{ marginBottom: "2rem" }}>
          Tools CLI is completely open-source and community-driven. We believe that developer tools should be transparent, accessible, and free of cost. The entire codebase is public, allowing developers around the world to study, customize, fork, and contribute to the platform.
        </p>
        <div>
          <a
            href="https://github.com/karan-k-code/tools-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="about-back-btn"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-color)",
              color: "#fff",
              boxShadow: "none"
            }}
          >
            <GithubIcon size={16} />
            <span>Star on GitHub</span>
          </a>
        </div>
      </section>

      {/* Donate CTA Card Section */}
      <section className="about-donate-card">
        <h2>Support Tools CLI Development</h2>
        <p>
          This dashboard is completely open-source and free to use. If it has saved you time or helped you learn, consider supporting the project to help cover hosting and active development costs.
        </p>
        <Link to="/donate" className="about-donate-btn">
          <Gift size={20} />
          <span>Support the Project</span>
        </Link>
      </section>

      {/* Footer / Back Navigation */}
      <footer className="about-footer">
        <p className="about-footer-text">
          Created with <Heart size={14} style={{ color: "var(--accent-color)", fill: "var(--accent-color)", verticalAlign: "middle" }} /> by <a href="https://github.com/karan-k-code" target="_blank" rel="noopener noreferrer">karan-k-code</a>. Released under the MIT License.
        </p>
        <Link to="/" className="about-back-btn">
          <ArrowLeft size={16} />
          <span>Back to Workspace</span>
        </Link>
      </footer>
    </div>
  );
}
