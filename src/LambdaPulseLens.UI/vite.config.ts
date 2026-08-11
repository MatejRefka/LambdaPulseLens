import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

const serverProjectPath = path.resolve(__dirname, "../LambdaPulseLens.Server/LambdaPulseLens.Server.csproj");

const getVersionLabel = () => {
  const serverProject = readFileSync(serverProjectPath, "utf8");
  const version = serverProject.match(/<Version>\s*([^<]+?)\s*<\/Version>/i)?.[1];
  if (!version) {
    throw new Error(`No <Version> value was found in ${serverProjectPath}.`);
  }

  const [baseVersion, prerelease = ""] = version.split("-");
  const channel = prerelease.split(".")[0];
  if (!channel) {
    return `v${baseVersion}`;
  }

  const channelLabel =
    channel.toLowerCase() === "rc"
      ? "RC"
      : `${channel.charAt(0).toUpperCase()}${channel.slice(1).toLowerCase()}`;

  return `${channelLabel} - v${baseVersion}`;
};

// https://vite.dev/config/
export default defineConfig({
  define: {
    "import.meta.env.APP_VERSION_LABEL": JSON.stringify(getVersionLabel())
  },
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json"
      }
    }),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8080"
    }
  },
  build: {
    outDir: path.resolve(__dirname, "../LambdaPulseLens.Server/wwwroot"),
    emptyOutDir: true
  }
});
