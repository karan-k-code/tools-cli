import React from 'react';
import { 
  Terminal, 
  Code, 
  Heart, 
  ChevronRight, 
  Copy, 
  Play, 
  Trash2, 
  CheckCircle2, 
  ExternalLink,
  GitBranch, 
  Cpu, 
  Video, 
  Download,
  Layers
} from 'lucide-react';
import { GithubIcon } from './icons';

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

export default function DashboardHome({
  toolsData,
  favorites,
  handleCopyToClipboard,
  handleRunCommand,
  handleDeleteFavorite
}) {
  return (
    <div>
      {/* Dashboard Welcome Hero */}
      <section style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0', letterSpacing: '-1.5px' }}>
          Interactive <span style={{ color: 'var(--accent-color)' }}>CLI Companion</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.6 }}>
          Learn how to master advanced command line tools like Git, local AI models (Ollama), multimedia rendering (FFmpeg), high-speed extractors (yt-dlp), and python runtime environments.
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
              {toolsData.reduce((acc, t) => acc + t.cheatsheets.reduce((cAcc, s) => cAcc + s.items.length, 0), 0)}
            </span>
            <span className="stat-lbl">Quick Cheat Sheets</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Heart size={22} style={{ color: 'var(--ytdlp-color)' }} />
          </div>
          <div className="stat-data">
            <span className="stat-val">{favorites.length}</span>
            <span className="stat-lbl">Bookmarked commands</span>
          </div>
        </div>
      </section>

      {/* Landing Cards Grid */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, textAlign: 'left', marginBottom: '1.25rem', color: '#fff' }}>
        Select a Tool to Learn & Configure
      </h2>

      <div className="landing-grid">
        {toolsData.map((tool) => (
          <div 
            key={tool.id} 
            className="landing-card"
            style={{ '--accent-color': tool.color }}
            onClick={() => { window.location.hash = `#/${tool.id}`; }}
          >
            <div className="landing-card-header">
              <div className="landing-card-icon-wrapper" style={{ backgroundColor: `rgba(${parseInt(tool.color.substring(1,3),16)}, ${parseInt(tool.color.substring(3,5),16)}, ${parseInt(tool.color.substring(5,7),16)}, 0.12)` }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Heart size={18} style={{ color: 'var(--ytdlp-color)' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bookmarked Commands</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Quickly launch, copy, or manage your custom-architected CLI commands.
          </p>

          <div className="favorites-list">
            {favorites.map((fav) => (
              <div key={fav.id} className="favorite-item">
                <div className="favorite-details">
                  <span className="fav-tool-name">{fav.toolName}</span>
                  <span className="fav-cmd-text" title={fav.command}>{fav.command}</span>
                </div>
                <div className="fav-actions">
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyToClipboard(fav.command)}
                    title="Copy command"
                    style={{ padding: '6px' }}
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    className="copy-btn"
                    onClick={() => handleRunCommand(fav.command, fav.simulatedOutput)}
                    title="Run in terminal"
                    style={{ padding: '6px' }}
                  >
                    <Play size={13} style={{ color: 'var(--ffmpeg-color)' }} />
                  </button>
                  <button
                    className="copy-btn"
                    onClick={() => handleDeleteFavorite(fav.id)}
                    title="Delete favorite"
                    style={{ padding: '6px' }}
                  >
                    <Trash2 size={13} style={{ color: 'var(--ytdlp-color)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick CLI Guides Overview */}
      <section style={{ marginTop: '3.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2.5rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>
          Why Master the Command Line?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--python-color)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} /> Speed & Automation
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Combine simple inputs with pipelines and redirect symbols (`|`, `&gt;`) to execute bulk transformations that would take hours inside a graphical browser window.
            </p>
          </div>
          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ollama-color)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} /> Privacy-First AI
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Using tools like Ollama, keep your prompts, coding assistants, and document analysis models on your local hard drive. 100% offline, zero server usage costs.
            </p>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ffmpeg-color)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} /> Media Transcoding power
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              FFmpeg lets you compress gigabytes of raw recording files down to high-definition web assets in seconds without uploading data to untrustworthy third-party online converters.
            </p>
          </div>
        </div>
      </section>

      {/* Open Source Banner */}
      <section style={{ 
        marginTop: '3.5rem', 
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)', 
        border: '1px solid rgba(168, 85, 247, 0.15)',
        padding: '2rem', 
        borderRadius: '16px',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'var(--accent-glow)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
        
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={22} style={{ color: 'var(--accent-color)' }} />
          <span>Open Source Initiative</span>
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '750px', marginBottom: '1.5rem' }}>
          Tools CLI is a community-driven, 100% open-source companion dashboard. Feel free to inspect the source code, fork the repository, suggest optimizations, or contribute new interactive CLI generators to enhance the learning experience.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a 
            href="https://github.com/your-username/tools-cli" 
            target="_blank" 
            rel="noopener noreferrer"
            className="run-cmd-btn"
            style={{ 
              textDecoration: 'none', 
              display: 'inline-flex',
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem'
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
              textDecoration: 'none', 
              display: 'inline-flex',
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)'
            }}
          >
            <span>Report a Bug</span>
          </a>
        </div>
      </section>
    </div>
  );
}
