import React from 'react';
import { 
  BookOpen, 
  Code, 
  Copy, 
  Heart, 
  Play,
  GitBranch, 
  Cpu, 
  Video, 
  Download, 
  Terminal, 
  Layers,
  Triangle
} from 'lucide-react';
import Console from './Console';

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
    case 'vercel':
      return <Triangle size={size} fill="currentColor" />;
    default:
      return <Terminal size={size} />;
  }
};

export default function ToolDetail({
  activeTool,
  activeOsTab,
  setActiveOsTab,
  builderOpts,
  handleOptChange,
  generatedCmd,
  cmdExplanation,
  simulatedOutput,
  handleCopyToClipboard,
  handleSaveCommand,
  handleRunCommand,
  runCmdSignal,
  runCmdOutput,
  setRunCmdSignal,
  setRunCmdOutput
}) {
  return (
    <div>
      {/* Hero header */}
      <section className="tool-hero">
        <div className="tool-header-row">
          <div className="tool-title-desc">
            <h1>
              <span style={{ color: 'var(--accent-color)', display: 'inline-flex', alignItems: 'center' }}>
                {getToolIcon(activeTool.id, 38)}
              </span>
              <span style={{ marginLeft: '0.5rem' }}>{activeTool.name}</span>
              <span className="tool-badge-category">{activeTool.category}</span>
            </h1>
            <p className="tool-tagline">{activeTool.tagline}</p>
          </div>

          {/* Install Panel */}
          <div className="install-tabs">
            <div className="install-tab-header">
              {['windows', 'mac', 'linux'].map((os) => (
                <button
                  key={os}
                  className={`install-tab-btn ${activeOsTab === os ? 'active' : ''}`}
                  onClick={() => setActiveOsTab(os)}
                >
                  {os.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="install-code-box">
              <span style={{ marginRight: '1rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {activeTool.install[activeOsTab]}
              </span>
              <button 
                className="copy-btn"
                onClick={() => handleCopyToClipboard(activeTool.install[activeOsTab], 'Install command')}
                title="Copy install command"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '1rem', maxWidth: '800px' }}>
          {activeTool.description}
        </p>
      </section>

      {/* Visual concept diagram / Flowchart */}
      {activeTool.visualConcept && (
        <section className="concept-section">
          <div className="concept-title">
            <BookOpen size={18} style={{ color: 'var(--accent-color)' }} />
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
            <Code size={20} style={{ color: 'var(--accent-color)' }} />
            <span>{activeTool.interactiveBuilder.title}</span>
          </div>
          <p className="card-desc">{activeTool.interactiveBuilder.description}</p>
          
          <div className="options-form">
            {activeTool.interactiveBuilder.options.map((opt) => {
              // Check conditional rendering
              if (opt.condition && !opt.condition(builderOpts)) return null;

              return (
                <div key={opt.id} className="form-group">
                  <label className="form-label">{opt.label}</label>
                  {opt.type === 'select' && (
                    <select 
                      className="form-select"
                      value={builderOpts[opt.id] || ''}
                      onChange={(e) => handleOptChange(opt.id, e.target.value)}
                    >
                      {opt.choices.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  )}
                  {opt.type === 'text' && (
                    <input
                      type="text"
                      className="form-input"
                      value={builderOpts[opt.id] || ''}
                      onChange={(e) => handleOptChange(opt.id, e.target.value)}
                    />
                  )}
                  {opt.type === 'boolean' && (
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={!!builderOpts[opt.id]}
                        onChange={(e) => handleOptChange(opt.id, e.target.checked)}
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
                  <span style={{ color: 'var(--text-muted)' }}>$ </span>
                  {generatedCmd}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyToClipboard(generatedCmd)}
                    title="Copy command"
                    style={{ padding: '8px' }}
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    className="copy-btn"
                    onClick={handleSaveCommand}
                    title="Bookmark command"
                    style={{ padding: '8px' }}
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>

              {/* Line-by-line flags analysis */}
              {cmdExplanation.length > 0 && (
                <div className="explanation-container">
                  <div className="explanation-title">Flags / Arguments Breakdown</div>
                  <div className="explanation-list">
                    {cmdExplanation.map((part, i) => (
                      <div key={i} className="explanation-item">
                        <span className="explanation-part">{part.part}</span>
                        <span className="explanation-desc">{part.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
              <button
                className="run-cmd-btn"
                onClick={() => handleRunCommand(generatedCmd, simulatedOutput)}
                style={{ width: '100%', justifyContent: 'center' }}
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
            setRunCmdSignal('');
            setRunCmdOutput('');
          }}
        />
      </div>

      {/* Cheat sheets */}
      {activeTool.cheatsheets && (
        <section className="cheatsheet-section">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>
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
                        <span className="cheatsheet-cmd">$ {item.cmd}</span>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyToClipboard(item.cmd)}
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
  );
}
