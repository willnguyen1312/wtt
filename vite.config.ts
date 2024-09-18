import MillionLint from '@million/lint';
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
const _plugins = [nodePolyfills(), react({
  babel: {
    plugins: [["module:@preact/signals-react-transform"]]
  }
})];
_plugins.unshift(MillionLint.vite())
export default defineConfig({
  plugins: _plugins
});