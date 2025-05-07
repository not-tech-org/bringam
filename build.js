// Custom build script for Next.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Print current working directory
console.log(`Current directory: ${process.cwd()}`);

// Define environment variables for the build
const buildEnv = {
  ...process.env,
  NODE_OPTIONS: "--max-old-space-size=8192",
  NEXT_TELEMETRY_DISABLED: "1",
};

// Delete .next directory if it exists (clean build)
const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  console.log("Removing existing .next directory...");
  fs.rmSync(nextDir, { recursive: true, force: true });
}

// Run the build with the custom environment
try {
  console.log("Starting Next.js build...");
  execSync("next build", {
    env: buildEnv,
    stdio: "inherit",
  });
  console.log("Build completed successfully!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
