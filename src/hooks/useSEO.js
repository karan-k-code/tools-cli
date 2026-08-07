import { useEffect } from "react";

const DEFAULT_DESCRIPTION =
  "Master terminal workflows with interactive generators, simulations, and curated command references for Git, Ollama, FFmpeg, Python, Docker, jq, tmux, and more.";
const DEFAULT_KEYWORDS =
  "command line, interactive CLI, developer dashboard, Git commands, FFmpeg generator, Ollama assistant, terminal tutorials, Python CLI, Docker commands, yt-dlp";

function ensureMeta(selector, attrs) {
  const element = document.querySelector(selector);
  if (element) {
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  const tagName = selector.startsWith("link") ? "link" : "meta";
  const newElement = document.createElement(tagName);
  Object.entries(attrs).forEach(([key, value]) => {
    newElement.setAttribute(key, value);
  });
  document.head.appendChild(newElement);
  return newElement;
}

export function useSEO({ title, description, path, activeSchema }) {
  useEffect(() => {
    const pageTitle = title || "Tools CLI - Interactive Command Line Companion";
    document.title = pageTitle;
    const desc = description || DEFAULT_DESCRIPTION;
    const keywords = DEFAULT_KEYWORDS;
    const cleanPath = path ? path.replace(/^\/+|\/+$/g, "") : "";
    const fullUrl = `https://tools-cli.konshu.in/${cleanPath}`;

    ensureMeta('meta[name="description"]', {
      name: "description",
      content: desc,
    });
    ensureMeta('meta[name="keywords"]', {
      name: "keywords",
      content: keywords,
    });
    ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: desc,
    });
    ensureMeta('meta[property="twitter:description"]', {
      property: "twitter:description",
      content: desc,
    });

    ensureMeta('meta[name="title"]', {
      name: "title",
      content: pageTitle,
    });
    ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: pageTitle,
    });
    ensureMeta('meta[property="twitter:title"]', {
      property: "twitter:title",
      content: pageTitle,
    });
    ensureMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Tools CLI",
    });
    ensureMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: "en_US",
    });
    ensureMeta('meta[property="twitter:card"]', {
      property: "twitter:card",
      content: "summary_large_image",
    });
    ensureMeta('meta[property="twitter:creator"]', {
      property: "twitter:creator",
      content: "@karan_k_code",
    });
    ensureMeta('meta[property="og:url"]', {
      property: "og:url",
      content: fullUrl,
    });
    ensureMeta('meta[property="twitter:url"]', {
      property: "twitter:url",
      content: fullUrl,
    });
    ensureMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: "Tools CLI interactive developer command line dashboard preview",
    });
    ensureMeta('meta[property="twitter:image:alt"]', {
      property: "twitter:image:alt",
      content: "Tools CLI interactive developer command line dashboard preview",
    });
    ensureMeta('link[rel="canonical"]', {
      rel: "canonical",
      href: fullUrl,
    });

    const schemaScript = document.getElementById("json-ld-schema");
    if (schemaScript) {
      const schemaData = activeSchema || [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Tools CLI",
          url: "https://tools-cli.konshu.in/",
          sameAs: [
            "https://github.com/karan-k-code/tools-cli",
            "https://twitter.com/karan_k_code",
          ],
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://tools-cli.konshu.in/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Tools CLI",
          url: "https://tools-cli.konshu.in/",
          description: desc,
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
      schemaScript.textContent = JSON.stringify(schemaData, null, 2);
    }
  }, [title, description, path, activeSchema]);
}
