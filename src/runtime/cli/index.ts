import path from "path";

import { runScanCommand } from "./commands/scan-command";

import { runImpactCommand } from "./commands/impact-command";

import { runValidateCommand } from "./commands/validate-command";

import { runWatchCommand } from "./commands/watch-command";

async function bootstrapCLI(): Promise<void> {
  const args = process.argv.slice(2);

  const command = args[0];

  const commandArgs = args.slice(1);

  const rootPath = path.resolve(process.cwd());

  const tsConfigFilePath = path.resolve(process.cwd(), "tsconfig.json");

  console.log("\n[MundiCodeLens CLI] Bootstrapping runtime CLI...\n");

  switch (command) {
    case "scan":
      await runScanCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "impact":
      await runImpactCommand({
        rootPath,
        tsConfigFilePath,
        target: commandArgs[0],
      });

      break;

    case "validate":
      await runValidateCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    case "watch":
      await runWatchCommand({
        rootPath,
        tsConfigFilePath,
      });

      break;

    default:
      console.log("[MundiCodeLens CLI] Unknown command.\n");

      console.log("Available commands:");

      console.log("  scan      → Build repository graph");

      console.log("  impact    → Analyze dependency impact");

      console.log("  validate  → Validate architecture governance");

      console.log("  watch     → Start live repository watcher");

      process.exit(1);
  }
}

bootstrapCLI().catch((error) => {
  console.error("\n[MundiCodeLens CLI] Runtime CLI failed:", error);

  process.exit(1);
});

// LIVE WATCH TEST
