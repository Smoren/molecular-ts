import path from "path";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from 'node:url'
import VueMacros from "unplugin-vue-macros/vite";
import Vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/molecular-ts/'
});
