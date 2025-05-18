import { defineConfig } from "rolldown";

export default defineConfig({
  input: "index.ts",
  output: {
    format: "esm",
    file: "bundle.js",
  },
  platform: "node",
});
