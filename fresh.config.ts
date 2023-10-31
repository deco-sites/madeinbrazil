/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="esnext" />

import { start } from "$fresh/server.ts";
import plugins from "deco-sites/std/plugins/mod.ts";
import partytownPlugin from "partytown/mod.ts";
import manifest from "./fresh.gen.ts";
import decoManifest from "./manifest.gen.ts";

import { defineConfig } from "$fresh/server.ts";
export default defineConfig({
  build: { target: ["chrome99", "firefox99", "safari11"] },
  plugins: [
    ...plugins(
      {
        manifest: decoManifest,
      },
    ),
    partytownPlugin(),
  ],
});
