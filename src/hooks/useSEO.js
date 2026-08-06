import { useEffect } from "react";

export function useSEO({ title, description, path, activeSchema }) {
  useEffect(() => {
    document.title = title || "Tools Cli - Git, Ollama, FFmpeg, Python & Utilities";
    const desc = description || "An interactive web dashboard for learning and configuring command line tools: Git, Ollama, FFmpeg, yt-dlp, Python, Pip, Docker, jq, tmux, and npm packages.";

    const updateMeta = (selector, value, attr = "content") => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    updateMeta('meta[name="description"]', desc);
    updateMeta('meta[property="og:description"]', desc);
    updateMeta('meta[property="twitter:description"]', desc);

    updateMeta('meta[name="title"]', document.title);
    updateMeta('meta[property="og:title"]', document.title);
    updateMeta('meta[property="twitter:title"]', document.title);

    const fullUrl = `https://tools-cli.konshu.in/${path || ""}`;
    updateMeta('link[rel="canonical"]', fullUrl, "href");
    updateMeta('meta[property="og:url"]', fullUrl);
    updateMeta('meta[property="twitter:url"]', fullUrl);

    // Update JSON-LD Schema
    const schemaScript = document.getElementById("json-ld-schema");
    if (schemaScript) {
      const schemaData = activeSchema || [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Tools Cli",
          url: "https://tools-cli.konshu.in/",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://tools-cli.konshu.in/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Tools Cli",
          url: "https://tools-cli.konshu.in/",
          description:
            "An interactive web dashboard for learning and configuring command line tools: Git, Ollama, FFmpeg, yt-dlp, Python, Pip, Docker, jq, tmux, and npm packages.",
          applicationCategory: "DeveloperApplication, EducationalApplication",
          operatingSystem: "Windows, macOS, Linux",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
          image: "https://tools-cli.konshu.in/hero.webp",
          author: {
            "@type": "Person",
            name: "karan-k-code",
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      ];
      schemaScript.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, path, activeSchema]);
}
