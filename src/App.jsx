//  author: https://github.com/karan-k-code/tools-cli

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";

// app pages
import Quiz from "./components/Quiz";
import Donate from "./components/Donate";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";
import LegalPopup from "./components/LegalPopup";
import About from "./components/About";

// main content components
import { Check } from "lucide-react";
import { toolsData } from "./data/toolsData";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import ToolDetail from "./components/ToolDetail";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derived routing states from URL path (using cleanPath to support clean parsing)
  const cleanPath = location.pathname.replace(/^\//, "");
  const showQuiz = cleanPath === "quiz";
  const showDonate = cleanPath === "donate";
  const showTerms = cleanPath === "terms";
  const showPrivacy = cleanPath === "privacy";
  const showDisclaimer = cleanPath === "disclaimer";
  const isAboutPage = cleanPath === "about";
  const isDonatePage = cleanPath === "donate";
  const isFullPage = isAboutPage || isDonatePage;

  // Find active tool from route param
  const activeToolId =
    !showQuiz &&
    !showDonate &&
    !showTerms &&
    !showPrivacy &&
    !showDisclaimer &&
    !isAboutPage &&
    !isDonatePage &&
    cleanPath !== ""
      ? cleanPath
      : null;

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

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  // Find active tool
  const activeTool = useMemo(() => {
    return toolsData.find((t) => t.id === activeToolId);
  }, [activeToolId]);

  // Derived interactive builder states
  const builderResults = useMemo(() => {
    if (!activeTool || !activeTool.interactiveBuilder) {
      return { generatedCmd: "", cmdExplanation: [], simulatedOutput: "" };
    }
    const generated = activeTool.interactiveBuilder.generator(builderOpts);
    return {
      generatedCmd: generated.command,
      cmdExplanation: generated.explanation,
      simulatedOutput:
        activeTool.interactiveBuilder.simulatedOutput(builderOpts),
    };
  }, [activeTool, builderOpts]);

  const { generatedCmd, cmdExplanation, simulatedOutput } = builderResults;

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

  // Handle Option change in form
  const handleOptChange = useCallback((id, value) => {
    setBuilderOpts((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  // Filter tools for Sidebar
  const filteredTools = useMemo(() => {
    return toolsData.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const fallbackCopyToClipboard = useCallback(
    (text, type) => {
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
    },
    [showToast],
  );

  // Copy code to clipboard (supports fallback for insecure contexts like HTTP IP addresses)
  const handleCopyToClipboard = useCallback(
    (text, type = "Command") => {
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
    },
    [showToast, fallbackCopyToClipboard],
  );

  // Run command in Terminal
  const handleRunCommand = useCallback(
    (cmd, output) => {
      setRunCmdSignal(cmd);
      setRunCmdOutput(output);
      showToast("Executing command in terminal simulator...");
    },
    [showToast],
  );

  // Save/Bookmark command
  const handleSaveCommand = useCallback(() => {
    if (!generatedCmd || !activeTool) return;
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
  }, [favorites, generatedCmd, activeTool, simulatedOutput, showToast]);

  // Delete saved command
  const handleDeleteFavorite = useCallback(
    (id) => {
      const updated = favorites.filter((fav) => fav.id !== id);
      setFavorites(updated);
      localStorage.setItem("toolscli_favorites", JSON.stringify(updated));
      showToast("Removed from favorites.");
    },
    [favorites, showToast],
  );

  return (
    <div
      className={`app-container ${activeTool ? activeTool.accentClass : "ollama-accent"} ${isFullPage ? "full-page" : ""}`}
    >
      {/* Sidebar Navigation */}
      {!isFullPage && (
        <Sidebar
          filteredTools={filteredTools}
          activeToolId={activeToolId}
          showQuiz={showQuiz}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      )}

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
        {!isFullPage && (
          <header className="app-header">
            <div className="breadcrumb-container">
              <Link to="/" className="breadcrumb-root">
                Workspace
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                {showQuiz
                  ? "CLI Quiz"
                  : showDonate
                    ? "Support Tools CLI"
                    : showTerms
                      ? "Terms of Service"
                      : showPrivacy
                        ? "Privacy Policy"
                        : showDisclaimer
                          ? "Disclaimer"
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
                className="status-dot"
                style={{
                  backgroundColor: activeTool
                    ? activeTool.color
                    : "var(--accent-color)",
                  boxShadow: `0 0 8px ${activeTool ? activeTool.color : "var(--accent-color)"}`,
                }}
              />
            </div>
          </header>
        )}

        <main className={isFullPage ? "main-content-full" : "main-content"}>
          <Routes>
            <Route
              path="/"
              element={
                <DashboardHome
                  toolsData={toolsData}
                  favorites={favorites}
                  handleCopyToClipboard={handleCopyToClipboard}
                  handleRunCommand={handleRunCommand}
                  handleDeleteFavorite={handleDeleteFavorite}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/terms"
              element={<Terms onClose={() => navigate("/")} />}
            />
            <Route
              path="/privacy"
              element={<Privacy onClose={() => navigate("/")} />}
            />
            <Route
              path="/disclaimer"
              element={<Disclaimer onClose={() => navigate("/")} />}
            />
            <Route
              path="/donate"
              element={<Donate onClose={() => navigate("/")} />}
            />
            <Route
              path="/quiz"
              element={<Quiz onClose={() => navigate("/")} />}
            />
            <Route
              path="/:toolId"
              element={
                activeTool ? (
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
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
        {/* Footer */}
        <Footer />
      </div>

      <LegalPopup />

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
