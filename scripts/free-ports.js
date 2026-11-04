#!/usr/bin/env node

/**
 * Cross-platform utility to find and terminate any process listening
 * on specified ports (default: 8080 for frontend, 4000 for backend)
 * before starting the development servers.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORTS = [8080, 4000];

function cleanStaleNextCache() {
  const nextDir = path.join(__dirname, "../frontend/.next");
  const buildIdPath = path.join(nextDir, "BUILD_ID");
  if (fs.existsSync(buildIdPath)) {
    try {
      console.log("[Port Manager] Found production build cache in frontend/.next. Cleaning for development...");
      fs.rmSync(nextDir, { recursive: true, force: true });
      console.log("[Port Manager] Cleaned frontend/.next.");
    } catch {
      // ignore
    }
  }
}

function killPortWindows(port) {
  try {
    const output = execSync(`netstat -ano`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    const lines = output.split("\n");
    const pids = new Set();

    for (const line of lines) {
      if (line.includes(`:${port}`) && line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0" && !isNaN(Number(pid)) && Number(pid) !== process.pid) {
          pids.add(pid);
        }
      }
    }

    for (const pid of pids) {
      try {
        console.log(`[Port Manager] Port ${port} is currently in use by PID ${pid}. Terminating process...`);
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`[Port Manager] Successfully freed port ${port}.`);
      } catch {
        // Process might have already closed or requires no action
      }
    }
  } catch {
    // Port not in use
  }
}

function killPortUnix(port) {
  try {
    const pids = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] })
      .trim()
      .split("\n");

    for (const pid of pids) {
      const num = Number(pid.trim());
      if (!isNaN(num) && num > 0 && num !== process.pid) {
        console.log(`[Port Manager] Port ${port} is in use by PID ${num}. Terminating process...`);
        try {
          execSync(`kill -9 ${num}`, { stdio: "ignore" });
          console.log(`[Port Manager] Successfully freed port ${port}.`);
        } catch {}
      }
    }
  } catch {
    // Port not in use
  }
}

function freePorts() {
  const isWindows = process.platform === "win32";
  for (const port of PORTS) {
    if (isWindows) {
      killPortWindows(port);
    } else {
      killPortUnix(port);
    }
  }
  cleanStaleNextCache();
}

freePorts();
console.log(`[Port Manager] Ports checked (${PORTS.join(", ")}). Ready to start dev servers.`);

