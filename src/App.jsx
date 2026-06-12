import React, { useState, useEffect } from 'react';
import { Terminal, Check } from 'lucide-react';
import { toolsData } from './data/toolsData';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import ToolDetail from './components/ToolDetail';
import Quiz from './components/Quiz';
import { GithubIcon } from './components/icons';
import './App.css';

export default function App() {
  const [activeToolId, setActiveToolId] = useState(null); // null = Home Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Interactive options state
  const [builderOpts, setBuilderOpts] = useState({});
  const [generatedCmd, setGeneratedCmd] = useState('');
  const [cmdExplanation, setCmdExplanation] = useState([]);
  const [simulatedOutput, setSimulatedOutput] = useState('');
  
  // Execution state for terminal
  const [runCmdSignal, setRunCmdSignal] = useState('');
  const [runCmdOutput, setRunCmdOutput] = useState('');

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('toolscli_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Installation OS Tabs
  const [activeOsTab, setActiveOsTab] = useState('windows');

  // Quiz Overlay Toggle
  const [showQuiz, setShowQuiz] = useState(false);

  // Sync state with URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/quiz' || hash === '#quiz') {
        setShowQuiz(true);
        setActiveToolId(null);
      } else if (hash.startsWith('#/')) {
        const toolId = hash.substring(2);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          window.location.hash = '';
        }
      } else if (hash.startsWith('#')) {
        const toolId = hash.substring(1);
        const exists = toolsData.some((t) => t.id === toolId);
        if (exists) {
          setActiveToolId(toolId);
          setShowQuiz(false);
          window.location.hash = `#/${toolId}`;
        } else {
          setActiveToolId(null);
          setShowQuiz(false);
          window.location.hash = '';
        }
      } else {
        setActiveToolId(null);
        setShowQuiz(false);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
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
      const { command, explanation } = activeTool.interactiveBuilder.generator(builderOpts);
      setGeneratedCmd(command);
      setCmdExplanation(explanation);
      setSimulatedOutput(activeTool.interactiveBuilder.simulatedOutput(builderOpts));
    }
  }, [builderOpts, activeToolId]);

  // Handle Option change in form
  const handleOptChange = (id, value) => {
    setBuilderOpts((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  // Filter tools for Sidebar
  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Copy code to clipboard (supports fallback for insecure contexts like HTTP IP addresses)
  const handleCopyToClipboard = (text, type = 'Command') => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast(`${type} copied to clipboard!`);
        })
        .catch((err) => {
          console.warn('Clipboard API failed, trying fallback:', err);
          fallbackCopyToClipboard(text, type);
        });
    } else {
      fallbackCopyToClipboard(text, type);
    }
  };

  const fallbackCopyToClipboard = (text, type) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      // Prevent page scrolling and make it completely invisible
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showToast(`${type} copied to clipboard!`);
      } else {
        showToast(`Failed to copy ${type}.`);
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      showToast(`Failed to copy ${type}.`);
    }
  };

  // Run command in Terminal
  const handleRunCommand = (cmd, output) => {
    setRunCmdSignal(cmd);
    setRunCmdOutput(output);
    showToast('Executing command in terminal simulator...');
  };

  // Save/Bookmark command
  const handleSaveCommand = () => {
    if (!generatedCmd) return;
    const isAlreadySaved = favorites.some((fav) => fav.command === generatedCmd);
    if (isAlreadySaved) {
      showToast('Command is already in your favorites!', 'info');
      return;
    }

    const newFav = {
      id: Date.now(),
      toolId: activeTool.id,
      toolName: activeTool.name,
      command: generatedCmd,
      simulatedOutput: simulatedOutput
    };

    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem('toolscli_favorites', JSON.stringify(updated));
    showToast('Command bookmarked to favorites!');
  };

  // Delete saved command
  const handleDeleteFavorite = (id) => {
    const updated = favorites.filter((fav) => fav.id !== id);
    setFavorites(updated);
    localStorage.setItem('toolscli_favorites', JSON.stringify(updated));
    showToast('Removed from favorites.');
  };

  return (
    <div className={`app-container ${activeTool ? activeTool.accentClass : 'ollama-accent'}`}>
      
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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        
        {/* Header */}
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workspace /</span>
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
              {showQuiz ? 'CLI Quiz' : activeTool ? activeTool.name : 'Dashboard Overview'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Local Host: 127.0.0.1</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--ffmpeg-color)',
              boxShadow: '0 0 8px var(--ffmpeg-color)'
            }} />
          </div>
        </header>

        {/* Content Body */}
        <main className="main-content">
          {showQuiz ? (
            <Quiz onClose={() => { window.location.hash = ''; }} />
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
        <footer style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} style={{ color: 'var(--accent-color)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', letterSpacing: '-0.5px' }}>TOOLS CLI</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>v1.0.0</span>
            </div>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              &copy; {new Date().getFullYear()} Tools CLI. Built with React & Vite. Released under the MIT License.
            </p>

            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <a 
                href="https://github.com/your-username/tools-cli" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-fast)', display: 'inline-flex', alignItems: 'center' }}
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
            <Check size={16} style={{ color: 'var(--ffmpeg-color)' }} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
