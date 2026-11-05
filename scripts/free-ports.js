#!/usr/bin/env node

/**
 * Cross-platform utility to find and terminate any process listening
 * on specified ports before starting development or production servers.
 *
 * Usage:
 *   node scripts/free-ports.js          # Frees default ports [8080, 4000]
 *   node scripts/free-ports.js 8080     # Frees only port 8080
 *   node scripts/free-ports.js 4000     # Frees only port 4000
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cliArgs = process.argv.slice(2).map(Number).filter((p) => !isNaN(p) && p > 0);
const PORTS = cliArgs.length > 0 ? cliArgs : [8080, 4000];

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

  // Remove stale dev lock files if they exist
  try {
    const lockFiles = [
      path.join(nextDir, "dev", "lock"),
      path.join(nextDir, "lock")
    ];
    for (const lf of lockFiles) {
      if (fs.existsSync(lf)) {
        fs.rmSync(lf, { force: true });
        console.log(`[Port Manager] Removed stale Next.js lock: ${lf}`);
      }
    }
  } catch {
    // ignore
  }
}

function getListeningPidsWindows(port) {
  const pids = new Set();
  try {
    const output = execSync("netstat -ano", { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    const lines = output.split(/\r?\n/);
    for (const line of lines) {
      if (!line.includes("LISTENING")) continue;
      const parts = line.trim().split(/\s+/);
      // Format: [Proto, LocalAddress, ForeignAddress, State, PID]
      const localAddress = parts[1];
      const pid = parts[parts.length - 1];
      if (localAddress && (localAddress.endsWith(`:${port}`) || localAddress.endsWith(`.${port}`))) {
        const numPid = Number(pid);
        if (numPid && numPid !== 0 && numPid !== process.pid) {
          pids.add(numPid);
        }
      }
    }
  } catch {
    // netstat error or empty
  }
  return Array.from(pids);
}

function killPortWindows(port) {
  let pids = getListeningPidsWindows(port);
  if (pids.length === 0) return;

  for (const pid of pids) {
    try {
      console.log(`[Port Manager] Port ${port} is in use by PID ${pid}. Terminating process tree...`);
      // /F = Forcefully terminate, /T = Tree kill (includes all child processes)
      execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" });
    } catch {
      // Process might already be closed or permission-restricted
    }
  }

  // Poll for up to 1.5 seconds to confirm port is fully released by the OS
  const start = Date.now();
  while (Date.now() - start < 1500) {
    pids = getListeningPidsWindows(port);
    if (pids.length === 0) {
      console.log(`[Port Manager] Successfully freed port ${port}.`);
      return;
    }
    try {
      execSync("powershell -NoProfile -Command Start-Sleep -Milliseconds 150", { stdio: "ignore" });
    } catch {
      break;
    }
  }

  // Final check
  pids = getListeningPidsWindows(port);
  if (pids.length === 0) {
    console.log(`[Port Manager] Successfully freed port ${port}.`);
  } else {
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /T /PID ${pid}`, { stdio: "ignore" });
      } catch {}
    }
    console.log(`[Port Manager] Port ${port} cleanup completed.`);
  }
}

function getListeningPidsUnix(port) {
  const pids = new Set();
  try {
    const output = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] });
    for (const line of output.split(/\r?\n/)) {
      const pid = Number(line.trim());
      if (pid && pid !== process.pid) pids.add(pid);
    }
  } catch {}
  return Array.from(pids);
}

function killPortUnix(port) {
  const pids = getListeningPidsUnix(port);
  if (pids.length === 0) return;

  for (const pid of pids) {
    try {
      console.log(`[Port Manager] Port ${port} is in use by PID ${pid}. Terminating process...`);
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
      console.log(`[Port Manager] Successfully freed port ${port}.`);
    } catch {}
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

  // Only clean frontend .next cache if port 8080 is being managed
  if (PORTS.includes(8080)) {
    cleanStaleNextCache();
  }
}

freePorts();
console.log(`[Port Manager] Ports checked (${PORTS.join(", ")}). Ready.`);
