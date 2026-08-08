const { execSync } = require("child_process");

const port = process.env.PORT || 3000;

function freePort(targetPort) {
  const isWin = process.platform === "win32";
  try {
    if (isWin) {
      const output = execSync(
        `netstat -ano | findstr LISTENING | findstr :${targetPort}`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
      );
      const lines = output.trim().split("\n");
      const pids = new Set();
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0") {
          pids.add(pid);
        }
      });
      pids.forEach((pid) => {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`[Clean Setup] Freed port ${targetPort} by killing process PID ${pid}`);
        } catch (e) {
          // Process already terminated
        }
      });
    } else {
      try {
        execSync(`lsof -t -i:${targetPort} | xargs kill -9`, { stdio: "ignore" });
        console.log(`[Clean Setup] Freed port ${targetPort}`);
      } catch (e) {
        // Port was not in use
      }
    }
  } catch (e) {
    // Port is free
  }
}

freePort(port);
