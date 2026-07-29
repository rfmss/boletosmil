import { cp, mkdir, rm } from "node:fs/promises";

const targets = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "sw.js",
  "icons",
  "src",
];

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const target of targets) {
  await cp(target, `dist/${target}`, { recursive: true });
}
console.log("Build estático criado em dist/.");
