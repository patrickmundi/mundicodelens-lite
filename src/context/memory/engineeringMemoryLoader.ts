import * as fs from "fs";

import * as path from "path";

export interface EngineeringMemory {
  globalEngineeringRules?: string[];

  projectPatterns?: string[];

  criticalBusinessRules?: string[];
}

export function loadEngineeringMemory(
  workspaceRoot: string,
): EngineeringMemory {
  const memoryPath = path.join(
    workspaceRoot,

    "docs",

    "architecture",

    "engineering-memory.json",
  );

  if (!fs.existsSync(memoryPath)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(memoryPath, "utf8");

    return JSON.parse(raw);
  } catch (error) {
    console.error("🔥 Failed to load engineering memory:", error);

    return {};
  }
}
