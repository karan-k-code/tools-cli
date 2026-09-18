export const ytdlp = {
    id: "yt-dlp",
    name: "yt-dlp",
    category: "Media",
    color: "#FF0000",
    accentClass: "ytdlp-accent",
    github: "https://github.com/yt-dlp/yt-dlp",
    tagline: "High-speed media and audio downloader for the web.",
    description:
      "yt-dlp is a command-line YouTube downloader fork of youtube-dl, adding active feature development, speed improvements, and rich customization features for downloading streams from thousands of websites.",
    install: {
      windows: "winget install yt-dlp.yt-dlp",
      mac: "brew install yt-dlp",
      linux:
        "sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp",
    },
    visualConcept: {
      title: "yt-dlp Operation Lifecycle",
      steps: [
        {
          name: "Extract Metadata",
          desc: "Queries remote URL to resolve streams, captions, subtitles, and playlists.",
          status: "modified",
        },
        {
          name: "Format Selector",
          desc: "Matches requested format flags (e.g. best video + best audio).",
          status: "staged",
        },
        {
          name: "HTTP Download",
          desc: "Downloads video/audio fragments in parallel streams.",
          status: "committed",
        },
        {
          name: "Post-Processor",
          desc: "Merges streams using FFmpeg, embeds thumbnails, and writes tags.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "yt-dlp Commander",
      description:
        "Generate high-performance commands to download videos, split playlists, or extract high-fidelity audio.",
      options: [
        {
          id: "action",
          label: "Download Goal",
          type: "select",
          defaultValue: "best-quality",
          choices: [
            { value: "best-quality", label: "Best Quality (Merged)" },
            { value: "mp3", label: "Extract Audio (MP3)" },
            {
              value: "download-section",
              label: "Download Specific Section (Trim)",
            },
            { value: "embed-subs", label: "Download Video + Embed Subtitles" },
            { value: "playlist", label: "Download Entire Playlist" },
            {
              value: "specific-res",
              label: "Specific Resolution (e.g. 1080p)",
            },
            { value: "list-formats", label: "List Available Formats only" },
          ],
        },
        {
          id: "url",
          label: "Video/Playlist URL",
          type: "text",
          defaultValue: "https://www.youtube.com/watch?v=HcjW2k1IrTM",
        },
        {
          id: "audioQuality",
          label: "Audio Bitrate (kbps)",
          type: "select",
          defaultValue: "320",
          choices: [
            { value: "320", label: "320 kbps (High)" },
            { value: "192", label: "192 kbps (Medium)" },
            { value: "128", label: "128 kbps (Low)" },
          ],
          condition: (opts) => opts.action === "mp3",
        },
        {
          id: "resVal",
          label: "Max Height Resolution",
          type: "select",
          defaultValue: "1080",
          choices: [
            { value: "4320", label: "8K Ultra HD (4320p)" },
            { value: "2160", label: "4K Ultra HD (2160p)" },
            { value: "1440", label: "2K Quad HD (1440p)" },
            { value: "1080", label: "Full HD (1080p)" },
            { value: "720", label: "HD (720p)" },
            { value: "480", label: "SD (480p)" },
          ],
          condition: (opts) => opts.action === "specific-res",
        },
        {
          id: "sectionStart",
          label: "Section Start Timestamp (e.g. 00:01:00 or 60)",
          type: "text",
          defaultValue: "00:01:00",
          condition: (opts) => opts.action === "download-section",
        },
        {
          id: "sectionEnd",
          label: "Section End Timestamp (e.g. 00:02:30 or 150)",
          type: "text",
          defaultValue: "00:02:30",
          condition: (opts) => opts.action === "download-section",
        },
        {
          id: "subLang",
          label: "Subtitle Language",
          type: "select",
          defaultValue: "en",
          choices: [
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "all", label: "All Available Languages" },
          ],
          condition: (opts) => opts.action === "embed-subs",
        },
      ],
      generator: (opts) => {
        const url = opts.url || "https://www.youtube.com/watch?v=HcjW2k1IrTM";
        switch (opts.action) {
          case "best-quality":
            return {
              command: `yt-dlp -f "bv*+ba/b" ${url}`,
              explanation: [
                { part: "yt-dlp", desc: "Runs the downloader utility." },
                {
                  part: '-f "bv*+ba/b"',
                  desc: "Format flag: Downloads best quality video stream (bv*) and best quality audio stream (ba) and merges them. If separate streams aren't available, falls back to best pre-merged format (b).",
                },
                { part: url, desc: "The target media url link." },
              ],
            };
          case "mp3":
            return {
              command: `yt-dlp -x --audio-format mp3 --audio-quality ${opts.audioQuality || "320"}k ${url}`,
              explanation: [
                {
                  part: "-x",
                  desc: "Extract audio: converts downloaded video files into audio-only files.",
                },
                {
                  part: "--audio-format mp3",
                  desc: "Converts the extracted audio stream into MP3 encoding.",
                },
                {
                  part: `--audio-quality ${opts.audioQuality || "320"}k`,
                  desc: "Specifies the MP3 quality output in kilobits per second.",
                },
              ],
            };
          case "download-section":
            return {
              command: `yt-dlp --download-sections "*${opts.sectionStart || "00:01:00"}-${opts.sectionEnd || "00:02:30"}" ${url}`,
              explanation: [
                { part: "yt-dlp", desc: "Runs the downloader utility." },
                {
                  part: `--download-sections "*${opts.sectionStart || "00:01:00"}-${opts.sectionEnd || "00:02:30"}"`,
                  desc: "Downloads only a specific segment/time-range of the video.",
                },
                { part: url, desc: "Target video URL." },
              ],
            };
          case "embed-subs":
            return {
              command: `yt-dlp --write-subs --sub-langs "${opts.subLang || "en"}" --embed-subs ${url}`,
              explanation: [
                { part: "yt-dlp", desc: "Runs the downloader utility." },
                {
                  part: "--write-subs",
                  desc: "Downloads the subtitle file during the processing phase.",
                },
                {
                  part: `--sub-langs "${opts.subLang || "en"}"`,
                  desc: "Specifies the targeted subtitle language code(s) to fetch.",
                },
                {
                  part: "--embed-subs",
                  desc: "Merges / embeds the subtitle track inside the video container (e.g., MKV/MP4).",
                },
              ],
            };
          case "playlist":
            return {
              command: `yt-dlp --yes-playlist --output "%(playlist_title)s/%(playlist_index)s - %(title)s.%(ext)s" ${url}`,
              explanation: [
                {
                  part: "--yes-playlist",
                  desc: "Allows downloading the entire playlist if the URL contains a playlist identifier.",
                },
                {
                  part: '--output "..."',
                  desc: "Formats the downloaded filenames dynamically: saves them into a folder named after the playlist title, prefixing the file with its track list index.",
                },
              ],
            };
          case "specific-res":
            return {
              command: `yt-dlp -f "bv*[height<=${opts.resVal || "1080"}]+ba/b[height<=${opts.resVal || "1080"}]" ${url}`,
              explanation: [
                {
                  part: `-f "bv*[height<=${opts.resVal}]+ba"`,
                  desc: `Downloads the best video stream that has a resolution height equal to or less than ${opts.resVal}p, plus the best audio, and blends them.`,
                },
              ],
            };
          case "list-formats":
            return {
              command: `yt-dlp -F ${url}`,
              explanation: [
                {
                  part: "-F",
                  desc: "Lists all available downloadable formats (video, audio, and multiplexed options) with their specific codec, size, and rate tags, without downloading anything.",
                },
              ],
            };
          default:
            return { command: `yt-dlp ${url}`, explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        if (opts.action === "list-formats") {
          return `[youtube] Extracting URL: ${opts.url || "..."}\n[youtube] HcjW2k1IrTM: Downloading webpage\n[info] Available formats for HcjW2k1IrTM:\nID  EXT   RESOLUTION FPS CH │   FILESIZE   TBR PROTO │ VCODEC           ACODEC\n137 mp4   1920x1080   30    │   45.21MiB  2154k https │ avc1.640028      none\n140 m4a   audio only   2    │    3.15MiB   129k https │ none             mp4a.40.2`;
        }
        if (opts.action === "download-section") {
          return `[youtube] Extracting URL: ${opts.url || "..."}\n[info] HcjW2k1IrTM: Downloading section *${opts.sectionStart || "00:01:00"}-${opts.sectionEnd || "00:02:30"}\n[download] Destination: Google Keynote IO 2024.mp4\n[download] 100% of 3.12MiB in 00:01\n\x1b[32m[Finished downloading trimmed segment successfully]\x1b[0m`;
        }
        if (opts.action === "embed-subs") {
          return `[youtube] Extracting URL: ${opts.url || "..."}\n[info] Writing subtitles to: Google Keynote IO 2024.${opts.subLang || "en"}.vtt\n[download] Destination: Google Keynote IO 2024.mp4\n[download] 100% of 15.40MiB in 00:03\n[Subtitles] Embedding subtitles in "Google Keynote IO 2024.mp4"\n\x1b[32m[Finished downloading video and embedding subtitles]\x1b[0m`;
        }
        return `[youtube] Extracting URL: ${opts.url || "..."}\n[youtube] HcjW2k1IrTM: Downloading webpage\n[info] HcjW2k1IrTM: Downloading 1 format(s)\n[download] Destination: Google Keynote IO 2024.mp4\n\x1b[36m[download]  45.0% of   15.40MiB at   5.20MiB/s ETA 00:01\x1b[0m\n[download] 100% of 15.40MiB in 00:03 at 4.80MiB/s\n[Merger] Merging formats into "Google Keynote IO 2024.mp4"\n\x1b[32m[Finished Downloading]\x1b[0m`;
      },
    },
    cheatsheets: [
      {
        title: "Performance Options",
      icon: "⚡",
        commands: [
          {
            cmd: "yt-dlp --limit-rate 50K <url>",
            desc: "Limit download bandwidth speed to 50KB/s.",
          },
          {
            cmd: "yt-dlp --concurrent-fragments 5 <url>",
            desc: "Download 5 video segments in parallel (speeds up slow server throttling).",
          },
        ],
      },
      {
        title: "Metadata & Subtitles",
      icon: "🏷️",
        commands: [
          {
            cmd: "yt-dlp --list-subs <url>",
            desc: "List all available subtitle languages for the video without downloading.",
          },
          {
            cmd: "yt-dlp --write-auto-subs --skip-download <url>",
            desc: "Fetch auto-generated captions and save them to disc, without downloading video.",
          },
          {
            cmd: "yt-dlp --embed-thumbnail --embed-metadata <url>",
            desc: "Merge video metadata and custom cover thumbnail directly into output file container.",
          },
          {
            cmd: "yt-dlp --write-thumbnail --skip-download <url>",
            desc: "Download the video preview thumbnail / cover image as a separate file.",
          },
        ],
      },
      {
        title: "Authentication & Inputs",
      icon: "🔑",
        commands: [
          {
            cmd: "yt-dlp --cookies-from-browser chrome <url>",
            desc: "Extract cookie session keys from Chrome to bypass captchas, age-gates, or login prompts.",
          },
          {
            cmd: "yt-dlp --batch-file urls.txt",
            desc: "Download multiple media files or playlists sequentially from a list of URLs in a text file.",
          },
        ],
      },
    ],
  };
