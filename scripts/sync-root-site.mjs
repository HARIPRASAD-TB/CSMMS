import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");

if (!fs.existsSync(outDir)) {
  console.error("Missing out/ folder. Run npm run build:gh first.");
  process.exit(1);
}

const skip = new Set([
  "node_modules",
  ".git",
  ".next",
  "out",
  ".gh-pages-backup",
  "src",
  "scripts",
  "public",
  "docs",
  "project-docs",
]);

for (const name of fs.readdirSync(outDir)) {
  const from = path.join(outDir, name);
  const to = path.join(root, name);

  if (skip.has(name)) {
    continue;
  }

  fs.cpSync(from, to, { recursive: true, force: true });
  console.log("Synced:", name);
}

console.log("Static site copied to repository root for GitHub Pages.");
