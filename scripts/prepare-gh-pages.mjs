import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const toggles = [
  "src/middleware.ts",
  "src/instrumentation.ts",
];
const apiDir = path.join(root, "src/app/api");
const apiBackup = path.join(root, ".gh-pages-backup/api");

const mode = process.argv[2] ?? "hide";

function cleanArtifacts() {
  for (const dir of [".next", "out"]) {
    const target = path.join(root, dir);
    if (fs.existsSync(target)) {
      try {
        fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 });
        console.log("Removed:", dir);
      } catch (error) {
        console.warn(`Could not remove ${dir}:`, error.message);
        console.warn("Stop `npm run dev` if it is running, then retry.");
        throw error;
      }
    }
  }
}

function hideForExport() {
  for (const rel of toggles) {
    const file = path.join(root, rel);
    const backup = `${file}.ghbak`;
    if (fs.existsSync(file)) {
      fs.renameSync(file, backup);
      console.log("Disabled for static export:", rel);
    }
  }
  hideApiRoutes();
}

function restoreFromExport() {
  for (const rel of toggles) {
    const file = path.join(root, rel);
    const backup = `${file}.ghbak`;
    if (fs.existsSync(backup)) {
      fs.renameSync(backup, file);
      console.log("Restored:", rel);
    }
  }
  restoreApiRoutes();
}

function hideApiRoutes() {
  if (fs.existsSync(apiDir)) {
    if (fs.existsSync(apiBackup)) {
      fs.rmSync(apiBackup, { recursive: true, force: true });
    }
    fs.mkdirSync(path.dirname(apiBackup), { recursive: true });
    fs.cpSync(apiDir, apiBackup, { recursive: true });
    fs.rmSync(apiDir, { recursive: true, force: true });
    console.log("Disabled for static export: src/app/api");
  }
}

function restoreApiRoutes() {
  if (fs.existsSync(apiBackup)) {
    if (fs.existsSync(apiDir)) {
      fs.rmSync(apiDir, { recursive: true, force: true });
    }
    fs.cpSync(apiBackup, apiDir, { recursive: true });
    fs.rmSync(apiBackup, { recursive: true, force: true });
    console.log("Restored: src/app/api");
  }
}

function postBuild() {
  const outDir = path.join(root, "out");
  const index = path.join(outDir, "index.html");
  const notFound = path.join(outDir, "404.html");
  const noJekyll = path.join(outDir, ".nojekyll");

  if (fs.existsSync(index)) {
    fs.copyFileSync(index, notFound);
    console.log("Created 404.html for GitHub Pages client routing");
  }
  if (!fs.existsSync(noJekyll)) {
    fs.writeFileSync(noJekyll, "");
    console.log("Created .nojekyll");
  }
}

if (mode === "clean") {
  cleanArtifacts();
  process.exit(0);
}

if (mode === "hide") {
  hideForExport();
} else if (mode === "restore") {
  restoreFromExport();
} else if (mode === "postbuild") {
  postBuild();
}
