//  author: https://github.com/karan-k-code/tools-cli

import { useState, useEffect } from "react";
import { Terminal, Check, Heart } from "lucide-react";
import { toolsData } from "./data/toolsData";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import ToolDetail from "./components/ToolDetail";
import Quiz from "./components/Quiz";
import Donate from "./components/Donate";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import { GithubIcon } from "./components/icons";
import "./App.css";

export default function App() {
  const [activeToolId, setActiveToolId] = useState(null); // null = Home Dashboard
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("q") || "";
    }
    return "";
  });
  const [activeCategory, setActiveCategory] = useState("All");

  // Interactive options state
  const [builderOpts, setBuilderOpts] = useState({});

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

  // Donate Overlay Toggle
  const [showDonate, setShowDonate] = useState(false);

  // Terms Overlay Toggle
  const [showTerms, setShowTerms] = useState(false);

  // Privacy Overlay Toggle
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Sync state with URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#/quiz" || hash === "#quiz") {
        setShowQuiz(true);
        setShowDonate(false);
        setShowTerms(false);
        setShowPrivacy(false);
        setActiveToolId(null);
      } else if (hash === "#/donate" || hash === "#donate" || hash === "#/donent" || hash === "#donent") {
        setShowDonate(true);
        setShowQuiz(false);
        setShowTerms(false);
        setShowPrivacy(false);
        setActiveToolId(null);
      } else if (hash === "#/terms" || hash === "#terms") {
        setShowTerms(true);
        setShowQuiz(false);
        setShowDonate(false);
        setShowPrivacy(false);
        setActiveToolId(null);
      } else if (hash === "#/privacy" || hash === "#privacy") {
        setShowPrivacy(true);
        setShowQuiz(false);
        setShowDonate(false);
        setShowTerms(false);
        setActiveToolId(null);
      } else if (hash.startsWith("#/")) {
        const toolId = hash.substring(2);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
          setShowDonate(false);
          setShowTerms(false);
          setShowPrivacy(false);
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          setShowDonate(false);
          setShowTerms(false);
          setShowPrivacy(false);
          window.location.hash = "";
        }
      } else if (hash.startsWith("#")) {
        const toolId = hash.substring(1);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
          setShowDonate(false);
          setShowTerms(false);
          setShowPrivacy(false);
          window.location.hash = `#/${toolId}`;
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          setShowDonate(false);
          setShowTerms(false);
          setShowPrivacy(false);
          window.location.hash = "";
        }
      } else {
        setActiveToolId(null);
        setShowQuiz(false);
        setShowDonate(false);
        setShowTerms(false);
        setShowPrivacy(false);
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

  // Derived interactive builder states
  let generatedCmd = "";
  let cmdExplanation = [];
  let simulatedOutput = "";

  if (activeTool && activeTool.interactiveBuilder) {
    const generated = activeTool.interactiveBuilder.generator(builderOpts);
    generatedCmd = generated.command;
    cmdExplanation = generated.explanation;
    simulatedOutput =
      activeTool.interactiveBuilder.simulatedOutput(builderOpts);
  }

  // Sync builder options when tool changes
  useEffect(() => {
    if (activeTool && activeTool.interactiveBuilder) {
      const defaults = {};
      activeTool.interactiveBuilder.options.forEach((opt) => {
        defaults[opt.id] = opt.defaultValue;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBuilderOpts(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeToolId]);

  // Dynamically update document title and meta elements for Google SEO
  useEffect(() => {
    let title = "Tools Cli - Git, Ollama, FFmpeg, Python & Utilities";
    let desc = "An interactive web dashboard for learning and configuring command line tools: Git, Ollama, FFmpeg, yt-dlp, Python, Pip, Docker, jq, tmux, and npm packages.";
    let path = "";

    if (showQuiz) {
      title = "Interactive CLI Quiz - Test Your Command Line Skills | Tools Cli";
      desc = "Test your knowledge of Git, Ollama, FFmpeg, Docker, and other terminal commands with our interactive CLI quiz.";
      path = "#/quiz";
    } else if (showDonate) {
      title = "Donate & Support - Tools Cli Project";
      desc = "Support the development of Tools Cli, an open-source companion for terminal and developer CLI tools.";
      path = "#/donate";
    } else if (showTerms) {
      title = "Terms of Service - Tools Cli";
      desc = "Review the Terms of Service and guidelines for using the Tools Cli interactive CLI dashboard.";
      path = "#/terms";
    } else if (showPrivacy) {
      title = "Privacy Policy - Tools Cli";
      desc = "Read our Privacy Policy to understand how we handle data and respect user privacy on Tools Cli.";
      path = "#/privacy";
    } else if (activeTool) {
      title = `${activeTool.name} Command Companion - Simulator & Guide | Tools Cli`;
      desc = activeTool.description || activeTool.tagline || `Learn, configure, and simulate ${activeTool.name} commands interactively.`;
      path = `#/${activeTool.id}`;
    }

    document.title = title;

    // Update Meta Description
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute("content", desc);

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) ogDescMeta.setAttribute("content", desc);

    const twitterDescMeta = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescMeta) twitterDescMeta.setAttribute("content", desc);

    // Update Meta Title
    const titleMeta = document.querySelector('meta[name="title"]');
    if (titleMeta) titleMeta.setAttribute("content", title);

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) ogTitleMeta.setAttribute("content", title);

    const twitterTitleMeta = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitleMeta) twitterTitleMeta.setAttribute("content", title);

    // Update Canonical and URLs
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    const fullUrl = `https://tools-cli.konshu.in/${path}`;
    if (canonicalLink) canonicalLink.setAttribute("href", fullUrl);

    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) ogUrlMeta.setAttribute("content", fullUrl);

    const twitterUrlMeta = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrlMeta) twitterUrlMeta.setAttribute("content", fullUrl);

    // Update Dynamic JSON-LD Structured Data Schema
    const schemaScript = document.getElementById("json-ld-schema");
    if (schemaScript) {
      let activeSchema;
      if (activeTool) {
        // Advanced SoftwareApplication Schema for specific tools
        activeSchema = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": `${activeTool.name} CLI Companion - Tools Cli`,
          "url": `https://tools-cli.konshu.in/#/${activeTool.id}`,
          "description": activeTool.description || activeTool.tagline,
          "applicationCategory": "DeveloperApplication, EducationalApplication",
          "operatingSystem": "Windows, macOS, Linux",
          "softwareRequirements": "Requires terminal. Requires web browser.",
          "downloadUrl": activeTool.github || "https://github.com/",
          "image": "https://tools-cli.konshu.in/hero.webp",
          "author": {
            "@type": "Person",
            "name": "karan-k-code"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
      } else {
        // Combines WebSite (with Sitelinks Searchbox action) + General WebApplication schema
        activeSchema = [
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Tools Cli",
            "url": "https://tools-cli.konshu.in/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://tools-cli.konshu.in/?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tools Cli",
            "url": "https://tools-cli.konshu.in/",
            "description": "An interactive web dashboard for learning and configuring command line tools: Git, Ollama, FFmpeg, yt-dlp, Python, Pip, Docker, jq, tmux, and npm packages.",
            "applicationCategory": "DeveloperApplication, EducationalApplication",
            "operatingSystem": "Windows, macOS, Linux",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "image": "https://tools-cli.konshu.in/hero.webp",
            "author": {
              "@type": "Person",
              "name": "karan-k-code"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        ];
      }
      schemaScript.textContent = JSON.stringify(activeSchema);
    }
  }, [activeTool, activeToolId, showQuiz, showDonate, showTerms, showPrivacy]);

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
      <Sidebar
        filteredTools={filteredTools}
        activeToolId={activeToolId}
        showQuiz={showQuiz}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

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
                : showDonate
                  ? "Support Tools CLI"
                  : showTerms
                    ? "Terms of Service"
                    : showPrivacy
                      ? "Privacy Policy"
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
          ) : showDonate ? (
            <Donate
              onClose={() => {
                window.location.hash = "";
              }}
            />
          ) : showTerms ? (
            <Terms
              onClose={() => {
                window.location.hash = "";
              }}
            />
          ) : showPrivacy ? (
            <Privacy
              onClose={() => {
                window.location.hash = "";
              }}
            />
          ) : activeTool ? (
            <ToolDetail
              activeTool={activeTool}
              activeOsTab={activeOsTab}
              setActiveOsTab={setActiveOsTab}
              builderOpts={builderOpts}
              handleOptChange={handleOptChange}
              generatedCmd={generatedCmd}
              cmdExplanation={cmdExplanation}
              simulatedOutput={simulatedOutput}
              handleCopyToClipboard={handleCopyToClipboard}
              handleSaveCommand={handleSaveCommand}
              handleRunCommand={handleRunCommand}
              runCmdSignal={runCmdSignal}
              runCmdOutput={runCmdOutput}
              setRunCmdSignal={setRunCmdSignal}
              setRunCmdOutput={setRunCmdOutput}
            />
          ) : (
            <DashboardHome
              toolsData={toolsData}
              favorites={favorites}
              handleCopyToClipboard={handleCopyToClipboard}
              handleRunCommand={handleRunCommand}
              handleDeleteFavorite={handleDeleteFavorite}
            />
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
                v1.0.0-Beta
              </span>
            </div>

            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              &copy; {new Date().getFullYear()} kosnhu.in. Built with React &
              Vite. Released under the MIT License.
            </p>

            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <a
                href="#/terms"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "color var(--transition-fast)",
                }}
                className="hover-accent"
              >
                Terms
              </a>
              <span style={{ color: "var(--border-color)", fontSize: "0.85rem" }}>|</span>
              <a
                href="#/privacy"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "color var(--transition-fast)",
                }}
                className="hover-accent"
              >
                Privacy
              </a>
              <span style={{ color: "var(--border-color)", fontSize: "0.85rem" }}>|</span>
              <a
                href="#/donate"
                style={{
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  transition: "color var(--transition-fast)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
                className="hover-accent"
              >
                <Heart size={14} style={{ color: "var(--ytdlp-color)" }} />
                Donate
              </a>
              <span style={{ color: "var(--border-color)", fontSize: "0.85rem" }}>|</span>
              <a
                href="https://github.com/karan-k-code/tools-cli"
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
