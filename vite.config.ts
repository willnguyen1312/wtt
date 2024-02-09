import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      events: "rollup-plugin-node-polyfills/polyfills/events",
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
      ],
    },
  },
});
