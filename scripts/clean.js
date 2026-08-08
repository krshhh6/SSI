const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const targets = [".next", "tsconfig.tsbuildinfo"];

// Run free-port first
try {
  require("./free-port.js");
} catch (e) {}

targets.forEach((target) => {
  const fullPath = path.join(root, target);
  if (fs.existsSync(fullPath)) {
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`[Clean Setup] Removed ${target}`);
    } catch (err) {
      console.warn(`[Clean Setup] Could not remove ${target}: ${err.message}`);
    }
  }
});

console.log("[Clean Setup] Workspace cleaned successfully!");
