import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        tsconfigPath: "./tsconfig.app.json"
      }
    }),
    tailwindcss()
  ],
  build: {
    outDir: path.resolve(__dirname, "../LambdaPulse.UI/wwwroot"),
    emptyOutDir: true
  }
});
