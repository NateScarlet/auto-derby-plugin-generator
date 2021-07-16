/* eslint-env node */

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,

  resolve: {
    alias: {
      '@/': resolve(__dirname, 'src') + '/',
    },
  },
  plugins: [
    vue(),
    legacy(),
    vueI18n({
      include: resolve(__dirname, "src/locales/**"),
    }),
  ],
});
