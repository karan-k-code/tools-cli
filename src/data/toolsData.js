// Auto-generated exports for tools
import { git } from "./tools/git.js";
import { ollama } from "./tools/ollama.js";
import { ffmpeg } from "./tools/ffmpeg.js";
import { ytdlp } from "./tools/ytdlp.js";
import { pythonpip } from "./tools/pythonpip.js";
import { utils } from "./tools/utils.js";
import { nodenpm } from "./tools/nodenpm.js";
import { vercel } from "./tools/vercel.js";
import { gemini } from "./tools/gemini.js";
import { adb } from "./tools/adb.js";
import { magick } from "./tools/magick.js";
import { fzf } from "./tools/fzf.js";
import { zoxide } from "./tools/zoxide.js";
import { ripgrep } from "./tools/ripgrep.js";
import { eza } from "./tools/eza.js";
import { bat } from "./tools/bat.js";
import { lazygit } from "./tools/lazygit.js";
import { starship } from "./tools/starship.js";
import { gh } from "./tools/gh.js";
import { nmap } from "./tools/nmap.js";
import { scrcpy } from "./tools/scrcpy.js";
// import { theHarvester } from "./tools/theHarvester.js";

export const toolsData = [
  git,
  gh,
  nmap,
  scrcpy,
  ollama,
  ffmpeg,
  ytdlp,
  pythonpip,
  utils,
  nodenpm,
  vercel,
  gemini,
  adb,
  magick,
  fzf,
  zoxide,
  ripgrep,
  eza,
  bat,
  lazygit,
  starship,
  // theHarvester,
];

export const quizQuestions = [
  {
    id: 1,
    question:
      "Which Git command is used to record changes temporarily on a stack, reverting back to the HEAD commit, without committing them?",
    options: ["git reset --soft", "git stash", "git revert", "git checkout"],
    answer: "git stash",
    explanation:
      "git stash saves your current local modifications and reverts the working directory to match the HEAD commit, allowing you to work on something else and restore them later.",
  },
  {
    id: 2,
    question: "In FFmpeg, what does the flag '-vn' do?",
    options: [
      "Encodes video using Nvidia hardware",
      "Stands for 'Video Normalization'",
      "Disables video recording/extraction",
      "Outputs video metadata details",
    ],
    answer: "Disables video recording/extraction",
    explanation:
      "-vn disables video recording. When extracting audio from a media container, -vn ensures only the audio stream is written to the output file.",
  },
  {
    id: 3,
    question:
      "How do you download ONLY the audio track of a YouTube video as an MP3 file using yt-dlp?",
    options: [
      "yt-dlp --audio <url>",
      "yt-dlp -x --audio-format mp3 <url>",
      "yt-dlp --mp3-only <url>",
      "yt-dlp -f mp3 <url>",
    ],
    answer: "yt-dlp -x --audio-format mp3 <url>",
    explanation:
      "-x tells yt-dlp to extract audio, and --audio-format mp3 sets the output extension format to mp3.",
  },
  {
    id: 4,
    question:
      "What is the command to create an isolated Python virtual environment named 'venv'?",
    options: [
      "pip install venv venv",
      "python -m venv venv",
      "python new venv",
      "venv init venv",
    ],
    answer: "python -m venv venv",
    explanation:
      "python -m venv executes the built-in python module 'venv' to create a directory containing isolated interpreter libraries.",
  },
  {
    id: 5,
    question:
      "Which jq filter extracts the name field from the first index of an array of users?",
    options: [
      "jq '.users[1].name'",
      "jq '.users[0].name'",
      "jq 'users.first.name'",
      "jq '.users(0)->name'",
    ],
    answer: "jq '.users[0].name'",
    explanation:
      "In JSON, arrays are 0-indexed. Therefore, .users[0].name fetches the 'name' field of the first object in the 'users' list.",
  },
  {
    id: 6,
    question:
      "In ImageMagick (v7+), which command is the standard entrypoint to process images?",
    options: ["convert", "magick", "imagemagick", "mogrify"],
    answer: "magick",
    explanation:
      "In ImageMagick version 7 and above, the unified entrypoint command is 'magick' which replaces the legacy 'convert' utility.",
  },
];
