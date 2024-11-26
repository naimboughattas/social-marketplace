import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["app.js"],
  clean: true,
  format: ["cjs"],
  ...options,
}));
