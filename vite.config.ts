/* eslint-env node */

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { execSync } from "child_process";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

function shell(command: string): string {
  return execSync(command).toString().trimEnd();
}

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      "@/": resolve(__dirname, "src") + "/",
    },
  },
  base: "./",
  define: {
    __VERSION__: JSON.stringify(shell("git describe --always --dirty")),
  },
  plugins: [
    vue(),
    vueI18n({
      include: resolve(__dirname, "src/locales/**"),
    }),
    VitePWA({
      srcDir: "src",
      filename: "sw.ts",
      strategies: "injectManifest",
      includeAssets: ["/favicon.ico"],
      manifest: {
        name: "auto-derby plugin generator",
        short_name: "auto-derby plugin generator",
        description:
          "A web app to generate [auto-derby](https://github.com/NateScarlet/auto-derby) plugin.",
        lang: "mul",
        theme_color: "#ffffff",
        icons: [
          {
            src: "./icon-256.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
      },
    }),
    legacy(),
  ],
});
