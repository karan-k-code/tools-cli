import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, HelpCircle, RefreshCw } from 'lucide-react';

export default function Console({ activeCommand, simulatedOutput, onCommandRunComplete }) {
  const [history, setHistory] = useState([
    { type: 'info', content: 'Tools Shell v1.0.0-Beta' },
    { type: 'info', content: 'Type "help" to see available command engines, or "clear" to empty screen.' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Scroll to bottom on new lines
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history, isTyping, typedContent]);

  // Handle run commands triggered externally from the page builder
  useEffect(() => {
    if (activeCommand) {
      triggerExternalCommand(activeCommand, simulatedOutput);
    }
  }, [activeCommand]);

  const triggerExternalCommand = (cmd, output) => {
    setIsTyping(true);
    setTypedContent('');
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < cmd.length) {
        setTypedContent((prev) => prev + cmd.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsTyping(false);
          setTypedContent('');
          setHistory((prev) => [
            ...prev,
            { type: 'input', content: cmd },
            { type: 'output', content: output || 'Command executed successfully.' }
          ]);
          if (onCommandRunComplete) {
            onCommandRunComplete();
          }
        }, 300);
      }
    }, 25);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (isTyping) return;

    const cmd = inputVal;
    setInputVal('');

    setHistory((prev) => [...prev, { type: 'input', content: cmd }]);
    if (cmd.trim()) {
      processTerminalCommand(cmd.trim());
    }
  };

  const processTerminalCommand = (cmdText) => {
    const args = cmdText.split(' ');
    const primary = args[0].toLowerCase();

    let output = '';
    switch (primary) {
      case 'clear':
        setHistory([]);
        return;
      case 'help':
        output = 'Available CLI Mock Engines:\n  - \x1b[33mgit\x1b[0m: git init, git add, git status, git commit\n  - \x1b[35mollama\x1b[0m: ollama list, ollama run <model>\n  - \x1b[32mffmpeg\x1b[0m: ffmpeg -i input.mp4\n  - \x1b[31myt-dlp\x1b[0m: yt-dlp <url>\n  - \x1b[36mpython\x1b[0m / \x1b[36mpip\x1b[0m: python --version, pip list\n  - \x1b[33mdocker\x1b[0m: docker run, docker ps\n  - \x1b[34mclear\x1b[0m: Wipe the console screen.';
        break;
      case 'git':
        if (args[1] === 'status') {
          output = 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n\t\x1b[31mmodified:   src/App.jsx\x1b[0m\n\t\x1b[31mmodified:   src/index.css\x1b[0m\n\nno changes added to commit (use "git add" and/or "git commit -a")';
        } else if (args[1] === 'init') {
          output = '\x1b[32mInitialized empty Git repository in C:/projects/tools/.git/\x1b[0m';
        } else if (args[1] === 'log') {
          output = '* \x1b[33me4a19bc\x1b[0m - (HEAD -> main) feat: add interactive CLI tools website (2 mins ago)\n* \x1b[33m7c32bf2\x1b[0m - Initial commit (3 hours ago)';
        } else {
          output = `git ${args[1] || 'status'} - Mock Git utility engine. Try 'git status' or 'git log'.`;
        }
        break;
      case 'ollama':
        if (args[1] === 'list') {
          output = 'NAME                 ID           SIZE      MODIFIED\nllama3:latest        e4a19bc451b2 4.7 GB    10 minutes ago\nmistral:latest       9c8a41753ba0 4.1 GB    1 day ago';
        } else if (args[1] === 'run') {
          output = `\x1b[35m[Ollama] Loading model ${args[2] || 'llama3'}...\x1b[0m\n>>> Hello! How can I help you today?\nI am a local AI assistant running on your terminal.`;
        } else {
          output = 'Ollama engine active. Commands: ollama list, ollama run llama3';
        }
        break;
      case 'ffmpeg':
        output = 'ffmpeg version 6.0-essentials_build-Gyan\nHyper fast Audio and Video encoder. Try building commands with the FFmpeg side panel!';
        break;
      case 'yt-dlp':
        output = '[youtube] Downloading webpage...\n[download] Destination: mock_video.mp4\n[download] 100% of 12.45MiB in 00:01\n\x1b[32m[Finished Downloading]\x1b[0m';
        break;
      case 'python':
        if (args[1] === '--version' || args[1] === '-V') {
          output = 'Python 3.12.3';
        } else {
          output = 'Python Interactive Shell is not simulated. Run a file using: python script.py';
        }
        break;
      case 'pip':
        if (args[1] === 'list') {
          output = 'Package    Version\n---------- -------\npip        24.0\nrequests   2.31.0\nurllib3    2.0.7';
        } else {
          output = 'Pip package manager active. Try: pip list, pip install requests';
        }
        break;
      case 'docker':
        if (args[1] === 'ps') {
          output = 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                  NAMES\ndf27a08b982a   nginx:alpine   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8080->80/tcp   web-container';
        } else {
          output = 'Docker daemon running. Commands: docker ps, docker run nginx';
        }
        break;
      case 'tmux':
        output = '\x1b[30;107m[tmux] 0:bash* 1:node-                                                (11/06/2026 07:15)\x1b[0m';
        break;
      case 'curl':
        output = `HTTP/2 200\ncontent-type: text/html\ndate: Thu, 11 Jun 2026 01:46:00 GMT\n\n\x1b[32m<html><body>Tools CLI Engine Server</body></html>\x1b[0m`;
        break;
      default:
        output = `tools-shell: command not found: ${primary}. Type "help" for a list of supported tools.`;
    }

    setHistory((prev) => [...prev, { type: 'output', content: output }]);
  };

  // Parses basic ANSI escape colors like \x1b[32m or \x1b[31m and returns JSX tags
  const renderAnsiText = (text) => {
    if (!text) return '';
    
    // Split text by ESC code
    const parts = text.split(/(\x1b\[\d+(?:;\d+)?m)/g);
    let currentColorClass = '';
    let currentBgColorClass = '';

    return parts.map((part, index) => {
      if (part.startsWith('\x1b[')) {
        const code = part.substring(2, part.length - 1);
        if (code === '0') {
          currentColorClass = '';
          currentBgColorClass = '';
        } else if (code === '31') {
          currentColorClass = 'text-red-500'; // red
        } else if (code === '32') {
          currentColorClass = 'text-emerald-400'; // green
        } else if (code === '33') {
          currentColorClass = 'text-yellow-400'; // yellow
        } else if (code === '35') {
          currentColorClass = 'text-purple-400'; // magenta/purple
        } else if (code === '36') {
          currentColorClass = 'text-cyan-400'; // cyan
        } else if (code === '37') {
          currentColorClass = 'text-white'; // white
        } else if (code === '30;107') {
          currentColorClass = 'text-black bg-white'; // black text white bg (tmux footer)
        }
        return null;
      }

      const inlineStyle = {};
      if (currentColorClass.includes('text-red-500')) inlineStyle.color = '#f87171';
      else if (currentColorClass.includes('text-emerald-400')) inlineStyle.color = '#34d399';
      else if (currentColorClass.includes('text-yellow-400')) inlineStyle.color = '#fbbf24';
      else if (currentColorClass.includes('text-purple-400')) inlineStyle.color = '#c084fc';
      else if (currentColorClass.includes('text-cyan-400')) inlineStyle.color = '#22d3ee';
      else if (currentColorClass.includes('text-white')) inlineStyle.color = '#ffffff';
      else if (currentColorClass.includes('text-black')) {
        inlineStyle.color = '#000000';
        inlineStyle.backgroundColor = '#ffffff';
        inlineStyle.padding = '0px 4px';
      }

      return (
        <span key={index} style={inlineStyle}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="terminal-card">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red" />
          <div className="terminal-dot yellow" />
          <div className="terminal-dot green" />
        </div>
        <div className="terminal-title">tools-terminal: sh</div>
        <div className="terminal-actions">
          <button 
            className="copy-btn" 
            title="Clear terminal logs"
            onClick={() => setHistory([])}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <div 
        ref={terminalBodyRef} 
        className="terminal-body" 
        onClick={handleTerminalClick}
        style={{ cursor: 'text' }}
      >
        {history.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.type === 'input' && (
              <span className="terminal-prompt-row">
                <span className="terminal-prompt">$</span>
                <span className="terminal-typed-cmd">{line.content}</span>
              </span>
            )}
            {line.type === 'output' && renderAnsiText(line.content)}
            {line.type === 'info' && <span style={{ color: '#6b7280' }}>{line.content}</span>}
          </div>
        ))}

        {isTyping && (
          <div className="terminal-line">
            <span className="terminal-prompt-row">
              <span className="terminal-prompt">$</span>
              <span className="terminal-typed-cmd">
                {typedContent}
                <span className="terminal-cursor" />
              </span>
            </span>
          </div>
        )}

        {!isTyping && (
          <form onSubmit={handleInputSubmit} className="terminal-prompt-row">
            <span className="terminal-prompt">$</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-typed-cmd"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                flex: 1,
                padding: 0,
                caretColor: '#00ff66'
              }}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type command here..."
              disabled={isTyping}
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  );
}
