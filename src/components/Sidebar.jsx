import React from 'react';
import { 
  Terminal, 
  Search, 
  Layers, 
  Award,
  GitBranch, 
  Cpu, 
  Video, 
  Download, 
  Code
} from 'lucide-react';

const getToolIcon = (id, size = 20) => {
  switch (id) {
    case 'git':
      return <GitBranch size={size} />;
    case 'ollama':
      return <Cpu size={size} />;
    case 'ffmpeg':
      return <Video size={size} />;
    case 'yt-dlp':
      return <Download size={size} />;
    case 'python-pip':
      return <Terminal size={size} />;
    case 'utils':
      return <Layers size={size} />;
    case 'node-npm':
      return <Code size={size} />;
    default:
      return <Terminal size={size} />;
  }
};

export default function Sidebar({
  filteredTools,
  activeToolId,
  showQuiz,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory
}) {
  return (
    <aside className="sidebar">
      <div 
        className="logo-section" 
        style={{ cursor: 'pointer', marginBottom: '1.5rem' }}
        onClick={() => {
          window.location.hash = '';
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
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['All', 'VCS', 'AI', 'Media', 'Utilities'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? 'var(--accent-glow)' : 'none',
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--accent-color)' : 'var(--border-color)',
              borderRadius: '6px',
              color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="nav-section-title">CLI Engines</div>
      <nav className="nav-links">
        <div 
          className={`nav-item ${activeToolId === null && !showQuiz ? 'active' : ''}`}
          onClick={() => {
            window.location.hash = '';
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
            className={`nav-item ${activeToolId === tool.id && !showQuiz ? 'active' : ''}`}
            onClick={() => {
              window.location.hash = `#/${tool.id}`;
            }}
          >
            <span className="nav-item-left" style={{ color: activeToolId === tool.id ? 'var(--accent-color)' : 'inherit' }}>
              {getToolIcon(tool.id, 16)}
              <span>{tool.name}</span>
            </span>
            <span className="nav-badge">{tool.category}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="quiz-btn" onClick={() => { window.location.hash = '#/quiz'; }}>
          <Award size={16} />
          <span>Test CLI Knowledge</span>
        </button>
      </div>
    </aside>
  );
}
