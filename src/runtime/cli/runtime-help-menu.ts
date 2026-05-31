import { runtimeCommands } from "./runtime-command-registry";

export function showRuntimeHelpMenu(): void {
  console.log("[MundiCodeLens CLI] Unknown command.\n");

  console.log("Available commands:\n");

  for (const command of runtimeCommands) {
    console.log(`  ${command.name.padEnd(30)} → ${command.description}`);
  }

  console.log("");
}
