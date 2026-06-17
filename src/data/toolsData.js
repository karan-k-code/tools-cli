export const toolsData = [
  {
    id: 'git',
    name: 'Git',
    category: 'VCS',
    color: '#F05032',
    accentClass: 'git-accent',
    github: 'https://github.com/git/git',
    tagline: 'Distributed version control system to track changes in source code.',
    description: 'Git is the industry standard for version control. It tracks changes to files, lets you revert to previous states, and makes collaboration seamless via branching and merging.',
    install: {
      windows: 'winget install --id Git.Git',
      mac: 'brew install git',
      linux: 'sudo apt install git-all'
    },
    visualConcept: {
      title: 'The Git Lifecycle',
      steps: [
        { name: 'Working Directory', desc: 'UnTracked or Modified files you are currently editing.', status: 'modified' },
        { name: 'Staging Area (Index)', desc: 'Files marked for the next commit. Cleaned & prepared.', status: 'staged' },
        { name: 'Local Repository', desc: 'Committed snapshots of your history stored locally.', status: 'committed' },
        { name: 'Remote Repository', desc: 'Hosted history on GitHub/GitLab, shared with others.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Git Command Architect',
      description: 'Configure files and actions to build Git staging, committing, and branching commands.',
      options: [
        {
          id: 'action',
          label: 'Select Action',
          type: 'select',
          defaultValue: 'commit',
          choices: [
            { value: 'init', label: 'Initialize Repository' },
            { value: 'add', label: 'Stage Files' },
            { value: 'commit', label: 'Commit Changes' },
            { value: 'branch', label: 'Create/Switch Branch' },
            { value: 'merge', label: 'Merge Branch' },
            { value: 'stash', label: 'Stash Changes' },
            { value: 'undo', label: 'Undo Last Commit' }
          ]
        },
        {
          id: 'fileName',
          label: 'File to Stage',
          type: 'text',
          defaultValue: '.',
          condition: (opts) => opts.action === 'add'
        },
        {
          id: 'commitMsg',
          label: 'Commit Message',
          type: 'text',
          defaultValue: 'feat: add interactive CLI tools website',
          condition: (opts) => opts.action === 'commit'
        },
        {
          id: 'branchName',
          label: 'Branch Name',
          type: 'text',
          defaultValue: 'main',
          condition: (opts) => opts.action === 'branch' || opts.action === 'merge'
        },
        {
          id: 'branchCreate',
          label: 'Create new branch if not existing (-b)',
          type: 'boolean',
          defaultValue: true,
          condition: (opts) => opts.action === 'branch'
        },
        {
          id: 'stashMsg',
          label: 'Stash Description',
          type: 'text',
          defaultValue: 'WIP: working on terminal styling',
          condition: (opts) => opts.action === 'stash'
        },
        {
          id: 'undoType',
          label: 'Reset Mode',
          type: 'select',
          defaultValue: '--soft',
          choices: [
            { value: '--soft', label: 'Soft (Keep changes in staging)' },
            { value: '--mixed', label: 'Mixed (Keep changes in working copy)' },
            { value: '--hard', label: 'Hard (Discard all changes completely!)' }
          ],
          condition: (opts) => opts.action === 'undo'
        }
      ],
      generator: (opts) => {
        switch (opts.action) {
          case 'init':
            return {
              command: 'git init',
              explanation: [
                { part: 'git init', desc: 'Initializes a new empty Git repository in the current folder, creating the hidden .git directory.' }
              ]
            };
          case 'add':
            return {
              command: `git add ${opts.fileName || '.'}`,
              explanation: [
                { part: 'git add', desc: 'Adds files to the staging area, preparing them to be committed.' },
                { part: opts.fileName || '.', desc: 'The specific path or file to stage. A dot (.) stages all changed files in the directory.' }
              ]
            };
          case 'commit':
            return {
              command: `git commit -m "${opts.commitMsg || 'update'}"`,
              explanation: [
                { part: 'git commit', desc: 'Takes a snapshot of your staged files and writes it to repository history.' },
                { part: '-m', desc: 'Flag indicating that a message string follows, avoiding opening a text editor.' },
                { part: `"${opts.commitMsg}"`, desc: 'The descriptive message explaining what changes are in this commit.' }
              ]
            };
          case 'branch': {
            const flag = opts.branchCreate ? '-b ' : '';
            return {
              command: `git checkout ${flag}${opts.branchName || 'main'}`,
              explanation: [
                { part: 'git checkout', desc: 'Navigates between branches or restores working tree files.' },
                ...(opts.branchCreate ? [{ part: '-b', desc: 'Creates the new branch if it does not already exist, and immediately switches to it.' }] : []),
                { part: opts.branchName || 'main', desc: 'The name of the branch to navigate to.' }
              ]
            };
          }
          case 'merge':
            return {
              command: `git merge ${opts.branchName || 'main'}`,
              explanation: [
                { part: 'git merge', desc: 'Combines the history of the target branch into your currently checked-out branch.' },
                { part: opts.branchName || 'main', desc: 'The branch containing changes you want to bring in.' }
              ]
            };
          case 'stash': {
            const desc = opts.stashMsg ? `push -m "${opts.stashMsg}"` : 'push';
            return {
              command: `git stash ${desc}`,
              explanation: [
                { part: 'git stash', desc: 'Saves your current local modifications and reverts the working directory to match the HEAD commit.' },
                { part: 'push', desc: 'Explicitly push a new stash entry onto the stack.' },
                ...(opts.stashMsg ? [{ part: `-m "${opts.stashMsg}"`, desc: 'Adds a custom text message to help identify this stash entry later.' }] : [])
              ]
            };
          }
          case 'undo':
            return {
              command: `git reset ${opts.undoType || '--soft'} HEAD~1`,
              explanation: [
                { part: 'git reset', desc: 'Resets the current HEAD to the specified state.' },
                { part: opts.undoType || '--soft', desc: opts.undoType === '--soft' ? 'Soft reset: keeps your changed files staged and ready for re-committing.' : opts.undoType === '--mixed' ? 'Mixed reset (default): unstages changes but keeps them in your workspace.' : 'Hard reset: discards ALL changes in staging AND working files! Be extremely careful.' },
                { part: 'HEAD~1', desc: 'Points to one commit before the current one (the commit you want to undo).' }
              ]
            };
          default:
            return { command: 'git status', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case 'init':
            return '\x1b[32mInitialized empty Git repository in C:/projects/tools/.git/\x1b[0m\n';
          case 'add':
            return ''; // silent usually
          case 'commit':
            return `[main e4a19bc] ${opts.commitMsg || 'feat: add interactive CLI tools website'}\n 4 files changed, 256 insertions(+), 12 deletions(-)\n create mode 100644 src/data/toolsData.js\n create mode 100644 src/components/Console.jsx`;
          case 'branch':
            return opts.branchCreate
              ? `\x1b[36mSwitched to a new branch '${opts.branchName || 'main'}'\x1b[0m`
              : `\x1b[36mSwitched to branch '${opts.branchName || 'main'}'\x1b[0m`;
          case 'merge':
            return `Updating 7c32bf2..e4a19bc\nFast-forward\n src/App.jsx | 42 ++++++++++++++++++--------\n 1 file changed, 30 insertions(+), 12 deletions(-)`;
          case 'stash':
            return `Saved working directory and index state WIP on main: e4a19bc feat: add interactive CLI tools website`;
          case 'undo':
            if (opts.undoType === '--hard') {
              return `HEAD is now at 7c32bf2 parent commit description`;
            } else {
              return `Unstaged changes after reset:\nM\tsrc/App.jsx\nM\tpackage.json`;
            }
          default:
            return 'On branch main\nnothing to commit, working tree clean';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Configuration',
        items: [
          { cmd: 'git config --global user.name "Your Name"', desc: 'Set global username for commits.' },
          { cmd: 'git config --global user.email "mail@example.com"', desc: 'Set global email address.' }
        ]
      },
      {
        section: 'Inspection & Logs',
        items: [
          { cmd: 'git status', desc: 'List files modified, staged, or untracked in current tree.' },
          { cmd: 'git log --oneline --graph', desc: 'Display commit history as a clean, visual ASCII branch tree.' },
          { cmd: 'git diff', desc: 'Show changes between working directory and the index.' }
        ]
      },
      {
        section: 'Remote Collaboration',
        items: [
          { cmd: 'git remote add origin <url>', desc: 'Map a remote repository URL to shortname "origin".' },
          { cmd: 'git fetch --all', desc: 'Download all latest commits from remotes without merging.' },
          { cmd: 'git pull origin main', desc: 'Fetch and merge remote changes from "main" into active branch.' }
        ]
      }
    ]
  },
  {
    id: 'ollama',
    name: 'Ollama',
    category: 'AI',
    color: '#a855f7',
    accentClass: 'ollama-accent',
    github: 'https://github.com/ollama/ollama',
    tagline: 'Run large language models locally on your system.',
    description: 'Ollama is a lightweight, extensible framework for building and running large language models (LLMs) locally. It packages model weights, configuration, and dependencies into a single Modelfile.',
    install: {
      windows: 'winget install Ollama.Ollama',
      mac: 'brew install ollama',
      linux: 'curl -fsSL https://ollama.com/install.sh | sh'
    },
    visualConcept: {
      title: 'Local LLM Architecture',
      steps: [
        { name: 'CLI Command', desc: 'Type command to load models locally.', status: 'modified' },
        { name: 'Ollama Server', desc: 'A background service running on port 11434 serving models.', status: 'staged' },
        { name: 'GGUF Models', desc: 'Quantized LLM files loaded in RAM/VRAM for prompt processing.', status: 'committed' },
        { name: 'Local Output', desc: 'Model response streamed back over local sockets. 100% private.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Ollama CLI Companion',
      description: 'Configure models and options to run, pull, manage, or query offline artificial intelligence models.',
      options: [
        {
          id: 'action',
          label: 'Select Action',
          type: 'select',
          defaultValue: 'run',
          choices: [
            { value: 'run', label: 'Run a Model (Interactive)' },
            { value: 'pull', label: 'Pull/Download Model' },
            { value: 'list', label: 'List Installed Models' },
            { value: 'show', label: 'Show Model Info' },
            { value: 'rm', label: 'Remove Model' }
          ]
        },
        {
          id: 'modelName',
          label: 'Select Model',
          type: 'select',
          defaultValue: 'llama3',
          choices: [
            { value: 'llama3', label: 'Llama 3 (Meta, 8B params)' },
            { value: 'mistral', label: 'Mistral (7B params)' },
            { value: 'phi3', label: 'Phi-3 (Microsoft, 3.8B params)' },
            { value: 'deepseek-coder', label: 'DeepSeek Coder (Coding expert)' },
            { value: 'gemma2', label: 'Gemma 2 (Google, 9B params)' }
          ],
          condition: (opts) => ['run', 'pull', 'show', 'rm'].includes(opts.action)
        }
      ],
      generator: (opts) => {
        switch (opts.action) {
          case 'run':
            return {
              command: `ollama run ${opts.modelName || 'llama3'}`,
              explanation: [
                { part: 'ollama run', desc: 'Runs a model. If the model is not downloaded, it pulls it automatically first, then starts an interactive chat terminal.' },
                { part: opts.modelName || 'llama3', desc: 'The name of the local model repository to load.' }
              ]
            };
          case 'pull':
            return {
              command: `ollama pull ${opts.modelName || 'llama3'}`,
              explanation: [
                { part: 'ollama pull', desc: 'Downloads a model from the Ollama library without starting a chat session.' },
                { part: opts.modelName || 'llama3', desc: 'The specific model tag to fetch.' }
              ]
            };
          case 'list':
            return {
              command: 'ollama list',
              explanation: [
                { part: 'ollama list', desc: 'Lists all models currently stored locally on your hard drive and available to run.' }
              ]
            };
          case 'show':
            return {
              command: `ollama show ${opts.modelName || 'llama3'}`,
              explanation: [
                { part: 'ollama show', desc: 'Displays detailed metadata, license information, system prompt details, and parameters of a model.' },
                { part: opts.modelName || 'llama3', desc: 'The model whose details you wish to view.' }
              ]
            };
          case 'rm':
            return {
              command: `ollama rm ${opts.modelName || 'llama3'}`,
              explanation: [
                { part: 'ollama rm', desc: 'Deletes the selected local model file, freeing up storage space.' },
                { part: opts.modelName || 'llama3', desc: 'The target model to delete.' }
              ]
            };
          default:
            return { command: 'ollama --help', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const m = opts.modelName || 'llama3';
        switch (opts.action) {
          case 'run':
            return `\x1b[32m>>>\x1b[0m \x1b[37mHello, who are you?\x1b[0m\nI am a large language model trained by Meta, running locally on your hardware via Ollama. How can I help you today?\n\x1b[32m>>>\x1b[0m \x1b[37m[Press Ctrl+D to exit]\x1b[0m`;
          case 'pull':
            return `pulling manifest\ndownloading f02422.. (4.7 GB) [====================>] 100% 45.2 MB/s\nverifying sha256 digest\nwriting manifest\nsuccess`;
          case 'list':
            return `NAME                 ID           SIZE      MODIFIED\n${m}:latest       e4a19bc451b2 4.7 GB    2 minutes ago\nmistral:latest       9c8a41753ba0 4.1 GB    1 day ago\ngemma2:latest        c92ea84b01e2 5.5 GB    3 days ago`;
          case 'show':
            return `Model Details\n  family:             llama\n  parameter size:     8.0B\n  quantization level: Q4_K_M\n\nParameters\n  stop:               "<|start_header_id|>"\n  stop:               "<|end_header_id|>"\n  stop:               "<|eot_id|>"`;
          case 'rm':
            return `deleted '${m}'`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Server & Control',
        items: [
          { cmd: 'ollama serve', desc: 'Start the Ollama background server manually.' },
          { cmd: 'ollama --version', desc: 'Check the currently installed Ollama client and server versions.' }
        ]
      },
      {
        section: 'Model Customization',
        items: [
          { cmd: 'ollama create mymodel -f ./Modelfile', desc: 'Build a custom model from a definition File.' },
          { cmd: 'ollama run gemma2 "Why is the sky blue?"', desc: 'Run a one-off prompt command and print output directly.' }
        ]
      }
    ]
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    category: 'Media',
    color: '#00cc66',
    accentClass: 'ffmpeg-accent',
    github: 'https://github.com/FFmpeg/FFmpeg',
    tagline: 'Swiss Army knife for multimedia transcoding and processing.',
    description: 'FFmpeg is a leading multimedia framework capable of decoding, encoding, transcoding, muxing, demuxing, streaming, filtering and playing almost anything humans and machines have created.',
    install: {
      windows: 'winget install Gyan.FFmpeg',
      mac: 'brew install ffmpeg',
      linux: 'sudo apt install ffmpeg'
    },
    visualConcept: {
      title: 'FFmpeg Transcoding Pipeline',
      steps: [
        { name: 'Demuxer', desc: 'Splits media container (e.g. mp4) into packets of audio/video streams.', status: 'modified' },
        { name: 'Decoder', desc: 'Uncompresses packets into raw, uncompressed frames in memory.', status: 'staged' },
        { name: 'Filters', desc: 'Applies filters (scaling, cropping, volume, watermark overlay).', status: 'committed' },
        { name: 'Encoder / Muxer', desc: 'Re-compresses frames with target codec and packages into final file.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'FFmpeg Command Configurator',
      description: 'Easily construct command chains to transcode, resize, crop, slice, and extract audio from files.',
      options: [
        {
          id: 'action',
          label: 'Operation',
          type: 'select',
          defaultValue: 'compress',
          choices: [
            { value: 'compress', label: 'Compress Video' },
            { value: 'extract-audio', label: 'Extract Audio (MP3)' },
            { value: 'cut', label: 'Cut / Slice Video' },
            { value: 'resize', label: 'Resize / Scale Video' },
            { value: 'convert', label: 'Convert Format' }
          ]
        },
        {
          id: 'input',
          label: 'Input File Name',
          type: 'text',
          defaultValue: 'input.mp4'
        },
        {
          id: 'output',
          label: 'Output File Name',
          type: 'text',
          defaultValue: 'output.mp4',
          condition: (opts) => opts.action !== 'extract-audio'
        },
        {
          id: 'crf',
          label: 'Compression Factor (CRF - Higher = Lower quality/file size)',
          type: 'select',
          defaultValue: '24',
          choices: [
            { value: '18', label: '18 (Near-lossless, large)' },
            { value: '23', label: '23 (Standard default)' },
            { value: '28', label: '28 (Highly compressed, small)' },
            { value: '32', label: '32 (Very low quality)' }
          ],
          condition: (opts) => opts.action === 'compress'
        },
        {
          id: 'startTime',
          label: 'Start Timestamp (hh:mm:ss)',
          type: 'text',
          defaultValue: '00:00:10',
          condition: (opts) => opts.action === 'cut'
        },
        {
          id: 'duration',
          label: 'Duration (seconds)',
          type: 'text',
          defaultValue: '30',
          condition: (opts) => opts.action === 'cut'
        },
        {
          id: 'resolution',
          label: 'Target Resolution',
          type: 'select',
          defaultValue: '1280:720',
          choices: [
            { value: '1920:1080', label: '1080p Full HD (1920x1080)' },
            { value: '1280:720', label: '720p HD (1280x720)' },
            { value: '854:480', label: '480p SD (854x480)' },
            { value: '640:360', label: '360p Low-res (640x360)' }
          ],
          condition: (opts) => opts.action === 'resize'
        },
        {
          id: 'format',
          label: 'Output Format',
          type: 'select',
          defaultValue: 'mkv',
          choices: [
            { value: 'mkv', label: 'MKV (Matroska)' },
            { value: 'avi', label: 'AVI (Legacy)' },
            { value: 'gif', label: 'Animated GIF' },
            { value: 'webm', label: 'WebM (Web optimized)' }
          ],
          condition: (opts) => opts.action === 'convert'
        }
      ],
      generator: (opts) => {
        const input = opts.input || 'input.mp4';
        switch (opts.action) {
          case 'compress':
            return {
              command: `ffmpeg -i ${input} -vcodec libx264 -crf ${opts.crf || '23'} ${opts.output || 'output.mp4'}`,
              explanation: [
                { part: 'ffmpeg', desc: 'Invokes the FFmpeg tool.' },
                { part: `-i ${input}`, desc: `Defines "${input}" as the input media source file.` },
                { part: '-vcodec libx264', desc: 'Sets the video encoder to H.264 (libx264), the most widely supported codec.' },
                { part: `-crf ${opts.crf}`, desc: `Constant Rate Factor. Controls quality. 18-28 is typical; higher values yield higher compression and lower file size.` },
                { part: opts.output || 'output.mp4', desc: 'The resulting output file path.' }
              ]
            };
          case 'extract-audio': {
            const audOut = input.replace(/\.[^/.]+$/, "") + '.mp3';
            return {
              command: `ffmpeg -i ${input} -vn -acodec libmp3lame -aq 2 ${audOut}`,
              explanation: [
                { part: 'ffmpeg -i', desc: 'Starts FFmpeg and designates the input stream.' },
                { part: '-vn', desc: 'Disables video recording/copying, extracting only the audio track.' },
                { part: '-acodec libmp3lame', desc: 'Selects the LAME MP3 encoder library.' },
                { part: '-aq 2', desc: 'Audio Quality level 2 (VBR ~190 kbps, standard high quality).' },
                { part: audOut, desc: 'The generated MP3 audio filename.' }
              ]
            };
          }
          case 'cut':
            return {
              command: `ffmpeg -i ${input} -ss ${opts.startTime || '00:00:00'} -t ${opts.duration || '10'} -c copy ${opts.output || 'output.mp4'}`,
              explanation: [
                { part: `-ss ${opts.startTime}`, desc: 'Seeks to the designated start timestamp in format hh:mm:ss.' },
                { part: `-t ${opts.duration}`, desc: 'Limits the output duration to the specified number of seconds.' },
                { part: '-c copy', desc: 'Copies audio and video codecs directly without re-encoding, making the operation instantaneous.' }
              ]
            };
          case 'resize':
            return {
              command: `ffmpeg -i ${input} -vf "scale=${opts.resolution}" ${opts.output || 'output.mp4'}`,
              explanation: [
                { part: '-vf', desc: 'Indicates the video filtergraph follows.' },
                { part: `"scale=${opts.resolution}"`, desc: `Applies the scaling filter to resize the width and height to ${opts.resolution.replace(':', 'x')}.` }
              ]
            };
          case 'convert': {
            const outFormatName = (opts.output || 'output.mp4').replace(/\.[^/.]+$/, "") + '.' + opts.format;
            return {
              command: `ffmpeg -i ${input} ${outFormatName}`,
              explanation: [
                { part: `ffmpeg -i ${input}`, desc: 'Specifies the input source file.' },
                { part: outFormatName, desc: `The target output filename. FFmpeg automatically infers the target codecs, container format, and parameters from this extension.` }
              ]
            };
          }
          default:
            return { command: 'ffmpeg -version', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const input = opts.input || 'input.mp4';
        return `ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers\nInput #0, mov,mp4,m4a,3gp, from '${input}':\n  Duration: 00:05:24.12, start: 0.000000, bitrate: 2154 kb/s\n  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709)\n  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x4061706D), 48000 Hz, stereo\n\x1b[33m[libx264 @ 000001bcfa7b32] using SAR=1/1\x1b[0m\nframe=  456 fps= 62 q=-1.0 size=    4521kB time=00:00:15.20 bitrate=2431.1kbits/s speed=2.07x\n\x1b[32m[Conversion Completed Successfully]\x1b[0m`;
      }
    },
    cheatsheets: [
      {
        section: 'Video Filtering',
        items: [
          { cmd: 'ffmpeg -i input.mp4 -vf "transpose=1" output.mp4', desc: 'Rotate video 90 degrees clockwise.' },
          { cmd: 'ffmpeg -i input.mp4 -vf "crop=w:h:x:y" output.mp4', desc: 'Crop video to width w, height h, starting at coordinate (x,y).' }
        ]
      },
      {
        section: 'Merge & Concatenate',
        items: [
          { cmd: 'ffmpeg -i "concat:part1.mp3|part2.mp3" -acodec copy output.mp3', desc: 'Merge two MP3 files together without re-encoding.' },
          { cmd: 'ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4', desc: 'Merge multiple video parts listed in list.txt.' }
        ]
      }
    ]
  },
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    category: 'Media',
    color: '#FF0000',
    accentClass: 'ytdlp-accent',
    github: 'https://github.com/yt-dlp/yt-dlp',
    tagline: 'High-speed media and audio downloader for the web.',
    description: 'yt-dlp is a command-line YouTube downloader fork of youtube-dl, adding active feature development, speed improvements, and rich customization features for downloading streams from thousands of websites.',
    install: {
      windows: 'winget install yt-dlp.yt-dlp',
      mac: 'brew install yt-dlp',
      linux: 'sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp'
    },
    visualConcept: {
      title: 'yt-dlp Operation Lifecycle',
      steps: [
        { name: 'Extract Metadata', desc: 'Queries remote URL to resolve streams, captions, subtitles, and playlists.', status: 'modified' },
        { name: 'Format Selector', desc: 'Matches requested format flags (e.g. best video + best audio).', status: 'staged' },
        { name: 'HTTP Download', desc: 'Downloads video/audio fragments in parallel streams.', status: 'committed' },
        { name: 'Post-Processor', desc: 'Merges streams using FFmpeg, embeds thumbnails, and writes tags.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'yt-dlp Commander',
      description: 'Generate high-performance commands to download videos, split playlists, or extract high-fidelity audio.',
      options: [
        {
          id: 'action',
          label: 'Download Goal',
          type: 'select',
          defaultValue: 'best-quality',
          choices: [
            { value: 'best-quality', label: 'Best Quality (Merged)' },
            { value: 'mp3', label: 'Extract Audio (MP3)' },
            { value: 'download-section', label: 'Download Specific Section (Trim)' },
            { value: 'embed-subs', label: 'Download Video + Embed Subtitles' },
            { value: 'playlist', label: 'Download Entire Playlist' },
            { value: 'specific-res', label: 'Specific Resolution (e.g. 1080p)' },
            { value: 'list-formats', label: 'List Available Formats only' }
          ]
        },
        {
          id: 'url',
          label: 'Video/Playlist URL',
          type: 'text',
          defaultValue: 'https://www.youtube.com/watch?v=HcjW2k1IrTM'
        },
        {
          id: 'audioQuality',
          label: 'Audio Bitrate (kbps)',
          type: 'select',
          defaultValue: '320',
          choices: [
            { value: '320', label: '320 kbps (High)' },
            { value: '192', label: '192 kbps (Medium)' },
            { value: '128', label: '128 kbps (Low)' }
          ],
          condition: (opts) => opts.action === 'mp3'
        },
        {
          id: 'resVal',
          label: 'Max Height Resolution',
          type: 'select',
          defaultValue: '1080',
          choices: [
            { value: '4320', label: '8K Ultra HD (4320p)' },
            { value: '2160', label: '4K Ultra HD (2160p)' },
            { value: '1440', label: '2K Quad HD (1440p)' },
            { value: '1080', label: 'Full HD (1080p)' },
            { value: '720', label: 'HD (720p)' },
            { value: '480', label: 'SD (480p)' }
          ],
          condition: (opts) => opts.action === 'specific-res'
        },
        {
          id: 'sectionStart',
          label: 'Section Start Timestamp (e.g. 00:01:00 or 60)',
          type: 'text',
          defaultValue: '00:01:00',
          condition: (opts) => opts.action === 'download-section'
        },
        {
          id: 'sectionEnd',
          label: 'Section End Timestamp (e.g. 00:02:30 or 150)',
          type: 'text',
          defaultValue: '00:02:30',
          condition: (opts) => opts.action === 'download-section'
        },
        {
          id: 'subLang',
          label: 'Subtitle Language',
          type: 'select',
          defaultValue: 'en',
          choices: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'all', label: 'All Available Languages' }
          ],
          condition: (opts) => opts.action === 'embed-subs'
        }
      ],
      generator: (opts) => {
        const url = opts.url || 'https://www.youtube.com/watch?v=HcjW2k1IrTM';
        switch (opts.action) {
          case 'best-quality':
            return {
              command: `yt-dlp -f "bv*+ba/b" ${url}`,
              explanation: [
                { part: 'yt-dlp', desc: 'Runs the downloader utility.' },
                { part: '-f "bv*+ba/b"', desc: 'Format flag: Downloads best quality video stream (bv*) and best quality audio stream (ba) and merges them. If separate streams aren\'t available, falls back to best pre-merged format (b).' },
                { part: url, desc: 'The target media url link.' }
              ]
            };
          case 'mp3':
            return {
              command: `yt-dlp -x --audio-format mp3 --audio-quality ${opts.audioQuality || '320'}k ${url}`,
              explanation: [
                { part: '-x', desc: 'Extract audio: converts downloaded video files into audio-only files.' },
                { part: '--audio-format mp3', desc: 'Converts the extracted audio stream into MP3 encoding.' },
                { part: `--audio-quality ${opts.audioQuality || '320'}k`, desc: 'Specifies the MP3 quality output in kilobits per second.' }
              ]
            };
          case 'download-section':
            return {
              command: `yt-dlp --download-sections "*${opts.sectionStart || '00:01:00'}-${opts.sectionEnd || '00:02:30'}" ${url}`,
              explanation: [
                { part: 'yt-dlp', desc: 'Runs the downloader utility.' },
                { part: `--download-sections "*${opts.sectionStart || '00:01:00'}-${opts.sectionEnd || '00:02:30'}"`, desc: 'Downloads only a specific segment/time-range of the video.' },
                { part: url, desc: 'Target video URL.' }
              ]
            };
          case 'embed-subs':
            return {
              command: `yt-dlp --write-subs --sub-langs "${opts.subLang || 'en'}" --embed-subs ${url}`,
              explanation: [
                { part: 'yt-dlp', desc: 'Runs the downloader utility.' },
                { part: '--write-subs', desc: 'Downloads the subtitle file during the processing phase.' },
                { part: `--sub-langs "${opts.subLang || 'en'}"`, desc: 'Specifies the targeted subtitle language code(s) to fetch.' },
                { part: '--embed-subs', desc: 'Merges / embeds the subtitle track inside the video container (e.g., MKV/MP4).' }
              ]
            };
          case 'playlist':
            return {
              command: `yt-dlp --yes-playlist --output "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" ${url}`,
              explanation: [
                { part: '--yes-playlist', desc: 'Allows downloading the entire playlist if the URL contains a playlist identifier.' },
                { part: '--output "..."', desc: 'Formats the downloaded filenames dynamically: saves them into a folder named after the playlist title, prefixing the file with its track list index.' }
              ]
            };
          case 'specific-res':
            return {
              command: `yt-dlp -f "bv*[height<=${opts.resVal || '1080'}]+ba/b[height<=${opts.resVal || '1080'}]" ${url}`,
              explanation: [
                { part: `-f "bv*[height<=${opts.resVal}]+ba"`, desc: `Downloads the best video stream that has a resolution height equal to or less than ${opts.resVal}p, plus the best audio, and blends them.` }
              ]
            };
          case 'list-formats':
            return {
              command: `yt-dlp -F ${url}`,
              explanation: [
                { part: '-F', desc: 'Lists all available downloadable formats (video, audio, and multiplexed options) with their specific codec, size, and rate tags, without downloading anything.' }
              ]
            };
          default:
            return { command: `yt-dlp ${url}`, explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        if (opts.action === 'list-formats') {
          return `[youtube] Extracting URL: ${opts.url || '...'}\n[youtube] HcjW2k1IrTM: Downloading webpage\n[info] Available formats for HcjW2k1IrTM:\nID  EXT   RESOLUTION FPS CH │   FILESIZE   TBR PROTO │ VCODEC           ACODEC\n137 mp4   1920x1080   30    │   45.21MiB  2154k https │ avc1.640028      none\n140 m4a   audio only   2    │    3.15MiB   129k https │ none             mp4a.40.2`;
        }
        if (opts.action === 'download-section') {
          return `[youtube] Extracting URL: ${opts.url || '...'}\n[info] HcjW2k1IrTM: Downloading section *${opts.sectionStart || '00:01:00'}-${opts.sectionEnd || '00:02:30'}\n[download] Destination: Google Keynote IO 2024.mp4\n[download] 100% of 3.12MiB in 00:01\n\x1b[32m[Finished downloading trimmed segment successfully]\x1b[0m`;
        }
        if (opts.action === 'embed-subs') {
          return `[youtube] Extracting URL: ${opts.url || '...'}\n[info] Writing subtitles to: Google Keynote IO 2024.${opts.subLang || 'en'}.vtt\n[download] Destination: Google Keynote IO 2024.mp4\n[download] 100% of 15.40MiB in 00:03\n[Subtitles] Embedding subtitles in "Google Keynote IO 2024.mp4"\n\x1b[32m[Finished downloading video and embedding subtitles]\x1b[0m`;
        }
        return `[youtube] Extracting URL: ${opts.url || '...'}\n[youtube] HcjW2k1IrTM: Downloading webpage\n[info] HcjW2k1IrTM: Downloading 1 format(s)\n[download] Destination: Google Keynote IO 2024.mp4\n\x1b[36m[download]  45.0% of   15.40MiB at   5.20MiB/s ETA 00:01\x1b[0m\n[download] 100% of 15.40MiB in 00:03 at 4.80MiB/s\n[Merger] Merging formats into "Google Keynote IO 2024.mp4"\n\x1b[32m[Finished Downloading]\x1b[0m`;
      }
    },
    cheatsheets: [
      {
        section: 'Performance Options',
        items: [
          { cmd: 'yt-dlp --limit-rate 50K <url>', desc: 'Limit download bandwidth speed to 50KB/s.' },
          { cmd: 'yt-dlp --concurrent-fragments 5 <url>', desc: 'Download 5 video segments in parallel (speeds up slow server throttling).' }
        ]
      },
      {
        section: 'Metadata & Subtitles',
        items: [
          { cmd: 'yt-dlp --list-subs <url>', desc: 'List all available subtitle languages for the video without downloading.' },
          { cmd: 'yt-dlp --write-auto-subs --skip-download <url>', desc: 'Fetch auto-generated captions and save them to disc, without downloading video.' },
          { cmd: 'yt-dlp --embed-thumbnail --embed-metadata <url>', desc: 'Merge video metadata and custom cover thumbnail directly into output file container.' },
          { cmd: 'yt-dlp --write-thumbnail --skip-download <url>', desc: 'Download the video preview thumbnail / cover image as a separate file.' }
        ]
      },
      {
        section: 'Authentication & Inputs',
        items: [
          { cmd: 'yt-dlp --cookies-from-browser chrome <url>', desc: 'Extract cookie session keys from Chrome to bypass captchas, age-gates, or login prompts.' },
          { cmd: 'yt-dlp --batch-file urls.txt', desc: 'Download multiple media files or playlists sequentially from a list of URLs in a text file.' }
        ]
      }
    ]
  },
  {
    id: 'python-pip',
    name: 'Python & Pip',
    category: 'AI',
    color: '#306998',
    accentClass: 'python-accent',
    github: 'https://github.com/pypa/pip',
    tagline: 'Write advanced applications and manage packages with pip.',
    description: 'Python is a high-level, general-purpose coding language. Pip is Python\'s package installer, enabling developers to query, install, resolve dependencies, and manage packages from the PyPI index.',
    install: {
      windows: 'winget install Python.Python.3',
      mac: 'brew install python',
      linux: 'sudo apt install python3 python3-pip'
    },
    visualConcept: {
      title: 'Python Environment Isolation',
      steps: [
        { name: 'System Python', desc: 'The global interpreter installed on your OS. Modifying this can break system packages.', status: 'modified' },
        { name: 'Virtual Env (venv)', desc: 'An isolated box folder containing its own local python interpreter & bin files.', status: 'staged' },
        { name: 'Pip Install', desc: 'Downloads packages directly inside your local venv directory instead of globally.', status: 'committed' },
        { name: 'Safe Execution', desc: 'Your script executes importing isolated versions without dependency conflicts.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Python Env Architect',
      description: 'Configure and generate commands to spin up virtual environments, install packages, and manage package manifests.',
      options: [
        {
          id: 'action',
          label: 'Task Type',
          type: 'select',
          defaultValue: 'venv',
          choices: [
            { value: 'venv', label: 'Create Virtual Env' },
            { value: 'activate-win', label: 'Activate Env (Windows)' },
            { value: 'activate-unix', label: 'Activate Env (Mac/Linux)' },
            { value: 'install', label: 'Install Package with Pip' },
            { value: 'requirements', label: 'Save / Install Requirements File' }
          ]
        },
        {
          id: 'envName',
          label: 'Venv Name',
          type: 'text',
          defaultValue: 'venv',
          condition: (opts) => ['venv', 'activate-win', 'activate-unix'].includes(opts.action)
        },
        {
          id: 'packageName',
          label: 'Package Name',
          type: 'text',
          defaultValue: 'numpy pandas requests',
          condition: (opts) => opts.action === 'install'
        },
        {
          id: 'pipMode',
          label: 'Save or Load requirements',
          type: 'select',
          defaultValue: 'freeze',
          choices: [
            { value: 'freeze', label: 'Export list of packages (freeze)' },
            { value: 'load', label: 'Install list from file (requirements.txt)' }
          ],
          condition: (opts) => opts.action === 'requirements'
        }
      ],
      generator: (opts) => {
        const ev = opts.envName || 'venv';
        switch (opts.action) {
          case 'venv':
            return {
              command: `python -m venv ${ev}`,
              explanation: [
                { part: 'python', desc: 'Invokes the python command line interpreter.' },
                { part: '-m venv', desc: 'Executes the built-in library module "venv" used to build isolated virtual environments.' },
                { part: ev, desc: 'The target folder name where the virtual environment libraries and files will be initialized.' }
              ]
            };
          case 'activate-win':
            return {
              command: `.\\${ev}\\Scripts\\activate`,
              explanation: [
                { part: `.\\${ev}\\Scripts\\activate`, desc: 'Runs the PowerShell/CMD batch script to update your terminal shell environment variables. Your terminal prompt will change to show the environment active.' }
              ]
            };
          case 'activate-unix':
            return {
              command: `source ${ev}/bin/activate`,
              explanation: [
                { part: 'source', desc: 'Executes the activate file in the context of the active terminal shell.' },
                { part: `${ev}/bin/activate`, desc: 'Path to the Unix environment activation shell script.' }
              ]
            };
          case 'install':
            return {
              command: `pip install ${opts.packageName || 'requests'}`,
              explanation: [
                { part: 'pip install', desc: 'Commands pip to download and install packages from the PyPI index.' },
                { part: opts.packageName || 'requests', desc: 'A space-separated list of packages to download (e.g. numpy, pandas, flask).' }
              ]
            };
          case 'requirements':
            return {
              command: opts.pipMode === 'freeze' ? 'pip freeze > requirements.txt' : 'pip install -r requirements.txt',
              explanation: [
                ...(opts.pipMode === 'freeze'
                  ? [
                      { part: 'pip freeze', desc: 'Lists all packages installed in the current environment in a standardized format.' },
                      { part: '>', desc: 'Redirection operator: sends the console output of the previous command into a text file instead of printing to screen.' },
                      { part: 'requirements.txt', desc: 'Name of the output text manifest.' }
                    ]
                  : [
                      { part: 'pip install', desc: 'Standard install command.' },
                      { part: '-r requirements.txt', desc: 'Instructs pip to read the list of packages and versions from the given requirements file and install all of them.' }
                    ])
              ]
            };
          default:
            return { command: 'python --version', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case 'venv':
            return ''; // silent
          case 'activate-win':
          case 'activate-unix':
            return `(venv) C:\\projects\\tools>`;
          case 'install':
            return `Collecting ${opts.packageName || 'requests'}\n  Downloading requests-2.31.0-py3-none-any.whl (62 kB)\n  Downloading urllib3-2.0.7-py3-none-any.whl (124 kB)\nInstalling collected packages: urllib3, requests\n\x1b[32mSuccessfully installed requests-2.31.0 urllib3-2.0.7\x1b[0m`;
          case 'requirements':
            return opts.pipMode === 'freeze'
              ? 'numpy==1.26.2\npandas==2.1.3\nrequests==2.31.0'
              : 'Installing dependencies from requirements.txt...\n\x1b[32mAll packages up to date.\x1b[0m';
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Package Management',
        items: [
          { cmd: 'pip uninstall <package>', desc: 'Remove a package from the environment.' },
          { cmd: 'pip list', desc: 'Show all installed packages and versions.' },
          { cmd: 'pip install <package> --upgrade', desc: 'Upgrade package to the latest version.' }
        ]
      },
      {
        section: 'Execution & Shell',
        items: [
          { cmd: 'python script.py', desc: 'Execute a python file.' },
          { cmd: 'python -c "import os; print(os.getcwd())"', desc: 'Execute a single-line python code snippet in the shell.' }
        ]
      }
    ]
  },
  {
    id: 'utils',
    name: 'More CLI Utilities',
    category: 'Utilities',
    color: '#eab308',
    accentClass: 'utils-accent',
    tagline: 'Standard commands that every CLI power user should master.',
    description: 'A curated collection of essential command line tools for text manipulation, networking, containers, and server multiplexing.',
    install: {
      windows: 'winget install jqlang.jq BurntSushi.ripgrep Docker.DockerDesktop',
      mac: 'brew install jq ripgrep tmux',
      linux: 'sudo apt install jq ripgrep tmux curl'
    },
    visualConcept: {
      title: 'Pipes & Streams Lifecycle',
      steps: [
        { name: 'Data Source', desc: 'An application output, logs, or a text file (e.g. cat server.json).', status: 'modified' },
        { name: 'Pipe Operator (|)', desc: 'Redirects stdout of left command into stdin of right command.', status: 'staged' },
        { name: 'Parser (jq/grep)', desc: 'Processes, filters, filters regular expressions, or reformats stream.', status: 'committed' },
        { name: 'Terminal / File', desc: 'Outputs matching lines or writes new parsed content to disk.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'General Utility Builder',
      description: 'Configure and test commands for Docker, JSON parsing (jq), regex searching (ripgrep/grep), and curl HTTP requests.',
      options: [
        {
          id: 'action',
          label: 'Select Tool',
          type: 'select',
          defaultValue: 'jq',
          choices: [
            { value: 'jq', label: 'jq - JSON Processor' },
            { value: 'ripgrep', label: 'ripgrep (rg) - Regex Search' },
            { value: 'curl', label: 'curl - HTTP Client' },
            { value: 'docker', label: 'docker - Containers' },
            { value: 'tmux', label: 'tmux - Terminal Multiplexer' }
          ]
        },
        {
          id: 'jqFilter',
          label: 'JSON Filter Key',
          type: 'text',
          defaultValue: '.users[0].name',
          condition: (opts) => opts.action === 'jq'
        },
        {
          id: 'rgQuery',
          label: 'Search Query',
          type: 'text',
          defaultValue: 'TODO: fix styles',
          condition: (opts) => opts.action === 'ripgrep'
        },
        {
          id: 'curlUrl',
          label: 'URL Endpoint',
          type: 'text',
          defaultValue: 'https://api.github.com/repos/facebook/react',
          condition: (opts) => opts.action === 'curl'
        },
        {
          id: 'dockerImage',
          label: 'Docker Image to run',
          type: 'select',
          defaultValue: 'nginx:alpine',
          choices: [
            { value: 'nginx:alpine', label: 'Nginx Web Server' },
            { value: 'postgres:alpine', label: 'PostgreSQL Database' },
            { value: 'redis:alpine', label: 'Redis Cache' }
          ],
          condition: (opts) => opts.action === 'docker'
        },
        {
          id: 'tmuxName',
          label: 'Session Name',
          type: 'text',
          defaultValue: 'developer-workspace',
          condition: (opts) => opts.action === 'tmux'
        }
      ],
      generator: (opts) => {
        switch (opts.action) {
          case 'jq':
            return {
              command: `cat data.json | jq '${opts.jqFilter || '.'}'`,
              explanation: [
                { part: 'cat data.json', desc: 'Reads and prints the content of "data.json" to standard output.' },
                { part: '|', desc: 'Pipes stdout into the next command.' },
                { part: 'jq', desc: 'Invokes the jq JSON parser.' },
                { part: `'${opts.jqFilter}'`, desc: 'The JSON query path filter. Extracts specific items, arrays, or fields.' }
              ]
            };
          case 'ripgrep':
            return {
              command: `rg "${opts.rgQuery || 'TODO'}" --line-number`,
              explanation: [
                { part: 'rg', desc: 'Invokes ripgrep, a recursive regex search tool that is faster than grep.' },
                { part: `"${opts.rgQuery}"`, desc: 'The string or regular expression to look for.' },
                { part: '--line-number', desc: 'Prints the line number matching the text query.' }
              ]
            };
          case 'curl':
            return {
              command: `curl -i -X GET ${opts.curlUrl || 'https://api.github.com'}`,
              explanation: [
                { part: 'curl', desc: 'Command line tool for transferring data over URLs.' },
                { part: '-i', desc: 'Prints HTTP response headers along with body.' },
                { part: '-X GET', desc: 'Designates the HTTP Request method (GET, POST, PUT, DELETE, etc.).' },
                { part: opts.curlUrl || 'https://api.github.com', desc: 'Target endpoint URL to fetch.' }
              ]
            };
          case 'docker':
            return {
              command: `docker run -d -p 8080:80 --name web-container ${opts.dockerImage || 'nginx:alpine'}`,
              explanation: [
                { part: 'docker run', desc: 'Tells docker to download (if not present) and execute an image inside a container.' },
                { part: '-d', desc: 'Runs container in detached background mode.' },
                { part: '-p 8080:80', desc: 'Binds port 8080 on the host machine to port 80 inside the container.' },
                { part: '--name web-container', desc: 'Sets a readable reference name for this container instance.' },
                { part: opts.dockerImage || 'nginx:alpine', desc: 'The base template image tag to initialize.' }
              ]
            };
          case 'tmux':
            return {
              command: `tmux new -s ${opts.tmuxName || 'work'}`,
              explanation: [
                { part: 'tmux new', desc: 'Builds a new tmux server session.' },
                { part: '-s', desc: 'Tells tmux to name the session.' },
                { part: opts.tmuxName || 'work', desc: 'A custom handle to connect back to this multiplexed shell session later.' }
              ]
            };
          default:
            return { command: 'help', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case 'jq':
            return `\x1b[36m{\n  "name": "Jane Doe",\n  "active": true\n}\x1b[0m`;
          case 'ripgrep':
            return `src/App.jsx:45:    // \x1b[31m${opts.rgQuery || 'TODO: fix styles'}\x1b[0m\nsrc/components/Sidebar.jsx:112:    // \x1b[31m${opts.rgQuery || 'TODO: fix styles'}\x1b[0m`;
          case 'curl':
            return `HTTP/2 200\nserver: GitHub.com\ndate: Thu, 11 Jun 2026 01:46:00 GMT\ncontent-type: application/json; charset=utf-8\n\n\x1b[32m{"id": 10279, "name": "react", "full_name": "facebook/react"}\x1b[0m`;
          case 'docker':
            return `Unable to find image '${opts.dockerImage || 'nginx:alpine'}' locally\nlatest: Pulling from library/nginx\nDigest: sha256:d82b4...31b2\nStatus: Downloaded newer image\n\x1b[32mdf27a08b982ac63481bdf9618a804791538bc1a3b4db732890\x1b[0m`;
          case 'tmux':
            return `[tmux session created]`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Docker',
        items: [
          { cmd: 'docker ps', desc: 'List active container processes.' },
          { cmd: 'docker logs <container-id>', desc: 'View server stdout/stderr output from a container.' },
          { cmd: 'docker stop <container-id>', desc: 'Halt a running container.' }
        ]
      },
      {
        section: 'Tmux',
        items: [
          { cmd: 'tmux attach -t <session>', desc: 'Connect to an active terminal multiplexer session.' },
          { cmd: 'Ctrl+B then %', desc: 'Split terminal screen vertically.' },
          { cmd: 'Ctrl+B then D', desc: 'Detach from current tmux session but keep terminal running in background.' }
        ]
      }
    ]
  },
  {
    id: 'node-npm',
    name: 'Node.js & npm',
    category: 'Utilities',
    color: '#339933',
    accentClass: 'node-accent',
    github: 'https://github.com/npm/cli',
    tagline: 'JavaScript runtime & package manager engine.',
    description: 'Node.js is an open-source cross-platform JavaScript runtime environment. npm is the default package manager for Node.js, and npx is its package execution helper.',
    install: {
      windows: 'winget install OpenJS.NodeJS',
      mac: 'brew install node',
      linux: 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs'
    },
    visualConcept: {
      title: 'Node.js Package Lifecycle',
      steps: [
        { name: 'npm init', desc: 'Creates package.json file to track your project specifications and packages.', status: 'modified' },
        { name: 'npm install', desc: 'Downloads modules into the node_modules folder and registers them in package.json.', status: 'staged' },
        { name: 'node app.js', desc: 'Starts the Node.js V8 execution loop to run your application.', status: 'committed' },
        { name: 'npx runner', desc: 'Downloads and executes single-use binary tools (like Vite) without local installation.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Node & npm Architect',
      description: 'Generate package setups, dependencies installers, test runners, and npx commands.',
      options: [
        {
          id: 'action',
          label: 'Operation',
          type: 'select',
          defaultValue: 'install',
          choices: [
            { value: 'init', label: 'Initialize package.json' },
            { value: 'install', label: 'Install Packages (Dependencies)' },
            { value: 'install-dev', label: 'Install Dev-Dependencies (-D)' },
            { value: 'run-script', label: 'Run NPM Script (npm run)' },
            { value: 'npx-exec', label: 'Execute with NPX' }
          ]
        },
        {
          id: 'pkgName',
          label: 'Package Name(s) / Libraries',
          type: 'text',
          defaultValue: 'lodash express cors',
          condition: (opts) => opts.action === 'install' || opts.action === 'install-dev'
        },
        {
          id: 'scriptName',
          label: 'Script name (defined in package.json)',
          type: 'text',
          defaultValue: 'dev',
          condition: (opts) => opts.action === 'run-script'
        },
        {
          id: 'npxCommand',
          label: 'NPX Script Runner',
          type: 'select',
          defaultValue: 'create-vite@latest',
          choices: [
            { value: 'create-vite@latest', label: 'create-vite (Scaffold Vite app)' },
            { value: 'create-next-app@latest', label: 'create-next-app (Scaffold Next.js)' },
            { value: 'prisma db push', label: 'Prisma (Database sync)' },
            { value: 'eslint --init', label: 'ESLint (Linter initialization)' }
          ],
          condition: (opts) => opts.action === 'npx-exec'
        }
      ],
      generator: (opts) => {
        switch (opts.action) {
          case 'init':
            return {
              command: 'npm init -y',
              explanation: [
                { part: 'npm init', desc: 'Runs the NPM interactive initializer wizard.' },
                { part: '-y', desc: 'Bypasses questionnaire prompts, filling in standard package defaults automatically.' }
              ]
            };
          case 'install':
            return {
              command: `npm install ${opts.pkgName || 'express'}`,
              explanation: [
                { part: 'npm install', desc: 'Instructs package manager to query registry and resolve dependencies.' },
                { part: opts.pkgName || 'express', desc: 'Names of libraries to download and append inside package.json dependencies.' }
              ]
            };
          case 'install-dev':
            return {
              command: `npm install -D ${opts.pkgName || 'nodemon'}`,
              explanation: [
                { part: 'npm install', desc: 'Downloads specified packages.' },
                { part: '-D', desc: 'DevDependencies flag. Saves package for dev environment checks only (ignored in production builds).' }
              ]
            };
          case 'run-script':
            return {
              command: `npm run ${opts.scriptName || 'dev'}`,
              explanation: [
                { part: 'npm run', desc: 'Tells npm to lookup and run custom terminal scripts mapped inside package.json.' },
                { part: opts.scriptName || 'dev', desc: 'The script label to start (e.g. dev, test, build, start).' }
              ]
            };
          case 'npx-exec':
            return {
              command: `npx ${opts.npxCommand || 'create-vite@latest'}`,
              explanation: [
                { part: 'npx', desc: 'NPM package execution utility. Runs binary packages from registry without global installations.' },
                { part: opts.npxCommand || 'create-vite@latest', desc: 'The package name and run options.' }
              ]
            };
          default:
            return { command: 'node -v', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case 'init':
            return `Wrote to C:\\projects\\tools\\package.json:\n{\n  "name": "tools",\n  "version": "1.0.0",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  },\n  "dependencies": {}\n}`;
          case 'install':
            return `added 14 packages, and audited 15 packages in 2s\nfound 0 vulnerabilities\n\x1b[32m[Installed libraries successfully]\x1b[0m`;
          case 'install-dev':
            return `added 8 packages, and audited 9 packages in 1s\nfound 0 vulnerabilities\n\x1b[32m[Installed devDependencies successfully]\x1b[0m`;
          case 'run-script':
            if (opts.scriptName === 'dev') {
              return `> tools@1.0.0 dev\n> vite\n\n  VITE v5.0.0  ready in 200 ms\n  ➜  Local: \x1b[36mhttp://localhost:5173/\x1b[0m`;
            }
            return `> tools@1.0.0 ${opts.scriptName}\n\x1b[32m[Script Ran Successfully]\x1b[0m`;
          case 'npx-exec':
            return `Need to install the following packages:\n  ${opts.npxCommand}\nOk to proceed? (y)\n\x1b[36m✔ Scaffolding project completed.\x1b[0m`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Version Control & Clean',
        items: [
          { cmd: 'npm install --production', desc: 'Install production dependencies only (ignores devDependencies).' },
          { cmd: 'npm prune', desc: 'Remove unused packages from node_modules that are not declared in package.json.' },
          { cmd: 'npm update', desc: 'Update all installed packages to their latest safe version within semantic bounds.' }
        ]
      },
      {
        section: 'Global Packages',
        items: [
          { cmd: 'npm list -g --depth=0', desc: 'List all globally installed npm modules.' },
          { cmd: 'npm install -g <package>', desc: 'Install a library globally (e.g. pm2, vercel, wrangler).' }
        ]
      }
    ]
  },
  {
    id: 'vercel',
    name: 'Vercel CLI',
    category: 'Utilities',
    color: '#ffffff',
    accentClass: 'vercel-accent',
    github: 'https://github.com/vercel/vercel',
    tagline: 'Instant cloud deployments and serverless management from your shell.',
    description: 'Vercel CLI provides a command line interface to deploy projects, configure DNS, configure serverless functions, and manage environment variables directly on Vercel\'s edge network.',
    install: {
      windows: 'npm install -g vercel',
      mac: 'npm install -g vercel',
      linux: 'npm install -g vercel'
    },
    visualConcept: {
      title: 'Vercel Deployment Flow',
      steps: [
        { name: 'Local Code', desc: 'Your project repository ready for deployment (e.g. Next.js, Vite, static HTML).', status: 'modified' },
        { name: 'Vercel Link', desc: 'Initialize and link local directory to a Vercel project configuration.', status: 'staged' },
        { name: 'Preview Build', desc: 'Deploy a preview build snapshot on a temporary subdomain.', status: 'committed' },
        { name: 'Production Push', desc: 'Alias, promote, and point your live production domain to the latest deploy.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Vercel Command Architect',
      description: 'Configure environment linking, deploy builds, inject environment secrets, or rollback active deployments.',
      options: [
        {
          id: 'action',
          label: 'Deployment Action',
          type: 'select',
          defaultValue: 'deploy-preview',
          choices: [
            { value: 'login', label: 'Login to Account' },
            { value: 'link', label: 'Link Project to Vercel' },
            { value: 'deploy-preview', label: 'Deploy Preview Build' },
            { value: 'deploy-prod', label: 'Deploy to Production (--prod)' },
            { value: 'env-add', label: 'Inject Environment Variable' },
            { value: 'rollback', label: 'Rollback to Previous Deployment' }
          ]
        },
        {
          id: 'projectName',
          label: 'Project Name/ID',
          type: 'text',
          defaultValue: 'my-web-app',
          condition: (opts) => opts.action === 'link'
        },
        {
          id: 'envKey',
          label: 'Env Variable Name (Key)',
          type: 'text',
          defaultValue: 'DATABASE_URL',
          condition: (opts) => opts.action === 'env-add'
        },
        {
          id: 'envVal',
          label: 'Env Variable Value',
          type: 'text',
          defaultValue: 'postgresql://usr:pwd@host/db',
          condition: (opts) => opts.action === 'env-add'
        },
        {
          id: 'envTarget',
          label: 'Environment target',
          type: 'select',
          defaultValue: 'development',
          choices: [
            { value: 'development', label: 'Development' },
            { value: 'preview', label: 'Preview' },
            { value: 'production', label: 'Production' }
          ],
          condition: (opts) => opts.action === 'env-add'
        },
        {
          id: 'deployId',
          label: 'Target Deployment ID/URL',
          type: 'text',
          defaultValue: 'dpl_8hG3x9n1aBcdeFgh',
          condition: (opts) => opts.action === 'rollback'
        }
      ],
      generator: (opts) => {
        const projectName = opts.projectName || 'my-web-app';
        const envKey = opts.envKey || 'DATABASE_URL';
        const envVal = opts.envVal || 'postgresql://usr:pwd@host/db';
        const envTarget = opts.envTarget || 'development';
        const deployId = opts.deployId || 'dpl_8hG3x9n1aBcdeFgh';
        
        switch (opts.action) {
          case 'login':
            return {
              command: 'vercel login',
              explanation: [
                { part: 'vercel login', desc: 'Authenticates your local terminal with your Vercel account via Email, GitHub, GitLab, or Bitbucket auth redirect.' }
              ]
            };
          case 'link':
            return {
              command: `vercel link --yes --project ${projectName}`,
              explanation: [
                { part: 'vercel link', desc: 'Sets up and links the current folder to a Vercel project.' },
                { part: '--yes', desc: 'Skips interactive setup prompts, auto-accepting default options.' },
                { part: `--project ${projectName}`, desc: 'Specifies the destination project name in your account.' }
              ]
            };
          case 'deploy-preview':
            return {
              command: 'vercel',
              explanation: [
                { part: 'vercel', desc: 'Triggers a preview deployment of the linked local folder. Files are uploaded and a preview subdomain url is generated.' }
              ]
            };
          case 'deploy-prod':
            return {
              command: 'vercel --prod',
              explanation: [
                { part: 'vercel', desc: 'Triggers a deployment build of the project.' },
                { part: '--prod', desc: 'Promotes this build to active production, binding it directly to your primary domains.' }
              ]
            };
          case 'env-add':
            return {
              command: `vercel env add ${envKey} ${envVal} ${envTarget}`,
              explanation: [
                { part: 'vercel env add', desc: 'Utility to append environment variables to your cloud project.' },
                { part: envKey, desc: 'The secret parameter key name.' },
                { part: envVal, desc: 'The secret value of the key (supports encryption).' },
                { part: envTarget, desc: 'Limits this variable to the selected target environment (development, preview, or production).' }
              ]
            };
          case 'rollback':
            return {
              command: `vercel rollback ${deployId}`,
              explanation: [
                { part: 'vercel rollback', desc: 'Rolls back your production domain instantly to a previous deployment version.' },
                { part: deployId, desc: 'The unique deployment hash ID or deployment URL target.' }
              ]
            };
          default:
            return { command: 'vercel', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const envKey = opts.envKey || 'DATABASE_URL';
        const envTarget = opts.envTarget || 'development';
        const deployId = opts.deployId || 'dpl_8hG3x9n1aBcdeFgh';
        
        switch (opts.action) {
          case 'login':
            return `Vercel CLI 34.0.0\n\x1b[36m> Success! Secure verification link sent. Check email.\x1b[0m\nLogged in to username (personal Scope)`;
          case 'link':
            return `? Set up and deploy "./my-web-app"? [y/N] y\n? Which scope? username\n? Link to existing project? [y/N] n\n\x1b[32mLinked to username/my-web-app (project settings downloaded)\x1b[0m`;
          case 'deploy-preview':
            return `Vercel CLI 34.0.0\nDeploying C:\\projects\\tools\\my-web-app under username\n\x1b[36mhttps://my-web-app-username.vercel.app [Preview]\x1b[0m\n\x1b[32m[Deployment Completed Successfully]\x1b[0m`;
          case 'deploy-prod':
            return `Vercel CLI 34.0.0\nDeploying C:\\projects\\tools\\my-web-app under username\n\x1b[36mhttps://my-web-app.vercel.app [Production]\x1b[0m\n\x1b[32m[Production Deployment Active]\x1b[0m`;
          case 'env-add':
            return `\x1b[32m+ env ${envKey} (${envTarget}) added\x1b[0m\nRun vercel pull to sync environment keys locally.`;
          case 'rollback':
            return `Rolling back to deployment ${deployId}...\n\x1b[32mSuccess! Production domain now points to deployment ${deployId}\x1b[0m`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Local Synced dev',
        items: [
          { cmd: 'vercel dev', desc: 'Run Vercel replication dev server locally on port 3000, parsing serverless routing.' },
          { cmd: 'vercel pull --environment=development', desc: 'Download and sync project settings & environment secret variables into .env.local file.' }
        ]
      },
      {
        section: 'Inspections & Management',
        items: [
          { cmd: 'vercel list', desc: 'List recent deployments of the linked project, along with status tags.' },
          { cmd: 'vercel inspect <url>', desc: 'Retrieve runtime configuration parameters and logs of a deployed URL.' },
          { cmd: 'vercel domains list', desc: 'Display all custom domain aliases configured on your Vercel project.' }
        ]
      }
    ]
  },

  {
    id: 'gemini',
    name: 'Gemini CLI',
    category: 'AI',
    color: '#38bdf8',
    accentClass: 'gemini-accent',
    github: 'https://github.com/google/generative-ai',
    tagline: "Google's Gemini LLM wrapper for prompt engineering and file queries directly in the terminal.",
    description: "Google Gemini CLI lets you prompt, analyze files, customize temperatures, and stream responses directly from your command line. Leverage Gemini Flash and Pro models natively.",
    install: {
      windows: 'npm install -g @google/gemini-cli',
      mac: 'npm install -g @google/gemini-cli',
      linux: 'npm install -g @google/gemini-cli'
    },
    visualConcept: {
      title: 'Generative AI Request Flow',
      steps: [
        { name: 'User Prompt', desc: 'User feeds prompt text and/or file parameters in terminal.', status: 'modified' },
        { name: 'System Role', desc: 'Custom agent instruction sets behavior constraint.', status: 'staged' },
        { name: 'API Gateway', desc: 'Resolves model selection and fetches from Google Gemini API.', status: 'committed' },
        { name: 'Markdown Render', desc: 'Streams and prints formatted markdown response directly to terminal.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'Gemini Command Builder',
      description: 'Configure and test commands for text prompts, custom models, system instructions, and multimodal file analysis.',
      options: [
        {
          id: 'action',
          label: 'Select Action',
          type: 'select',
          defaultValue: 'prompt',
          choices: [
            { value: 'prompt', label: 'Prompt with Custom Options' },
            { value: 'multimodal', label: 'Multimodal File Query' },
            { value: 'config', label: 'Setup & API Authentication' }
          ]
        },
        {
          id: 'promptText',
          label: 'Prompt Query',
          type: 'text',
          defaultValue: 'Explain quantum computing in simple terms.',
          condition: (opts) => opts.action !== 'config'
        },
        {
          id: 'modelName',
          label: 'Gemini Model',
          type: 'select',
          defaultValue: 'gemini-2.5-flash',
          choices: [
            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Fast & Multimodal)' },
            { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Deep Reasoning & Coding)' },
            { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Legacy lightweight)' }
          ],
          condition: (opts) => opts.action !== 'config'
        },
        {
          id: 'systemInstruction',
          label: 'System Instruction',
          type: 'text',
          defaultValue: 'You are a helpful coding assistant.',
          condition: (opts) => opts.action === 'prompt'
        },
        {
          id: 'temperature',
          label: 'Temperature (Creativity)',
          type: 'select',
          defaultValue: '0.7',
          choices: [
            { value: '0.2', label: '0.2 (Focused & Deterministic)' },
            { value: '0.7', label: '0.7 (Balanced & Creative)' },
            { value: '1.0', label: '1.0 (Highly Creative)' }
          ],
          condition: (opts) => opts.action === 'prompt'
        },
        {
          id: 'filePath',
          label: 'Input File Path',
          type: 'text',
          defaultValue: 'data.csv',
          condition: (opts) => opts.action === 'multimodal'
        }
      ],
      generator: (opts) => {
        switch (opts.action) {
          case 'prompt':
            return {
              command: `gemini --model ${opts.modelName || 'gemini-2.5-flash'} --system "${opts.systemInstruction || 'You are a helpful coding assistant.'}" --temp ${opts.temperature || '0.7'} "${opts.promptText || 'Explain quantum computing in simple terms.'}"`,
              explanation: [
                { part: 'gemini', desc: 'Invokes the Google Gemini CLI.' },
                { part: `--model ${opts.modelName || 'gemini-2.5-flash'}`, desc: 'Specifies which version of Gemini to route the prompt to.' },
                { part: `--system "${opts.systemInstruction || 'You are a helpful coding assistant.'}"`, desc: 'Defines the behavioral persona or instructions for the LLM.' },
                { part: `--temp ${opts.temperature || '0.7'}`, desc: 'Controls randomness. Lower values are analytical; higher values are creative.' },
                { part: `"${opts.promptText || 'Explain quantum computing in simple terms.'}"`, desc: 'The prompt query or question sent to the model.' }
              ]
            };
          case 'multimodal':
            return {
              command: `gemini --model ${opts.modelName || 'gemini-2.5-flash'} --file ${opts.filePath || 'data.csv'} "${opts.promptText || 'Explain quantum computing in simple terms.'}"`,
              explanation: [
                { part: 'gemini', desc: 'Invokes the Google Gemini CLI.' },
                { part: `--model ${opts.modelName || 'gemini-2.5-flash'}`, desc: 'Specifies the target model (typically Gemini 2.5 Flash).' },
                { part: `--file ${opts.filePath || 'data.csv'}`, desc: 'Paths of files (images, audio, csv) to attach to the query context.' },
                { part: `"${opts.promptText || 'Explain quantum computing in simple terms.'}"`, desc: 'The instructions or questions based on the attached file context.' }
              ]
            };
          case 'config':
            return {
              command: 'gemini configure',
              explanation: [
                { part: 'gemini configure', desc: 'Launches the interactive setup prompt to securely store your Google Gemini API Key locally.' }
              ]
            };
          default:
            return { command: 'gemini', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        switch (opts.action) {
          case 'prompt':
            return `gemini --model ${opts.modelName || 'gemini-2.5-flash'} --temp ${opts.temperature || '0.7'}...\n\x1b[35m[Gemini AI Response]\x1b[0m\nQuantum computing uses qubits instead of classical bits. While classical bits can represent 0 or 1, qubits can exist in a superposition of both states simultaneously, allowing complex computations to be solved exponentially faster.\n\n\x1b[32m[Tokens: 124 input, 68 output]\x1b[0m`;
          case 'multimodal':
            return `gemini --model ${opts.modelName || 'gemini-2.5-flash'} --file ${opts.filePath || 'data.csv'}...\n\x1b[35m[Gemini Multimodal Parser]\x1b[0m\nReading file ${opts.filePath || 'data.csv'}...\nAnalysis: The uploaded dataset contains 150 rows. Key trend reveals a 12% increase in developer activity during weekends. Recommended action: optimize server capacity on Saturdays.\n\n\x1b[32m[Finished Processing]\x1b[0m`;
          case 'config':
            return `? Enter your Google Gemini API Key: ****************************************\n\x1b[32m✔ Configuration saved to ~/.geminirc\x1b[0m`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Basic Queries',
        items: [
          { cmd: 'gemini "write a python quicksort"', desc: 'Quick prompt run and output response.' },
          { cmd: 'gemini --stream "explain recursion"', desc: 'Stream Gemini response token by token in real-time.' }
        ]
      },
      {
        section: 'Model & Config',
        items: [
          { cmd: 'gemini --list-models', desc: 'List all available Gemini models and metadata.' },
          { cmd: 'gemini configure', desc: 'Interactive setup for API keys.' }
        ]
      },
      {
        section: 'Multimodal Inputs',
        items: [
          { cmd: 'gemini --file logs.txt "find the error"', desc: 'Attach a text file to your Gemini prompt.' },
          { cmd: 'gemini --image chart.png "summarize chart"', desc: 'Attach an image file to analyze structure/content.' }
        ]
      }
    ]
  },

  {
    id: 'adb',
    name: 'Android Debug Bridge (ADB)',
    category: 'Utilities',
    color: '#3ddc84',
    accentClass: 'adb-accent',
    github: 'https://github.com/aosp-mirror/platform_system_core',
    tagline: 'Versatile command-line tool to communicate with Android devices.',
    description: 'Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. The adb command facilitates a variety of device actions, such as installing and debugging apps, running shells, transferring files, and viewing system logs.',
    install: {
      windows: 'winget install -e --id Google.Adk.PlatformTools',
      mac: 'brew install android-platform-tools',
      linux: 'sudo apt install android-tools-adb'
    },
    visualConcept: {
      title: 'ADB Architecture',
      steps: [
        { name: 'ADB Client', desc: 'Command line terminal on your PC sending user instructions.', status: 'modified' },
        { name: 'ADB Server', desc: 'Background process on your PC coordinating client-device requests.', status: 'staged' },
        { name: 'ADB Daemon (adbd)', desc: 'Background process running on the connected Android device/emulator.', status: 'committed' },
        { name: 'Device Shell', desc: 'Secure Unix shell inside the Android OS executing system level commands.', status: 'remote' }
      ]
    },
    interactiveBuilder: {
      title: 'ADB Command Architect',
      description: 'Configure parameters to generate ADB commands for device tracking, file management, app execution, and logcat monitoring.',
      options: [
        {
          id: 'action',
          label: 'Action Type',
          type: 'select',
          defaultValue: 'devices',
          choices: [
            { value: 'devices', label: 'List Connected Devices' },
            { value: 'install', label: 'Install App (APK)' },
            { value: 'uninstall', label: 'Uninstall App (Package)' },
            { value: 'push', label: 'Push File to Device' },
            { value: 'pull', label: 'Pull File from Device' },
            { value: 'shell', label: 'Run Shell Command' },
            { value: 'logcat', label: 'View Device Logs (Logcat)' },
            { value: 'reboot', label: 'Reboot Device' }
          ]
        },
        {
          id: 'targetDevice',
          label: 'Target Device Serial (-s) (optional)',
          type: 'text',
          defaultValue: ''
        },
        {
          id: 'apkPath',
          label: 'APK File Path',
          type: 'text',
          defaultValue: 'app-debug.apk',
          condition: (opts) => opts.action === 'install'
        },
        {
          id: 'packageId',
          label: 'App Package ID',
          type: 'text',
          defaultValue: 'com.example.myapp',
          condition: (opts) => opts.action === 'uninstall'
        },
        {
          id: 'localPath',
          label: 'Local File Path',
          type: 'text',
          defaultValue: 'photo.jpg',
          condition: (opts) => opts.action === 'push' || opts.action === 'pull'
        },
        {
          id: 'remotePath',
          label: 'Remote File Path (on device)',
          type: 'text',
          defaultValue: '/sdcard/Pictures/',
          condition: (opts) => opts.action === 'push' || opts.action === 'pull'
        },
        {
          id: 'shellCmd',
          label: 'Shell Command',
          type: 'text',
          defaultValue: 'pm list packages',
          condition: (opts) => opts.action === 'shell'
        },
        {
          id: 'logFilter',
          label: 'Logcat Filter (Tag:Priority)',
          type: 'text',
          defaultValue: 'ActivityManager:I *:S',
          condition: (opts) => opts.action === 'logcat'
        },
        {
          id: 'rebootMode',
          label: 'Reboot Mode',
          type: 'select',
          defaultValue: 'normal',
          choices: [
            { value: 'normal', label: 'Normal Reboot' },
            { value: 'recovery', label: 'Recovery Mode' },
            { value: 'bootloader', label: 'Bootloader (Fastboot)' }
          ],
          condition: (opts) => opts.action === 'reboot'
        }
      ],
      generator: (opts) => {
        const deviceFlag = opts.targetDevice ? `-s ${opts.targetDevice} ` : '';
        switch (opts.action) {
          case 'devices':
            return {
              command: `adb devices`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                { part: 'devices', desc: 'Queries the ADB server and lists all currently connected emulator or physical Android devices.' }
              ]
            };
          case 'install':
            return {
              command: `adb ${deviceFlag}install ${opts.apkPath || 'app-debug.apk'}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific connected device with this serial number.' }] : []),
                { part: 'install', desc: 'Pushes the target application APK package to the device and performs installation.' },
                { part: opts.apkPath || 'app-debug.apk', desc: 'Local path of the installation APK package file.' }
              ]
            };
          case 'uninstall':
            return {
              command: `adb ${deviceFlag}uninstall ${opts.packageId || 'com.example.myapp'}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: 'uninstall', desc: 'Instructs the device package manager to uninstall the given app package.' },
                { part: opts.packageId || 'com.example.myapp', desc: 'The unique bundle identifier or package name of the app to delete.' }
              ]
            };
          case 'push':
            return {
              command: `adb ${deviceFlag}push ${opts.localPath || 'photo.jpg'} ${opts.remotePath || '/sdcard/Pictures/'}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: 'push', desc: 'Copies specified file or folder from host machine to device storage.' },
                { part: opts.localPath || 'photo.jpg', desc: 'The source file or folder path on the local PC.' },
                { part: opts.remotePath || '/sdcard/Pictures/', desc: 'The target destination path inside the connected Android device filesystem.' }
              ]
            };
          case 'pull':
            return {
              command: `adb ${deviceFlag}pull ${opts.remotePath || '/sdcard/Pictures/'} ${opts.localPath || 'photo.jpg'}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: 'pull', desc: 'Retrieves a file or directory from the device filesystem back to the host machine.' },
                { part: opts.remotePath || '/sdcard/Pictures/', desc: 'The source file/folder path on the device.' },
                { part: opts.localPath || 'photo.jpg', desc: 'The destination file/folder path on the host computer.' }
              ]
            };
          case 'shell':
            return {
              command: `adb ${deviceFlag}shell "${opts.shellCmd || 'pm list packages'}"`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: 'shell', desc: 'Executes a Unix shell command payload directly on the connected device\'s operating system.' },
                { part: `"${opts.shellCmd || 'pm list packages'}"`, desc: 'The shell command string parameter sent to the device for execution.' }
              ]
            };
          case 'logcat':
            return {
              command: `adb ${deviceFlag}logcat ${opts.logFilter || 'ActivityManager:I *:S'}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: 'logcat', desc: 'Streams real-time device logs. Allows filtering by process, tag, or log severity.' },
                { part: opts.logFilter || 'ActivityManager:I *:S', desc: 'Log filter parameters to isolate specific debug logs and suppress others.' }
              ]
            };
          case 'reboot': {
            const rebootType = opts.rebootMode === 'normal' ? '' : ` ${opts.rebootMode}`;
            return {
              command: `adb ${deviceFlag}reboot${rebootType}`,
              explanation: [
                { part: 'adb', desc: 'Invokes the Android Debug Bridge command line tool.' },
                ...(opts.targetDevice ? [{ part: `-s ${opts.targetDevice}`, desc: 'Directs the command to the specific device.' }] : []),
                { part: `reboot${rebootType}`, desc: `Triggers a hardware power cycle. ${opts.rebootMode === 'normal' ? 'Restarts device back to normal Android OS.' : opts.rebootMode === 'recovery' ? 'Reboots device into Recovery UI.' : 'Reboots device into Bootloader (Fastboot) mode.'}` }
              ]
            };
          }
          default:
            return { command: 'adb --help', explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const serial = opts.targetDevice || 'emulator-5554';
        switch (opts.action) {
          case 'devices':
            return `List of devices attached\n${serial}\tdevice\n192.168.1.102:5555\tdevice`;
          case 'install':
            return `Performing Streamed Install\nSuccess`;
          case 'uninstall':
            return `Success`;
          case 'push':
            return `${opts.localPath || 'photo.jpg'}: 1 file pushed, 0 skipped. 18.5 MB/s (102456 bytes in 0.005s)`;
          case 'pull':
            return `${opts.remotePath || '/sdcard/Pictures/'}: 1 file pulled, 0 skipped. 15.2 MB/s (102456 bytes in 0.006s)`;
          case 'shell':
            if (opts.shellCmd === 'pm list packages') {
              return `package:android\npackage:com.android.providers.telephony\npackage:com.android.providers.contacts\npackage:com.google.android.youtube\npackage:${opts.packageId || 'com.example.myapp'}`;
            }
            return `\x1b[32m[Executing shell: ${opts.shellCmd}]\x1b[0m\nuid=2000(shell) gid=2000(shell) groups=2000(shell),1004(input),3003(inet)\n`;
          case 'logcat':
            return `\x1b[36m--------- beginning of main\x1b[0m\n06-17 09:55:01.214  1420  1450 I ActivityManager: Start proc 12455:com.android.chrome/u0a115 for service\n06-17 09:55:01.442  1420  1460 I ActivityManager: Displayed com.android.chrome/org.chromium.chrome.browser.ChromeTabbedActivity: +210ms\n\x1b[33m[Streaming logcat... Press Ctrl+C to terminate]\x1b[0m`;
          case 'reboot':
            return `\x1b[31mRebooting device ${serial} (${opts.rebootMode || 'normal'}) ...\x1b[0m\nDevice connection terminated.`;
          default:
            return '';
        }
      }
    },
    cheatsheets: [
      {
        section: 'Connection & Discovery',
        items: [
          { cmd: 'adb devices -l', desc: 'List connected devices with model and USB interface info.' },
          { cmd: 'adb connect 192.168.1.100:5555', desc: 'Connect to an Android device over Wi-Fi network.' },
          { cmd: 'adb disconnect', desc: 'Disconnect from all TCP/IP connected Android devices.' }
        ]
      },
      {
        section: 'File & App Management',
        items: [
          { cmd: 'adb install -r app.apk', desc: 'Reinstall / upgrade an existing application, keeping its user data.' },
          { cmd: 'adb shell pm list packages -3', desc: 'List all third-party app packages installed on the device.' },
          { cmd: 'adb shell pm clear com.example.app', desc: 'Clear all runtime cache and data for the target package.' }
        ]
      },
      {
        section: 'Debugging & Logs',
        items: [
          { cmd: 'adb logcat -c', desc: 'Clear/flush the active device logcat buffer.' },
          { cmd: 'adb shell screencap -p /sdcard/screenshot.png', desc: 'Take a screenshot and save it to SDCard storage.' },
          { cmd: 'adb shell dumpsys battery', desc: 'Display device battery level, charge status, and health metrics.' }
        ]
      }
    ]
  },

];

export const quizQuestions = [
  {
    id: 1,
    question: "Which Git command is used to record changes temporarily on a stack, reverting back to the HEAD commit, without committing them?",
    options: ["git reset --soft", "git stash", "git revert", "git checkout"],
    answer: "git stash",
    explanation: "git stash saves your current local modifications and reverts the working directory to match the HEAD commit, allowing you to work on something else and restore them later."
  },
  {
    id: 2,
    question: "In FFmpeg, what does the flag '-vn' do?",
    options: ["Encodes video using Nvidia hardware", "Stands for 'Video Normalization'", "Disables video recording/extraction", "Outputs video metadata details"],
    answer: "Disables video recording/extraction",
    explanation: "-vn disables video recording. When extracting audio from a media container, -vn ensures only the audio stream is written to the output file."
  },
  {
    id: 3,
    question: "How do you download ONLY the audio track of a YouTube video as an MP3 file using yt-dlp?",
    options: ["yt-dlp --audio <url>", "yt-dlp -x --audio-format mp3 <url>", "yt-dlp --mp3-only <url>", "yt-dlp -f mp3 <url>"],
    answer: "yt-dlp -x --audio-format mp3 <url>",
    explanation: "-x tells yt-dlp to extract audio, and --audio-format mp3 sets the output extension format to mp3."
  },
  {
    id: 4,
    question: "What is the command to create an isolated Python virtual environment named 'venv'?",
    options: ["pip install venv venv", "python -m venv venv", "python new venv", "venv init venv"],
    answer: "python -m venv venv",
    explanation: "python -m venv executes the built-in python module 'venv' to create a directory containing isolated interpreter libraries."
  },
  {
    id: 5,
    question: "Which jq filter extracts the name field from the first index of an array of users?",
    options: ["jq '.users[1].name'", "jq '.users[0].name'", "jq 'users.first.name'", "jq '.users(0)->name'"],
    answer: "jq '.users[0].name'",
    explanation: "In JSON, arrays are 0-indexed. Therefore, .users[0].name fetches the 'name' field of the first object in the 'users' list."
  }
];
