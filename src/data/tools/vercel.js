export const vercel = {
    id: "vercel",
    name: "Vercel CLI",
    category: "Utilities",
    color: "#ffffff",
    accentClass: "vercel-accent",
    github: "https://github.com/vercel/vercel",
    tagline:
      "Instant cloud deployments and serverless management from your shell.",
    description:
      "Vercel CLI provides a command line interface to deploy projects, configure DNS, configure serverless functions, and manage environment variables directly on Vercel's edge network.",
    install: {
      windows: "npm install -g vercel",
      mac: "npm install -g vercel",
      linux: "npm install -g vercel",
    },
    visualConcept: {
      title: "Vercel Deployment Flow",
      steps: [
        {
          name: "Local Code",
          desc: "Your project repository ready for deployment (e.g. Next.js, Vite, static HTML).",
          status: "modified",
        },
        {
          name: "Vercel Link",
          desc: "Initialize and link local directory to a Vercel project configuration.",
          status: "staged",
        },
        {
          name: "Preview Build",
          desc: "Deploy a preview build snapshot on a temporary subdomain.",
          status: "committed",
        },
        {
          name: "Production Push",
          desc: "Alias, promote, and point your live production domain to the latest deploy.",
          status: "remote",
        },
      ],
    },
    interactiveBuilder: {
      title: "Vercel Command Architect",
      description:
        "Configure environment linking, deploy builds, inject environment secrets, or rollback active deployments.",
      options: [
        {
          id: "action",
          label: "Deployment Action",
          type: "select",
          defaultValue: "deploy-preview",
          choices: [
            { value: "login", label: "Login to Account" },
            { value: "link", label: "Link Project to Vercel" },
            { value: "deploy-preview", label: "Deploy Preview Build" },
            { value: "deploy-prod", label: "Deploy to Production (--prod)" },
            { value: "env-add", label: "Inject Environment Variable" },
            { value: "rollback", label: "Rollback to Previous Deployment" },
          ],
        },
        {
          id: "projectName",
          label: "Project Name/ID",
          type: "text",
          defaultValue: "my-web-app",
          condition: (opts) => opts.action === "link",
        },
        {
          id: "envKey",
          label: "Env Variable Name (Key)",
          type: "text",
          defaultValue: "DATABASE_URL",
          condition: (opts) => opts.action === "env-add",
        },
        {
          id: "envVal",
          label: "Env Variable Value",
          type: "text",
          defaultValue: "postgresql://usr:pwd@host/db",
          condition: (opts) => opts.action === "env-add",
        },
        {
          id: "envTarget",
          label: "Environment target",
          type: "select",
          defaultValue: "development",
          choices: [
            { value: "development", label: "Development" },
            { value: "preview", label: "Preview" },
            { value: "production", label: "Production" },
          ],
          condition: (opts) => opts.action === "env-add",
        },
        {
          id: "deployId",
          label: "Target Deployment ID/URL",
          type: "text",
          defaultValue: "dpl_8hG3x9n1aBcdeFgh",
          condition: (opts) => opts.action === "rollback",
        },
      ],
      generator: (opts) => {
        const projectName = opts.projectName || "my-web-app";
        const envKey = opts.envKey || "DATABASE_URL";
        const envVal = opts.envVal || "postgresql://usr:pwd@host/db";
        const envTarget = opts.envTarget || "development";
        const deployId = opts.deployId || "dpl_8hG3x9n1aBcdeFgh";

        switch (opts.action) {
          case "login":
            return {
              command: "vercel login",
              explanation: [
                {
                  part: "vercel login",
                  desc: "Authenticates your local terminal with your Vercel account via Email, GitHub, GitLab, or Bitbucket auth redirect.",
                },
              ],
            };
          case "link":
            return {
              command: `vercel link --yes --project ${projectName}`,
              explanation: [
                {
                  part: "vercel link",
                  desc: "Sets up and links the current folder to a Vercel project.",
                },
                {
                  part: "--yes",
                  desc: "Skips interactive setup prompts, auto-accepting default options.",
                },
                {
                  part: `--project ${projectName}`,
                  desc: "Specifies the destination project name in your account.",
                },
              ],
            };
          case "deploy-preview":
            return {
              command: "vercel",
              explanation: [
                {
                  part: "vercel",
                  desc: "Triggers a preview deployment of the linked local folder. Files are uploaded and a preview subdomain url is generated.",
                },
              ],
            };
          case "deploy-prod":
            return {
              command: "vercel --prod",
              explanation: [
                {
                  part: "vercel",
                  desc: "Triggers a deployment build of the project.",
                },
                {
                  part: "--prod",
                  desc: "Promotes this build to active production, binding it directly to your primary domains.",
                },
              ],
            };
          case "env-add":
            return {
              command: `vercel env add ${envKey} ${envVal} ${envTarget}`,
              explanation: [
                {
                  part: "vercel env add",
                  desc: "Utility to append environment variables to your cloud project.",
                },
                { part: envKey, desc: "The secret parameter key name." },
                {
                  part: envVal,
                  desc: "The secret value of the key (supports encryption).",
                },
                {
                  part: envTarget,
                  desc: "Limits this variable to the selected target environment (development, preview, or production).",
                },
              ],
            };
          case "rollback":
            return {
              command: `vercel rollback ${deployId}`,
              explanation: [
                {
                  part: "vercel rollback",
                  desc: "Rolls back your production domain instantly to a previous deployment version.",
                },
                {
                  part: deployId,
                  desc: "The unique deployment hash ID or deployment URL target.",
                },
              ],
            };
          default:
            return { command: "vercel", explanation: [] };
        }
      },
      simulatedOutput: (opts) => {
        const envKey = opts.envKey || "DATABASE_URL";
        const envTarget = opts.envTarget || "development";
        const deployId = opts.deployId || "dpl_8hG3x9n1aBcdeFgh";

        switch (opts.action) {
          case "login":
            return `Vercel CLI 34.0.0\n\x1b[36m> Success! Secure verification link sent. Check email.\x1b[0m\nLogged in to username (personal Scope)`;
          case "link":
            return `? Set up and deploy "./my-web-app"? [y/N] y\n? Which scope? username\n? Link to existing project? [y/N] n\n\x1b[32mLinked to username/my-web-app (project settings downloaded)\x1b[0m`;
          case "deploy-preview":
            return `Vercel CLI 34.0.0\nDeploying C:\\projects\\tools\\my-web-app under username\n\x1b[36mhttps://my-web-app-username.vercel.app [Preview]\x1b[0m\n\x1b[32m[Deployment Completed Successfully]\x1b[0m`;
          case "deploy-prod":
            return `Vercel CLI 34.0.0\nDeploying C:\\projects\\tools\\my-web-app under username\n\x1b[36mhttps://my-web-app.vercel.app [Production]\x1b[0m\n\x1b[32m[Production Deployment Active]\x1b[0m`;
          case "env-add":
            return `\x1b[32m+ env ${envKey} (${envTarget}) added\x1b[0m\nRun vercel pull to sync environment keys locally.`;
          case "rollback":
            return `Rolling back to deployment ${deployId}...\n\x1b[32mSuccess! Production domain now points to deployment ${deployId}\x1b[0m`;
          default:
            return "";
        }
      },
    },
    cheatsheets: [
      {
        title: "Local Synced dev",
      icon: "⚙️",
        commands: [
          {
            cmd: "vercel dev",
            desc: "Run Vercel replication dev server locally on port 3000, parsing serverless routing.",
          },
          {
            cmd: "vercel pull --environment=development",
            desc: "Download and sync project settings & environment secret variables into .env.local file.",
          },
        ],
      },
      {
        title: "Inspections & Management",
      icon: "⚙️",
        commands: [
          {
            cmd: "vercel list",
            desc: "List recent deployments of the linked project, along with status tags.",
          },
          {
            cmd: "vercel inspect <url>",
            desc: "Retrieve runtime configuration parameters and logs of a deployed URL.",
          },
          {
            cmd: "vercel domains list",
            desc: "Display all custom domain aliases configured on your Vercel project.",
          },
        ],
      },
    ],
  };
