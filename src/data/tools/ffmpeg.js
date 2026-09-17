export const ffmpeg = {
    id: "ffmpeg",
    name: "FFmpeg",
    category: "Media",
    color: "#00cc66",
    accentClass: "ffmpeg-accent",
    github: "https://github.com/FFmpeg/FFmpeg",
    tagline: "Swiss Army knife for multimedia transcoding and processing.",
    description:
      "FFmpeg is a leading multimedia framework capable of decoding, encoding, transcoding, muxing, demuxing, streaming, filtering and playing almost anything humans and machines have created.",
    install: {
      windows: "winget install Gyan.FFmpeg",
      mac: "brew install ffmpeg",
      linux: "sudo apt install ffmpeg",
    },
    visualConcept: {
      title: "FFmpeg Transcoding Pipeline",
      steps: [
        {
          name: "Demuxer",
          desc: "Splits media container (e.g. mp4) into packets of audio/video streams.",
          status: "modified",
        },
        {
          name: "Decoder",
          desc: "Uncompresses packets into raw, uncompressed frames in memory.",
          status: "staged",
        },
        {
          name: "Filters",
          desc: "Applies filters (scaling, cropping, volume, watermark overlay).",
          status: "committed",
        },
        {
          name: "Encoder / Muxer",
          desc: "Re-compresses frames with target codec and packages into final file.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "FFmpeg Command Configurator",
      description:
        "Easily construct command chains to transcode, resize, crop, slice, and extract audio from files.",
      options: [
        {
          id: "action",
          label: "Operation",
          type: "select",
          defaultValue: "compress",
          choices: [
            { value: "compress", label: "Compress Video" },
            { value: "extract-audio", label: "Extract Audio (MP3)" },
            { value: "cut", label: "Cut / Slice Video" },
            { value: "resize", label: "Resize / Scale Video" },
            { value: "convert", label: "Convert Format" },
          ],
        },
        {
          id: "input",
          label: "Input File Name",
          type: "text",
          defaultValue: "input.mp4",
        },
        {
          id: "output",
          label: "Output File Name",
          type: "text",
          defaultValue: "output.mp4",
          condition: (opts) => opts.action !== "extract-audio",
        },
        {
          id: "crf",
          label: "Compression Factor (CRF - Higher = Lower quality/file size)",
          type: "select",
          defaultValue: "24",
          choices: [
            { value: "18", label: "18 (Near-lossless, large)" },
            { value: "23", label: "23 (Standard default)" },
            { value: "28", label: "28 (Highly compressed, small)" },
            { value: "32", label: "32 (Very low quality)" },
          ],
          condition: (opts) => opts.action === "compress",
        },
        {
          id: "startTime",
          label: "Start Timestamp (hh:mm:ss)",
          type: "text",
          defaultValue: "00:00:10",
          condition: (opts) => opts.action === "cut",
        },
        {
          id: "duration",
          label: "Duration (seconds)",
          type: "text",
          defaultValue: "30",
          condition: (opts) => opts.action === "cut",
        },
        {
          id: "resolution",
          label: "Target Resolution",
          type: "select",
          defaultValue: "1280:720",
          choices: [
            { value: "1920:1080", label: "1080p Full HD (1920x1080)" },
            { value: "1280:720", label: "720p HD (1280x720)" },
            { value: "854:480", label: "480p SD (854x480)" },
            { value: "640:360", label: "360p Low-res (640x360)" },
          ],
          condition: (opts) => opts.action === "resize",
        },
        {
          id: "format",
          label: "Output Format",
          type: "select",
          defaultValue: "mkv",
          choices: [
            { value: "mkv", label: "MKV (Matroska)" },
            { value: "avi", label: "AVI (Legacy)" },
            { value: "gif", label: "Animated GIF" },
            { value: "webm", label: "WebM (Web optimized)" },
          ],
          condition: (opts) => opts.action === "convert",
        },
      ],
      generator: (opts) => {
        const input = opts.input || "input.mp4";
        switch (opts.action) {
          case "compress":
            return {
              command: `ffmpeg -i ${input} -vcodec libx264 -crf ${opts.crf || "23"} ${opts.output || "output.mp4"}`,
              explanation: [
                { part: "ffmpeg", desc: "Invokes the FFmpeg tool." },
                {
                  part: `-i ${input}`,
                  desc: `Defines "${input}" as the input media source file.`,
                },
                {
                  part: "-vcodec libx264",
                  desc: "Sets the video encoder to H.264 (libx264), the most widely supported codec.",
                },
                {
                  part: `-crf ${opts.crf}`,
                  desc: `Constant Rate Factor. Controls quality. 18-28 is typical; higher values yield higher compression and lower file size.`,
                },
                {
                  part: opts.output || "output.mp4",
                  desc: "The resulting output file path.",
                },
              ],
            };
          case "extract-audio": {
            const audOut = input.replace(/\.[^/.]+$/, "") + ".mp3";
            return {
              command: `ffmpeg -i ${input} -vn -acodec libmp3lame -aq 2 ${audOut}`,
              explanation: [
                {
                  part: "ffmpeg -i",
                  desc: "Starts FFmpeg and designates the input stream.",
                },
                {
                  part: "-vn",
                  desc: "Disables video recording/copying, extracting only the audio track.",
                },
                {
                  part: "-acodec libmp3lame",
                  desc: "Selects the LAME MP3 encoder library.",
                },
                {
                  part: "-aq 2",
                  desc: "Audio Quality level 2 (VBR ~190 kbps, standard high quality).",
                },
                { part: audOut, desc: "The generated MP3 audio filename." },
              ],
            };
          }
          case "cut":
            return {
              command: `ffmpeg -i ${input} -ss ${opts.startTime || "00:00:00"} -t ${opts.duration || "10"} -c copy ${opts.output || "output.mp4"}`,
              explanation: [
                {
                  part: `-ss ${opts.startTime}`,
                  desc: "Seeks to the designated start timestamp in format hh:mm:ss.",
                },
                {
                  part: `-t ${opts.duration}`,
                  desc: "Limits the output duration to the specified number of seconds.",
                },
                {
                  part: "-c copy",
                  desc: "Copies audio and video codecs directly without re-encoding, making the operation instantaneous.",
                },
              ],
            };
          case "resize":
            return {
              command: `ffmpeg -i ${input} -vf "scale=${opts.resolution}" ${opts.output || "output.mp4"}`,
              explanation: [
                {
                  part: "-vf",
                  desc: "Indicates the video filtergraph follows.",
                },
                {
                  part: `"scale=${opts.resolution}"`,
                  desc: `Applies the scaling filter to resize the width and height to ${opts.resolution.replace(":", "x")}.`,
                },
              ],
            };
          case "convert": {
            const outFormatName =
              (opts.output || "output.mp4").replace(/\.[^/.]+$/, "") +
              "." +
              opts.format;
            return {
              command: `ffmpeg -i ${input} ${outFormatName}`,
              explanation: [
                {
                  part: `ffmpeg -i ${input}`,
                  desc: "Specifies the input source file.",
                },
                {
                  part: outFormatName,
                  desc: `The target output filename. FFmpeg automatically infers the target codecs, container format, and parameters from this extension.`,
                },
              ],
            };
          }
          default:
            return { command: "ffmpeg -version", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const input = opts.input || "input.mp4";
        return `ffmpeg version 6.0 Copyright (c) 2000-2023 the FFmpeg developers\nInput #0, mov,mp4,m4a,3gp, from '${input}':\n  Duration: 00:05:24.12, start: 0.000000, bitrate: 2154 kb/s\n  Stream #0:0[0x1](und): Video: h264 (High) (avc1 / 0x31637661), yuv420p(tv, bt709)\n  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x4061706D), 48000 Hz, stereo\n\x1b[33m[libx264 @ 000001bcfa7b32] using SAR=1/1\x1b[0m\nframe=  456 fps= 62 q=-1.0 size=    4521kB time=00:00:15.20 bitrate=2431.1kbits/s speed=2.07x\n\x1b[32m[Conversion Completed Successfully]\x1b[0m`;
      },
    },
    cheatsheets: [
      {
        title: "Video Filtering",
      icon: "⚙️",
        commands: [
          {
            cmd: 'ffmpeg -i input.mp4 -vf "transpose=1" output.mp4',
            desc: "Rotate video 90 degrees clockwise.",
          },
          {
            cmd: 'ffmpeg -i input.mp4 -vf "crop=w:h:x:y" output.mp4',
            desc: "Crop video to width w, height h, starting at coordinate (x,y).",
          },
        ],
      },
      {
        title: "Merge & Concatenate",
      icon: "⚙️",
        commands: [
          {
            cmd: 'ffmpeg -i "concat:part1.mp3|part2.mp3" -acodec copy output.mp3',
            desc: "Merge two MP3 files together without re-encoding.",
          },
          {
            cmd: "ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4",
            desc: "Merge multiple video parts listed in list.txt.",
          },
        ],
      },
    ],
  };
