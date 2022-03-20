/* eslint-env node */

import vueI18n from "@intlify/vite-plugin-vue-i18n";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";
import { execSync } from "child_process";
import { resolve } from "path";
import { defineConfig, Plugin, build } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import * as cheerio from 'cheerio';
import * as babel from '@babel/core';

function shell(command: string): string {
  return execSync(command).toString().trimEnd();
}
const alias = {
  "@/": resolve(__dirname, "src") + "/",
};

const define = {
  __VERSION__: JSON.stringify(shell("git describe --always --dirty")),
};

function one<T>(v: T | T[]): T {
  if (Array.isArray(v)) {
    return v[0];
  }
  return v;
}

export const preload = (): Plugin => ({
  name: "preload",
  async transformIndexHtml(html) {
    const res = one(
      await build({
        root: __dirname,
        configFile: false,
        plugins: [],
        resolve: { alias },
        define,
        build: {
          write: false,
          target: false,
          rollupOptions: {
            input: resolve(__dirname, "./src/preload.ts"),
            output: {
              format: "iife",
            },
          },
        },
      })
    );
    if (!("output" in res)) {
      throw new Error("invalid build result");
    }
    const output = one(res.output);
    if (!("code" in output)) {
      throw new Error("invalid output");
    }

    const $ = cheerio.load(html);
    const code = (
      await babel.transformAsync(output.code, {
        configFile: false,
        minified: true,
        presets: [["@babel/preset-env", { targets: { ie: 10 } }]],
      })
    ).code;

    $("#app").after(`<script>${code}</script>`);
    return $.html();
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  root: __dirname,
  resolve: {
    alias,
  },
  base: "./",
  define,
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
    preload(),
  ],
});
