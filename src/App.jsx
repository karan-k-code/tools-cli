import React, { useState, useEffect } from "react";
import {
  GitBranch,
  Cpu,
  Video,
  Download,
  Terminal,
  Layers,
  Search,
  Heart,
  Copy,
  Play,
  Trash2,
  Check,
  Award,
  BookOpen,
  ExternalLink,
  ChevronRight,
  Code,
  CheckCircle2,
} from "lucide-react";
import { toolsData } from "./data/toolsData";
import Console from "./components/Console";
import Quiz from "./components/Quiz";
import "./App.css";

// Inline GitHub SVG Icon (Since Lucide v1.x doesn't export brand icons)
const GithubIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Map tool IDs to Lucide Icons
const getToolIcon = (id, size = 20) => {
  switch (id) {
    case "git":
      return <GitBranch size={size} />;
    case "ollama":
      return <Cpu size={size} />;
    case "ffmpeg":
      return <Video size={size} />;
    case "yt-dlp":
      return <Download size={size} />;
    case "python-pip":
      return <Terminal size={size} />;
    case "utils":
      return <Layers size={size} />;
    case "node-npm":
      return <Code size={size} />;
    default:
      return <Terminal size={size} />;
  }
};

export default function App() {
  const [activeToolId, setActiveToolId] = useState(null); // null = Home Dashboard
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Interactive options state
  const [builderOpts, setBuilderOpts] = useState({});
  const [generatedCmd, setGeneratedCmd] = useState("");
  const [cmdExplanation, setCmdExplanation] = useState([]);
  const [simulatedOutput, setSimulatedOutput] = useState("");

  // Execution state for terminal
  const [runCmdSignal, setRunCmdSignal] = useState("");
  const [runCmdOutput, setRunCmdOutput] = useState("");

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("toolscli_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Installation OS Tabs
  const [activeOsTab, setActiveOsTab] = useState("windows");

  // Quiz Overlay Toggle
  const [showQuiz, setShowQuiz] = useState(false);

  // Sync state with URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/quiz" || hash === "#quiz") {
        setShowQuiz(true);
        setActiveToolId(null);
      } else if (hash.startsWith("#/")) {
        const toolId = hash.substring(2);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          window.location.hash = "";
        }
      } else if (hash.startsWith("#")) {
        const toolId = hash.substring(1);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
          window.location.hash = `#/${toolId}`;
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          window.location.hash = "";
        }
      } else {
        setActiveToolId(null);
        setShowQuiz(false);
      }
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Find active tool
  const activeTool = toolsData.find((t) => t.id === activeToolId);

  // Sync builder options when tool changes
  useEffect(() => {
    if (activeTool && activeTool.interactiveBuilder) {
      const defaults = {};
      activeTool.interactiveBuilder.options.forEach((opt) => {
        defaults[opt.id] = opt.defaultValue;
      });
      setBuilderOpts(defaults);
    }
  }, [activeToolId]);

  // Recalculate generated command when builder options change
  useEffect(() => {
    if (activeTool && activeTool.interactiveBuilder) {
      const { command, explanation } =
        activeTool.interactiveBuilder.generator(builderOpts);
      setGeneratedCmd(command);
      setCmdExplanation(explanation);
      setSimulatedOutput(
        activeTool.interactiveBuilder.simulatedOutput(builderOpts),
      );
    }
  }, [builderOpts, activeToolId]);

  // Handle Option change in form
  const handleOptChange = (id, value) => {
    setBuilderOpts((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Filter tools for Sidebar
  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Copy code to clipboard (supports fallback for insecure contexts like HTTP IP addresses)
  const handleCopyToClipboard = (text, type = "Command") => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast(`${type} copied to clipboard!`);
        })
        .catch((err) => {
          console.warn("Clipboard API failed, trying fallback:", err);
          fallbackCopyToClipboard(text, type);
        });
    } else {
      fallbackCopyToClipboard(text, type);
    }
  };

  const fallbackCopyToClipboard = (text, type) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      // Prevent page scrolling and make it completely invisible
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showToast(`${type} copied to clipboard!`);
      } else {
        showToast(`Failed to copy ${type}.`);
      }
    } catch (err) {
      console.error("Fallback copy failed: ", err);
      showToast(`Failed to copy ${type}.`);
    }
  };

  // Run command in Terminal
  const handleRunCommand = (cmd, output) => {
    setRunCmdSignal(cmd);
    setRunCmdOutput(output);
    showToast("Executing command in terminal simulator...");
  };

  // Save/Bookmark command
  const handleSaveCommand = () => {
    if (!generatedCmd) return;
    const isAlreadySaved = favorites.some(
      (fav) => fav.command === generatedCmd,
    );
    if (isAlreadySaved) {
      showToast("Command is already in your favorites!", "info");
      return;
    }

    const newFav = {
      id: Date.now(),
      toolId: activeTool.id,
      toolName: activeTool.name,
      command: generatedCmd,
      simulatedOutput: simulatedOutput,
    };

    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem("toolscli_favorites", JSON.stringify(updated));
    showToast("Command bookmarked to favorites!");
  };

  // Delete saved command
  const handleDeleteFavorite = (id) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem("toolscli_favorites", JSON.stringify(updated));
    showToast("Removed from favorites.");
  };

  return (
    <div
      className={`app-container ${activeTool ? activeTool.accentClass : "ollama-accent"}`}
    >
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div
          className="logo-section"
          style={{ cursor: "pointer", marginBottom: "1.5rem" }}
          onClick={() => {
            window.location.hash = "";
          }}
        >
          <Terminal className="logo-icon" />
          <span className="logo-text">TOOLS CLI</span>
        </div>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search CLI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="nav-section-title">Categories</div>
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            marginBottom: "1rem",
            flexWrap: "wrap",
          }}
        >
          {["All", "VCS", "AI", "Media", "Utilities"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background:
                  activeCategory === cat ? "var(--accent-glow)" : "none",
                border: "1px solid",
                borderColor:
                  activeCategory === cat
                    ? "var(--accent-color)"
                    : "var(--border-color)",
                borderRadius: "6px",
                color:
                  activeCategory === cat ? "#fff" : "var(--text-secondary)",
                fontSize: "0.75rem",
                padding: "0.25rem 0.5rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="nav-section-title">CLI Engines</div>
        <nav className="nav-links">
          <div
            className={`nav-item ${activeToolId === null && !showQuiz ? "active" : ""}`}
            onClick={() => {
              window.location.hash = "";
            }}
          >
            <span className="nav-item-left">
              <Layers size={16} />
              <span>Dashboard Overview</span>
            </span>
          </div>

          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className={`nav-item ${activeToolId === tool.id && !showQuiz ? "active" : ""}`}
              onClick={() => {
                window.location.hash = `#/${tool.id}`;
              }}
            >
              <span
                className="nav-item-left"
                style={{
                  color:
                    activeToolId === tool.id
                      ? "var(--accent-color)"
                      : "inherit",
                }}
              >
                {getToolIcon(tool.id, 16)}
                <span>{tool.name}</span>
              </span>
              <span className="nav-badge">{tool.category}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="quiz-btn"
            onClick={() => {
              window.location.hash = "#/quiz";
            }}
          >
            <Award size={16} />
            <span>Test CLI Knowledge</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header className="app-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Workspace /
            </span>
            <span
              style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600 }}
            >
              {showQuiz
                ? "CLI Quiz"
                : activeTool
                  ? activeTool.name
                  : "Dashboard Overview"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}
            >
              Local Host: 127.0.0.1
            </span>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "var(--ffmpeg-color)",
                boxShadow: "0 0 8px var(--ffmpeg-color)",
              }}
            />
          </div>
        </header>

        {/* Content Body */}
        <main className="main-content">
          {showQuiz ? (
            <Quiz
              onClose={() => {
                window.location.hash = "";
              }}
            />
          ) : activeTool ? (
            /* ACTIVE TOOL DETAILED GUIDE PAGE */
            <div>
              {/* Hero header */}
              <section className="tool-hero">
                <div className="tool-header-row">
                  <div className="tool-title-desc">
                    <h1>
                      <span style={{ color: "var(--accent-color)" }}>
                        {getToolIcon(activeTool.id, 38)}
                      </span>
                      <span>{activeTool.name}</span>
                      <span className="tool-badge-category">
                        {activeTool.category}
                      </span>
                    </h1>
                    <p className="tool-tagline">{activeTool.tagline}</p>
                  </div>

                  {/* Install Panel */}
                  <div className="install-tabs">
                    <div className="install-tab-header">
                      {["windows", "mac", "linux"].map((os) => (
                        <button
                          key={os}
                          className={`install-tab-btn ${activeOsTab === os ? "active" : ""}`}
                          onClick={() => setActiveOsTab(os)}
                        >
                          {os.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="install-code-box">
                      <span
                        style={{
                          marginRight: "1rem",
                          color: "var(--text-secondary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activeTool.install[activeOsTab]}
                      </span>
                      <button
                        className="copy-btn"
                        onClick={() =>
                          handleCopyToClipboard(
                            activeTool.install[activeOsTab],
                            "Install command",
                          )
                        }
                        title="Copy install command"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    marginTop: "1rem",
                    maxWidth: "800px",
                  }}
                >
                  {activeTool.description}
                </p>
              </section>

              {/* Visual concept diagram / Flowchart */}
              {activeTool.visualConcept && (
                <section className="concept-section">
                  <div className="concept-title">
                    <BookOpen
                      size={18}
                      style={{ color: "var(--accent-color)" }}
                    />
                    <span>{activeTool.visualConcept.title}</span>
                  </div>
                  <div className="flowchart-container">
                    {activeTool.visualConcept.steps.map((step, idx) => (
                      <div key={step.name} className="flowchart-node">
                        <div className="node-step">Step {idx + 1}</div>
                        <div className="node-name">{step.name}</div>
                        <div className="node-desc">{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Main Interactive Grid */}
              <div className="interactive-grid">
                {/* Option Configurator & Generator */}
                <div className="config-card">
                  <div className="card-title">
                    <Code size={20} style={{ color: "var(--accent-color)" }} />
                    <span>{activeTool.interactiveBuilder.title}</span>
                  </div>
                  <p className="card-desc">
                    {activeTool.interactiveBuilder.description}
                  </p>

                  <div className="options-form">
                    {activeTool.interactiveBuilder.options.map((opt) => {
                      // Check conditional rendering
                      if (opt.condition && !opt.condition(builderOpts))
                        return null;

                      return (
                        <div key={opt.id} className="form-group">
                          <label className="form-label">{opt.label}</label>
                          {opt.type === "select" && (
                            <select
                              className="form-select"
                              value={builderOpts[opt.id] || ""}
                              onChange={(e) =>
                                handleOptChange(opt.id, e.target.value)
                              }
                            >
                              {opt.choices.map((c) => (
                                <option key={c.value} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          )}
                          {opt.type === "text" && (
                            <input
                              type="text"
                              className="form-input"
                              value={builderOpts[opt.id] || ""}
                              onChange={(e) =>
                                handleOptChange(opt.id, e.target.value)
                              }
                            />
                          )}
                          {opt.type === "boolean" && (
                            <label className="form-checkbox-label">
                              <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={!!builderOpts[opt.id]}
                                onChange={(e) =>
                                  handleOptChange(opt.id, e.target.checked)
                                }
                              />
                              <span>Enable flag parameter</span>
                            </label>
                          )}
                        </div>
                      );
                    })}

                    {/* Generated command output box */}
                    <div className="command-generator-box">
                      <div className="generated-command-row">
                        <div className="generated-command-text">
                          <span style={{ color: "var(--text-muted)" }}>$ </span>
                          {generatedCmd}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className="copy-btn"
                            onClick={() => handleCopyToClipboard(generatedCmd)}
                            title="Copy command"
                            style={{ padding: "8px" }}
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="copy-btn"
                            onClick={handleSaveCommand}
                            title="Bookmark command"
                            style={{ padding: "8px" }}
                          >
                            <Heart size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Line-by-line flags analysis */}
                      {cmdExplanation.length > 0 && (
                        <div className="explanation-container">
                          <div className="explanation-title">
                            Flags / Arguments Breakdown
                          </div>
                          <div className="explanation-list">
                            {cmdExplanation.map((part, i) => (
                              <div key={i} className="explanation-item">
                                <span className="explanation-part">
                                  {part.part}
                                </span>
                                <span className="explanation-desc">
                                  {part.desc}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "1.5rem" }}>
                      <button
                        className="run-cmd-btn"
                        onClick={() =>
                          handleRunCommand(generatedCmd, simulatedOutput)
                        }
                        style={{ width: "100%", justifyContent: "center" }}
                      >
                        <Play size={16} />
                        <span>Inject & Run Command</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Console Terminal Panel */}
                <Console
                  activeCommand={runCmdSignal}
                  simulatedOutput={runCmdOutput}
                  onCommandRunComplete={() => {
                    setRunCmdSignal("");
                    setRunCmdOutput("");
                  }}
                />
              </div>

              {/* Cheat sheets */}
              {activeTool.cheatsheets && (
                <section className="cheatsheet-section">
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: "1.25rem",
                      color: "#fff",
                    }}
                  >
                    Quick Cheat Sheets
                  </h3>
                  <div className="cheatsheet-grid">
                    {activeTool.cheatsheets.map((sheet) => (
                      <div key={sheet.section} className="cheatsheet-card">
                        <div className="cheatsheet-title">{sheet.section}</div>
                        <div className="cheatsheet-list">
                          {sheet.items.map((item) => (
                            <div key={item.cmd} className="cheatsheet-item">
                              <div className="cheatsheet-cmd-row">
                                <span className="cheatsheet-cmd">
                                  $ {item.cmd}
                                </span>
                                <button
                                  className="copy-btn"
                                  onClick={() =>
                                    handleCopyToClipboard(item.cmd)
                                  }
                                  title="Copy command"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                              <div className="cheatsheet-desc">{item.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            /* HOME / GENERAL DASHBOARD OVERVIEW */
            <div>
              {/* Dashboard Welcome Hero */}
              <section style={{ marginBottom: "3rem", textAlign: "left" }}>
                <h1
                  style={{
                    fontSize: "3rem",
                    fontWeight: 800,
                    margin: "0 0 0.5rem 0",
                    letterSpacing: "-1.5px",
                  }}
                >
                  Interactive{" "}
                  <span style={{ color: "var(--accent-color)" }}>
                    CLI Companion
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "var(--text-secondary)",
                    maxWidth: "750px",
                    lineHeight: 1.6,
                  }}
                >
                  Learn how to master advanced command line tools like Git,
                  local AI models (Ollama), multimedia rendering (FFmpeg),
                  high-speed extractors (yt-dlp), and python runtime
                  environments.
                </p>
              </section>

              {/* High-fidelity Statistics */}
              <section className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <Terminal size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-val">{toolsData.length}+</span>
                    <span className="stat-lbl">CLI Engines Active</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <Code size={22} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-val">
                      {toolsData.reduce(
                        (acc, t) =>
                          acc +
                          t.cheatsheets.reduce(
                            (cAcc, s) => cAcc + s.items.length,
                            0,
                          ),
                        0,
                      )}
                    </span>
                    <span className="stat-lbl">Quick Cheat Sheets</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper">
                    <Heart size={22} style={{ color: "var(--ytdlp-color)" }} />
                  </div>
                  <div className="stat-data">
                    <span className="stat-val">{favorites.length}</span>
                    <span className="stat-lbl">Bookmarked commands</span>
                  </div>
                </div>
              </section>

              {/* Landing Cards Grid */}
              <h2
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  textAlign: "left",
                  marginBottom: "1.25rem",
                  color: "#fff",
                }}
              >
                Select a Tool to Learn & Configure
              </h2>

              <div className="landing-grid">
                {toolsData.map((tool) => (
                  <div
                    key={tool.id}
                    className="landing-card"
                    style={{ "--accent-color": tool.color }}
                    onClick={() => {
                      window.location.hash = `#/${tool.id}`;
                    }}
                  >
                    <div className="landing-card-header">
                      <div
                        className="landing-card-icon-wrapper"
                        style={{
                          backgroundColor: `rgba(${parseInt(tool.color.substring(1, 3), 16)}, ${parseInt(tool.color.substring(3, 5), 16)}, ${parseInt(tool.color.substring(5, 7), 16)}, 0.12)`,
                        }}
                      >
                        {getToolIcon(tool.id, 22)}
                      </div>
                      <h3 className="landing-card-title">{tool.name}</h3>
                    </div>
                    <p className="landing-card-tagline">{tool.tagline}</p>
                    <div className="landing-card-footer">
                      <span>Launch Interactive Builder</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Favorites Drawer in Dashboard */}
              {favorites.length > 0 && (
                <section className="favorites-drawer">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Heart size={18} style={{ color: "var(--ytdlp-color)" }} />
                    <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                      Bookmarked Commands
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      marginBottom: "1.25rem",
                    }}
                  >
                    Quickly launch, copy, or manage your custom-architected CLI
                    commands.
                  </p>

                  <div className="favorites-list">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="favorite-item">
                        <div className="favorite-details">
                          <span className="fav-tool-name">{fav.toolName}</span>
                          <span className="fav-cmd-text" title={fav.command}>
                            {fav.command}
                          </span>
                        </div>
                        <div className="fav-actions">
                          <button
                            className="copy-btn"
                            onClick={() => handleCopyToClipboard(fav.command)}
                            title="Copy command"
                            style={{ padding: "6px" }}
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            className="copy-btn"
                            onClick={() =>
                              handleRunCommand(fav.command, fav.simulatedOutput)
                            }
                            title="Run in terminal"
                            style={{ padding: "6px" }}
                          >
                            <Play
                              size={13}
                              style={{ color: "var(--ffmpeg-color)" }}
                            />
                          </button>
                          <button
                            className="copy-btn"
                            onClick={() => handleDeleteFavorite(fav.id)}
                            title="Delete favorite"
                            style={{ padding: "6px" }}
                          >
                            <Trash2
                              size={13}
                              style={{ color: "var(--ytdlp-color)" }}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Quick CLI Guides Overview */}
              <section
                style={{
                  marginTop: "3.5rem",
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "2.5rem",
                  textAlign: "left",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "1.5rem",
                  }}
                >
                  Why Master the Command Line?
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      padding: "1.25rem",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--python-color)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CheckCircle2 size={16} /> Speed & Automation
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      Combine simple inputs with pipelines and redirect symbols
                      (`|`, `&gt;`) to execute bulk transformations that would
                      take hours inside a graphical browser window.
                    </p>
                  </div>

                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      padding: "1.25rem",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--ollama-color)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CheckCircle2 size={16} /> Privacy-First AI
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      Using tools like Ollama, keep your prompts, coding
                      assistants, and document analysis models on your local
                      hard drive. 100% offline, zero server usage costs.
                    </p>
                  </div>

                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-color)",
                      padding: "1.25rem",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "var(--ffmpeg-color)",
                        fontWeight: 700,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <CheckCircle2 size={16} /> Media Transcoding power
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                      }}
                    >
                      FFmpeg lets you compress gigabytes of raw recording files
                      down to high-definition web assets in seconds without
                      uploading data to untrustworthy third-party online
                      converters.
                    </p>
                  </div>
                </div>
              </section>

              {/* Open Source Banner */}
              <section
                style={{
                  marginTop: "3.5rem",
                  background:
                    "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)",
                  border: "1px solid rgba(168, 85, 247, 0.15)",
                  padding: "2rem",
                  borderRadius: "16px",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    right: "-50px",
                    width: "150px",
                    height: "150px",
                    background: "var(--accent-glow)",
                    filter: "blur(60px)",
                    borderRadius: "50%",
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                />

                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Code size={22} style={{ color: "var(--accent-color)" }} />
                  <span>Open Source Initiative</span>
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    maxWidth: "750px",
                    marginBottom: "1.5rem",
                  }}
                >
                  Tools CLI is a community-driven, 100% open-source companion
                  dashboard. Feel free to inspect the source code, fork the
                  repository, suggest optimizations, or contribute new
                  interactive CLI generators to enhance the learning experience.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a
                    href="https://github.com/karan-k-code/tools-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="run-cmd-btn"
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.2rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>View Repository on GitHub</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://github.com/your-username/tools-cli/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="copy-btn"
                    style={{
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.2rem",
                      fontSize: "0.85rem",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <span>Report a Bug</span>
                  </a>
                </div>
              </section>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            marginTop: "auto",
            borderTop: "1px solid var(--border-color)",
            background: "var(--bg-secondary)",
            padding: "2rem 1.5rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Terminal size={18} style={{ color: "var(--accent-color)" }} />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#fff",
                  letterSpacing: "-0.5px",
                }}
              >
                TOOLS CLI
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                v1.0.0
              </span>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              &copy; {new Date().getFullYear()} Tools CLI. Built with React &
              Vite. Released under the MIT License.
            </p>

            <div style={{ display: "flex", gap: "1.25rem" }}>
              <a
                href="https://github.com/your-username/tools-cli"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--text-secondary)",
                  transition: "color var(--transition-fast)",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                title="GitHub"
              >
                <GithubIcon size={18} />
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <Check size={16} style={{ color: "var(--ffmpeg-color)" }} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
