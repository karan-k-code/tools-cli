export const magick = {
    id: "magick",
    name: "ImageMagick",
    category: "Utilities",
    color: "#ec4899",
    accentClass: "magick-accent",
    github: "https://github.com/ImageMagick/ImageMagick",
    tagline: "Powerful CLI suite to edit, compose, or convert bitmap images.",
    description:
      "ImageMagick is a free, open-source software suite for editing, composing, and converting raster images. It can read and write images in a variety of formats (over 200) including PNG, JPEG, GIF, WebP, HEIC, SVG, and PDF. Use it to resize, flip, mirror, rotate, shear, crop, transform, adjust colors, or draw shapes and text.",
    install: {
      windows: "winget install ImageMagick.ImageMagick",
      mac: "brew install imagemagick",
      linux: "sudo apt install imagemagick",
    },
    visualConcept: {
      title: "ImageMagick Pipeline",
      steps: [
        {
          name: "Source Image",
          desc: "Target raster or vector file (e.g., photo.jpg, logo.png).",
          status: "modified",
        },
        {
          name: "Image Operators",
          desc: "Filters and transforms applied sequentially (e.g., -resize, -crop, -rotate).",
          status: "staged",
        },
        {
          name: "Image Settings",
          desc: "Metadata, compression quality, colorspace, or render parameters (e.g., -quality, -fill).",
          status: "committed",
        },
        {
          name: "Output Rendering",
          desc: "Decoded result written to target file extension with inferred codecs.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "ImageMagick CLI Companion",
      description:
        "Easily configure ImageMagick v7 commands to convert format, resize, crop, rotate, or watermark images.",
      options: [
        {
          id: "action",
          label: "Select Action",
          type: "select",
          defaultValue: "convert",
          choices: [
            { value: "convert", label: "Convert Image Format" },
            { value: "resize", label: "Resize / Scale Image" },
            { value: "crop", label: "Crop Image Region" },
            { value: "rotate", label: "Rotate Image" },
            { value: "quality", label: "Compress / Set Quality" },
            { value: "watermark", label: "Draw Text / Watermark" },
            { value: "info", label: "Get Image Info (Identify)" },
          ],
        },
        {
          id: "input",
          label: "Input Image",
          type: "text",
          defaultValue: "input.jpg",
        },
        {
          id: "output",
          label: "Output Image",
          type: "text",
          defaultValue: "output.jpg",
          condition: (opts) => opts.action !== "info",
        },
        {
          id: "width",
          label: "Width (px)",
          type: "text",
          defaultValue: "800",
          condition: (opts) => ["resize", "crop"].includes(opts.action),
        },
        {
          id: "height",
          label: "Height (px)",
          type: "text",
          defaultValue: "600",
          condition: (opts) => ["resize", "crop"].includes(opts.action),
        },
        {
          id: "cropX",
          label: "Crop X Offset",
          type: "text",
          defaultValue: "10",
          condition: (opts) => opts.action === "crop",
        },
        {
          id: "cropY",
          label: "Crop Y Offset",
          type: "text",
          defaultValue: "10",
          condition: (opts) => opts.action === "crop",
        },
        {
          id: "angle",
          label: "Rotation Angle",
          type: "select",
          defaultValue: "90",
          choices: [
            { value: "90", label: "90° Clockwise" },
            { value: "180", label: "180° Half-turn" },
            { value: "270", label: "270° Counter-Clockwise" },
            { value: "-90", label: "-90° CCW" },
          ],
          condition: (opts) => opts.action === "rotate",
        },
        {
          id: "qualityVal",
          label: "JPEG/WebP Quality (1-100)",
          type: "text",
          defaultValue: "85",
          condition: (opts) => opts.action === "quality",
        },
        {
          id: "textOverlay",
          label: "Watermark Text",
          type: "text",
          defaultValue: "Copyright 2026",
          condition: (opts) => opts.action === "watermark",
        },
        {
          id: "textColor",
          label: "Text Color",
          type: "text",
          defaultValue: "white",
          condition: (opts) => opts.action === "watermark",
        },
        {
          id: "textSize",
          label: "Font Size (pt)",
          type: "text",
          defaultValue: "36",
          condition: (opts) => opts.action === "watermark",
        },
      ],
      generator: (opts) => {
        const inp = opts.input || "input.jpg";
        const out = opts.output || "output.jpg";

        switch (opts.action) {
          case "convert": {
            const outFormat = opts.output || "output.png";
            return {
              command: `magick ${inp} ${outFormat}`,
              explanation: [
                {
                  part: "magick",
                  desc: "Invokes the ImageMagick CLI utility (ImageMagick v7+ uses 'magick' as entrypoint instead of 'convert').",
                },
                {
                  part: inp,
                  desc: "The source input image filename to decode.",
                },
                {
                  part: outFormat,
                  desc: "The destination output image file. ImageMagick automatically transcodes the image based on this file extension.",
                },
              ],
            };
          }
          case "resize": {
            const w = opts.width || "800";
            const h = opts.height || "600";
            return {
              command: `magick ${inp} -resize ${w}x${h} ${out}`,
              explanation: [
                { part: "magick", desc: "Invokes the ImageMagick CLI utility." },
                { part: inp, desc: "Source input image file." },
                {
                  part: `-resize ${w}x${h}`,
                  desc: `Resizes the image so that it fits inside the ${w}x${h} bounding box while maintaining aspect ratio. (Use an exclamation point like ${w}x${h}! to force exact dimensions).`,
                },
                { part: out, desc: "Saves resized output to this file." },
              ],
            };
          }
          case "crop": {
            const w = opts.width || "400";
            const h = opts.height || "300";
            const x = opts.cropX || "10";
            const y = opts.cropY || "10";
            return {
              command: `magick ${inp} -crop ${w}x${h}+${x}+${y} ${out}`,
              explanation: [
                { part: "magick", desc: "Invokes the ImageMagick CLI utility." },
                { part: inp, desc: "Source input image file." },
                {
                  part: `-crop ${w}x${h}+${x}+${y}`,
                  desc: `Crops a rectangular area of dimensions ${w}x${h} starting from offsets X=${x}, Y=${y}.`,
                },
                { part: out, desc: "Saves the cropped result image." },
              ],
            };
          }
          case "rotate": {
            const a = opts.angle || "90";
            return {
              command: `magick ${inp} -rotate ${a} ${out}`,
              explanation: [
                { part: "magick", desc: "Invokes the ImageMagick CLI utility." },
                { part: inp, desc: "Source input image file." },
                {
                  part: `-rotate ${a}`,
                  desc: `Rotates the image clockwise by ${a} degrees. Empty spaces filled by background color.`,
                },
                { part: out, desc: "Saves the rotated result image." },
              ],
            };
          }
          case "quality": {
            const q = opts.qualityVal || "85";
            return {
              command: `magick ${inp} -quality ${q} ${out}`,
              explanation: [
                { part: "magick", desc: "Invokes the ImageMagick CLI utility." },
                { part: inp, desc: "Source input image file." },
                {
                  part: `-quality ${q}`,
                  desc: `Sets the JPEG, WebP, or PNG compression quality factor (value 1 to 100). Higher means less lossy compression, larger file.`,
                },
                { part: out, desc: "Saves the compressed image." },
              ],
            };
          }
          case "watermark": {
            const text = opts.textOverlay || "Copyright 2026";
            const color = opts.textColor || "white";
            const size = opts.textSize || "36";
            return {
              command: `magick ${inp} -pointsize ${size} -fill ${color} -draw "text 20,50 '${text}'" ${out}`,
              explanation: [
                { part: "magick", desc: "Invokes the ImageMagick CLI utility." },
                { part: inp, desc: "Source input image file." },
                { part: `-pointsize ${size}`, desc: `Sets font size to ${size} points.` },
                { part: `-fill ${color}`, desc: `Sets fill color for rendering text.` },
                {
                  part: `-draw "text 20,50 '${text}'"`,
                  desc: `Draws text string '${text}' at coordinate (X=20, Y=50) offset from top-left.`,
                },
                { part: out, desc: "Saves image with text watermark." },
              ],
            };
          }
          case "info": {
            return {
              command: `magick identify ${inp}`,
              explanation: [
                { part: "magick identify", desc: "Prints format, resolution, depth, and colorspace metadata details for the target image." },
                { part: inp, desc: "Source image to analyze." },
              ],
            };
          }
          default:
            return { command: "magick --help", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const inp = opts.input || "input.jpg";
        const out = opts.output || "output.jpg";
        switch (opts.action) {
          case "convert":
            return `input.jpg JPEG 1920x1080 1920x1080+0+0 8-bit sRGB 246KB 0.030u 0:00.031\n[Transcoded output saved to ${opts.output || "output.png"}]`;
          case "resize":
            return `input.jpg JPEG 1920x1080=>${opts.width || "800"}x${opts.height || "450"} 8-bit sRGB 85KB\n[Resize operation completed successfully]`;
          case "crop":
            return `input.jpg JPEG 1920x1080=>${opts.width || "400"}x${opts.height || "300"} 8-bit sRGB 42KB\n[Cropped region saved to ${out}]`;
          case "rotate":
            return `input.jpg JPEG 1920x1080=>1080x1920 8-bit sRGB 238KB\n[Rotated image saved to ${out}]`;
          case "quality":
            return `input.jpg JPEG 1920x1080 8-bit sRGB 246KB=>125KB (quality: ${opts.qualityVal || "85"})\n[Compression completed successfully]`;
          case "watermark":
            return `[Overlaying watermark text '${opts.textOverlay || "Copyright 2026"}' using color ${opts.textColor || "white"}]\n[Watermarked image saved to ${out}]`;
          case "info":
            return `${inp} JPEG 1920x1080 1920x1080+0+0 8-bit sRGB 246KB 0.000u 0:00.004\nFormat: JPEG (Joint Photographic Experts Group)\nClass: DirectClass\nColorspace: sRGB\nDepth: 8-bit\nFilesize: 246KB`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        title: "Basic Conversions",
      icon: "🎨",
        commands: [
          {
            cmd: "magick input.png -quality 85 output.jpg",
            desc: "Convert PNG to JPEG with specific compression quality.",
          },
          {
            cmd: "magick input.jpg -resize 50% output.jpg",
            desc: "Halve the dimensions of an image relative to source size.",
          },
          {
            cmd: "magick mogrify -format png *.jpg",
            desc: "Batch convert all JPEG images in folder to PNG.",
          },
        ],
      },
      {
        title: "Advanced Operations",
      icon: "✨",
        commands: [
          {
            cmd: "magick input.jpg -colorspace Gray output.jpg",
            desc: "Convert image to grayscale format.",
          },
          {
            cmd: "magick input.png -bordercolor black -border 10x10 output.png",
            desc: "Add a 10px black border around the outer edges of the image.",
          },
          {
            cmd: "magick convert image1.png image2.png +append combined.png",
            desc: "Assemble/append two images side-by-side horizontally.",
          },
        ],
      },
    ],
  };
